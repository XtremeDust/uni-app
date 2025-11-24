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
  {/* Aumentamos el ancho máximo para que respire mejor (max-w-3xl) */}
  <ContainModal className="bg-white text-black max-w-3xl w-full rounded-lg shadow-xl overflow-hidden">
    
    <HeaderModal className="flex-none border-b border-gray-100 py-4" onClose={onClose}>
      <div className="text-start">
        {/* Título más grande y oscuro */}
        <h2 className="ml-6 text-2xl font-bold text-slate-900">Comentarios</h2>
      </div>
    </HeaderModal>

    <div className="p-6"> {/* Padding interno generoso */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
             <p className="text-gray-500 animate-pulse">Cargando detalles...</p>
        </div>
      ) : userData ? (
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          <div className="text-start pr-4">
            <p className="text-gray-600  leading-relaxed">
              {userData.comentario || "Sin comentario disponible."}
            </p>
          </div>

          <div className="text-start pl-0 md:pl-6 space-y-6">
            
            <div className="space-y-3">
              <div>
                <p className="font-bold text-slate-800 text-sm">Fecha de publicación:</p>
                <p className="text-gray-500 text-sm">{entryData.fecha_creacion}</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Comentario en estado:</p>
                <p className="text-gray-500 text-sm capitalize">{entryData.estado}</p>
              </div>
            </div>

            <div>
              <h3 className="text-blue-950 font-bold text-lg mb-3">Información del autor</h3>
              
              <div className="space-y-2 text-sm">
                {userData.autor?.nombre && (
                  <p>
                    <span className="font-bold text-slate-700">Nombre:</span> 
                    <span className="text-gray-600 ml-1">{userData.autor.nombre}</span>
                  </p>
                )}

                {userData.autor?.cedula && (
                  <p>
                    <span className="font-bold text-slate-700">Cédula:</span> 
                    <span className="text-gray-600 ml-1">{userData.autor.cedula}</span>
                  </p>
                )}

                <p>
                    <span className="font-bold text-slate-700">Email:</span> 
                    <span className="text-gray-600 ml-1 break-all">{userData.autor?.email || userData.email}</span>
                </p>

                {userData.autor?.telefono && (
                   <p>
                    <span className="font-bold text-slate-700">Teléfono:</span> 
                    <span className="text-gray-600 ml-1">{userData.autor.telefono}</span>
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <p className="text-red-500 text-center">No se pudieron cargar los detalles.</p>
      )}
    </div>
  </ContainModal>
</Modal>
    );
}
