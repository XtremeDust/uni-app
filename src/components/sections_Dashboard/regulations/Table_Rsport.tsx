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


interface ApiRegulationDetail {
  id: number;
  titulo: string;
  url_archivo: string;
  alcance: string;
  publicado: string;
  creator: string;
}
interface ApiSportInfo {
  id: number;
  nombre: string;
}
interface ApiSportRegulation {
  id_asignacion: number;
  deporte: ApiSportInfo;
  reglamento: ApiRegulationDetail;
}

const buttons = [
    {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]

export default function Tabla_Rsport() {

    const [sportRegs, setSportRegs] = useState<ApiSportRegulation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSportRegs() {
            setLoading(true);
            setError(null);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            try {
                const res = await fetch(`${API_URL}/sport-regulations`);
                if (!res.ok) throw new Error(`Error HTTP: ${res.statusText}`);
                
                const jsonData = await res.json();
                setSportRegs(jsonData.data);
            } catch (e: any) {
                setError(e.message || "Error al cargar reglas de deporte");
            } finally {
                setLoading(false);
            }
        }
        fetchSportRegs();
    }, []); 

    if (loading) return <p className="text-center p-4">Cargando reglas de deporte...</p>;
    if (error) return <p className="text-center p-4 text-red-600">Error: {error}</p>;
  return (
    <div className="bg-white p-6 rounded-lg shadow ">

        <div className="flex justify-between">
            <h3 className="text-2xl font-bold mb-6">Reglas por deporte</h3>
            <Button className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0">
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
                <TableHeaderCell  className="first:rounded-l-lg last:rounded-r-lg p-4 justify-center font-semibold ">Deporte</TableHeaderCell>
                <TableHeaderCell  className="first:rounded-l-lg last:rounded-r-lg p-4 justify-center font-semibold ">Documento (Reglamento)</TableHeaderCell>
                <TableHeaderCell  className="first:rounded-l-lg last:rounded-r-lg p-4 justify-center font-semibold ">Publicado</TableHeaderCell>
                <TableHeaderCell  className="first:rounded-l-lg last:rounded-r-lg p-4 justify-center font-semibold ">Creador</TableHeaderCell>
                <TableHeaderCell  className="first:rounded-l-lg last:rounded-r-lg p-4 justify-center font-semibold ">Acciones</TableHeaderCell>
            </TableHead>

            <TableBody className="bg-white divide-y divide-gray-200">
                {sportRegs.map((data)=>(
                    <TableRow key={data.reglamento.id} className="hover:bg-gray-100 text-center">
                        <TableCell className="font-bold">{data.deporte.nombre}</TableCell>
                        <TableCell>{data.reglamento.titulo}</TableCell>
                        <TableCell>{data.reglamento.publicado}</TableCell>
                        <TableCell>{data.reglamento.creator ?? 'N/A'}</TableCell>
                        <TableCell className="space-x-2 flex justify-evenly text-white">
                            {buttons.map((btn)=>(
                                <Button key={btn.id} className={`btn rounded-lg cursor-pointer size-14 ${btn.id ===1? 'hover:bg-unimar/10' : (btn.id===2? 'hover:bg-gray-300/50': 'hover:bg-rose-300/50' )}`}>
                                    <Image
                                        src={btn.img}
                                        alt={btn.button}
                                        width={500}
                                        height={500}
                                    />
                                </Button>
                            ))}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>    
    </div>
  )
}
