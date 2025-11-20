'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { 
  Input, Button, Table, TableBody, TableCell, TableRow, 
  TableHead, TableHeaderCell, Modal, ContainModal, HeaderModal, FooterModal
} from '@/types/ui_components'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';

interface ApiUser {
  id: number;
  nombre: string | null;
  email: string | null;
  cedula: string | null;
  telefono: string | null;
}

interface ApiSub {
    id_suscripcion: number;
    email: string;
    suscriptor: ApiUser | null;
    fecha_suscripcion: string;
    hace_tiempo: string;
}

const buttons = [
    // {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"}, 
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]

const titleSubscrit=[
    {id:1, titulo:"Suscriptor (Email)"}, 
    {id:2, titulo:"Nombre"},
    {id:3, titulo:"Desde"},
    {id:4, titulo:"Hace"},
    {id:5, titulo:"Acciones"},
]

export default function table_subscripts() {          
    const [subs, setSubs] = useState<ApiSub[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSub, setSelectedSub] = useState<ApiSub | null>(null);
    
    const [subToDelete, setSubToDelete] = useState<ApiSub | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchSubs = async () => {
        try {
            setLoading(true);
            setError(null);
            const API_URL = process.env.NEXT_PUBLIC_API_URL;

            const res = await fetch(`${API_URL}/subscribed-users`);
            
            if (!res.ok) throw new Error(`Error cargando suscripciones: ${res.statusText}`);
            const jsonData = await res.json();
            setSubs(jsonData.data);

        } catch (e: any) {
            console.error(e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubs();
    }, []); 

    const handleViewDetails = (sub: ApiSub) => {
        setSelectedSub(sub);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (sub: ApiSub) => {
        setSubToDelete(sub);
    };

    const handleConfirmDelete = async () => {
        if (!subToDelete) return;
        setIsDeleting(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await fetch(`${API_URL}/subscribed-users/${subToDelete.id_suscripcion}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' }
            });

            if (!res.ok) throw new Error("Error al eliminar suscripción");

            alert("Suscripción eliminada");
            setSubToDelete(null);
            fetchSubs();

        } catch (e: any) {
            alert(e.message);
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <p className="text-center p-4">Cargando suscriptores...</p>;
    if (error) return <p className="text-center p-4 text-red-600">Error: {error}</p>;
        
  return (
    <section className="SUBSCRIPCION grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">
        <div className="bg-white p-6 rounded-lg shadow col-span-2">
            <h3 className="text-2xl font-bold mb-6">Usuarios Suscritos</h3>

            {subs.length > 0 ?(
                <>
                    <div className="Filtro flex items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">        
                         <div className="relative w-full flex ">
                            <label htmlFor='buscar' className="h-full place-content-center absolute left-0 px-2 pl-3.5 cursor-pointer rounded-2xl">
                                <Image className="size-8" src={'/lupa.png'} alt="buscar" width={60} height={60} />
                            </label>
                            <Input type="text" id="buscar" className="bg-gray-50 focus:ring-[1px]  focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-18 pr-3 py-3" placeholder="Buscar" required/>
                            <Button className="h-full items-center px-2 pr-4 absolute right-0 rounded-2xl cursor-pointer ">
                                <Image className="size-4" src={'/cerca.png'} alt="buscar" width={60} height={60} />
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
                            {subs.map((sub)=>(
                                <TableRow  key={sub.id_suscripcion} className="cursor-pointer hover:bg-gray-100 text-center"
                                    onClick={() => handleViewDetails(sub)}
                                >
                                    <TableCell className="font-bold text-blue-900">
                                        {sub.email}
                                    </TableCell>
                                    
                                    <TableCell>
                                        {sub.suscriptor ? (
                                            <span className="font-semibold text-gray-700">{sub.suscriptor.nombre}</span>
                                        ) : (
                                            <span className="text-gray-400 italic text-md">Anónimo</span>
                                        )}
                                    </TableCell>

                                    <TableCell>{sub.fecha_suscripcion}</TableCell>
                                    <TableCell>{sub.hace_tiempo}</TableCell>
                                    
                                    <TableCell className="space-x-2 flex justify-evenly text-white">
                                        {buttons.map((btn)=>(
                                            <div key={btn.id} onClick={(e) => {
                                                    e.stopPropagation();
                                                    if(btn.id === 3) handleDeleteClick(sub);
                                                }}>
                                                <Button className={`btn rounded-lg cursor-pointer size-12 hover:bg-rose-300/50`}>
                                                    <Image className='scale-110' src={btn.img} alt={btn.button} width={500} height={500} />
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
        
        {isModalOpen && selectedSub && (
            <DetalleSubs
                sub={selectedSub}
                state={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        )}

        {subToDelete && (
            <ConfirmDeleteModal
                isOpen={!!subToDelete}
                title="Eliminar Suscripción"
                message={`¿Desea eliminar la suscripción de ${subToDelete.email}?`}
                onClose={() => setSubToDelete(null)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
            />
        )}

    </section>   
  )
}

interface ModalPropsSubs {
    sub: ApiSub;
    state: boolean;
    onClose: () => void;
}

function DetalleSubs({ sub, state, onClose }: ModalPropsSubs) {
    return (
        <Modal state={state}>
            <ContainModal className='bg-white w-full max-w-md'>
                <HeaderModal className="flex-none" onClose={onClose}>
                    <div className="text-start pl-2">
                        <h2 className="text-xl font-bold text-gray-800">Detalles del Suscriptor</h2>
                    </div>
                </HeaderModal>
                
                <div className="p-6 space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <p className="text-sm text-gray-500">Correo Electrónico</p>
                        <p className="text-lg font-bold text-blue-900">{sub.email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Fecha</p>
                            <p className="font-medium">{sub.fecha_suscripcion}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Antigüedad</p>
                            <p className="font-medium">{sub.hace_tiempo}</p>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {sub.suscriptor ? (
                        <div className="space-y-2">
                            <h3 className="font-bold text-gray-800">Cuenta Vinculada</h3>
                            <div className="flex flex-col space-y-1 text-sm">
                                <p><span className="font-semibold">Nombre:</span> {sub.suscriptor.nombre}</p>
                                <p><span className="font-semibold">Cédula:</span> {sub.suscriptor.cedula}</p>
                                <p><span className="font-semibold">Teléfono:</span> {sub.suscriptor.telefono}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-3 rounded text-center">
                            <p className="text-gray-500 italic text-sm">
                                Este es un suscriptor anónimo (no tiene cuenta registrada).
                            </p>
                        </div>
                    )}
                </div>
                
            </ContainModal>
        </Modal>
    );
}