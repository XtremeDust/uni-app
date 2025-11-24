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
  <ContainModal className="bg-white max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl">
    
    <HeaderModal className="flex-none border-b border-gray-100 py-4 px-6" onClose={onClose}>
      <h2 className="text-xl font-bold text-slate-800">Detalles de la Inscripción</h2>
    </HeaderModal>

    <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh]">
      
      {isLoading ? (
        <div className="py-20 text-center text-gray-500 animate-pulse">Cargando información...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
         
          <div className="md:col-span-4">
             {teamData ? (
                <div className="bg-unimar/8 rounded-2xl p-6 border border-slate-100 h-full flex flex-col items-center text-center">
                  <h3 className="text-sm font-bold text-center text-gray-800  tracking-wide mb-6 self-start">
                    Información del Equipo
                  </h3>

                  <div className="relative mb-4">
                      <a 
                        href={`${API_URL}${teamData.logo}`} 
                        download={`logo_${teamData.nombre.replace(/\s+/g, '_')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative w-40 h-40 block bg-white rounded-full overflow-hidden border-4 border-white shadow-md cursor-pointer"
                      >
                        <Image 
                          src={teamData.logo ? `${API_URL}${teamData.logo}` : '/persona.png'}
                          alt="Logo Equipo" 
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
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

                  <h2 className="text-lg font-bold text-slate-900 mb-1">{teamData.nombre}</h2>
                  
                  <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-slate-700">Capitán:</span> {teamData.captain?.nombre || 'N/A'}
                      </p>
                      
                      <div className="flex items-center justify-center gap-2 mt-3">
                         <div 
                            className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" 
                            style={{ backgroundColor: teamData.color || '#000' }}
                         />
                         <span className="text-xs font-mono text-gray-400 uppercase">{teamData.color || 'N/A'}</span>
                      </div>
                  </div>
                </div>
             ) : (
                <div className="bg-slate-50 p-6 rounded-xl">
                   <p className="font-bold">{entryData.nombre}</p>
                   <p className="text-sm text-gray-500">Participante Individual</p>
                </div>
             )}
          </div>

          <div className="md:col-span-8 space-y-8">
            
            <section>
              <h3 className="text-sm font-bold text-slate-800 mb-5 border-b border-gray-100 pb-2">
                Información del Torneo
              </h3>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-8  text-justify">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Torneo</p>
                  <p className="font-bold text-slate-800 text-sm">{entryData.torneo}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Deporte</p>
                  <p className="font-bold text-slate-800 text-sm">{entryData.disciplina}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Categoría</p>
                  <p className="font-bold text-slate-800 text-sm">{entryData.categoria}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Estado</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                    entryData.estado === 'Aceptado' 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : entryData.estado === 'Pendiente'
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        : 'bg-rose-100 text-rose-700 border-red-200'
                  }`}>
                    {entryData.estado}
                  </span>
                </div>
              </div>
            </section>

            {teamData && (
              <section>
                 <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    Integrantes 
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                      {teamData.integrantes_total}
                    </span>
                 </h3>

                 <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Table className='w-full'>
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
                 </div>
              </section>
            )}
            
          </div>
        </div>
      )}
    </div>
  </ContainModal>
</Modal>
    );
}
