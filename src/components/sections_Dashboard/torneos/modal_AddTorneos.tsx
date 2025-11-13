'use client';
import { useState, ChangeEvent } from "react";
import { Button, ContainModal, HeaderModal, FooterModal, Input, InputGroup, Modal, TextArea } from "@/types/ui_components";
import Image from "next/image";
import UploadLogo from "@/components/ui/UpLoad_IMG";

interface ModalProps {
  state: boolean;
  onClose: () => void;
  onTournamentCreated?: () => void;
}


const initialState = {
  name: "",
  descrip: "",
  state: "proximo",
  img: null as File | null,
  init_date: "",
  end_date: "",
};

export default function modal_addTorneos({ state, onClose, onTournamentCreated }: ModalProps) {

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({
      name: "",
      descrip: "",
      state: "proximo",
      img: "",
      init_date: "",
      end_date: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCloseModal = () => {
    setFormData(initialState);
    setErrors({
      name: "",
      descrip: "",
      state: "proximo",
      img: "",
      init_date: "",
      end_date: "",
    });
    setLoading(false);
    onClose(); 
  };

  const validateForm = () => {
    const newErrors:any = { ...initialState };
    let isValid = true;

    if (!formData.name) { newErrors.name = "El nombre es obligatorio."; isValid = false; }
    if (!formData.init_date) { newErrors.init_date = "La fecha de inicio es obligatoria."; isValid = false; }
    if (!formData.end_date) { newErrors.end_date = "La fecha de fin es obligatoria."; isValid = false; }
    if (!formData.img) { newErrors.img = "Debes subir una imagen/banner."; isValid = false; }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('descrip', formData.descrip);
    data.append('state', formData.state);
    data.append('init_date', formData.init_date);
    data.append('end_date', formData.end_date);
    data.append('img', formData.img!);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    try {
      const res = await fetch(`${API_URL}/tournaments`, {
        method: 'POST',
        body: data,
        // headers: { 'Authorization': `Bearer TU_TOKEN` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear el torneo');
      }

      alert('¡Torneo creado con éxito!');
      if(onTournamentCreated){
        onTournamentCreated();
      }
      handleCloseModal();

    } catch (e: any) {
      console.error("Error al enviar formulario:", e);
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

return (
    <Modal state={state}>
      <ContainModal className="w-full max-w-2xl bg-white text-black overflow-y-auto">
        
        <HeaderModal onClose={handleCloseModal}>
          <div className="text-start">
            <h2 className="ml-5 title">Añadir Nuevo Torneo</h2>
            <p className="ml-5 text-[1.2rem]">Rellene la información del evento principal.</p>
          </div>
        </HeaderModal>

        <div className="p-6 space-y-4">
          
          <InputGroup label="Nombre del Torneo" For="name"labelClass="text-gray-500 text-start" className="text-start">
            <Input
              id="name"
              name="name"
              type="text"
              className="input w-full"
              placeholder="Ej: Juegos Internos UNIMAR 2025"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </InputGroup>

          <InputGroup label="Descripción" For="descrip"labelClass="text-gray-500 text-start">
            <TextArea
              id="descrip"
              name="descrip"
              className="input w-full"
              rows={3}
              placeholder="Descripción corta del evento..."
              value={formData.descrip}
              onChange={handleChange}
            />
           
          </InputGroup>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputGroup label="Fecha de Inicio" For="init_date"labelClass="text-gray-500 text-start">
              <Input
                id="init_date"
                name="init_date"
                type="date"
                className="input w-full"
                value={formData.init_date}
                onChange={handleChange}
              />
              {errors.init_date && <p className="text-red-500 text-sm mt-1">{errors.init_date}</p>}
            </InputGroup>

            <InputGroup label="Fecha de Fin" For="end_date"labelClass="text-gray-500 text-start">
              <Input
                id="end_date"
                name="end_date"
                type="date"
                className="input w-full"
                value={formData.end_date}
                onChange={handleChange}
              />
              {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
            </InputGroup>
            
          </div>

          <UploadLogo
            label="Banner para el Torneo"
            file={formData.img}
            error={errors.img}
             onFileChange={(file: File | null) => {
                  setFormData(prev => ({ ...prev, img: file }));
                  
                  if (file) {
                      setErrors(prev => ({ ...prev, img: "" }));
                  }
              }}
          />
          {errors.img && <p className="text-red-500 text-sm mt-1 -translate-y-3 px-3">{errors.img}</p>}

        </div>

        <FooterModal
          className="flex-none"
          BTmain="Crear Torneo"
          BTSecond="Cerrar"
          onClose={handleCloseModal}
          onSumit={handleSubmit}
          disabled={loading}
        />
      </ContainModal>
    </Modal>
  );
}
