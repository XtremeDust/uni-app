'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Modal_addtorneos from '@/components/sections_Dashboard/torneos/modal_AddTorneos'
import Modal_addDiscipline from '@/components/sections_Dashboard/torneos/modal_Adddisciplinas'
import DetallesTorneo from './modal_DetallesTorneo'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal' // <-- Importar modal eliminar

import { 
  Input,
  Button, 
  Select, 
  Table, 
  TableBody, TableCell, TableRow,
  TableHead, TableHeaderCell,
} from '@/types/ui_components'

const titleventos=[
    {id:1, titulo:"Evento"},
    {id:2, titulo:"Disiplinas"},
    {id:3, titulo:"Inicia"},
    {id:4, titulo:"Termina"},
    {id:5, titulo:"Estado"},
    {id:6, titulo:"Acciones"},
]
 
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

export interface ApiTournament {
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
  img?: string; 
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

export default function Table_Torneos() {
        const [isAddModalOpen, setIsAddModalOpen] = useState(false);
        const [isAddDisciplineModalOpen, setIsAddDisciplineModalOpen] = useState(false);
        const [isModalOpenT, setModalOpenT] = useState(false);

        const [tournaments, setTournaments] = useState<ApiTournament[]>([]);
        const [selectedEntry, setSelectedEntry] = useState<ApiList | null>(null);
        const [selectedT, setSelectedT]=useState<ApiTournament|null>(null);
        
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const [loadingModal, setLoadingModal] = useState(false);

        const [editingTournament, setEditingTournament] = useState<ApiTournament | null>(null);
        const [tournamentToDelete, setTournamentToDelete] = useState<ApiTournament | null>(null);
        const [isDeleting, setIsDeleting] = useState(false);

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

        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        const fetchTournaments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/tournaments`);
                if (!response.ok) throw new Error(`Error HTTP: ${response.statusText}`);
                const jsonData = await response.json();
                setTournaments(jsonData.data);
            } catch (e: any) {
                setError(e.message || "Error al cargar torneos");
            } finally {
                setLoading(false);
            }
        };
        
        useEffect(() => {
            fetchTournaments();
        }, []);

        const handleOpenAddDiscipline = (tournament: ApiList) => {
            setModalOpenT(false);
            setIsAddDisciplineModalOpen(true);
        };

        const handleDisciplineCreated = () => {
            fetchTournaments();
        };

        const handleClickT = async (entryT:ApiList) => {
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
            }finally{
                 setLoadingModal(false);
            }
        }

        const handleEditClick = async (tournamentList: ApiList) => {
            console.log("Editando torneo:", tournamentList.nombre);
            try {
                const res = await fetch(`${API_URL}/tournaments/${tournamentList.id}`);
                if (!res.ok) throw new Error("No se pudo cargar la info para editar");
                const jsonData = await res.json();
                setEditingTournament(jsonData.data);
            } catch(e) {
                alert('Error al cargar datos de edición');
            }
        };

        const handleDeleteClick = (tournamentList: ApiList) => {
             setTournamentToDelete(tournamentList as unknown as ApiTournament);
        };

        const handleConfirmDelete = async () => {
            if (!tournamentToDelete) return;
            setIsDeleting(true);
            
            try {
                const res = await fetch(`${API_URL}/tournaments/${tournamentToDelete.id}`, {
                    method: 'DELETE',
                    headers: { 'Accept': 'application/json' }
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Error al eliminar');
                }

                alert('¡Torneo eliminado con éxito!');
                setTournamentToDelete(null);
                fetchTournaments();

            } catch (e: any) {
                alert(e.message);
            } finally {
                setIsDeleting(false);
            }
        };

    
        if (loading) return <p className="text-center p-4">Cargando torneos...</p>;
        if (error) return <p className="text-center p-4 text-red-600">Error: {error}</p>;

  return (
         <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between mb-6">
                        <h3 className="text-2xl font-bold">Torneos Deportivos</h3>
                        <Button className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0"
                            onClick={() => setIsAddModalOpen(true)}
                        >
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

                    {tournaments.length > 0 ? (
                        <>
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
                                                <TableRow  className="hover:bg-gray-100 text-center cursor-pointer"
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
                                                        {tournament.estado.charAt(0).toUpperCase() + tournament.estado.slice(1)}
                                                    </p>
                                                </TableCell>
                                                    <TableCell className="space-x-2 flex justify-evenly text-white">
                                                        {buttons.map((btn)=>(
                                                            <div key={btn.id}
                                                                onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (btn.id === 2) handleEditClick(tournament);
                                                                if (btn.id === 3) handleDeleteClick(tournament);
                                                                }}
                                                            >
                                                                <Button className={`btn rounded-lg cursor-pointer size-12 ${btn.id ===1? 'hover:bg-unimar/10' : (btn.id===2? 'hover:bg-gray-300/50': 'hover:bg-rose-300/50' )}`}
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
                        </>
                    ):(
                        <div className='justify-items-center text-xl font-semibold text-unimar'>
                            <p className='pb-2'>No se han creado torneos</p>
                            <hr className='bg-unimar w-full'/>
                        </div>
                    )}

                    {isModalOpenT &&(
                        <DetallesTorneo
                            entryData={selectedEntry}
                            DeporteData={selectedT}
                            isLoading={loadingModal}
                            state={isModalOpenT===true ? true:false}
                            onClose={() => setModalOpenT(false)}
                            onAddDisciplineClick={() => handleOpenAddDiscipline(selectedEntry!)}
                        />
                    )}
        
                    {isAddDisciplineModalOpen && selectedEntry && ( 
                        <Modal_addDiscipline
                            state={isAddDisciplineModalOpen}
                            onClose={() => setIsAddDisciplineModalOpen(false)}
                            onSaveSuccess={handleDisciplineCreated}
                            tournamentId={selectedEntry.id} 
                        />
                    )}

                    {(isAddModalOpen || editingTournament) && (
                        <Modal_addtorneos
                            state={isAddModalOpen || !!editingTournament}
                            onClose={() => {
                                setIsAddModalOpen(false);
                                setEditingTournament(null);
                            }}    
                            onTournamentCreated={fetchTournaments}
                            tournamentToEdit={editingTournament} 
                        />
                    )}

                    {tournamentToDelete && (
                        <ConfirmDeleteModal
                            isOpen={!!tournamentToDelete}
                            title="Eliminar Torneo"
                            message={`¿Estás seguro de que quieres eliminar el torneo "${tournamentToDelete.nombre}"? Se borrarán todas sus disciplinas y datos asociados.`}
                            onClose={() => setTournamentToDelete(null)}
                            onConfirm={handleConfirmDelete}
                            isLoading={isDeleting}
                        />
                    )}
                    
                </div>
  )
}