import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { 
  Button, 
  Table, 
  TableBody, TableCell, TableRow,
  TableHead, TableHeaderCell,
  Modal,
  HeaderModal,
  ContainModal
 } from '@/types/ui_components'

interface ModalPropsTournaments {
    entryData: ApiList | null;
    DeporteData: ApiTournament | null;
    DisciplinesData:{nombre_deporte:string, categoria:string}[];
    isLoading: boolean;
    state:boolean;
    tournamentId:number;
    onClose: () => void;
    onAddDisciplineClick: () => void;
}

interface ApiRegulation {
  id: number;
  titulo: string;
  url_archivo: string;
}

interface Creador {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  cedula: string;
  telefono: string;
}

  interface ApiList{
    id:number
    nombre:string;
    estado: 'proximo'|'activo' | 'finalizado';
    inicio:string;
    fin:string;
    total_disiplinas: string; 
  }

interface ApiTournament {
  id: number;
  nombre: string;
  descripcion: string;
  estado: 'proximo' | 'activo' | 'finalizado'; 
  creador: Creador;
  total_disiplinas: string; 
  inicio: string;
  fin: string;
  disciplinas:ApiDiscipline[];
  reglamentos_torneo:ApiRegulation[];
  img?:string;
}

interface ApiDiscipline{
    id:number;
    categoria:string;
    modo_juego:string;
    nombre_deporte:string;
}

interface ApiCompetidor{
  entry_id: number | null;
  nombre: string;
  score: number | null;
}

interface ApiGames{
  id: number;
  estado: string;
  fecha: string;
  ronda: number;
  competidor_a: ApiCompetidor;
  competidor_b: ApiCompetidor;
}

const tituloPartidos = [
    {id:1 , titulo:'Ronda'},
    {id:2 , titulo:'Competidor A'},
    {id:3 , titulo:'Resultado'},
    {id:4 , titulo:'Competidor B'},
    {id:5 , titulo:'Estado'},
]

