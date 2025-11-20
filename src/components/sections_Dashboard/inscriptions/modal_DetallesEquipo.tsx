'use client'
import React from 'react'
import { 
  Table, 
  TableBody, TableCell, TableRow,
  TableHead, TableHeaderCell,
  Modal,
  ContainModal,
  HeaderModal
 } from '@/types/ui_components'
 import Image from 'next/image'

interface ApiUser {
  id: number;
  nombre: string | null;
  email: string | null;
  cedula: string | null;
  telefono: string | null;
  pivot?: {
    dorsal: string | null;
  };
}

const titles = [
     {id:1, titulo:'Dorsal'},
     {id:2, titulo:'Usuario'},
     {id:3, titulo:'Cedula'},
     {id:4, titulo:'Email'},
]

//tabla inscripciones
interface ApiTeam {
  id: number;
  torneo: string;
  nombre: string;
  disciplina: string;
  categoria: string;
  logo:string;
  integrantes_total: number;
  estado: 'Aceptado' | 'Rechazado' | 'Pendiente';
  team_id_for_modal: number | null;
  user_id_for_modal: number | null;
  color:string;
  captain: {
    id: number;
    nombre: string;
  };
    integrantes_data: ApiUser[];
}

interface ModalProps {
    entryData: ApiTeam | null;
    teamData: ApiTeam | null;
    isLoading: boolean;
    state:boolean;
    onClose: () => void;
}

export default function modal_DetallesEquipo({ entryData, teamData, isLoading, onClose, state }: ModalProps) {
    if (!entryData) return null;

    const esIndividual = !!entryData.user_id_for_modal;
    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

    return (
        <Modal state={state}>
            <ContainModal className='bg-white'>
                <HeaderModal className="flex-none" onClose={onClose}>
                    <div className="text-start">
                        <h2 className="ml-5 title">Detalles de la Inscripción</h2>
                    </div>
                </HeaderModal>
                <div >
                    <div >
                        <p><strong>Torneo:</strong> {entryData.torneo}</p>
                        <p><strong>Deporte:</strong> {entryData.disciplina}</p>
                        <p><strong>Categoría:</strong> {entryData.categoria}</p>
                        <p><strong>Estado:</strong> {entryData.estado}</p>
                        <hr />
                        {isLoading ? (
                            <p>Cargando detalles del competidor...</p>
                        ) : esIndividual ? (
                            // Caso Individual
                            <div>
                                <h3>Jugador Individual</h3>
                                <p><strong>Nombre:</strong> {entryData.nombre}</p>
                                
                            </div>
                        ) : teamData ? (
                            // Caso Equipo
                            <div className='items-center flex flex-col'>
                                <h3>Detalles del Equipo</h3>
                                    <div className="relative w-full h-48 lg:h-58 rounded-lg overflow-hidden">
                                        <Image
                                        src={`${API_URL}${teamData.logo}`}
                                        alt={teamData.nombre}
                                        layout="fill"
                                        objectFit="cover"
                                        className="bg-gray-200"
                                        />
                                    </div>                                
                                   <div className="flex justify-center my-4">
                                    <a 
                                        href={`${API_URL}${teamData.logo}`} 
                                        download={`logo_${teamData.nombre.replace(/\s+/g, '_')}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="group relative size-64 bg-gray-100 rounded-full overflow-hidden border-4 border-unimar/25 shadow-lg cursor-pointer block"
                                    >
                                        <Image 
                                            src={teamData.logo ? `${API_URL}${teamData.logo}` : '/persona.png'}
                                            alt="Logo Equipo" 
                                            fill
                                            className="object-cover"
                                        />
                                        <div className='absolute inset-0 flex justify-center items-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10'>
                                            <Image 
                                                className='scale-110 grayscale invert' 
                                                src={'/bandeja-de-descarga.png'} 
                                                alt={'descargar'} 
                                                width={25} 
                                                height={25} 
                                            />
                                        </div>
                                    </a>
                                </div>
                                <p><strong>Nombre:</strong> {teamData.nombre}</p>
                                <p><strong>Capitán:</strong> {teamData.captain?.nombre || 'No asignado'}</p>
                                <p><strong>Color:</strong> {teamData.color}</p>
                                <div>
                                </div>
                                <hr />
                                <h4>Integrantes ({teamData.integrantes_total}):</h4>
                                <ul>
                                     <Table>
                                         <TableHead className="text-gray-100  bg-unimar">
                                        {titles.map((t)=>(
                                            <TableHeaderCell key={t.id} className="first:rounded-l-lg last:rounded-r-lg p-2 justify-center text-center font-semibold ">
                                                {t.titulo}
                                              </TableHeaderCell>
                                            ))}
                                        </TableHead>
                                        
                                        <TableBody className="bg-gray-100 divide-y divide-gray-200">
                                            {teamData.integrantes_data.map(member => (
                                                <TableRow key={member.id}>
                                                    <TableCell>{member.pivot?.dorsal || 'N/A'}</TableCell>
                                                    <TableCell>{member.nombre} </TableCell>
                                                    <TableCell>{member.cedula} </TableCell>
                                                    <TableCell>{member.email} </TableCell>
                                                    
                                                   
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ul>
                            </div>
                        ) : (
                            <p>No se pudieron cargar los detalles del equipo.</p>
                        )}
                    </div>
                </div>
            </ContainModal>
        </Modal>
    );
}
