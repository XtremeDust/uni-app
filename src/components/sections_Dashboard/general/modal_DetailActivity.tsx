'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { 
  Input,
  Button, 
  Select, 
  Table, 
  TableBody, TableCell, TableRow,
  TableHead, TableHeaderCell,
  HeaderModal,
  ContainModal,
  Modal
 } from '@/types/ui_components'

 interface ApiActivityList {
  id: number;
  titulo: string;
  tipo: 'cultural' | 'general';
  estado: 'proximo' | 'finalizado' | 'activo';
  fecha_actividad: string;
  ubicacion: string;
  extracto_contenido: string;
  creador_nombre: string;
}

interface ApiCreator {
  id: number;
  nombre: string;
  email: string;

}

interface ApiRegulation {
  id: number;
  titulo: string;
  url_archivo: string;

}

interface ApiActivityDetail {
  id: number;
  titulo: string;
  contenido_completo: string;
  imagen_url: string;
  tipo: 'cultural' | 'general';
  estado: 'proximo' | 'finalizado' | 'activo';
  fecha_actividad: string;
  ubicacion: string;
  creador: ApiCreator;
  reglamentos: ApiRegulation[];
  creado_hace: string;
}

interface ModalProps {
    activityData: ApiActivityDetail | null;
    isLoading: boolean;
    onClose: () => void;
}

export default function modal_DetailActivity({ activityData, isLoading, onClose }: ModalProps) {
    return (
        <Modal state={true}>
       
        <ContainModal className="bg-gray-50 max-w-4xl w-full h-[90vh] md:h-auto md:max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            
            <div className="relative w-full h-48 flex-none bg-gray-300  rounded-lg">
                <div className="absolute top-3 right-3 z-20">
                    <HeaderModal onClose={onClose} className="text-white/90 hover:text-white hover:bg-black/20 rounded-full transition-all">
                    <></>
                    </HeaderModal>
                </div>

                <Image
                    src={'/logounimar-25-aniversario.png'} // `${activityData?.imagen_url}` ||
                    alt="Banner Actividad"
                    fill
                    className="object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t rounded-lg from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <h2 className="text-2xl font-bold text-white mb-2 text-start">
                        {activityData?.titulo || 'Título de la Actividad'}
                    </h2>
                    
                    {activityData?.estado && (
                        <span className={`self-start px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                            activityData.estado === 'activo' ? 'bg-green-600/50 text-white' :
                            activityData.estado === 'finalizado' ? 'bg-purple-600/40 text-white' :
                            'bg-blue-600/50 text-white'
                        }`}>
                            {activityData.estado}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-justify">
            
            {isLoading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Cargando detalles...</div>
            ) : activityData ? (
                <>
                    <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-gray-100 pb-2">
                        Detalles Generales
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-gray-400">
                        
                                <Image src={'/etiqueta (2).png'} alt={'etiqueta'} width={25} height={25}/>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Tipo</p>
                                <p className="font-medium text-slate-700 capitalize">{activityData.tipo}</p>
                            </div>
                        </div>

                        
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-gray-400">
                        
                                <Image src={'/calendario (4).png'} alt={'calendario'} width={25} height={25}/>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Fecha</p>
                                <p className="font-medium text-slate-700">{activityData.fecha_actividad}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-gray-400">

                                 <Image src={'/ubicacion (1).png'} alt={'calendario'} width={25} height={25}/>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Ubicación</p>
                                <p className="font-medium text-slate-700">{activityData.ubicacion}</p>
                            </div>
                        </div>
                    </div>
                    </section>

                    <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-gray-100 pb-2">
                        Descripción
                    </h3>
                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {activityData.contenido_completo}
                    </div>
                    </section>

                    <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-gray-100 pb-2">
                        Información del Organizador
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-gray-400">
                                 <Image src={'/usuario (2).png'} alt={'usuarios'} width={25} height={25}/>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Nombre</p>
                                <p className="font-medium text-slate-700">{activityData.creador.nombre}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-gray-400">
                                 <Image src={'/correo-electronico (1).png'} alt={'email'} width={25} height={25}/>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-gray-500 font-bold uppercase">Email</p>
                                <p className="font-medium text-slate-700 truncate">{activityData.creador.email}</p>
                            </div>
                        </div>
                    </div>
                    </section>

                    <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-gray-100 pb-2">
                        Reglamentos
                    </h3>
                    {activityData.reglamentos && activityData.reglamentos.length > 0 ? (
                        <div className="space-y-2">
                            {activityData.reglamentos.map(reg => (
                                <div key={reg.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="bg-unimar/10 p-1.5 rounded text-unimar">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <span className="font-semibold text-slate-700 text-sm">{reg.titulo}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic">No hay reglamentos asociados.</p>
                    )}
                    </section>

                </>
            ) : (
                <p className="text-red-500 text-center text-sm">No se pudieron cargar los detalles.</p>
            )}
            </div>
        </ContainModal>
        </Modal>
    );
}
