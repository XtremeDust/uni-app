'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button,Modal, ContainModal, HeaderModal, FooterModal, Select, InputGroup, Input } from '@/types/ui_components';
import PdfUploader from '@/components/ui/UpLoadPdf';

interface ModalProps {
  state: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  assignType: 'sport'| 'tournament' | 'activity' | 'discipline';
}

interface ISelectItem {
  id: number;
  label: string;
}

interface ISelectItem {
  id: number;
  label: string; 
}

const initialFormData = {
  title: "",
  file: null as File | null,
  selectedItemId: null as number | null,
};

const initialErrors = {
  title: "",
  file: "",
  selectedItemId: "",
};

const API_CONFIG = {
  tournament: { fetchItems: '/tournaments', label: 'Torneo' },
  activity: { fetchItems: '/activities', label: 'Actividad' },
  sport: { fetchItems: '/sports', label: 'Deporte' },
  discipline: { fetchItems: '/disciplines', label: 'Disciplina' }
};

export default function Modal_addRegulation({ state, onClose, onSaveSuccess, assignType }: ModalProps) {
  
  const [loadingItems, setLoadingItems] = useState(true); 
  const [isSaving, setIsSaving] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  
  const [items, setItems] = useState<ISelectItem[]>([]);
  const [isItemOpen, setIsItemOpen] = useState(false);
  
  const config = API_CONFIG[assignType];
  const label = config.label;

useEffect(() => {
    if (!state) return; 

    const fetchDropdownItems = async () => {
      setLoadingItems(true);
      setError(null);
      
      setFormData(initialFormData);
      setErrors(initialErrors);
      setIsItemOpen(false);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      try {
        const res = await fetch(`${API_URL}${config.fetchItems}`);
        if (!res.ok) {
          throw new Error(`Error cargando la lista de ${label}s`);
        }
        
        const json = await res.json();
        
        const formattedItems = json.data.map((item: any) => ({
          id: item.id,
          label: item.name || item.nombre || item.title || item.titulo || 'Nombre no encontrado'
        }));
        
        setItems(formattedItems);

      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingItems(false);
      }
    };
    
    fetchDropdownItems();
  }, [assignType, state]);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, img: file }));
    if (file) {
      setErrors(prev => ({ ...prev, img: "" }));
    }
  };

  // Validación antes de enviar
  const validateForm = (): boolean => {
    const newErrors = { ...initialErrors };
    let isValid = true;
    
    if (!formData.title) { newErrors.title = "El título es obligatorio."; isValid = false; }
    if (!formData.file) { newErrors.file = "El archivo PDF es obligatorio."; isValid = false; }
    if (!formData.selectedItemId) { newErrors.selectedItemId = `Debe seleccionar un ${label}.`; isValid = false; }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('file', formData.file!);

    data.append('assignType', assignType);
    data.append('item_id', formData.selectedItemId!.toString());

    try {

      const res = await fetch(`${API_URL}/regulations`, { 
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
          // 'Authorization': `Bearer TU_TOKEN` // Si está protegido
        }
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al crear el reglamento');
      }

      alert('¡Reglamento creado y asignado con éxito!');
      onSaveSuccess();
      onClose(); 

    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSaving(false);
    }
  };
  return (
      <Modal state={state}>
        <ContainModal className="w-full max-w-2xl bg-white text-black">
          <HeaderModal onClose={onClose}>
            <h2 className="text-xl font-bold text-gray-800">
              Crear y Asignar Nuevo Reglamento
            </h2>
          </HeaderModal>

          {loadingItems ? (
            <div className="p-6 text-center">Cargando...</div>
          ) : error ? (
            <div className="p-6 text-red-500 text-center">{error}</div>
          ) : (
            <div className="p-6 space-y-4">
              
              <InputGroup label="Título del Reglamento" For="title" labelClass="text-gray-500 text-start">
                <Input
                  id="title"
                  name="title"
                  type="text"
                  className="input w-full"
                  placeholder="Ej: Reglamento Específico de Fútbol Sala"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </InputGroup>

              <div className="grid grid-cols-1 gap-4">
                


              <InputGroup label={`Asignar a ${label}`} For="item" labelClass="text-gray-500 text-start">
                <Select
                  className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-lg w-full pl-6 pr-3 py-2"
                  options={items}
                  currentValue={items.find(i => i.id === formData.selectedItemId)?.label || ""}
                  isOpen={isItemOpen}
                  setOpen={setIsItemOpen}
                  onSelect={(id, label) => {
                    setFormData(prev => ({ ...prev, selectedItemId: id }));
                    if (errors.selectedItemId) setErrors(p => ({ ...p, selectedItemId: "" }));
                  }}
                  placeholder={`Buscar ${label}...`}
                />
                {errors.selectedItemId && <p className="text-red-500 text-sm mt-1">{errors.selectedItemId}</p>}
              </InputGroup>

                <PdfUploader
                  label="Archivo (PDF)"
                  file={formData.file}
                  onFileChange={(newFile) => {
                    setFormData(prev => ({ ...prev, file: newFile }));
                    if (newFile) setErrors(p => ({ ...p, file: "" }));
                  }}
                  error={errors.file}
                />
              </div>             
            </div>
          )}

          <FooterModal
            BTmain="Crear y Asignar"
            BTSecond="Cancelar"
            onClose={onClose}
            onSumit={handleSave}
            disabled={loadingItems || isSaving}
          />
        </ContainModal>
      </Modal>
    );
}