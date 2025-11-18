'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal, ContainModal, HeaderModal, FooterModal, Select, InputGroup, Input } from '@/types/ui_components';
import PdfUploader from '@/components/ui/UpLoadPdf'; 

interface ModalProps {
  state: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
  assignType?: 'sport'| 'tournament' | 'activity' | 'discipline' | 'torneo'; 
  regulationToEdit?: any | null; 
}

interface ISelectItem {
  id: number;
  label: string; 
}

const initialFormData = {
  title: "",
  file: null as File | null,
  selectedItemId: null as number | null,
  scope: null as string | null,
};

const initialErrors = {
  title: "",
  file: "",
  selectedItemId: "",
  scope:""
};

const API_CONFIG: { [key: string]: { fetchItems: string, label: string } } = {
  tournament: { fetchItems: '/tournaments', label: 'Torneo' },
  activity: { fetchItems: '/activities', label: 'Actividad' },
  sport: { fetchItems: '/sports', label: 'Deporte' },
  discipline: { fetchItems: '/disciplines', label: 'Disciplina' }
};

const scopeOptions = [
  { id: 1, label: "general_evento" },
  { id: 2, label: "deporte_base" },
  { id: 3, label: "disciplina_especifica" },
  { id: 4, label: "actividad_cultural" },
];

