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
import Modal_AddGames from './modal_AddGames'

interface ApiGames{
  id: number;
  estado: string;
  fecha: string;
  ronda: number;
  competidor_a: ApiCompetidor;
  competidor_b: ApiCompetidor;
 disciplina_nombre:string; 
}

interface ApiCompetidor{
  entry_id: number | null;
  nombre: string;
  score: number | null;
}


const buttons = [
    {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]

const tituloPartidos = [
    {id:0 , titulo:'Disciplina'},
    {id:1 , titulo:'Ronda'},
    {id:2 , titulo:'Fecha'},
    {id:3 , titulo:'Competidor A'},
    {id:4 , titulo:'Resultado'},
    {id:5 , titulo:'Competidor B'},
    {id:6 , titulo:'Estado'},
    {id:7 , titulo:'Accion'},
]

export default function Table_Games() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [isEst, setSelectEst] = useState<string|null>('Todos'); 
    const [isOpenEst, setisEst] = useState(false);     

    const handleSelectEst = (id: number, label:string) => {
        setSelectEst(label);
        setisEst(false);
    };

    const refreshGames = () => {
            console.log("¡Refrescando lista de torneos!");
            // fetchGames(); 
    };
    
    const est = [{id:1,label:'Activo'},{id:2,label:'Próximo'},{id:3,label:'Finalizado'},];

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

    const [allGames, setAllGames] = useState<ApiGames[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    useEffect(() => {
        async function fetchAllGames() {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/all-games`); 
                if (!res.ok) throw new Error(`Error HTTP: ${res.statusText}`);
                
                const jsonData = await res.json();
                setAllGames(jsonData.data);
            } catch (e: any) {
                setError(e.message || "Error al cargar partidos");
            } finally {
                setLoading(false);
            }
        }
        fetchAllGames();
    }, []);

    if (loading) return <p>Cargando todos los partidos...</p>;
    if (error) return <p>Error: {error}</p>;



    return (

        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between mb-6">
                <h3 className="text-2xl font-bold">Partidos Deportivos</h3>
                <Button onClick={()=>setIsAddModalOpen(!isAddModalOpen)} className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0">
                    <Image
                    className="size-5"
                        src={'/mas.png'}
                        alt="plus"
                        width={500}
                        height={500}
                    />
                        <h3 className="font-semibold">Añadir Partido</h3>
                </Button>
            </div>

            {allGames.length > 0 ?
            (      
                <>
                    <div className="Filtro flex flex-col sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-2 xl:flex xl:flex-row items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
                        
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

                            <div className="w-full md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl text-black">
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

                            <div className="w-full md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl relative">
                                <Input type="date" id="fecha" className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-3 pr-3 py-3" required/>
                            </div>
                        
                    </div>

                    <Table className="w-full">
                        <TableHead className="text-gray-100  bg-unimar">
                            {tituloPartidos.map((titulos)=>(
                                <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-end font-semibold ">
                                    {titulos.titulo}
                                </TableHeaderCell>
                            ))}
                        </TableHead>

                        <TableBody className="bg-white divide-y divide-gray-200">
                            {allGames.map((data)=>(
                                        <TableRow key={data.id} className="hover:bg-gray-100 text-center">
                                            <TableCell className="font-bold">{data.disciplina_nombre}</TableCell>
                                            <TableCell>{data.ronda}</TableCell>
                                            <TableCell>{data.fecha}</TableCell>
                                            <TableCell>{data.competidor_a.nombre}</TableCell>
                                            <TableCell>{data.competidor_a.score ?? '-'} vs {data.competidor_b.score ?? '-'}</TableCell>
                                            <TableCell>{data.competidor_b.nombre}</TableCell>
                                            <TableCell className="place-items-center"><p  className={`inline-block items-center rounded-full px-4 py-2 text-sm font-semibold ${
                                                data.estado === 'finalizado' ? 'bg-purple-100 text-purple-800' :
                                                data.estado === 'en partido' ? 'bg-green-100 text-green-800' :
                                                data.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                data.estado === 'cancelado' ? 'bg-rose-100 text-rose-800' :
                                                'bg-gray-200 text-gray-800'
                                                }`}>
                                                    {data.estado}</p></TableCell>
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
                    <p className='pb-2'>No se han creado partidos</p>
                    <hr className='bg-unimar w-full'/>
                </div>
            )}


            {isAddModalOpen && (
                <Modal_AddGames
                    state={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}    
                    onGameCreated={refreshGames}
                />
            )}
        </div>
    );
}
