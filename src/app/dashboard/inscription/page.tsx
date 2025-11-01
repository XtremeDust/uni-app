'use client'
import React, { MouseEventHandler, useEffect, useState } from 'react'
import Image from 'next/image'
import { 
  Input,
  Button, 
  Select, 
  Table, 
  TableBody, TableCell, TableRow,
  TableHead, TableHeaderCell,
  InputGroup,
  Modal,
  ContainModal,
  HeaderModal,
  FooterModal
 } from '@/types/ui_components'



//tabla usuarios por equipo api/teams
interface ApiUser {
  id: number;
  nombre: string | null;
  email: string | null;
  cedula: string | null;
  telefono: string | null;
}

// Para la tabla de equipos (api/teams)
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

interface ApiSub{
    id_suscripcion:number;
    email:string;
    suscriptor:ApiUser;
    fecha_suscripcion:string;
    hace_tiempo:string;
    
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

const titleintegrantes = [
    {id:1, titulo:"Usuario"},
    {id:2, titulo:"Cedula"},
    {id:4, titulo:"Telefono"},
    {id:3, titulo:"Equipo"},
    {id:5, titulo:"Acciones"},
]

const titleSubscrit=[
    {id:1, titulo:"Suscriptor"},
    {id:2, titulo:"Desde"},
    {id:3, titulo:"Hace"},
    {id:4, titulo:"Acciones"},
]

const buttons = [
    {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]

export default function page() {

    const category = [{id: 2, label: 'Masculina'}, {id: 3, label: 'Femenina'}, {id:4, label:'Mixta'}];

    /// funcional sin hook (maldito mrd no sirve) <Filtro de Categorias>

        const [isCat, setSelectCat] = useState<string|null>('Todos'); 
        const [isOpenCat, setisCat] = useState(false);
    
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

    ///filtro estados   
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

        const handleActionClick = (buttonId: number, x:string) => {
            
            if (buttonId === 1) {
                console.log('ACCIÓN: Descargar');
                console.log(x);
            }
            
            if (buttonId === 2) {
                console.log('ACCIÓN: Editar');
                console.log(x);
            }
            
            if (buttonId === 3) {
                console.log('ACCIÓN: Eliminar');
                console.log(x);
            }
        };


        const [teams, setTeams] = useState<ApiTeam[]>([]);
        const [userTeam, setUserTeam] = useState<ApiUsers[]>([]);
        const [sub, setSub] = useState<ApiSub[]>([]);

        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string|null>(null);

        // modal
            const [isModalOpen, setIsModalOpen] = useState(false);
            const [loadingModal, setLoadingModal] = useState(false);
            const [selectedEntry, setSelectedEntry] = useState<ApiTeam | null>(null);
            const [selectedTeam, setSelectedTeam] = useState<ApiTeam | null>(null);

            const [isModalOpenSub, setIsModalOpenSub] =useState(false);
            const [selectedEntrySub, setSelectedEntrySub ]=useState<ApiSub|null>(null);
            const [selectedSub, setSelectedSub]=useState< ApiSub|null>(null);
        //
        
        useEffect(() => {
            async function fetchAllData() {
                try {
                    setLoading(true);
                    setError(null);

                    const API_URL = process.env.NEXT_PUBLIC_API_URL;

                    // Ejecutamos ambas peticiones en paralelo
                    const [   teamsRes, userTeamsRes, subRes] = await Promise.all([
                        fetch(`${API_URL}/teams-inscription`),
                        fetch(`${API_URL}/teams`),
                        fetch(`${API_URL}/subscribed-users`),
                    ]);

                    // Comprobamos si ambas respuestas son exitosas
                    if (!teamsRes.ok) throw new Error(`Error en inscripciones: ${teamsRes.statusText}`);
                    if (!userTeamsRes.ok) throw new Error(`Error en equipos: ${userTeamsRes.statusText}`);
                    if (!subRes.ok) throw new Error(`Error en suscripciones: ${subRes.statusText}`);

                    const userTeamData = await userTeamsRes.json();
                    const teamsData = await teamsRes.json();
                    const subsData = await subRes.json();

                    // 3. Guardamos los datos
                    // Nota: Laravel API Resources envuelven la colección en una clave 'data'
                    setTeams(teamsData.data); 
                    setUserTeam(userTeamData.data);
                    setSub(subsData.data);

                } catch (e: any) {
                    console.error("Error al cargar datos:", e);
                    setError(e.message || "Error desconocido");
                } finally {
                    setLoading(false);
                }
            }

        fetchAllData();
        }, []); 

        
        if (loading) return <p>Cargando datos...</p>;
        if (error) return <p>Error al cargar: {error}</p>;

    
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // --- Función para abrir el MODAL y buscar detalles ---
    const handleVerDetalles = async (entry: ApiTeam) => {
        // 1. Guardar datos que ya tenemos (de la inscripción)
        setSelectedEntry(entry);
        setIsModalOpen(true);
        setLoadingModal(true);
        setSelectedTeam(null); // Limpiar datos de equipo anterior

        // 2. Determinar si es un equipo o un usuario individual
        if (entry.team_id_for_modal) {
            // Es un equipo, buscar en /api/teams
            try {
                const res = await fetch(`${API_URL}/teams/${entry.team_id_for_modal}`);
                if (!res.ok) throw new Error(`Error en API teams: ${res.statusText}`);
                const jsonData = await res.json();
                setSelectedTeam(jsonData.data); // Guardar detalles del equipo
            } catch (e: any) {
                console.error("Error al cargar detalles del equipo:", e);
                // El modal mostrará un error
            } finally {
                setLoadingModal(false);
            }
        } else if (entry.user_id_for_modal) {
            // Es un individual. No necesitamos buscar en /api/teams.
            // (Podríamos buscar en /api/users/{id} si quisiéramos más detalles)
            // Por ahora, solo indicamos que la carga terminó.
            setLoadingModal(false);
        } else {
            // No hay ID, solo cerrar
            setLoadingModal(false);
        }
    };

    const handleVerDetallesSub = async (entrySub:ApiSub)=>{

        setSelectedEntrySub(entrySub);
        setIsModalOpenSub(true);
        setLoadingModal(true);
        setSelectedSub(null);

        try {
                const res = await fetch(`${API_URL}/subscribed-users/${entrySub.id_suscripcion}`);
                if (!res.ok) throw new Error(`Error en API subs: ${res.statusText}`);
                const jsonData = await res.json();
                setSelectedSub(jsonData.data); // Guardar detalles del equipo
            } catch (e: any) {
                console.error("Error al cargar detalles del suscriptor:", e);
                // El modal mostrará un error
            } finally {
                setLoadingModal(false);
            }
    }
        

  return (
    <div className="Case2 overflow-y-auto text-black">

            <section className="grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">

                <div className="bg-white p-6 rounded-lg shadow col-span-2">
                    <div className="flex justify-between mb-6">
                        <h3 className="text-2xl font-bold">Equipos Inscritos</h3>
                        <Button className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0">
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

                           {/*
                            <div className="w-full md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl">
                                <Select
                                        className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-6 pr-3 py-3"
                                        options={dropdownOptions}
                                        currentValue={estate.value}
                                        isOpen={estate.isOpen}
                                        setOpen={estate.setOpen} 
                                        onSelect={estate.handleSelect}
                                        placeholder="Seleccione uno"
                                />
                            </div>
                           */}
                                
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
                                    <TableCell  className="place-items-center">
                                        <p  className={`items-center rounded-full px-4 py-2 font-semibold text-gray-950
                                             ${entry.estado==='Aceptado'? ' bg-green-200/65 text-green-800' :
                                            (entry.estado==='Rechazado'? 'bg-red-200/65 text-red-800': 'bg-yellow-200/65 text-yellow-800')}`}>
                                            {entry.estado}
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
                                                        handleActionClick(btn.id, entry.nombre)
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
                </div>

            </section>


             {/* --- El Modal de equipos --- */}
            {isModalOpen && (
                <DetalleEquipoModal
                    entryData={selectedEntry}
                    teamData={selectedTeam}
                    isLoading={loadingModal}
                    state={isModalOpen===true ? true:false}
                    onClose={() => setIsModalOpen(false)}
                />
            )}


            <section className="USERS INSRIPTION     grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">

                <div className="bg-white p-6 rounded-lg shadow col-span-2">
                    <h3 className="text-2xl font-bold mb-6">Usuarios Inscritos</h3>

                    <div className="Filtro flex items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
                        
                            <div className="relative w-full flex ">
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
                    </div>
                        

                    <Table className="w-full">
                        <TableHead className="text-gray-100  bg-unimar">
                            {titleintegrantes.map((titulos)=>(
                                <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-center text-center font-semibold ">
                                    {titulos.titulo}
                                </TableHeaderCell>
                            ))}
                        </TableHead>

                        <TableBody className="bg-white divide-y divide-gray-200">
                            {userTeam.map((data)=>(
                                <React.Fragment key={data.id}>
                                    {data.integrantes_data?.map((person:any)=>(
                                        <TableRow key={person.id || person.email} className="hover:bg-gray-100 text-center">
                                                <>
                                                    <TableCell className="font-bold">{person.email}</TableCell>
                                                    <TableCell>{person.cedula}</TableCell>
                                                    <TableCell>{person.telefono}</TableCell>
                                                    <TableCell>{data.nombre}</TableCell>
                                                    <TableCell className="space-x-2 flex justify-evenly text-white">
                                                        {buttons.map((btn)=>(
                                                            <Button key={btn.id} className={`btn rounded-lg cursor-pointer size-12 ${btn.id ===1? 'hover:bg-unimar/10' : (btn.id===2? 'hover:bg-gray-300/50': 'hover:bg-rose-300/50' )}`}>
                                                                <Image
                                                                    className='scale-110'
                                                                    src={btn.img}
                                                                    alt={btn.button}
                                                                    width={500}
                                                                    height={500}
                                                                />
                                                            </Button>
                                                        ))}
                                                    </TableCell>
                                                </>
                                        </TableRow>
                                    ))}

                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>                                 
                </div>

            </section>

            <section className="SUBSCRIPCION grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">

                <div className="bg-white p-6 rounded-lg shadow col-span-2">
                    <h3 className="text-2xl font-bold mb-6">Usuarios Suscritos</h3>

                    <div className="Filtro flex items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
                        
                            <div className="relative w-full flex ">
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
                    </div>
                        

                    <Table className="w-full">
                        <TableHead className="text-gray-100  bg-unimar">
                            {titleSubscrit.map((titulos)=>(
                                <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-center text-center font-semibold ">
                                    {titulos.titulo}
                                </TableHeaderCell>
                            ))}
                        </TableHead>

                        <TableBody className="bg-white divide-y divide-gray-200">
                            {sub.map((entrySub)=>(
                                
                                <TableRow  key={entrySub.id_suscripcion} className="cursor-pointer hover:bg-gray-100 text-center"
                                onClick={() => handleVerDetallesSub(entrySub)}
                                >
                                
                                    <TableCell className="font-bold">{entrySub.suscriptor.email}</TableCell>
                                    <TableCell>{entrySub.fecha_suscripcion}</TableCell>
                                    <TableCell>{entrySub.hace_tiempo}</TableCell>
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
                                
                            ))}
                        </TableBody>
                    </Table>                                 
                </div>

            </section>            

            {/* --- El Modal suscriptores --- */}
            {isModalOpenSub && (
                <DetalleSubs
                    entryDataSub={selectedEntrySub}
                    userData={selectedSub}
                    isLoading={loadingModal}
                    state={isModalOpenSub===true ? true:false}
                    onClose={() => setIsModalOpenSub(false)}
                />
            )}

    </div>
  )
}


interface ModalProps {
    entryData: ApiTeam | null;
    teamData: ApiTeam | null;
    isLoading: boolean;
    state:boolean;
    onClose: () => void;
}

function DetalleEquipoModal({ entryData, teamData, isLoading, onClose, state }: ModalProps) {
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
                <div > {/* Fondo oscuro */}
                    <div > {/* Contenido del modal */}
                        
                       
                        
                       
                        
                        {/* 1. Información de la INSCRIPCIÓN (la que ya teníamos) */}
                        <p><strong>Torneo:</strong> {entryData.torneo}</p>
                        <p><strong>Deporte:</strong> {entryData.disciplina}</p>
                        <p><strong>Categoría:</strong> {entryData.categoria}</p>
                        <p><strong>Estado:</strong> {entryData.estado}</p>
                        <hr />

                        {/* 2. Información del EQUIPO/JUGADOR (la que buscamos) */}
                        {isLoading ? (
                            <p>Cargando detalles del competidor...</p>
                        ) : esIndividual ? (
                            // Caso Individual
                            <div>
                                <h3>Jugador Individual</h3>
                                <p><strong>Nombre:</strong> {entryData.nombre}</p>
                                {/* Aquí podrías mostrar más detalles si el API de 'user' se llamara */}
                            </div>
                        ) : teamData ? (
                            // Caso Equipo
                            <div>
                                <h3>Detalles del Equipo</h3>
                                <p><strong>Nombre:</strong> {teamData.nombre}</p>
                                <p><strong>Capitán:</strong> {teamData.captain?.nombre || 'No asignado'}</p>
                                <p><strong>Color:</strong> {teamData.color}</p>
                                <p><strong>Imagen</strong>{teamData.logo}</p>
                                {/* <img src={teamData.logo} alt="Logo" /> */}
                                <h4>Integrantes ({teamData.integrantes_total}):</h4>
                                <ul>
                                    {teamData.integrantes_data.map(member => (
                                        <li key={member.id}>
                                        {member.id} {member.nombre} {member.cedula} ({member.email})
                                        </li>
                                    ))}
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


interface ModalPropsSubs {
    entryDataSub: ApiSub | null;
    userData: ApiSub | null;
    isLoading: boolean;
    state:boolean;
    onClose: () => void;
}

function DetalleSubs({ entryDataSub, userData, isLoading, onClose, state }: ModalPropsSubs) {
    if (!entryDataSub) return null;

    return (
        <Modal state={state}>
            <ContainModal className='bg-white'>
                <HeaderModal className="flex-none" onClose={onClose}>
                    <div className="text-start">
                        <h2 className="ml-5 title">Detalles del Suscriptor</h2>
                    </div>
                </HeaderModal>
                <div > {/* Fondo oscuro */}
                    <div > {/* Contenido del modal */}
                        
                        {/* 1. Información del suscriptor */}
                        <p><strong>Fecha de suscripción:</strong> {entryDataSub.fecha_suscripcion}</p>
                        <p><strong>Suscrito hace:</strong> {entryDataSub.hace_tiempo}</p>
                        <hr />

                        {/* 2. Información del EQUIPO/JUGADOR (la que buscamos) */}
                        {isLoading ? (
                            <p>Cargando detalles del suscriptor...</p>
                        )  : userData ? (
                            // Caso Equipo
                            <div>
                                <h3>Información del suscriptor</h3>
                                <p><strong>Nombre:</strong> {userData.suscriptor.nombre}</p>
                                <p><strong>Cedula:</strong> {userData.suscriptor.cedula}</p>
                                <p><strong>Email:</strong> {userData.suscriptor.email}</p>
                                <p><strong>Telefono:</strong> {userData.suscriptor.telefono}</p>
                            </div>
                        ) : (
                            <p>No se pudieron cargar los detalles del suscriptor.</p>
                        )}
                    </div>
                </div>
            </ContainModal>
        </Modal>
    );
}
