import React, {ChangeEvent, useState} from 'react'
import {Modal, ContainModal, HeaderModal, FooterModal, Input, InputGroup, Button, Select, TextArea} from '@/types/ui_components'
import UploadLogo from '@/components/ui/UpLoad_IMG';
import Image from 'next/image';

export interface Modal{
    state:boolean;
    onClose: ()=>void;
    //onActivityCreated: () => void;
}

const activityTypes = [
  { id: 1, label: "general" },
  { id: 2, label: "cultural" },
];

const initialState = {
  title: "",
  descrip: "",
  type: null as string | null,
  location: "",
  img: null as File | null,
  start_date: "",
  end_date: "",
};

const initialErrors = {
  title: "",
  type: "",
  location: "",
  img: "",
  start_date: "",
  end_date: "",
};

export default function modal_Addactivity({state, onClose}:Modal) {

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
    if (!formData.title) { newErrors.title = "El título es obligatorio."; isValid = false; }
    if (!formData.type) { newErrors.type = "El tipo es obligatorio."; isValid = false; }
    if (!formData.location) { newErrors.location = "La ubicación es obligatoria."; isValid = false; }
    if (!formData.start_date) { newErrors.start_date = "La fecha de inicio es obligatoria."; isValid = false; }
    //if (!formData.end_date) { newErrors.end_date = "La fecha de fin es obligatoria."; isValid = false; }
    if (!formData.img) { newErrors.img = "Debes subir una imagen/banner.."; isValid = false; }
    
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
    data.append('location', formData.location);
    data.append('start_date', formData.start_date);
    //data.append('end_date', formData.end_date);
    data.append('img', formData.img!);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    try {
      const res = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        body: data,
        // headers: { 'Authorization': `Bearer TU_TOKEN` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear la actividad');
      }

      alert('¡Actividad creada con éxito!');
      //onActivityCreated();
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
         <h2 className="ml-5 title">Añadir Nueva Actividad</h2>
         <p className="ml-5 text-[1.2rem]">Complete los datos para realizar el registro de la activididad.</p>
       </div>
      </HeaderModal>

      <div className="relative flex-grow main-modal overflow-y-auto px-4 space-y-4">
        <section className="flex flex-col p-4 shadow rounded-xl bg-gray-100 space-y-4">
         <div className="text-start">
                      <h3 className="text-[1.3rem] font-bold">Detalles de la Actividad</h3>
                  </div>

                  <InputGroup label="Título de la Actividad" For="title" labelClass="text-gray-700 text-start">
                    <Input
                      id="title" name="title" type="text" className="input w-full"
                      placeholder="Ej: Charla: Nutrición para Atletas"
                      value={formData.title} onChange={handleChange}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </InputGroup>

                  <InputGroup label="Descripción" For="descrip" labelClass="text-gray-700 text-start">
                    <TextArea
                      id="descrip" name="descrip" className="input w-full" rows={3}
                      placeholder="Descripción corta de la actividad..."
                      value={formData.descrip} onChange={handleChange}
                    />
                  </InputGroup>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="Tipo de Actividad" For="type" labelClass="text-gray-700 text-start">
                        <Select
                          className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-lg w-full pl-3 pr-3 py-1"
                          options={activityTypes}
                          currentValue={formData.type || ""}
                          isOpen={isTypeOpen}
                          setOpen={setIsTypeOpen}
                          onSelect={(id, label) => {
                            setFormData(prev => ({ ...prev, type: label }));
                            if (errors.type) setErrors(prev => ({ ...prev, type: "" }));
                          }}
                          placeholder="Seleccionar tipo"
                        />
                        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                    </InputGroup>

                    <InputGroup label="Ubicación" For="location" labelClass="text-gray-700 text-start">
                        <Input
                          id="location" name="location" type="text" className="input w-full"
                          placeholder="Ej: Cancha Techada UNIMAR"
                          value={formData.location} onChange={handleChange}
                        />
                        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </InputGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="Fecha de Inicio" For="start_date" labelClass="text-gray-700 text-start">
                      <Input
                        id="start_date" name="start_date" type="date" className="input w-full"
                        value={formData.start_date} onChange={handleChange}
                      />
                      {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                    </InputGroup>

                    
                  </div>
        </section>
                <section className="flex flex-col p-3 shadow rounded-xl bg-gray-100">
                    <UploadLogo
                        label='Banner de la Actividad'
                        file={formData.img}
                        onFileChange={handleFileChange}
                        error={errors.img}
                    />
                </section>
      </div>

      <FooterModal
        className="flex-none"
        BTmain="Crear Actividad"
        BTSecond="Cerrar"
        onClose={handleCloseModal}
        onSumit={handleFinalSubmit}
        disabled={loading } 
      />
    </ContainModal>
  </Modal>
 )
}
