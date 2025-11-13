import React, {ChangeEvent, useState} from 'react'
import { Button, ContainModal, HeaderModal, FooterModal, Input, InputGroup, Modal, TextArea, Select } from "@/types/ui_components";
import UploadLogo from '@/components/ui/UpLoad_IMG';

export interface Modal{
    state: boolean;
    onClose:()=>void;
    onSportCreated?:() => void;
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
  type: null as string | null,
  img: null as File | null,
};

// Estado inicial de los errores
const initialErrors = {
  title: "",
  type: "",
  img: "",
};

export default function modal_Addsport({state,onClose,onSportCreated}:Modal) {

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, img: file }));
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
    if (!formData.type) { newErrors.type = "Seleccione un modo de juego."; isValid = false; }
    if (!formData.img) { newErrors.img = "Debes subir una imagen/ícono."; isValid = false; }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleFinalSubmit = async () => {
    if (!validateForm()) return; 

    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('descrip', formData.descrip);
    data.append('type', formData.type!);
    data.append('img', formData.img!);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    try {
      const res = await fetch(`${API_URL}/sports`, {
        method: 'POST',
        body: data,
        // headers: { 'Authorization': `Bearer TU_TOKEN` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear el deporte');
      }

      alert('¡Deporte creado con éxito!');
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
                    <h2 className="ml-5 title">Añadir Nuevo Deporte</h2>
                    <p className="ml-5 text-[1.2rem]">Complete los datos para registrar el nuevo deporte.</p>
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

            <InputGroup label="Modo de Juego" For="type" labelClass="text-gray-700 text-start">
                <Select
                    className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-lg w-full pl-3 pr-3 py-1"
                    options={sportTypes}
                    currentValue={formData.type || ""}
                    isOpen={isTypeOpen}
                    setOpen={setIsTypeOpen}
                    onSelect={(id, label) => {
                                setFormData(prev => ({ ...prev, type: label }));
                                if (errors.type) setErrors(prev => ({ ...prev, type: "" }));
                    }}
                    placeholder="Seleccionar el modo"
                />
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </InputGroup>

            </div>

            <InputGroup label="Descripción" For="descrip" labelClass="text-gray-700 text-start">
                <TextArea
                    id="descrip" name="descrip" className="input w-full" rows={3}
                    placeholder="Descripción corta del deporte..."
                    value={formData.descrip} onChange={handleChange}
                />
            </InputGroup>

        </section>

        <section className="flex flex-col p-3 shadow rounded-xl bg-gray-100">
          <UploadLogo
              label='Icono del Deporte)'
              file={formData.img}
              onFileChange={handleFileChange}
              />
              {errors.img && <p className="text-red-500 text-sm mb-1">{errors.img}</p>}
        </section>
        </div>


        <FooterModal
            className="flex-none"
            BTmain="Crear Deporte"
            BTSecond="Cerrar"
            onClose={handleCloseModal}
            onSumit={handleFinalSubmit}
            disabled={loading }
        />

        </ContainModal>
    </Modal>
  )
}
