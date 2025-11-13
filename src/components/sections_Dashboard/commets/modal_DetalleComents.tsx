'use client'
import React, { useState, useEffect  } from 'react'
import Image from 'next/image'
import { 
  Input,
  Button, 
  Select, 
  Table, 
  TableBody, TableCell, TableRow,
  TableHead, TableHeaderCell,
  Modal, HeaderModal,ContainModal
 } from '@/types/ui_components'

  interface ApiList{
    id:number
    estado: 'publico'|'privado';
    email:string;
    fecha_creacion:string;
    autor:string;
    comentario_extracto:string;
  }

  interface APIcoment{
     id: number;
    comentario: string;
    email:string;
    estado: string;
    autor: {
        id: number;
        nombre:string;
        email: string;
        cedula:string;
        telefono:string;
    };
    fecha_creacion:string;
  }

interface ModalPropsSubs {
    entryData: ApiList | null;
    userData: APIcoment | null;
    isLoading: boolean;
    state:boolean;
    onClose: () => void;
}

export default function DetalleSubs({ entryData, userData, isLoading, onClose, state }: ModalPropsSubs) {
    if (!entryData) return null;

    return (
        <Modal state={state}>
            <ContainModal className='bg-white text-black'>
                <HeaderModal className="flex-none" onClose={onClose}>
                    <div className="text-start">
                        <h2 className="ml-5 title">Comentarios</h2>
                    </div>
                </HeaderModal>
                <div > {/* Fondo oscuro */}
                    <div > {/* Contenido del modal */}
                        
                        {/* 1. Información del autor */}
                        <p><strong>Fecha de publicación:</strong> {entryData.fecha_creacion}</p>
                        <p><strong>Comentario en estado:</strong> {entryData.estado}</p>
                        <hr />

                        {/* 2. Información del EQUIPO/JUGADOR (la que buscamos) */}
                        {isLoading ? (
                            <p>Cargando detalles del autor...</p>
                        )  : userData ? (
                            // Caso Equipo
                            <div>
                                <h3 className='text-lg font-semibold'>Información del autor</h3>                                
                                <p className={`${userData.autor?.nombre ? '':'hidden'}`}><strong>Nombre:</strong> {userData.autor?.nombre}</p>
                                <p className={`${userData.autor?.cedula ? '':'hidden'}`}><strong>Cedula:</strong> {userData.autor?.cedula}</p>
                                <p><strong>Email:</strong> {userData.autor?.email || userData.email}</p>
                                <p className={`${userData.autor?.telefono ? '':'hidden'}`}><strong>Telefono:</strong> {userData.autor?.telefono}</p>

                                <div>
                                    <p>{userData.comentario}</p>
                                </div>
                            </div>
                        ) : (
                            <p>No se pudieron cargar los detalles del autor.</p>
                        )}
                    </div>
                </div>
            </ContainModal>
        </Modal>
    );
}
