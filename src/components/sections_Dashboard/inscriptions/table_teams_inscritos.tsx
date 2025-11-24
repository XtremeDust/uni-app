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
  Modal,
 } from '@/types/ui_components'
import TeamModal from '@/components/sections_Dashboard/inscriptions/modal_AddTeam';
import DetalleEquipoModal from '@/components/sections_Dashboard/inscriptions/modal_DetallesEquipo'
import ModalCambioEstado from '@/components/sections_Dashboard/inscriptions/modal_CambioEstado'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

interface ApiUser {
  id: number;
  nombre: string | null;
  email: string | null;
  cedula: string | null;
  telefono: string | null;
}

interface ApiUsers {
  id: number;
  nombre: string;
  logo: string;
  color: string;
  captain: {
    id: number;
    name: string;
  };
  integrantes_total: number;
  integrantes_data: ApiUser[];
}

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

const titlequipos = [
    {id:1, titulo:"Equipo"},
    {id:2, titulo:"Deporte"},
    {id:3, titulo:"Categoria"},
    {id:4, titulo:"Cantidad"},
    {id:5, titulo:"Estados"},
    {id:6, titulo:"Acciones"},
]

const buttons = [
    {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]

export default function table_teams_inscritos() {
  const category = [{id: 2, label: 'Masculina'}, {id: 3, label: 'Femenina'}, {id:4, label:'Mixta'}];

        const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

        const [isCat, setSelectCat] = useState<string|null>('Todos'); 
        const [isOpenCat, setisCat] = useState(false);

        const [teamToDelete, setTeamToDelete] = useState<ApiTeam | null>(null);
        const [isDeleting, setIsDeleting] = useState(false);
    
            const handleSelectCat = (id: number, label:string) => {
            setSelectCat(label);
            setisCat(false);
        };
    
        const cat=[{id: 1, label: 'Masculina'}, {id: 2, label: 'Femenina'}, {id:3, label:'Mixta'}]
        
        const filteredCat = cat
        .filter(cat => cat.label !== isCat)
        .map(cat => ({
            id: cat.id,
            label: cat.label,
        }));
    
        const dropdownCat = [
        ...(isCat !== 'Todos' ? [{ id: 0, label: 'Todos' }] : []),
        ...filteredCat,
        ];

        const [isEst, setSelectEst] = useState<string|null>('Todos'); 
        const [isOpenEst, setisEst] = useState(false);     

        const handleSelectEst = (id: number, label:string) => {
            setSelectEst(label);
            setisEst(false);
        };
        
        const est = [{id: 2, label: 'Aceptado'}, {id: 3, label: 'Pendiente'}, {id: 4, label: 'Rechazado'}];

        const filteredEst = est
        .filter(est => est.label != isEst)
        .map(est => ({
            id:est.id,
            label:est.label,
        }));

        const dropdownEst = [
            ...(isEst !== 'Todos' ? [{ id: 0, label: 'Todos' }] : []),
            ...filteredEst,
        ];

        const handleActionClick = async (buttonId: number, entry:any) => {
            
            if (buttonId === 1) {
                console.log('ACCIÓN: Descargar');
                console.log(entry);
            }
            
            if (buttonId === 2) {
                if (!entry.team_id_for_modal) {
                    alert("La edición de inscripciones individuales se maneja diferente.");
                    return;
                }

                try {

                    const res = await fetch(`${API_URL}/teams/${entry.team_id_for_modal}`);
                    if (!res.ok) throw new Error("No se pudieron cargar los detalles del equipo");
                    const teamJson = await res.json();
                    
                    const fullDataForModal = {
                        ...teamJson.data, 
                        ...entry, 

                        id: entry.id, 
                        
                        integrantes_data: teamJson.data.integrantes_data || teamJson.data.integrantes || []
                    };

                    console.log("Datos corregidos para modal (ID debe ser la inscripción):", fullDataForModal);

                    setEditingTeam(fullDataForModal);
                    setIsTeamModalOpen(true);

                } catch (error: any) {
                    console.error(error);
                    alert("Error al cargar los datos: " + error.message);
                }
            }
            
            if (buttonId === 3) {
                console.log('ACCIÓN: Eliminar');
                console.log(entry);
            }
        };

         const handleDeleteClick = (row: ApiTeam) => {
            setTeamToDelete(row);
        };

        const handleConfirmDelete = async () => {
            if(!teamToDelete) return;
            setIsDeleting(true);
            alert("eliminar Team pendiente de endpoint.");
            setIsDeleting(false);
            setTeamToDelete(null);
        };

        const [teams, setTeams] = useState<ApiTeam[]>([]);

        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string|null>(null);

        const [editingTeam, setEditingTeam] = useState<ApiTeam | null>(null);

        const [isModalOpen, setIsModalOpen] = useState(false);
        const [loadingModal, setLoadingModal] = useState(false);

        const [selectedEntry, setSelectedEntry] = useState<ApiTeam | null>(null);
        const [selectedTeam, setSelectedTeam] = useState<ApiTeam | null>(null);

        const [isStateModalOpen, setIsStateModalOpen] = useState(false);
        const [selectedEntryForState, setSelectedEntryForState] = useState<ApiTeam | null>(null);
        const [isSavingState, setIsSavingState] = useState(false); 
        //

        const fetchAllData = async()=>{
            setLoading(true);
            setError(null);
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
                    try {
                        const [   teamsRes] = await Promise.all([
                            fetch(`${API_URL}/teams-inscription`),
                            fetch(`${API_URL}/teams`),
                            fetch(`${API_URL}/subscribed-users`),
                        ]);
                        if (!teamsRes.ok) throw new Error(`Error en inscripciones: ${teamsRes.statusText}`);
                        const teamsData = await teamsRes.json();
                        setTeams(teamsData.data); 
    
                    } catch (e: any) {
                        console.error("Error al cargar datos:", e);
                        setError(e.message || "Error desconocido");
                    } finally {
                        setLoading(false);
                    }
                }

            useEffect(() => {
                fetchAllData();
            }, []);

        {/**
            useEffect(() => {
                async function fetchAllData() {
                    try {
                        setLoading(true);
                        setError(null);
                        const API_URL = process.env.NEXT_PUBLIC_API_URL;
                        // Ejecutamos ambas peticiones en paralelo
                        const [   teamsRes] = await Promise.all([
                            fetch(`${API_URL}/teams-inscription`),
                            fetch(`${API_URL}/teams`),
                            fetch(`${API_URL}/subscribed-users`),
                        ]);
    
                        // Comprobamos si ambas respuestas son exitosas
                        if (!teamsRes.ok) throw new Error(`Error en inscripciones: ${teamsRes.statusText}`);
                        const teamsData = await teamsRes.json();
    
                        // 3. Guardamos los datos
                        // Nota: Laravel API Resources envuelven la colección en una clave 'data'
                        setTeams(teamsData.data); 
    
                    } catch (e: any) {
                        console.error("Error al cargar datos:", e);
                        setError(e.message || "Error desconocido");
                    } finally {
                        setLoading(false);
                    }
                }
    
            fetchAllData();
            }, []);
            */}

        
    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Error al cargar: {error}</p>;

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const handleVerDetalles = async (entry: ApiTeam) => {
        
        setSelectedEntry(entry);
        setIsModalOpen(true);
        setLoadingModal(true);
        setSelectedTeam(null);

        if (entry.team_id_for_modal) {
            try {
                const res = await fetch(`${API_URL}/teams/${entry.team_id_for_modal}`);
                if (!res.ok) throw new Error(`Error en API teams: ${res.statusText}`);
                const jsonData = await res.json();
                setSelectedTeam(jsonData.data); 
            } catch (e: any) {
                console.error("Error al cargar detalles del equipo:", e);
            } finally {
                setLoadingModal(false);
            }
        } else if (entry.user_id_for_modal) {
            setLoadingModal(false);
        } else {
            setLoadingModal(false);
        }
    };
    
    const handleChangeStateClick = (entry: ApiTeam) => {
    setSelectedEntryForState(entry);
    setIsStateModalOpen(true);
    };

    const handleSaveState = async (newState: string) => {
    if (!selectedEntryForState) return;

    setIsSavingState(true);

    try {
        const res = await fetch(`${API_URL}/discipline-entries/${selectedEntryForState.id}/estado`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json",
            // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ state: newState }),
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || "Error al actualizar el estado");
        }

        alert("Estado actualizado correctamente ");
        setIsStateModalOpen(false);

        setTeams((prevTeams) =>
        prevTeams.map((t) =>
            t.id === selectedEntryForState.id ? { ...t, estado: newState as any } : t
        )
        );

    } catch (error: any) {
        console.error(error);
        alert(error.message || "Error al actualizar el estado");
    } finally {
        setIsSavingState(false);
    }
    };

  return (
    <section className="EQUIPOS grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">
        <div className="bg-white p-6 rounded-lg shadow col-span-2">
            <div className="flex justify-between mb-6">
                <h3 className="text-2xl font-bold">Equipos Inscritos</h3>
                <Button className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0"
                    onClick={() => setIsTeamModalOpen(true)}
                >
                    <Image
                        className="size-5"
                        src={'/mas.png'}
                        alt="plus"
                        width={500}
                        height={500}
                    />
                      <h3 className="font-semibold">Añadir Equipo</h3>
                </Button>
            </div>



            {teams.length > 0 ?(
                <>
                <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-2 xl:flex xl:flex-row items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
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
                    <div className="w-full md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl">
                            <Select
                                    className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-6 pr-3 py-3"
                                    options={dropdownCat}
                                    currentValue={isCat}
                                    isOpen={isOpenCat}
                                    setOpen={setisCat} 
                                    onSelect={handleSelectCat}
                                    placeholder="Seleccione una categoria"
                            /> 
                    </div>
                    <div className="w-full md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl">
                        <Select
                                className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-6 pr-3 py-3"
                                options={dropdownEst}
                                currentValue={isEst}
                                isOpen={isOpenEst}
                                setOpen={setisEst} 
                                onSelect={handleSelectEst}
                                placeholder="Seleccione el tipo de juego"
                        />
                    </div>    
                </div>

                <Table className="w-full">
                    <TableHead className="text-gray-100  bg-unimar">
                        {titlequipos.map((titulos)=>(
                            <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-center text-center font-semibold ">
                                {titulos.titulo}
                            </TableHeaderCell>
                        ))}
                    </TableHead>

                    <TableBody className="bg-white divide-y divide-gray-200">
                        {teams.map((entry)=>(
                            <TableRow key={entry.id} className="cursor-pointer hover:bg-gray-100 text-center"
                                onClick={() => handleVerDetalles(entry)}
                            >
                                <TableCell className="font-bold">{entry.nombre}</TableCell>
                                <TableCell>{entry.disciplina}</TableCell>
                                <TableCell>{entry.categoria}</TableCell>
                                <TableCell>{entry.integrantes_total}</TableCell>
                                <TableCell onClick={(e)=>{
                                    e.stopPropagation()
                                }}
                                    className="place-items-center">
                                    <Button onClick={()=>{
                                        if (entry.estado === 'Pendiente') {
                                            handleChangeStateClick(entry);
                                        } else {
                                            alert("Solo se pueden modificar las inscripciones en estado 'Pendiente'.");
                                        }
                                    }
                                    }
                                    className={`items-center rounded-full p-2 text-sm font-semibold text-gray-950
                                        ${entry.estado==='Aceptado'? ' bg-green-200/65 text-green-800' :
                                        (entry.estado==='Rechazado'? 'bg-red-200/65 text-red-800': 'bg-yellow-200/65 text-yellow-800')}`}>
                                        {entry.estado}
                                    </Button>
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
                                                     if (btn.id === 2) handleActionClick(btn.id, entry)
                                                     if (btn.id === 3) handleDeleteClick(entry)
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
                        ))}
                    </TableBody>
                </Table>  
                </>
            ):(
                <div className='justify-items-center text-xl font-semibold text-unimar'>
                    <p className='pb-2'>No se han inscrito equipos</p>
                    <hr className='bg-unimar w-full'/>
                </div>
            )}                             
        </div>

    {isModalOpen && (
        <DetalleEquipoModal
            entryData={selectedEntry}
            teamData={selectedTeam}
            isLoading={loadingModal}
            state={isModalOpen===true ? true:false}
            onClose={() => setIsModalOpen(false)}
        />
    )}

    {isStateModalOpen && selectedEntryForState && (
    <ModalCambioEstado
        teamName={selectedEntryForState.nombre}
        currentState={selectedEntryForState.estado}
        state={isStateModalOpen}
        isLoading={isSavingState}
        onClose={() => setIsStateModalOpen(false)}
        onSave={handleSaveState}
    />
    )}

    {isTeamModalOpen && (       
        <TeamModal 
            state={isTeamModalOpen}
            onCloseExternal={() => {
                setIsTeamModalOpen(false);
                setEditingTeam(null); 
            }}
            inscriptionToEdit={editingTeam} 
            onSaveSuccess={fetchAllData}
        />       
    )}

    {teamToDelete && (
        <ConfirmDeleteModal
            isOpen={!!teamToDelete}
            title="Eliminar Usuario"
            message={`¿Desea eliminar a ${teamToDelete.nombre}?`}
            onClose={() => setTeamToDelete(null)}
            onConfirm={handleConfirmDelete}
            isLoading={isDeleting}
        />
    )}
    </section>
  )
}

