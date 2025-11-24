'use client';
import React from 'react';
import Image from 'next/image';
import { 
  Modal, 
  ContainModal, 
  HeaderModal, 
  Button
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
}

export default function Modal_DetallesDeporte({ sportData, isLoading, state, onClose }: ModalProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-10 text-center flex flex-col items-center justify-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-unimar mb-4"></div>
             <p className="text-lg font-semibold text-gray-600">Cargando información completa...</p>
        </div>
      );
    }

    if (!sportData) {
      return <p className="p-6 text-center text-red-500">No se pudieron cargar los datos del deporte.</p>;
    }

    return (
      <div className="flex flex-col gap-3 pb-4">
        {/**
         * <div className="flex-shrink-0 mt-3 w-full px-6 justify-center place-content-center items-center">
          <div className="relative w-full h-48 lg:h-58 rounded-lg overflow-hidden shadow-lg border border-gray-100">
            <Image
              src={sportData.logo_url 
                ? (sportData.logo_url.startsWith('http') ? sportData.logo_url : `${API_URL}${sportData.logo_url}`)
                : '/assets/default_sport.png'} 
              alt={sportData.nombre}
              layout="fill"
              objectFit="cover"
              className="bg-gray-200"
            />
          </div>
        </div>
         */}
        

        <div className="flex-grow px-6 space-y-4">
          
          <div className='items-center gap-2 justify-center xl:justify-start mt-2'>
              <h3 className="text-2xl title font-bold text-gray-800 uppercase">{sportData.nombre}</h3>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide">
                {sportData.tipo}
              </span>
          </div>

          <div className="space-y-4">
            <div className='text-justify bg-gray-50 p-3 rounded-lg'>
              <h4 className="font-bold text-unimar mb-1">Descripción</h4>
              <p className="text-gray-700 whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                {sportData.descripcion || "No hay descripción disponible."}
              </p>
            </div>
            
            <div>
                <h4 className="font-bold text-gray-700 text-start">Equipamiento Necesario</h4>               
                <div className="flex flex-wrap gap-2 p-2 rounded-lg">
                {sportData.equipamiento && (
                    <div className="flex flex-wrap gap-2 pt-2 justify-center">
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
      <ContainModal className="bg-white w-[95%] md:w-[70%] lg:w-[60%] xl:w-[50%] max-h-[85vh] rounded-2xl grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden shadow-2xl">
        
        <HeaderModal className="flex-none border-b border-gray-100 py-3" onClose={onClose}>
          <></>
        </HeaderModal>
        
        <div className="main-modal overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
          <Button className='btn bg-unimar text-white px-6 py-2 rounded-xl hover:bg-blue-900 transition-colors cursor-pointer font-medium shadow-md'
           onClick={onClose}
          >
            Cerrar
          </Button>

      </ContainModal>
    </Modal>
  );
}