'use client';
import React from 'react';
import Image from 'next/image';
import { 
  Modal, 
  ContainModal, 
  HeaderModal, 
  Button
} from '@/types/ui_components';

interface ModalProps {
  offeringData: any | null; 
  isLoading: boolean;
  state: boolean;
  onClose: () => void;
}

export default function ModalDetallesOferta({ offeringData, isLoading, state, onClose }: ModalProps) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

  const renderContent = () => {
    if (isLoading) {
      return <div className="p-10 text-center text-gray-500">Cargando detalles...</div>;
    }

    if (!offeringData) {
      return <div className="p-10 text-center text-red-500">No se pudo cargar la información.</div>;
    }

    const { deporte, entrenador, enrollments, trimestre, cupos, inscritos_actuales } = offeringData;

    return (
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex-shrink-0 mt-3 w-full px-6 flex justify-center">
          <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-md bg-gray-100">
             <Image
               src={deporte?.img ? `${API_URL}${deporte.img}` : '/logounimar-25-aniversario.png'} 
               alt={deporte?.titulo || 'Deporte'}
               layout="fill"
               objectFit="cover"
               className="opacity-90"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                    <h2 className="text-3xl font-bold">{deporte?.titulo || 'Sin Título'}</h2>
                    <p className="text-sm font-medium opacity-90 uppercase tracking-wider">{trimestre} • {inscritos_actuales}/{cupos} Cupos</p>
                </div>
             </div>
          </div>
        </div>

        <div className="flex-grow px-6 space-y-6">
            
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                     Encargado
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-start">
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-bold">Nombre</p>
                        <p className="text-gray-800 font-medium">{entrenador?.nombre}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-bold">Correo</p>
                        <p className="text-gray-800 font-medium">{entrenador?.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-bold">Cédula</p>
                        <p className="text-gray-800 font-medium">{entrenador?.cedula}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs uppercase font-bold">Teléfono</p>
                        <p className="text-gray-800 font-medium">{entrenador?.telefono || 'N/A'}</p>
                    </div>
                </div>
            </div>

            <div>

                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                    <h4 className="font-bold text-gray-800 p-4 flex items-center gap-2">
                        Listado de Estudiantes
                    </h4>
                    <div className="max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {enrollments && enrollments.length > 0 ? (
                            enrollments.map((enroll: any, idx: number) => (
                                <div key={enroll.id} className="flex items-center justify-between p-3 bg-white hover:bg-blue-50/50 rounded-lg border border-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 text-xs font-bold w-4">{idx + 1}</span>
                                        <div>
                                            <p className=" font-bold text-gray-800">{enroll.student?.nombre}</p>
                                            <p className="text-sm text-gray-500">{enroll.student?.cedula}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[12px] px-2 py-1 rounded-full font-bold uppercase ${enroll.state === 'inscrito' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {enroll.state}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-gray-400 text-sm italic">
                                No hay estudiantes inscritos en esta oferta.
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
      <ContainModal className="bg-white w-[95%] md:w-[70%] lg:w-[60%] xl:w-[50%] max-h-[90vh] rounded-3xl grid grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden">
        
        <HeaderModal className="flex-none border-b border-gray-100" onClose={onClose}>
            <></>
        </HeaderModal>
        
        <div className="main-modal overflow-y-auto bg-white">
          {renderContent()}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
            <Button 
                className='bg-unimar text-white px-6 py-2 rounded-xl font-bold hover:opacity-90 shadow-lg shadow-blue-900/10 transition-all active:scale-95'
                onClick={onClose}
            >
                Cerrar
            </Button>
        </div>

      </ContainModal>
    </Modal>
  );
}