export default function modal_DetallesTorneo({state, isLoading, entryData, DeporteData, tournamentId, onClose, onAddDisciplineClick}:ModalPropsTournaments) {
    const [selectedDisciplineId, setSelectedDisciplineId] = useState<number | null>(null);
    const [games, setGames] = useState<ApiGames[]>([]);
    const [loadingGames, setLoadingGames] = useState(false);

    const handleDisciplineClick = async (disciplineId: number) => {
        if (selectedDisciplineId === disciplineId) {
            setSelectedDisciplineId(null);
            setGames([]);
            return;
        }

        setSelectedDisciplineId(disciplineId);
        setLoadingGames(true);
        setGames([]);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const res = await fetch(`${API_URL}/games?discipline_id=${disciplineId}`); 
            if (!res.ok) throw new Error(`Error en API Games: ${res.statusText}`);
            
            const jsonData = await res.json();
            setGames(jsonData.data);
            
        } catch (e) {
            console.error("Error al cargar partidos:", e);
        } finally {
            setLoadingGames(false);
        }
    };
    
     const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

    return(
        <Modal state={state}>
        <ContainModal className="bg-gray-50 max-w-4xl w-full h-[90vh] md:h-auto md:max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            
            <div className="relative w-full h-48 flex-none bg-gray-300 rounded-lg">
                <div className="absolute top-3 right-3 z-20">
                    <HeaderModal onClose={onClose} className="text-white/90 hover:text-white hover:bg-black/20 rounded-full transition-all">
                    <></>
                    </HeaderModal>
                </div>

                <Image
                    src={DeporteData?.img ? `${API_URL}${DeporteData.img}` : '/logounimar-25-aniversario.png'}
                    alt="Banner Torneo"
                    fill
                    className="object-cover"
                />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 rounded-lg via-black/20 to-transparent flex flex-col justify-end p-6">
                <h2 className="text-xl font-bold text-white mb-2 text-start">
                    {entryData?.nombre || 'Nombre del Torneo'}
                </h2>
                
                {entryData?.estado && (
                    <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                        entryData?.estado === 'proximo' ? 'bg-blue-600/50 text-white' :
                        entryData?.estado === 'activo' ? 'bg-green-600/50 text-white' :
                        'bg-gray-600/50 text-white'
                    }`}>
                        {entryData?.estado}
                    </span>
                )}
            </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-justify">
            
            {isLoading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Cargando detalles...</div>
            ) : DeporteData ? (
                <>
                    <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-gray-100 pb-2">
                        Información del Organizador
                    </h3>
                    


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-gray-400">
                               <Image src={'/usuario (2).png'} alt={'usuarios'} width={25} height={25}/>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Nombre</p>
                                <p className="font-medium text-slate-700">{DeporteData.creador.nombre}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-gray-400">
                                 <Image src={'/portafolio.png'} alt={'rol'} width={25} height={25}/>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Rol</p>
                                <p className="font-medium text-slate-700">{DeporteData.creador.rol}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-gray-400">
                                 <Image src={'/correo-electronico (1).png'} alt={'email'} width={25} height={25}/>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-gray-500 font-bold uppercase">Email</p>
                                <p className="font-medium text-slate-700 truncate" title={DeporteData.creador.email}>
                                {DeporteData.creador.email}
                                </p>
                            </div>
                        </div>
                    </div>
                    </section>

                    <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-gray-100 pb-2">
                        Reglamento(s) del Torneo
                    </h3>
                    
                    {DeporteData.reglamentos_torneo && DeporteData.reglamentos_torneo.length > 0 ? (
                        <div className="space-y-2">
                            {DeporteData.reglamentos_torneo.map(reg => (
                                <div key={reg.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
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
                                    href={reg.url_archivo} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-unimar/90 hover:bg-unimar text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
                                >
                                    <Image
                                    className=' invert grayscale'
                                            src={'/descarga.png'}
                                            alt='descarga'
                                            width={27}
                                            height={25}
                                        />
                                    Descargar
                                </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic">No hay reglamentos cargados.</p>
                    )}
                    </section>

                    <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                        <h3 className="text-lg font-bold text-slate-800">Disciplinas del Torneo</h3>
                        
                        {entryData?.estado === 'proximo' && (
                            <Button 
                                onClick={onAddDisciplineClick}
                                className="bg-unimar/90 hover:bg-unimar cursor-pointer text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
                            >
                                <Image
                                    className="size-5"
                                        src={'/mas.png'}
                                        alt="plus"
                                        width={500}
                                        height={500}
                                />
                                Añadir Disciplina
                            </Button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {DeporteData.disciplinas.length > 0 ? (
                            DeporteData.disciplinas.map(discipline => (
                                <div key={discipline.id} className="border border-gray-200 rounded-lg overflow-hidden">

                                <div 
                                    onClick={() => handleDisciplineClick(discipline.id)}
                                    className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm md:text-base">
                                            {discipline.nombre_deporte} <span className="font-normal text-gray-500 text-xs md:text-sm">({discipline.categoria})</span>
                                        </h4>
                                    </div>
                                    <div className={`text-gray-400 transition-transform duration-200 ${selectedDisciplineId === discipline.id ? 'rotate-180' : ''}`}>
                                        <Image
                                                className='mr-[5px] invert-50'
                                                src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'}
                                                alt="img"
                                                width={15}
                                                height={25}
                                            />
                                    </div>
                                </div>

                                {selectedDisciplineId === discipline.id && (
                                    <div className="border-t border-gray-200 bg-gray-50 animate-fadeIn">
                                        {loadingGames ? (
                                            <p className="text-xs text-gray-500 text-center py-2">Cargando partidos...</p>
                                        ) : games.length > 0 ? (
                                            <div className="overflow-x-auto  bg-white">
                                                <Table className='w-full '>
                                                    <TableHead >
                                                        {tituloPartidos.map((titulo)=>(
                                                            <TableCell key={titulo.id} className="text-white  bg-unimar justify-end font-semibold" >{titulo.titulo}</TableCell>
                                                        ))}
                                                    
                                                        
                                                    </TableHead>
                                                    <TableBody>
                                                        {games.map(game => (
                                                            <TableRow key={game.id} className='bg-slate-200/50'>
                                                                <TableCell>{game.ronda}</TableCell>
                                                                <TableCell>{game.competidor_a.nombre}</TableCell>
                                                                <TableCell>{game.competidor_a.score ?? '-'} vs {game.competidor_b.score ?? '-'}</TableCell>
                                                                <TableCell>{game.competidor_b.nombre}</TableCell>
                                                                <TableCell>{game.estado}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 text-center py-2 italic">No hay partidos programados.</p>
                                        )}
                                    </div>
                                )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <p className="text-gray-500 text-sm">No se han asignado disciplinas.</p>
                            </div>
                        )}
                    </div>
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
