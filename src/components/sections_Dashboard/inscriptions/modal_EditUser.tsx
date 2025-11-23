'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Modal, ContainModal, HeaderModal, FooterModal, Input, InputGroup } from '@/types/ui_components';
import UploadIMG from '@/components/ui/UpLoad_IMG';

interface ApiUser {
  id: number;
  nombre: string | null;
  email: string | null;
  cedula: string | null;
  telefono: string | null;
  img?: string;
}

interface ModalProps {
    state: boolean;
    onClose: () => void;
    userToEdit: ApiUser;
    onSaveSuccess: () => void;
}

export default function Modal_EditUser({ state, onClose, userToEdit, onSaveSuccess }: ModalProps) {

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        cedula: '',
        photo: null as File | null,
        previewUrl: null as string | null, 
    });
    
    const [errors, setErrors] = useState({
        nombre: '',
        telefono: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userToEdit && state) {
            const API_DOMAIN = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
            
            const imageUrl = userToEdit.img 
                ? (userToEdit.img.startsWith('http') ? userToEdit.img : `${API_DOMAIN}${userToEdit.img}`)
                : null;

            setFormData({
                nombre: userToEdit.nombre || '',
                email: userToEdit.email || '',
                telefono: userToEdit.telefono || '',
                cedula: userToEdit.cedula || '',
                photo: null, 
                previewUrl: imageUrl
            });

            setErrors({ nombre: '', telefono: '' });
        }
    }, [userToEdit, state]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (file: File | null) => {
        setFormData(prev => ({ ...prev, photo: file, previewUrl: null }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { nombre: '', telefono: '' };

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio.';
            isValid = false;
        } else if (formData.nombre.length < 3) {
            newErrors.nombre = 'El nombre es muy corto.';
            isValid = false;
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es obligatorio.';
            isValid = false;
        } else if (!/^[0-9]{10,12}$/.test(formData.telefono)) {
            newErrors.telefono = 'Teléfono inválido (solo números, 10-12 dígitos).';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        
        const data = new FormData();
        data.append('name', formData.nombre);
        data.append('telefono', formData.telefono);
        data.append('email', formData.email);
        
        if (formData.photo) {
            data.append('photo', formData.photo);
        }
        
        data.append('_method', 'PUT'); 

        try {
            const res = await fetch(`${API_URL}/users/${userToEdit.id}`, {
                method: 'POST', 
                body: data,
                headers: { 'Accept': 'application/json' }
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Error al actualizar usuario");
            }

            alert("Usuario actualizado correctamente");
            onSaveSuccess();
            onClose();
        } catch (e: any) {
            console.error(e);
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal state={state}>
            <ContainModal className="w-full max-w-md bg-white text-black">
                <HeaderModal onClose={onClose}>
                    <div className="text-start pl-4">
                        <h2 className="text-xl font-bold">Editar Usuario</h2>
                        <p className="text-sm text-gray-500">Solo puede modificar datos de contacto y foto.</p>
                    </div>
                </HeaderModal>
                
                <div className="p-6 space-y-4 text-start">
                    
                    <div className="flex justify-center mb-4">
                        <div className="w-full">
                             <UploadIMG
                                label="Foto de Perfil"
                                file={formData.photo}
                                onFileChange={handleFileChange}
                                previewUrl={formData.previewUrl}
                             />
                        </div>
                    </div>

                    <InputGroup label="Cédula" For="cedula" labelClass="text-gray-500">
                        <Input value={formData.cedula} disabled className="input w-full bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300 focus:ring-0" />
                    </InputGroup>

                    <InputGroup label="Email" For="email" labelClass="text-gray-500">
                        <Input name="email" value={formData.email} disabled className="input w-full bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300 focus:ring-0" />
                    </InputGroup>

                    <InputGroup label="Nombre" For="nombre" labelClass="text-gray-700 font-semibold">
                        <Input 
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            className={`input w-full ${errors.nombre ? 'border-red-500 ring-red-200' : ''}`}
                            placeholder="Nombre completo"
                        />
                        {errors.nombre && <p className="text-red-500 text-xs mt-1 ml-1">{errors.nombre}</p>}
                    </InputGroup>

                    <InputGroup label="Teléfono" For="telefono" labelClass="text-gray-700 font-semibold">
                        <Input 
                            name="telefono" 
                            value={formData.telefono} 
                            onChange={handleChange} 
                            className={`input w-full ${errors.telefono ? 'border-red-500 ring-red-200' : ''}`}
                            placeholder="Ej: 04121234567"
                            maxLength={12}
                        />
                        {errors.telefono && <p className="text-red-500 text-xs mt-1 ml-1">{errors.telefono}</p>}
                    </InputGroup>
                </div>

                <FooterModal
                    BTmain="Guardar Cambios"
                    BTSecond="Cancelar"
                    onClose={onClose}
                    onSumit={handleSave}
                    disabled={loading}
                />
            </ContainModal>
        </Modal>
    );
}