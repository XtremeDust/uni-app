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
        <Modal state={true}> {/* Asumo tu componente Modal */}
            <ContainModal className='bg-white text-black '>
                <HeaderModal onClose={onClose}>
                    Detalles de la Actividad
                </HeaderModal>
                <div>
                    {isLoading ? (
                        <p>Cargando detalles...</p>
                    ) : activityData ? (
                        <div>
                            <h2>{activityData.titulo}</h2>
                            <p><strong>Tipo:</strong> {activityData.tipo}</p>
                            <p><strong>Estado:</strong> {activityData.estado}</p>
                            <p><strong>Fecha:</strong> {activityData.fecha_actividad}</p>
                            <p><strong>Ubicación:</strong> {activityData.ubicacion}</p>
                            
                            <hr className="my-2" />
                            <p><strong>Descripción:</strong></p>
                            <p>{activityData.contenido_completo}</p>
                            
                            <hr className="my-2" />
                            <h3>Creador</h3>
                            <p>{activityData.creador.nombre} ({activityData.creador.email})</p>
                            
                            <hr className="my-2" />
                            <h3>Reglamentos</h3>
                            <ul>
                                {activityData.reglamentos.length > 0 ? (
                                    activityData.reglamentos.map(reg => (
                                        <li key={reg.id}>{reg.titulo}</li>
                                    ))
                                ) : (
                                    <li>No hay reglamentos asociados.</li>
                                )}
                            </ul>
                        </div>
                    ) : (
                        <p>No se pudieron cargar los detalles.</p>
                    )}
                </div>
            </ContainModal>
        </Modal>
    );
}
