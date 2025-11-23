import React, { ChangeEvent, useState, useEffect } from 'react'
import { Modal, ContainModal, HeaderModal, FooterModal, Input, InputGroup, Select, TextArea } from '@/types/ui_components'
import UploadLogo from '@/components/ui/UpLoad_IMG'; 

export interface ModalProps {
  state: boolean;
  onClose: () => void;
  onActivityCreated: () => void;
  dataToEdit?: any; 
}

const activityTypes = [
  { id: 1, label: "general" },
  { id: 2, label: "cultural" },
];

const initialState = {
  title: "",
  body: "",
  type: null as string | null,
  location: "",
  img: null as File | null,
  activity_date: "",
  start_time: "",
  end_time: "",
  previewUrl: null as string | null, 
};

const initialErrors = {
  title: "",
  type: "",
  location: "",
  img: "",
  activity_date: "",
  start_time: "",
  end_time: "",
};

export default function Modal_AddActivity({ state, onClose, onActivityCreated, dataToEdit }: ModalProps) {

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const formatTime = (val: any) => {
      if (!val) return "";
      const timeString = String(val);
      return timeString.length > 5 ? timeString.substring(0, 5) : timeString;
  };

  useEffect(() => {
    if (state) {
      if (dataToEdit) {
        
        const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
        
        let imageUrl = null;
        if (dataToEdit.imagen_url) {
             const cleanPath = dataToEdit.imagen_url.replace('//', '/');
             imageUrl = cleanPath.startsWith('http') ? cleanPath : `${API_DOMAIN}${cleanPath}`;
        }

        setFormData({
          title: dataToEdit.titulo || "",
          body: dataToEdit.contenido_completo || "", 
          type: dataToEdit.tipo || null,
          location: dataToEdit.ubicacion || "",
          activity_date: dataToEdit.fecha_actividad || "",
          start_time: formatTime(dataToEdit.hora_inicio),
          end_time: formatTime(dataToEdit.hora_fin),
          img: null, 
          previewUrl: imageUrl 
        });

      } else {
        setFormData(initialState);
      }
      setErrors(initialErrors);
    }
  }, [state, dataToEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, img: file, previewUrl: null })); 
    if (file && errors.img) setErrors(prev => ({ ...prev, img: "" }));
  };

  const handleCloseModal = () => {
    setFormData(initialState); setErrors(initialErrors); setLoading(false); onClose();
  };

  const validateForm = (): boolean => {
    const newErrors = { ...initialErrors };
    let isValid = true;
    if (!formData.title) { newErrors.title = "Requerido"; isValid = false; }
    
    if (!formData.previewUrl && !formData.img) { newErrors.img = "Requerido"; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const handleFinalSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('body', formData.body);
    data.append('type', formData.type!);
    data.append('location', formData.location);
    data.append('activity_date', formData.activity_date);
    data.append('start_time', formData.start_time);
    data.append('end_time', formData.end_time);
    
    if (formData.img) data.append('img', formData.img);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    try {
      let url = `${API_URL}/activities`;
      if (dataToEdit) {
        url = `${API_URL}/activities/${dataToEdit.id}`;
        data.append('_method', 'PUT'); 
      }
      const res = await fetch(url, { method: 'POST', body: data });
      if (!res.ok) throw new Error('Error');
      onActivityCreated();
      handleCloseModal();
    } catch (e: any) {
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
            <h2 className="ml-5 title">{dataToEdit ? 'Editar Actividad' : 'Crear Actividad'}</h2>
          </div>
        </HeaderModal>

        <div className="relative flex-grow main-modal overflow-y-auto px-4 space-y-4">
          <section className="flex flex-col p-4 shadow rounded-xl bg-gray-100 space-y-4">
             
             <InputGroup label="Título" For="title" labelClass="text-gray-700 text-start">
                <Input id="title" name="title" type="text" className="input w-full" value={formData.title} onChange={handleChange} />
             </InputGroup>
             
             <InputGroup label="Descripción" For="body" labelClass="text-gray-700 text-start">
                  <TextArea id="body" name="body" className="input w-full" rows={3} value={formData.body} onChange={handleChange} />
             </InputGroup>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputGroup label="Tipo" For="type" labelClass="text-gray-700 text-start">
                      <Select 
                        className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-lg w-full pl-3 pr-3 py-1"
                        options={activityTypes} currentValue={formData.type || ""} isOpen={isTypeOpen} setOpen={setIsTypeOpen}
                        onSelect={(id, label) => setFormData(p => ({ ...p, type: label }))}
                        placeholder="Tipo"
                      />
                  </InputGroup>
                  <InputGroup label="Ubicación" For="location" labelClass="text-gray-700 text-start">
                      <Input id="location" name="location" type="text" className="input w-full" value={formData.location} onChange={handleChange} />
                  </InputGroup>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputGroup label="Fecha" For="activity_date" labelClass="text-gray-700 text-start">
                    <Input id="activity_date" name="activity_date" type="date" className="input w-full" value={formData.activity_date} onChange={handleChange} />
                  </InputGroup>
                  <InputGroup label="Hora Inicio" For="start_time" labelClass="text-gray-700 text-start">
                      <Input id="start_time" name="start_time" type="time" className="input w-full" value={formData.start_time} onChange={handleChange} />
                  </InputGroup>
                  <InputGroup label="Hora Fin" For="end_time" labelClass="text-gray-700 text-start">
                      <Input id="end_time" name="end_time" type="time" className="input w-full" value={formData.end_time} onChange={handleChange} />
                  </InputGroup>
             </div>
          </section>

          <section className="flex flex-col p-3 shadow rounded-xl bg-gray-100">
            <UploadLogo 
                label='Banner de la Actividad' 
                file={formData.img} 
                onFileChange={handleFileChange} 
                error={errors.img} 
                previewUrl={formData.previewUrl} 
            />
          </section>
        </div>

        <FooterModal className="flex-none" BTmain="Guardar" BTSecond="Cerrar" onClose={handleCloseModal} onSumit={handleFinalSubmit} disabled={loading} />
      </ContainModal>
    </Modal>
  )
}