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
  TextArea,
  Modal,
  ContainModal,
  HeaderModal,
  FooterModal
 } from '@/types/ui_components'

interface ApiSub{
    id_suscripcion:number;
    email:string;
    suscriptor: ApiUser | null;
    fecha_suscripcion:string;
    hace_tiempo:string;
    
}

const buttons = [
    {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]

interface ApiUser {
  id: number;
  nombre: string | null;
  email: string | null;
  cedula: string | null;
  telefono: string | null;
}

const titleSubscrit=[
    {id:1, titulo:"Suscriptor"},
    {id:2, titulo:"Desde"},
    {id:3, titulo:"Hace"},
    {id:4, titulo:"Acciones"},
]

export default function table_subscripts() {           
        const [sub, setSub] = useState<ApiSub[]>([]);

        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string|null>(null);

            //modal sub
        const [isModalOpenSub, setIsModalOpenSub] =useState(false);
        const [selectedEntrySub, setSelectedEntrySub ]=useState<ApiSub|null>(null);
        const [selectedSub, setSelectedSub]=useState< ApiSub|null>(null);
        const [loadingModal, setLoadingModal] = useState(false);


        
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
            
        const handleVerDetallesSub = async (entrySub:ApiSub)=>{
            setSelectedEntrySub(entrySub);
            setIsModalOpenSub(true);
            setLoadingModal(true);
            setSelectedSub(null);

            try {
                    const API_URL = process.env.NEXT_PUBLIC_API_URL;
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
    <section className="SUBSCRIPCION grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">
        <div className="bg-white p-6 rounded-lg shadow col-span-2">
            <h3 className="text-2xl font-bold mb-6">Usuarios Suscritos</h3>

            {sub.length > 0 ?(
                <>
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
                                
                                    <TableCell className="font-bold">
                                    {entrySub.suscriptor ? (
                                        <span>{entrySub.suscriptor.nombre || entrySub.email}</span>
                                    ) : (
                                        <span>{entrySub.email}</span>
                                    )}
                                    </TableCell>
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
                </>
            ):(
                <div className='justify-items-center text-xl font-semibold text-unimar'>
                    <p className='pb-2'>No existen usuarios suscritos</p>
                    <hr className='bg-unimar w-full'/>
                </div> 
            )}
        </div>
        
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
    </section>   
  )
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
                <div >
                    <div >
                        
                        <p><strong>Fecha de suscripción:</strong> {entryDataSub.fecha_suscripcion}</p>
                        <p><strong>Suscrito hace:</strong> {entryDataSub.hace_tiempo}</p>
                        <hr />

                        {isLoading ? (
                            <p>Cargando detalles del suscriptor...</p>
                        )  : userData && userData.suscriptor ? (
                            <div>
                                <h3>Información del suscriptor</h3>
                                <p><strong>Nombre:</strong> {userData.suscriptor.nombre}</p>
                                <p><strong>Cedula:</strong> {userData.suscriptor.cedula}</p>
                                <p><strong>Email:</strong> {userData.suscriptor.email}</p>
                                <p><strong>Telefono:</strong> {userData.suscriptor.telefono}</p>
                            </div>
                        ): userData ? (
                            // --- CORRECCIÓN: Caso Usuario ANÓNIMO ---
                            <div>
                                <h3>Información del Usuario</h3>
                                <p><strong>Email:</strong> {userData.email}</p>
                                <p>Esta suscripción pertenece a un visitante anónimo y no está vinculada a una cuenta de usuario registrada.</p>
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

