'use client';
import React from 'react';
import Image from 'next/image';
import { Modal, ContainModal, HeaderModal, FooterModal } from '@/types/ui_components';

interface UserDetailData {
  nombre: string | null;
  email: string | null;
  cedula: string | null;
  telefono: string | null;
  equipos: { id: number; nombre: string; disciplina: string }[];
  img?: string;
}

interface ModalProps {
    state: boolean;
    onClose: () => void;
    user: UserDetailData | null;
}

export default function Modal_DetallesUser({ state, onClose, user }: ModalProps) {
    if (!user) return null;
    const ApiURL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');

    return (
        <Modal state={state}>
            <ContainModal className="w-full max-w-md bg-white text-black rounded-2xl overflow-hidden">
                <HeaderModal onClose={onClose}>
                    <div className="text-start pl-2">
                        <h2 className="text-xl font-bold text-gray-800">Detalles del Usuario</h2>
                    </div>
                </HeaderModal>
                
                <div className="p-6 flex flex-col items-center space-y-2">
                    
                    <div className="relative size-38 bg-unimar/10 overflow-hidden rounded-full flex items-center justify-center border-4 border-unimar/25 shadow-lg">
                         <Image 
                            src={user.img 
                                ? `${ApiURL}${user.img}`
                                : '/persona.png'}
                            alt="Usuario" 
                            fill
                            className="object-cover"
                     />
                    </div>

                    <div className="text-center space-y-1">
                        <h3 className="text-2xl font-bold text-gray-900">{user.nombre || 'Sin Nombre'}</h3>
                    </div>

                    <div className="w-full bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
                        
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500 text-sm">Cédula</span>
                            <span className="font-medium text-gray-800">{user.cedula}</span>
                        </div>

                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500 text-sm">Correo</span>
                            <span className="font-medium text-gray-800 text-sm">{user.email}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500 text-sm">Teléfono</span>
                            <span className="font-medium text-gray-800">{user.telefono}</span>
                        </div>

                    </div>
                    <div className="w-full text-start">
                        <h4 className="font-bold text-gray-700 mb-2">Equipos Inscritos</h4>
                        {user.equipos.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {user.equipos.map((eq, i) => (
                                    <div key={i} className="bg-blue-50 border border-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm">
                                        <p className="font-bold">{eq.nombre}</p>
                                        <p className="text-xs text-blue-600">{eq.disciplina}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">Sin equipos asignados.</p>
                        )}
                    </div>
                </div>

            </ContainModal>
        </Modal>
    );
}