'use client';
import React from 'react';
import Image from 'next/image';
import { 
  Modal, 
  ContainModal, 
  HeaderModal 
} from '@/types/ui_components';

export interface ApiSportDetail {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  logo_url: string | null; 
  equipamiento: string;
}

interface ModalProps {
  sportData: ApiSportDetail | null; 
  isLoading: boolean;
  state: boolean;
  onClose: () => void;
  // Opcional: para los botones de editar/eliminar desde aquí
  // onEdit: () => void;
  // onDelete: () => void;
}

export default function Modal_DetallesDeporte({ sportData, isLoading, state, onClose }: ModalProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

  const renderContent = () => {
    if (isLoading) {
      return <p className="p-6 text-center">Cargando detalles del deporte...</p>;
    }

    if (!sportData) {
      return <p className="p-6 text-center">No se pudieron cargar los datos.</p>;
    }

    return (
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="flex-shrink-0 w-full md:w-1/3">
          <div className="relative w-full h-48 md:h-full rounded-lg overflow-hidden shadow-lg">
            <Image
              src={`${API_URL}${sportData.logo_url}`}
              alt={sportData.nombre}
              layout="fill"
              objectFit="cover"
              className="bg-gray-200"
            />
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{sportData.nombre}</h3>
          <p className="text-lg text-unimar mb-4 font-semibold">{sportData.tipo}</p> 
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-gray-700">Descripción</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{sportData.descripcion}</p>
            </div>
            <div>
                <h4 className="font-bold text-gray-700">Equipamiento Necesario</h4>               
                <div className="flex flex-wrap gap-2 p-2 rounded-lg justify-center">
                {sportData.equipamiento && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {sportData.equipamiento.split(',')
                            .map(tag => tag.trim())
                            .filter(tag => tag)
                            .map((tag, index) => (
                                <span key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                    {tag}
                                </span>
                        ))}
                    </div>
                )}
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal state={state}>
      <ContainModal className="bg-white w-[95%] md:w-[70%] lg:w-[50%] max-h-[80vh] rounded-2xl grid grid-rows-[auto_minmax(0,1fr)]">
        <HeaderModal className="flex-none" onClose={onClose}>
          <div className="text-start">
            <h2 className="ml-5 title">Detalles del Deporte</h2>
          </div>
        </HeaderModal>
        
        <div className="main-modal overflow-y-auto">
          {renderContent()}
        </div>

      </ContainModal>
    </Modal>
  );
}