export default function Modal_addRegulation({ 
  state, 
  onClose, 
  onSaveSuccess, 
  assignType, 
  regulationToEdit 
}: ModalProps) {
  
  const isEditMode = !!regulationToEdit;

  const [loadingItems, setLoadingItems] = useState(true); 
  const [isSaving, setIsSaving] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  
  const [items, setItems] = useState<ISelectItem[]>([]);
  const [isItemOpen, setIsItemOpen] = useState(false);
  const [isScopeOpen, setIsScopeOpen] = useState(false);

  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null);
  
  const config = assignType ? API_CONFIG[assignType] : null;
  const label = config?.label;

  useEffect(() => {
    if (!state) return; 

    setFormData(initialFormData);
    setErrors(initialErrors);
    setIsItemOpen(false);
    setIsScopeOpen(false);
    setExistingFileUrl(null);
    setError(null);
    setItems([]); 
    const fetchDropdownItems = async () => {
      if (!config) {
          setLoadingItems(false);
          return;
      }

      setLoadingItems(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      try {
        const res = await fetch(`${API_URL}${config.fetchItems}`);
        if (!res.ok) throw new Error('Error al cargar la lista');
        
        const json = await res.json();
        
        const formattedItems = json.data.map((item: any) => ({
          id: Number(item.id),
          label: item.name || item.nombre || item.title || item.titulo || 'Sin nombre'
        }));
        
        setItems(formattedItems);
      } catch (e: any) {
        console.error(e);
        setError("No se pudo cargar la lista de opciones.");
      } finally {
        setLoadingItems(false);
      }
    };

    if (isEditMode && regulationToEdit && assignType && config) {
      
      const dataKeyMap: { [key: string]: string } = {
        tournament: 'torneo',
        discipline: 'disciplina', 
        activity: 'actividad',
        sport: 'deporte',
      };
      
      const dataKey = dataKeyMap[assignType] || assignType;

      if (!dataKey || !(regulationToEdit as any)[dataKey]) {
        console.error(`Error datos: no se encontró '${dataKey}' en`, regulationToEdit);
        setError(`Error cargando datos para editar`);
        return; 
      }
      
      const itemData = (regulationToEdit as any)[dataKey];
      const safeId = Number(itemData.id); 

      setFormData({
        title: regulationToEdit.reglamento.titulo || "",
        file: null, 
        selectedItemId: safeId, 
        scope: null,
      });
      
      setExistingFileUrl(regulationToEdit.reglamento.archivo_url);

      fetchDropdownItems();


    } else if (assignType && !isEditMode && config) {

       fetchDropdownItems();
    } else {
      setLoadingItems(false);
    }
  }, [assignType, state, config, isEditMode, regulationToEdit]);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, file: file }));
    if (file) {
      setErrors(prev => ({ ...prev, file: "" }));
      setExistingFileUrl(null); 
    }
  };

  const validateForm = (): boolean => {
    const newErrors = { ...initialErrors };
    let isValid = true;
    
    if (!formData.title.trim()) { newErrors.title = "El título es obligatorio."; isValid = false; }
    
    if (!isEditMode && !formData.file) {
      newErrors.file = "El archivo PDF es obligatorio."; 
      isValid = false;
    } else if (isEditMode && !formData.file && !existingFileUrl) {
      newErrors.file = "El archivo PDF es obligatorio."; 
      isValid = false;
    }

    if (assignType) { 
      if (formData.selectedItemId === null || formData.selectedItemId === undefined) { 
          newErrors.selectedItemId = `Debe seleccionar un ${label}.`; 
          isValid = false; 
      }
    } else { 
      if (!formData.scope) { newErrors.scope = "Debe seleccionar un Alcance."; isValid = false; }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    
    const data = new FormData();
    data.append('title', formData.title);

    if (formData.file) {
      data.append('file', formData.file);
    }

    let postUrl = '';
    
    try {
      if (isEditMode) {
        // EDITAR
        postUrl = `${API_URL}/regulations/${regulationToEdit!.reglamento.id}`;
        data.append('_method', 'PUT'); 
        
        if (assignType && formData.selectedItemId !== null) {
          data.append('assignType', assignType);
          data.append('item_id', formData.selectedItemId.toString());
        }
      } else {
        // CREAR
        if (assignType && config && formData.selectedItemId !== null){
          postUrl = `${API_URL}/regulations`;
          data.append('assignType', assignType);
          data.append('item_id', formData.selectedItemId.toString());
        } else {
          postUrl = `${API_URL}/regulations-simple`;
          data.append('scope', formData.scope!);
        }
      }

      const res = await fetch(postUrl, { 
        method: 'POST', 
        body: data,
        headers: { 'Accept': 'application/json' }
      });
        
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Error al procesar el reglamento`);
      }

      alert(`¡Operación exitosa!`);
      if (onSaveSuccess) onSaveSuccess();
      onClose(); 

    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentLabel = () => {
      if (!assignType) return "";
      // Busca en la lista COMPLETA de items
      const found = items.find(i => i.id === formData.selectedItemId);
      return found ? found.label : "Seleccionar...";
  };

  return (
    <Modal state={state}>
      <ContainModal className="w-full max-w-2xl bg-white text-black">
        <HeaderModal onClose={onClose}>
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? `Editar Reglamento` : (assignType ? `Asignar a ${label}` : 'Crear Nuevo Reglamento')}
          </h2>
        </HeaderModal>

        {loadingItems ? (
          <div className="p-6 text-center">Cargando lista de {label}s...</div>
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
                placeholder="Ej: Reglamento Específico..."
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </InputGroup>

            <div className="grid grid-cols-1 gap-4">
              {!assignType ? (
                <InputGroup label="Alcance (Scope)" For="scope" labelClass="text-gray-500 text-start">
                  <Select
                    className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-lg w-full pl-6 pr-3 py-2"
                    options={scopeOptions}
                    currentValue={formData.scope || ""}
                    isOpen={isScopeOpen}
                    setOpen={setIsScopeOpen}
                    onSelect={(id, label) => {
                      setFormData(prev => ({ ...prev, scope: label }));
                      if (errors.scope) setErrors(p => ({ ...p, scope: "" }));
                    }}
                    placeholder="¿Para qué se usará esta regla?"
                  />
                  {errors.scope && <p className="text-red-500 ...">{errors.scope}</p>}
                </InputGroup>
              ) : (
                <InputGroup label={`Asignar a ${label}`} For="item" labelClass="text-gray-500 text-start">
                  <Select
                    className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-lg w-full pl-6 pr-3 py-2"
                    options={items}
                    currentValue={getCurrentLabel()} 
                    isOpen={isItemOpen}
                    setOpen={setIsItemOpen}
                    onSelect={(id, label) => {
                      setFormData(prev => ({ ...prev, selectedItemId: Number(id) }));
                      if (errors.selectedItemId) setErrors(p => ({ ...p, selectedItemId: "" }));
                    }}
                    placeholder={`Buscar ${label}...`}
                  />
                  {errors.selectedItemId && <p className="text-red-500 text-sm mt-1">{errors.selectedItemId}</p>}
                </InputGroup>
              )}

              <PdfUploader
                label="Archivo (PDF)"
                file={formData.file}
                onFileChange={handleFileChange}
                error={errors.file}
                existingFileUrl={existingFileUrl}
              />
            </div>
          </div>
        )}

        <FooterModal
          BTmain={isEditMode ? 'Guardar Cambios' : (assignType ? 'Crear y Asignar' : 'Crear')}
          BTSecond="Cancelar"
          onClose={onClose}
          onSumit={handleSave}
          disabled={loadingItems || isSaving}
        />
      </ContainModal>
    </Modal>
  );
}