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
  reglamentos_deporte: ApiRegulation[];
}

interface ApiRegulation {
  id: number;
  titulo: string;
  url_archivo: string;
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
      <div className="flex flex-col  gap-3">
        <div className="flex-shrink-0 mt-3 w-full px-6 justify-center place-content-center items-center">
          <div className="relative w-full h-48 lg:h-58 rounded-lg overflow-hidden shadow-lg ">
            <Image
              src={sportData.logo_url ? `${API_URL}${sportData.logo_url}` : '/logounimar-25-aniversario.png'}
              alt={'logo del deporte'}
              layout="fill"
              objectFit="cover"
              className="bg-gray-200"
            />
          </div>
        </div>
        <div className="flex-grow px-6">
          <div className=' items-center gap-5 justify-center xl:justify-start'>
              <h3 className="title font-bold text-gray-800 ">{sportData.nombre}</h3>
              <p className="text-md text-unimar mb-2 font-semibold">({sportData.tipo})</p> 
          </div>
          <div className="space-y-2">
            <div className='text-justify'>
              <h4 className="font-bold text-gray-700">Descripción</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{sportData.descripcion}</p>
            </div>
            <div>
                <h4 className="font-bold text-gray-700 text-start">Equipamiento Necesario</h4>               
                <div className="flex flex-wrap gap-2 p-2 rounded-lg justify-center">
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

          <div>
              <h4 className="font-bold text-gray-800 text-start mb-2">Reglamento Oficial</h4>
              {sportData.reglamentos_deporte && sportData.reglamentos_deporte ? (
                <div className="space-y-2">
                  {sportData.reglamentos_deporte.map((reg)=>(
                     <div key={reg.id} className="flex items-center justify-between px-2 py-1.5 bg-slate-50 rounded-lg border border-blue-100 transition-colors mb-2">
                        <div className="flex items-center gap-3">
                            <div className=" p-1.5 rounded bg-unimar/8">
                                <Image
                                    src={'/R-02.png'}
                                    alt='imagen'
                                    width={27}
                                    height={25}
                                />
                            </div>
                            
                            <span className="font-semibold text-slate-700 text-sm">{reg.titulo}</span>
                        </div>
                        <a  
                            href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/regulations/${reg.id}/download`}   
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-unimar/90 cursor-pointer hover:bg-unimar text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                            Descargar
                        </a>
                    </div>
                  ))}
              </div>
                  
              ) : (
                  <p className="text-gray-400 text-sm italic p-2 border border-dashed border-gray-300 rounded-lg text-center">
                      Reglamento digital no disponible.
                  </p>
              )}
          </div>
        </div>
        <div>
        </div>
      </div>
    );
  };

  return (
    <Modal state={state}>
      <ContainModal className="bg-white w-[95%] md:w-[70%] lg:w-[80%] xl:w-[40%] max-h-[80vh] rounded-2xl grid grid-rows-[auto_minmax(0,1fr)]">
        <HeaderModal className="flex-none" onClose={onClose}>
          <></>
        </HeaderModal>
        
        <div className="main-modal overflow-y-auto">
          {renderContent()}
        </div>

          {/*
          <Button className='btn bg-unimar text-white  hover:opacity-95 cursor-pointer'
           onClick={onClose}
          >
            Cerrar
          </Button>
          */}

      </ContainModal>
    </Modal>
  );
}