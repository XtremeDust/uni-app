'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { 
  Input,
  Button, 
  Select, 
  Table, 
  TableBody, TableCell, TableRow,
  TableHead, TableHeaderCell
 } from '@/types/ui_components'
import ModalAsignarRegla from './Modal_addRegulation';
import Modal_VerReglamento from './Modal_reglamento';

export interface ApiRegulation {
  id: number;
  titulo: string;
  archivo_url: string;
  alcance: string;
  publicado: string;
  creator: string;
}

interface ApiTournamentRegulation {
  id: number;
  torneo: {
    id: number;
    nombre: string;
  };
  reglamento: ApiRegulation;
}

const buttons = [
    {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]

const titlesreglas = [
    {id:1,titulo:'Torneo'},
    {id:2,titulo:'Documento (Reglamento)'},
    {id:3,titulo:'Publicado'},
    {id:4,titulo:'Creador'},
    {id:5,titulo:'Acciones'},
]

export default function Table_Rtorneo() {
    const [tournamentRegs, setTournamentRegs] = useState<ApiTournamentRegulation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
     const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const fetchTournamentRegs = async () => {
        setLoading(true);
        setError(null);
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        try {
        const res = await fetch(`${API_URL}/tournament-regulations`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.statusText}`);
        const jsonData = await res.json();
        setTournamentRegs(jsonData.data);
        } catch (e: any) {
        setError(e.message || "Error al cargar reglas de torneo");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchTournamentRegs();
    }, []);

    if (loading) return <p className="text-center p-4">Cargando reglas de torneo...</p>;
    if (error) return <p className="text-center p-4 text-red-600">Error: {error}</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between">
                <h3 className="text-2xl font-bold mb-6">Reglas por torneo</h3>
                <Button onClick={() => setIsModalOpen(true)} className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0">
                    <Image
                    className="size-5"
                        src={'/mas.png'}
                        alt="plus"
                        width={500}
                        height={500}
                    />
                    <h3 className="font-semibold">Añadir Regla</h3>
                </Button>
            </div>


            {tournamentRegs.length > 0 ?(
                <>
                    <div className="Filtro grid grid-rows-2 md:flex items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
                        
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
                        
                            <div className="relative">
                                <Input type="date" id="fecha" className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-3 pr-3 py-3" required/>
                            </div>
                        
                    </div>
                    <Table className="w-full">
                        <TableHead className="text-gray-100  bg-unimar">
                            {titlesreglas.map((titulos)=>(
                                <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-center font-semibold ">
                                    {titulos.titulo}
                                </TableHeaderCell>
                            ))}
                        </TableHead>

                        <TableBody className="bg-white divide-y divide-gray-200">
                            {tournamentRegs.map((data)=>(
                                <TableRow key={`${data.id}`} className="hover:bg-gray-100 text-center cursor-pointer"
                                    onClick={() => {
                                    console.log("Clic en la fila. URL del PDF:", data.reglamento.archivo_url);
                                    setPdfUrl(data.reglamento.archivo_url);
                            }}
                                >
                                    <TableCell className="font-bold">{data.torneo.nombre}</TableCell>
                                    <TableCell>{data.reglamento.titulo}</TableCell>
                                    <TableCell>{data.reglamento.publicado}</TableCell>
                                    <TableCell>{data.reglamento.creator ?? 'N/A'}</TableCell>
                                    <TableCell className="space-x-2 flex justify-evenly text-white">
                                        {buttons.map((btn)=>(            
                                            btn.id === 1 ? (
                                                <a 
                                                    key={btn.id}
                                                    href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/regulations/${data.reglamento.id}/download`}   
                                                    title={btn.button}
                                                    className={`btn rounded-lg cursor-pointer flex size-12 place-items-center ${btn.id ===1? 'hover:bg-unimar/10' : (btn.id===2? 'hover:bg-gray-300/50': 'hover:bg-rose-300/50' )}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Image className='scale-110' src={btn.img} alt={btn.button} width={500} height={500} />
                                                </a>
                                            ) : (
                                                <div key={btn.id} 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <Button className={`btn rounded-lg cursor-pointer size-12 ${btn.id ===1? 'hover:bg-unimar/10' : (btn.id===2? 'hover:bg-gray-300/50': 'hover:bg-rose-300/50' )}`}>
                                                        <Image className='scale-110' src={btn.img} alt={btn.button} width={500} height={500} />
                                                    </Button>
                                                </div>
                                            )
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table> 
                </>
            ):(
                <div className='justify-items-center text-xl font-semibold text-unimar'>
                    <p className='pb-2'>No se han creado reglamentos para los torneos</p>
                    <hr className='bg-unimar w-full'/>
                </div>
            )}

            {pdfUrl && (
                    <Modal_VerReglamento 
                        url={pdfUrl} 
                        onClose={() => setPdfUrl(null)} 
                        state={!!pdfUrl}
                    />
            )}

            {isModalOpen && (
                <ModalAsignarRegla
                state={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                assignType="tournament"
                onSaveSuccess={fetchTournamentRegs}
                />
            )}
        </div>
  )
}
