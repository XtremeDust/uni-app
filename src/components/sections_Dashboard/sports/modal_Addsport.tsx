import React, {ChangeEvent, useEffect, useState} from 'react'
import { Button, ContainModal, HeaderModal, FooterModal, Input, InputGroup, Modal, TextArea, Select } from "@/types/ui_components";
import UploadLogo from '@/components/ui/UpLoad_IMG';
import Image from 'next/image';

export interface Modal{
    state: boolean;
    onClose:()=>void;
    onSportCreated?:() => void;
    sportToEdit?: ApiSports | null;
}

export interface ApiSports {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  img:string;
  equipamiento:string;
}

const sportTypes = [
  { id: 1, label: "En equipo" },
  { id: 2, label: "En duplas" },
  { id: 3, label: "Individual" },
];

// Estado inicial del formulario
const initialState = {
  title: "",
  descrip: "",
  mode: null as string | null,
  equipment:"",
  img: null as File | null,
  img_preview_url: null as string | null,
};

// Estado inicial de los errores
const initialErrors = {
  title: "",
  descrip: "",
  mode: "",
  img: "",
  equipment:"",
};

export default function modal_Addsport({state,onClose,onSportCreated, sportToEdit}:Modal) {

  const isEditMode = !!sportToEdit;

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const [currentEquipment, setCurrentEquipment] = useState("");

  useEffect(() => {

    if (isEditMode && sportToEdit) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
      
      const imageUrl = (sportToEdit as any).logo_url ? `${API_URL}${(sportToEdit as any).logo_url}` 
          : null;
        setFormData({
            title: sportToEdit.nombre,
            descrip: sportToEdit.descripcion,
            mode: sportToEdit.tipo,
            equipment:sportToEdit.equipamiento,
            img: null,
            img_preview_url: imageUrl,
        });
    } else {
        
        setFormData(initialState);
    }
  }, [sportToEdit, isEditMode, state]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, img: file, img_preview_url: null }));
    if (file) setErrors(prev => ({ ...prev, img: "" }));
  };

  const handleCloseModal = () => {
    setFormData(initialState); 
    setErrors(initialErrors); 
    setLoading(false);
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors = { ...initialErrors };
    let isValid = true;
    if (!formData.title) { newErrors.title = "El nombre es obligatorio."; isValid = false; }
    if (!formData.mode) { newErrors.mode = "Seleccione un modo de juego."; isValid = false; }
    if (!formData.descrip) { newErrors.descrip = "Coloque la descripcion del deporte."; isValid = false; }
    if (!formData.equipment) { newErrors.equipment = "Coloque el equipo necesario."; isValid = false; }
    if (!isEditMode && !formData.img) { 
        newErrors.img = "Debes subir una imagen/ícono."; 
        isValid = false; 
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleEquipmentKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const newTag = currentEquipment.trim();

        if (newTag) { 
          setFormData(prev => ({
            ...prev,
            equipment: prev.equipment ? `${prev.equipment},${newTag}` : newTag
          }));
          setCurrentEquipment("");
        }
      }
  };

  const handleRemoveEquipmentTag = (tagToRemove: string) => {
      const newTags = formData.equipment
                          .split(',')
                          .map(t => t.trim())
                          .filter(t => t !== tagToRemove && t)
                          .join(',');
      
      setFormData(prev => ({ ...prev, equipment: newTags }));
  };

  const handleFinalSubmit = async () => {
    if (!validateForm()) return; 

    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('descrip', formData.descrip);
    data.append('mode', formData.mode!);
    data.append('equipment', formData.equipment);
    if (formData.img) {
      data.append('logo', formData.img);
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    let endpoint = `${API_URL}/sports`;

   if (isEditMode) {
        endpoint = `${API_URL}/sports/${sportToEdit!.id}`;
        data.append('_method', 'PUT'); // Laravel usa esto para "tunelizar"
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
        // headers: { 'Authorization': `Bearer TU_TOKEN` }
      });

      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el deporte`);
        }

        alert(`¡Deporte ${isEditMode ? 'actualizado' : 'creado'} con éxito!`);
      
        if (onSportCreated){
          onSportCreated();
        }
        handleCloseModal();

    } catch (e: any) {
      console.error("Error al enviar formulario:", e);
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }
    return (
    <Modal state={state}>
        <ContainModal className={`grid grid-rows-[auto_minmax(0,1fr)_auto] text-black w-[95%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] space-y-3 bg-gray-200 rounded-2xl overflow-hidden max-h-[90vh]`}>
            <HeaderModal className="flex-none" onClose={handleCloseModal}>
                <div className="text-start">
                    <h2 className="ml-5 title">{isEditMode ? 'Editar Deporte' : 'Añadir Nuevo Deporte'}</h2>
                    <p className="ml-5 text-[1.2rem]">{isEditMode ? 'Modifica los datos del deporte.' : 'Complete los datos del nuevo deporte.'}</p>
                </div>
            </HeaderModal>

        <div className="relative flex-grow main-modal overflow-y-auto px-4 space-y-4">

        <section className="flex flex-col p-4 shadow rounded-xl bg-gray-100 space-y-4">
            <div className="text-start">
                <h3 className="text-[1.3rem] font-bold">Detalles del Deporte</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="Nombre del Deporte" For="title" labelClass="text-gray-700 text-start">
              <Input
                  id="title" name="title" type="text" className="input w-full"
                  placeholder="Ej: Fútbol Sala"
                  value={formData.title} onChange={handleChange}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </InputGroup>

            <InputGroup label="Modo de Juego" For="mode" labelClass="text-gray-700 text-start">
                <Select
                    className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-lg w-full pl-3 pr-3 py-1"
                    options={sportTypes}
                    currentValue={formData.mode || ""}
                    isOpen={isTypeOpen}
                    setOpen={setIsTypeOpen}
                    onSelect={(id, label) => {
                                setFormData(prev => ({ ...prev, mode: label }));
                                if (errors.mode) setErrors(prev => ({ ...prev, mode: "" }));
                    }}
                    placeholder="Seleccionar el modo"
                />
                {errors.mode && <p className="text-red-500 text-sm mt-1">{errors.mode}</p>}
            </InputGroup>

            </div>

            <InputGroup label="Descripción" For="descrip" labelClass="text-gray-700 text-start">
                <TextArea
                    id="descrip" name="descrip" className="input w-full" rows={3}
                    placeholder="Descripción corta del deporte..."
                    value={formData.descrip} onChange={handleChange}
                />
                {errors.descrip && <p className="text-red-500 text-sm mt-1">{errors.descrip}</p>}
            </InputGroup>

            <InputGroup label="Equipamiento" For="equipment_input" labelClass="text-gray-700 text-start">
              <Input
                  id="equipment_input" name="equipment_input" type="text" className="input w-full"
                  placeholder={formData.equipment ? "Añadir más equipamiento..." : "Escriba y presione Enter o coma..."}
                  value={currentEquipment}
                  onChange={(e) => setCurrentEquipment(e.target.value)}
                  onKeyDown={handleEquipmentKeyDown}
              />
                {formData.equipment && (
                    <div className="flex flex-wrap gap-2 p-2 rounded-lg">
                        {formData.equipment.split(',')
                            .map(tag => tag.trim())
                            .filter(tag => tag)
                            .map((tag, index) => (
                                <span key={index} className="flex overflow-hidden items-center bg-blue-100 text-blue-800 text-sm font-medium  rounded-full">
                                    <p className='ml-4'>{tag}</p>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveEquipmentTag(tag)}
                                        className="ml-1 px-2 py-1 text-blue-600 hover:text-blue-800 focus:outline-non cursor-pointer"
                                    >
                                        &times;
                                    </button>
                                </span>
                        ))}
                    </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Escriba y presione Enter o coma para agregar un elemento.</p>
                {errors.equipment && <p className="text-red-500 text-sm mt-1">{errors.equipment}</p>}              
          </InputGroup>
        </section>

        <section className="flex flex-col p-3 shadow rounded-xl bg-gray-100">          
          <UploadLogo
              label={isEditMode ? 'Cambiar Icono' : 'Icono del Deporte'}
              file={formData.img}
              previewUrl={formData.img_preview_url}
              onFileChange={handleFileChange}
              />
              {errors.img && <p className="text-red-500 text-sm mb-1">{errors.img}</p>}
        </section>
        </div>

        <FooterModal
            className="flex-none"
            BTmain={isEditMode ? 'Guardar Cambios' : 'Crear Deporte'}
            BTSecond="Cerrar"
            onClose={handleCloseModal}
            onSumit={handleFinalSubmit}
            disabled={loading }
        />

        </ContainModal>
    </Modal>
  )
}
