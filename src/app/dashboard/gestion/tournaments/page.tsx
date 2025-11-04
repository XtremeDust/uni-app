'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Table_Games from '@/components/sections_Dashboard/Table_Games'
import { 
  Input,
  Button, 
  Select, 
  Table, 
  TableBody, TableCell, TableRow,
  TableHead, TableHeaderCell,
  Modal,
  HeaderModal,
  ContainModal
 } from '@/types/ui_components'

 const titleventos=[
    {id:1, titulo:"Evento"},
    {id:2, titulo:"Disiplinas"},
    {id:3, titulo:"Inicia"},
    {id:4, titulo:"Termina"},
    {id:5, titulo:"Estado"},
    {id:6, titulo:"Acciones"},
 ]


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
}

const buttons = [
    {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]

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


export default function page() {

    const [isEstate, setSelectE] = useState('Todos'); 
    const [isOpenE, setIsOpenE] = useState(false);

        const handleSelectE = (id: number, label:string) => {
        setSelectE(label);
        setIsOpenE(false);
    };

    const estate=[{id:1,label:'Activo'},{id:2,label:'Próximo'},{id:3,label:'Finalizado'},]

    const filteredEstate = estate
    .filter(item => item.label !== isEstate)
    .map(item => ({
        id: item.id,
        label: item.label,
    }));

    const dropdownEstate = [
    ...(isEstate !== 'Todos' ? [{ id: 0, label: 'Todos' }] : []),
    ...filteredEstate,
    ];
        

            const [loading, setLoading] = useState(true);
            const [error, setError] = useState<string | null>(null);
            
            //modal
            const [isModalOpenT, setModalOpenT] = useState(false);
            const [loadingModal, setLoadingModal] = useState(false);
            const [tournaments, setTournaments] = useState<ApiTournament[]>([]);
            
            const [selectedEntry, setSelectedEntry] = useState<ApiList | null>(null);
            const [selectedT, setSelectedT]=useState< ApiTournament|null>(null);


            //partidos
            const [selectedDisciplineId, setSelectedDisciplineId] = useState<number | null>(null);
            const [games, setGames] = useState<ApiGames[]>([]);
            const [loadingGames, setLoadingGames] = useState(false);


        useEffect(() => {
            async function fetchTournaments() {
                setLoading(true);
                setError(null);
                 const API_URL = process.env.NEXT_PUBLIC_API_URL;
                try {
                    const response = await fetch(`${API_URL}/tournaments`);
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.statusText}`);
                    }
                    const jsonData = await response.json();
                    setTournaments(jsonData.data); // Obtiene el array desde la clave 'data'
                } catch (e: any) {
                    setError(e.message || "Error al cargar torneos");
                } finally {
                    setLoading(false);
                }
            }
            fetchTournaments();
        }, []);

        if (loading) return <p>Cargando torneos...</p>;
        if (error) return <p>Error: {error}</p>;

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const handleClickT= async (entryT:ApiList)=>{
            setSelectedEntry(entryT);
            setLoadingModal(true);
            setModalOpenT(true);
            setSelectedT(null);

            try{
                const res = await fetch(`${API_URL}/tournaments/${entryT.id}`)
                if (!res.ok) throw new Error(`Error en API Torneos: ${res.statusText}`);
                const jsonData = await res.json();
                setSelectedT(jsonData.data); 

            }catch (e: any){
                console.error("Error al cargar detalles del torneo:", e);
                // El modal mostrará un error
            }finally{
                 setLoadingModal(false);
            }
        }

        return (
    <div className="Case2 overflow-y-auto text-black">
            <section className="grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between mb-6">
                        <h3 className="text-2xl font-bold">Torneos Deportivos</h3>
                        <Button className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0">
                            <Image
                            className="size-5"
                                src={'/mas.png'}
                                alt="plus"
                                width={500}
                                height={500}
                            />
                              <h3 className="font-semibold">Añadir Torneo</h3>
                        </Button>
                    </div>



                    <div className="Filtro flex flex-col sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-2 xl:flex xl:flex-row  items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
                        
                            <div className="relative w-full flex col-span-2">
                                
                                <label htmlFor='buscar' className="h-full place-content-center absolute left-0 px-2 pl-3.5 cursor-pointer rounded-2xl">
                                    <Image
                                        className="size-8"
                                        src={'/lupa.png'}
                                        alt="buscar"
                                        width={60}
                                        height={60}
                                    />
                                </label>
                                <Input type="text" id="buscar" className="bg-gray-50 focus:ring-[1px]  focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-18 pr-3 py-3" placeholder="Buscar" required/>
                                
                                    <Button className="h-full items-center px-2 pr-4 absolute right-0 rounded-2xl cursor-pointer ">
                                        <Image
                                            className="size-4"
                                            src={'/cerca.png'}
                                            alt="buscar"
                                            width={60}
                                            height={60}
                                        />
                                    </Button>
                            </div>

                            <div className="w-full relative md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl">
                                <Input type="date" id="fecha" className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-3 pr-3 py-3" required/>
                            </div>

                            <div className="w-full md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl"       >
                                <Select
                                        className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-3 pr-3 py-3"
                                        options={dropdownEstate}
                                        currentValue={isEstate}
                                        isOpen={isOpenE}
                                        setOpen={setIsOpenE} 
                                        onSelect={handleSelectE}
                                        placeholder="Seleccione el estado"
                                />     
                            </div>  

                    </div>
                  
                    <Table className="w-full">
                        <TableHead className="text-gray-100  bg-unimar">
                            {titleventos.map((titulos)=>(
                                <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-end font-semibold ">
                                    {titulos.titulo}
                                </TableHeaderCell>
                            ))}
                        </TableHead>

                        <TableBody className="bg-white divide-y divide-gray-200">
                            {tournaments.map((tournament)=>(
                                <React.Fragment key={tournament.id}>
                                        <TableRow  className="hover:bg-gray-100 text-center"
                                            onClick={()=>(handleClickT(tournament))}
                                        >
                                            <TableCell className="font-bold">{tournament.nombre}</TableCell>
                                            <TableCell>{tournament.total_disiplinas}</TableCell>
                                            <TableCell>{tournament.inicio}</TableCell>
                                            <TableCell>{tournament.fin}</TableCell>
                                            <TableCell className="place-items-center">
                                            <p className={`inline-block items-center rounded-full px-3 py-2 text-sm font-semibold ${
                                                tournament.estado === 'proximo' ? 'bg-blue-100 text-blue-800' :
                                                tournament.estado === 'activo' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {/* Capitaliza la primera letra */}
                                                {tournament.estado.charAt(0).toUpperCase() + tournament.estado.slice(1)}
                                            </p>
                                        </TableCell>
                                            <TableCell className="space-x-2 flex justify-evenly text-white">
                                                {buttons.map((btn)=>(
                                                    <div key={btn.id}
                                                        onClick={(e) => {
                                                        e.stopPropagation();
                                                        }}
                                                    >
                                                        <Button className={`btn rounded-lg cursor-pointer size-12 ${btn.id ===1? 'hover:bg-unimar/10' : (btn.id===2? 'hover:bg-gray-300/50': 'hover:bg-rose-300/50' )}`}
                                                            onClick={() => { 
                                                            
                                                            }}
                                                        >
                                                            <Image
                                                                className='scale-110'
                                                                src={btn.img}
                                                                alt={btn.button}
                                                                width={500}
                                                                height={500}
                                                            />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </TableCell>
                                        </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>  
                    
                </div>


            {isModalOpenT &&(
                <DetallesTorneos
                    entryData={selectedEntry}
                    DeporteData={selectedT}
                    isLoading={loadingModal}
                    state={isModalOpenT===true ? true:false}
                    onClose={() => setModalOpenT(false)}
                />
            )}

            <Table_Games/>
                
            </section>

    </div>
  )
}


interface ModalPropsTournaments {
    entryData: ApiList | null;
    DeporteData: ApiTournament | null;
    isLoading: boolean;
    state:boolean;
    onClose: () => void;
}

const tituloPartidos = [
    {id:1 , titulo:'Ronda'},
    {id:2 , titulo:'Competidor A'},
    {id:3 , titulo:'Resultado'},
    {id:4 , titulo:'Competidor B'},
    {id:5 , titulo:'Estado'},
]

function DetallesTorneos({state, isLoading, entryData, DeporteData, onClose}:ModalPropsTournaments){
    
    // --- para cargar partidos ---
    const [selectedDisciplineId, setSelectedDisciplineId] = useState<number | null>(null);
    const [games, setGames] = useState<ApiGames[]>([]);
    const [loadingGames, setLoadingGames] = useState(false);

    // --- Función para cargar partidos ---
    const handleDisciplineClick = async (disciplineId: number) => {
        // Si ya está seleccionada, la oculta
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
    
    return(
        <Modal state={state}>
            <ContainModal className='bg-white text-black'>
                <HeaderModal onClose={onClose}>
                    Detalles del Torneo
                </HeaderModal>
                <div > {/* Contenido del modal */}
                    
                    {/* 1. Información del autor */}
                    <p><strong>Nombre del Torneo:</strong> {entryData?.nombre}</p>
                    <p><strong>Estado del Torneo:</strong> {entryData?.estado}</p>
                    <hr />

                    {/* 2. Información del EQUIPO/JUGADOR (la que buscamos) */}
                    {isLoading ? (
                        <p>Cargando detalles del Torneo...</p>
                    )  : DeporteData ? (
                        // Caso Equipo
                        <div>
                            <h3>Información del Creador</h3>
                            <p><strong>Nombre:</strong> {DeporteData.creador.nombre}</p>
                            <p><strong>Rol:</strong> {DeporteData.creador.rol}</p>
                            <p><strong>Email:</strong> {DeporteData.creador.email}</p>

                            <h3>Disciplinas del Torneo</h3>
                            <div>
                                {DeporteData.disciplinas.map(discipline => (
                                    <React.Fragment key={discipline.id}>
                                        
                                        <div 
                                            className=' cursor-pointer bg-gray-200 p-[10px] my-[5px] flex justify-between items-center rounded-md'
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
                                            <div className='mt-[2.5px]'>
                                                {loadingGames ? (
                                                    <p>Cargando partidos...</p>
                                                ) : games.length > 0 ? (
                                                    <Table className='my-1'>
                                                        <TableHead >
                                                            {tituloPartidos.map((titulo)=>(
                                                                <TableCell key={titulo.id} className="text-white  bg-unimar first:rounded-l-lg last:rounded-r-lg p-4 justify-end font-semibold" >{titulo.titulo}</TableCell>
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
                                ))}
                            </div>
                            

                        </div>
                    ) : (
                        <p>No se pudieron cargar los detalles del torneo.</p>
                    )}
                </div>
            </ContainModal>
        </Modal>
    );
}

