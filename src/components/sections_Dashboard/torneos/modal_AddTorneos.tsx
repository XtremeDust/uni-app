'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { 
    Modal, ContainModal, HeaderModal, FooterModal, 
    Input, InputGroup, TextArea, Select 
} from '@/types/ui_components';
import UploadIMG from '@/components/ui/UpLoad_IMG';

interface ApiTournament {
  id: number;
  nombre: string;
  descripcion: string;
  estado: string; 
  inicio: string;
  fin: string;
  img?: string;
}

interface ModalProps {
    state: boolean;
    onClose: () => void;
    onTournamentCreated?: () => void; 
    tournamentToEdit?: ApiTournament | null;
}

const stateOptions = [
    { id: 1, label: "proximo" },
    { id: 2, label: "activo" },
    { id: 3, label: "finalizado" },
];

export default function Modal_addtorneos({ state, onClose, onTournamentCreated, tournamentToEdit }: ModalProps) {
    
    const isEditMode = !!tournamentToEdit;

    const [formData, setFormData] = useState({
        name: '',
        descrip: '',
        state: '',
        init_date: '',
        end_date: '',
        img: null as File | null,
    });

    const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const [isStateOpen, setIsStateOpen] = useState(false);

    const [errors, setErrors] = useState({
        name: '',
        descrip: '',
        state: '',
        dates: '',
        img: ''
    });

    useEffect(() => {
        if (state) {
            setErrors({ name: '', descrip: '', state: '', dates: '', img: '' });

            if (isEditMode && tournamentToEdit) {
                const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
                
                const imageUrl = tournamentToEdit.img 
                    ? (tournamentToEdit.img.startsWith('http') ? tournamentToEdit.img : `${API_URL}${tournamentToEdit.img}`)
                    : null;
                
                setExistingLogoUrl(imageUrl);

                setFormData({
                    name: tournamentToEdit.nombre,
                    descrip: tournamentToEdit.descripcion || '',
                    state: tournamentToEdit.estado,
                    init_date: tournamentToEdit.inicio ? tournamentToEdit.inicio.split('T')[0] : '',
                    end_date: tournamentToEdit.fin ? tournamentToEdit.fin.split('T')[0] : '',
                    img: null
                });
            } else {
                setFormData({
                    name: '',
                    descrip: '',
                    state: 'proximo', 
                    init_date: '',
                    end_date: '',
                    img: null
                });
                setExistingLogoUrl(null);
            }
        }
    }, [state, isEditMode, tournamentToEdit]);


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (file: File | null) => {
        setFormData(prev => ({ ...prev, img: file }));
        if (file) {
            setErrors(prev => ({ ...prev, img: '' }));
            setExistingLogoUrl(null);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { name: '', descrip: '', state: '', dates: '', img: '' };

        if (!formData.name.trim()) { newErrors.name = 'El nombre es obligatorio.'; isValid = false; }
        if (!formData.descrip.trim()) { newErrors.descrip = 'La descripción es obligatoria.'; isValid = false; }
        if (!formData.state) { newErrors.state = 'El estado es obligatorio.'; isValid = false; }
        
        if (!formData.init_date || !formData.end_date) {
            newErrors.dates = 'Ambas fechas son obligatorias.';
            isValid = false;
        } else if (new Date(formData.init_date) > new Date(formData.end_date)) {
            newErrors.dates = 'La fecha de inicio no puede ser mayor a la de fin.';
            isValid = false;
        }

        if (!isEditMode && !formData.img) {
            newErrors.img = 'La imagen del torneo es obligatoria.';
            isValid = false;
        } else if (isEditMode && !formData.img && !existingLogoUrl) {
            newErrors.img = 'La imagen del torneo es obligatoria.';
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
        data.append('name', formData.name);
        data.append('descrip', formData.descrip);
        data.append('state', formData.state);
        data.append('init_date', formData.init_date);
        data.append('end_date', formData.end_date);
        
        if (formData.img) {
            data.append('img', formData.img); 
        }

        let url = `${API_URL}/tournaments`;
        
        if (isEditMode && tournamentToEdit) {
            url = `${API_URL}/tournaments/${tournamentToEdit.id}`;
            data.append('_method', 'PUT'); 
        }

        try {
            const res = await fetch(url, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} torneo`);
            }

            alert(`Torneo ${isEditMode ? 'actualizado' : 'creado'} con éxito!`);
            if (onTournamentCreated) onTournamentCreated();
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
            <ContainModal className="w-[95%] md:w-[70%] lg:w-[40%] bg-gray-200 rounded-2xl overflow-hidden max-h-[90vh] grid grid-rows-[auto_minmax(0,1fr)_auto]">
                
                <HeaderModal className="flex-none" onClose={onClose}>
                    <div className="text-start pl-4">
                        <h2 className="text-2xl font-bold">{isEditMode ? 'Editar Torneo' : 'Añadir Nuevo Torneo'}</h2>
                        <p className="text-md text-gray-600">Complete la información del evento deportivo.</p>
                    </div>
                </HeaderModal>

                <div className="relative flex-grow main-modal overflow-y-auto px-6 py-4 space-y-4">
                    
                    <section className="flex flex-col p-4 shadow rounded-xl bg-gray-100 space-y-4 text-start">
                        <h3 className="font-bold text-lg text-gray-700">Información General</h3>
                        
                        <InputGroup label="Nombre del Torneo" For="name" labelClass="text-gray-600">
                            <Input 
                                id="name" name="name" 
                                value={formData.name} onChange={handleChange} 
                                className="input w-full" 
                                placeholder="Ej: Copa Aniversario 2025"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </InputGroup>

                        <InputGroup label="Descripción" For="descrip" labelClass="text-gray-600">
                            <TextArea 
                                id="descrip" name="descrip" 
                                value={formData.descrip} onChange={handleChange} 
                                className="input w-full" rows={3}
                                placeholder="Detalles del torneo..."
                            />
                            {errors.descrip && <p className="text-red-500 text-xs mt-1">{errors.descrip}</p>}
                        </InputGroup>

                        <div className="grid grid-cols-1 gap-4">
                            <InputGroup label="Estado" For="state" labelClass="text-gray-600">
                                <Select
                                    className="cursor-pointer input w-full pl-3 py-2 placeholder:text-black" 
                                    options={stateOptions}
                                    currentValue={formData.state}
                                    isOpen={isStateOpen}
                                    setOpen={setIsStateOpen}
                                    onSelect={(id, label) => {
                                        setFormData(prev => ({ ...prev, state: label }));
                                        if(errors.state) setErrors(prev => ({ ...prev, state: '' }));
                                    }}
                                    placeholder="Seleccione estado"
                                />
                                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                            </InputGroup>
                        </div>
                    </section>

                    <section className="flex flex-col p-4 shadow rounded-xl bg-gray-100 space-y-4 text-start">
                        <h3 className="font-bold text-lg text-gray-700">Logística y Multimedia</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputGroup label="Fecha Inicio" For="init_date" labelClass="text-gray-600">
                                <Input 
                                    type="date" id="init_date" name="init_date"
                                    value={formData.init_date} onChange={handleChange} 
                                    className="input w-full"
                                />
                            </InputGroup>

                            <InputGroup label="Fecha Fin" For="end_date" labelClass="text-gray-600">
                                <Input 
                                    type="date" id="end_date" name="end_date"
                                    value={formData.end_date} onChange={handleChange} 
                                    className="input w-full"
                                />
                            </InputGroup>
                        </div>
                        {errors.dates && <p className="text-red-500 text-xs">{errors.dates}</p>}

                        <div>
                            <UploadIMG
                                label="Imagen del Torneo"
                                file={formData.img}
                                onFileChange={handleFileChange}
                                previewUrl={existingLogoUrl}
                            />
                            {errors.img && <p className="text-red-500 text-xs mt-1">{errors.img}</p>}
                        </div>
                    </section>
                </div>

                <FooterModal
                    className="flex-none"
                    BTmain={isEditMode ? "Guardar Cambios" : "Crear Torneo"}
                    BTSecond="Cancelar"
                    onClose={onClose}
                    onSumit={handleSave}
                    disabled={loading}
                />
            </ContainModal>
        </Modal>
    );
}