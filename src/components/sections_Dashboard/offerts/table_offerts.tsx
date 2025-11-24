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

  export interface currentProps{
      current:number;
  }

const buttons = [
    {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]

interface Sport{
    id:number,
    titulo:string;
    deleted_at:string;
}

interface Entrenador{
  id: number;
  nombre: string;
  email: string;
  rol: string;
  cedula: string;
  telefono: string;
}

interface ApiOffers{
  id:number,
  trimestre: string;
  deporte: Sport;
  entrenador:Entrenador;
  cupos:string
  categoria: string;
  inscritos_actuales: number;
  estado: 'abierto'| 'cerrado'| 'lleno';
}

const titlesofertasdeporte=[
    { id: 1, titulo: "Deporte"},
    { id: 2, titulo: "Trimestre" },
    { id: 4, titulo: "Entrenador" },
    { id: 3, titulo: "Inscritos" },
    { id: 5, titulo: "Estado" },
    {id:6, titulo:"Acciones"},
]

export default function table_offerts() {

        const [isJug, setSelectJug] = useState<string|null>('Todos'); 
        const [isOpenJug, setisJug] = useState(false);
    
            const handleSelectJug = (id: number, label:string) => {
            setSelectJug(label);
            setisJug(false);
        };
    
        const jug=[{id: 1, label: 'Individual'}, {id: 2, label: 'En Equipo'}, {id:3, label:'En Duplas'}]
    
    
        const filteredJug = jug
        .filter(jug => jug.label !== isJug)
        .map(jug => ({
            id: jug.id,
            label: jug.label,
        }));
    
        const dropdownjug = [
        ...(isJug !== 'Todos' ? [{ id: 0, label: 'Todos' }] : []),
        ...filteredJug,
        ];

        const [isEst, setSelectEst] = useState<string|null>('Todos'); 
        const [isOpenEst, setisEst] = useState(false);     

        const handleSelectEst = (id: number, label:string) => {
            setSelectEst(label);
            setisEst(false);
        };
        
        const est = [{id: 2, label: 'Aceptado'}, {id: 3, label: 'Proximamente'}, {id: 4, label: 'Cerrado'}];

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

        const [offerings, setOfferings] = useState<ApiOffers[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOfferings() {
            setLoading(true);
            setError(null);

            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            try {
                const response = await fetch(`${API_URL}/academic-offerings`);
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.statusText}`);
                }
                const jsonData = await response.json();

                setOfferings(jsonData.data);

            } catch (e: any) {
                setError(e.message || "Error al cargar ofertas");
            } finally {
                setLoading(false);
            }
        }

        fetchOfferings();
    }, []);

    if (loading) return <p>Cargando ofertas académicas...</p>;
    if (error) return <p>Error: {error}</p>;

    return(
        <div className="Case2 overflow-y-auto">
            <section className="grid grid-cols-1  space-y-3 lg:space-y-0 lg:gap-6 mb-4">
                    <div className="bg-white p-6 rounded-lg shadow col-span-2 space-y-1">
                    
                        <div className="flex justify-between mb-6">
                        <h3 className="text-2xl font-bold text-black">Ofertas Academicas</h3>
                        <Button className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0">
                            <Image
                            className="size-5"
                                src={'/mas.png'}
                                alt="plus"
                                width={500}
                                height={500}
                            />
                                <h3 className="font-semibold">Añadir Oferta</h3>
                        </Button>
                    </div>

                    {offerings.length > 0 ?(
                        <>
                            <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-2 xl:flex xl:flex-row items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl text-black">                                
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
                                    <Input type="text" id="buscar" className="bg-gray-50 focus:ring-[1px] text-black placeholder:text-gray-600 focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-18 pr-3 py-3" placeholder="Buscar" required/>
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
                                        options={dropdownjug}
                                        currentValue={isJug}
                                        isOpen={isOpenJug}
                                        setOpen={setisJug} 
                                        onSelect={handleSelectJug}
                                        placeholder="Seleccione una jugegoria"
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
                                    {titlesofertasdeporte.map((titulos)=>(
                                        <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-end font-semibold ">
                                            {titulos.titulo}
                                        </TableHeaderCell>
                                    ))}
                                </TableHead>

                                <TableBody className="bg-white divide-y divide-gray-200">
                                    {offerings.map((data)=>(
                                        <TableRow key={data.id} className="hover:bg-gray-100 text-center">
                                            
                                             <TableCell className="font-bold">
                                                {data.deporte ? (
                                                    <span>{data.deporte.titulo}</span>
                                                ) : (
                                                    <span className="text-red-500 italic">Deporte no disponible</span>
                                                )}

                                                {data.deporte?.deleted_at && (
                                                    <span className="text-xs text-red-400 block">(Eliminado)</span>
                                                )}
                                            </TableCell>
                                           
                                            <TableCell>{data.trimestre}</TableCell>
                                            <TableCell>{data.entrenador.nombre}</TableCell>
                                            <TableCell>{data.inscritos_actuales}/{data.cupos}</TableCell>
                                            <TableCell className="place-items-center">
                                                <p  className={`rounded-full px-4 py-2 font-semibold text-gray-950 ${data.estado==='abierto'? ' bg-green-200/65 text-green-800' : (data.estado==='cerrado'? 'bg-gray-200 text-gray-800': 'bg-yellow-200 text-yellow-800')}`}>
                                                    {data.estado}
                                                </p>
                                            </TableCell>
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>                                                
                        </>
                    ):(
                        <div className='justify-items-center text-xl font-semibold text-unimar'>
                            <p className='pb-2'>No se han creado ofertas academicas</p>
                            <hr className='bg-unimar w-full'/>
                        </div>
                    )}
                </div>
            </section>
        </div>  
    );
}
