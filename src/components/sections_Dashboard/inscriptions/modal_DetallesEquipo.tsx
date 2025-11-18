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

interface ApiUser {
  id: number;
  nombre: string | null;
  email: string | null;
  cedula: string | null;
  telefono: string | null;
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
                            <div>
                                <h3>Detalles del Equipo</h3>
                                <p><strong>Nombre:</strong> {teamData.nombre}</p>
                                <p><strong>Capitán:</strong> {teamData.captain?.nombre || 'No asignado'}</p>
                                <p><strong>Color:</strong> {teamData.color}</p>
                                <p><strong>Imagen</strong>{teamData.logo}</p>                                
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
                                                    <TableCell>{member.id}</TableCell>
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
