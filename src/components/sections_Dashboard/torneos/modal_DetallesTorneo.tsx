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
            // Llama a la API de partidos filtrada
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
            <ContainModal className='bg-white h-[95%] w-[95%] md:w-[80%] overflow-y-auto lg:w-[80%] xl:w-[40%] rounded-2xl grid grid-rows-[auto_minmax(0,1fr)]'>
                <HeaderModal onClose={onClose}>
                     <></>
                </HeaderModal>
                <div className='text-start space-y-3 mt-3'>
                     <div className="flex-shrink-0 w-full  justify-center place-content-center items-center">
                        <div className="relative w-full h-64 lg:h-68 rounded-lg overflow-hidden shadow-lg ">
                        <Image
                            src={DeporteData?.img ? `${API_URL}${DeporteData.img}` : '/logounimar-25-aniversario.png'}
                            alt={'banner'}
                            layout="fill"
                            objectFit="cover"
                            className="bg-gray-200"
                        />
                        </div>
                    </div>
                    <div className='text-center'>
                        <p className='text-2xl font-bold'>{entryData?.nombre}</p>
                        {entryData?.estado&&(
                            <p className={`inline-block rounded-full px-3 py-1.5 text-sm font-semibold ${
                                entryData?.estado === 'proximo' ? 'bg-blue-100 text-blue-800' :
                                entryData?.estado === 'activo' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {entryData?.estado.charAt(0).toUpperCase() + entryData?.estado.slice(1)}
                            </p>
                        )}
                    </div>


                    {isLoading ? (
                        <p>Cargando detalles del Torneo...</p>
                    )  : DeporteData ? (
                        // Caso Equipo
                        <div>
                            <section className='flex flex-col xl:flex-row gap-2'>
                                <div className='bg-gray-100 border border-unimar rounded-2xl shadow p-4'>
                                    <h3 className="text-lg font-bold mb-2">Información del Creador</h3>
                                    <p><strong>Nombre:</strong> {DeporteData.creador.nombre}</p>
                                    <p><strong>Rol:</strong> {DeporteData.creador.rol}</p>
                                    <p><strong>Email:</strong> {DeporteData.creador.email}</p>
                                </div>

                                <div className='bg-gray-100 border border-unimar rounded-2xl shadow p-4'>
                                    <h3 className="text-lg font-bold mb-2">Reglamento(s) del Torneo</h3>
                                    {DeporteData.reglamentos_torneo && DeporteData.reglamentos_torneo.length > 0 ? (
                                        <div className="list-disc px-2 space-y-2">
                                            {DeporteData.reglamentos_torneo.map(reg => (
                                                    
                                                    <a 
                                                        key={reg.id}
                                                        href={reg.url_archivo}
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className=" flex items-center text-unimar justify-between font-semibold gap-2 p-2 group bg-unimar/5 hover:bg-unimar/8 shadow rounded-lg cursor-pointer"
                                                    >
                                                         <div className='flex items-center gap-2'>
                                                            <Image
                                                                src={'/R-02.png'}
                                                                alt='bajar'
                                                                width={35}
                                                                height={35}
                                                            />
                                                            {reg.titulo}
                                                         </div>
                                                         <div className='flex items-center text-white bg-unimar/90 group-hover:bg-unimar text-sm rounded-2xl py-2 px-4'>
                                                            Descargar
                                                         </div>
                                                    </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No hay reglamentos generales para este torneo.</p>
                                    )}
                                </div>
                            </section>

                            <section className='bg-gray-100 border border-unimar rounded-2xl shadow-lg p-4 mt-2'>
                                <div className='flex items-center justify-between my-3 '>
                                    <h3 className="text-lg font-bold mb-2">Disciplinas del Torneo</h3>
                                    {entryData?.estado === 'proximo' && (
                                        <Button 
                                        className="bg-unimar flex gap-2 text-white text-sm px-3 py-2 rounded-lg"
                                        onClick={onAddDisciplineClick}
                                        >
                                            <Image
                                            className="size-5"
                                                src={'/mas.png'}
                                                alt="plus"
                                                width={500}
                                                height={500}
                                        />
                                        <p>Añadir Disciplina</p> 
                                        </Button>
                                    )}
                                </div>
                                <div>
                                    {DeporteData.disciplinas.length>0?(
                                        DeporteData.disciplinas.map(discipline => (
                                            <React.Fragment key={discipline.id}>
                                                
                                                <div 
                                                    className=' cursor-pointer bg-gray-200/55 shadow p-[10px] my-[5px] flex justify-between items-center rounded-md'
                                                    onClick={() => handleDisciplineClick(discipline.id)}
                                                >
                                                    <h3><strong>{discipline.nombre_deporte}</strong> ({discipline.categoria})</h3>
                                                    <div className={`relative size-4 ${selectedDisciplineId === discipline.id ? 'rotate-180' : 'rotate-0'}`}>
                                                        <Image
                                                            className='mr-[5px]'
                                                            src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'}
                                                            alt="img"
                                                            width={100}
                                                            height={100}
                                                        />
                                                    </div>
                                                </div>

                                                {selectedDisciplineId === discipline.id && (
                                                    <div className='mt-[0.5px] px-2'>
                                                        {loadingGames ? (
                                                            <p>Cargando partidos...</p>
                                                        ) : games.length > 0 ? (
                                                            <Table className='my-1  w-full'>
                                                                <TableHead >
                                                                    {tituloPartidos.map((titulo)=>(
                                                                        <TableCell key={titulo.id} className="text-white  bg-unimar first:rounded-l-lg last:rounded-r-lg p-2 justify-end font-semibold" >{titulo.titulo}</TableCell>
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
                                                        ) : (
                                                            <p>No hay partidos programados.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))
                                    ):( 
                                        <p className="text-gray-500 text-center p-4">No se han asignado disciplinas</p>
                                    )}
                                    
                                </div>
                            </section>
                            

                        </div>
                    ) : (
                        <p>No se pudieron cargar los detalles del torneo.</p>
                    )}
                </div>
            </ContainModal>
        </Modal>
    );
}
