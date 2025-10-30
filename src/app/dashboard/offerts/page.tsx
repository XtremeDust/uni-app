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

const titlesofertasdeporte=[
    { id: 1, titulo: "Deporte"},
    { id: 2, titulo: "Trimestre" },
    { id: 4, titulo: "Entrenador" },
    { id: 3, titulo: "Inscritos" },
    { id: 5, titulo: "Estado" },
    {id:6, titulo:"Acciones"},
]

const titlesofertas=[
    { id: 1, titulo: "Deporte"},
    { id: 3, titulo: "Secciones" },
    { id: 2, titulo: "Cupos" },
    {id:4, titulo:"Acciones"},
]


const deporte = [
    {id: 1,title: 'Fútbol Sala',tipo: 'en equipo',inscritos:184,  status:'Activo'},
    {id: 2,title: 'Básquetbol',tipo: 'en equipo',inscritos:50,  status:'Cerrado'},
    {id: 3,title: 'Voleibol',tipo: 'en equipo',inscritos:145, status:'Proximamente' },
    {id: 4,title: 'Béisbol 5',tipo: 'en equipo',inscritos:80 , status:'Activo'},
    {id: 5,title: 'Tenis de Mesa',tipo: 'individual o en duplas',inscritos:105 , status:'Cerrado'},
    {id: 6,title: 'Kickingball',tipo: 'en equipo',inscritos:64, status:'Proximamente'},
    {id: 7,title: 'Karate-Do',tipo: 'individual',inscritos:52 , status:'Activo'},
    {id: 8,title: 'Softbol',tipo: 'en equipo',inscritos:30 , status:'Cerrado'},
    {id: 9,title: 'Pickleball',tipo: 'individual o en duplas',inscritos:24, status:'Proximamente'},
];

const recreativas=[
    {id: 1,title: 'Fútbol Sala', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 2,title: 'Básquetbol', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 3,title: 'Voleibol', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 4,title: 'Béisbol 5', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 5,title: 'Tenis de Mesa', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 6,title: 'Kickingball', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 7,title: 'Karate-Do', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 8,title: 'Softbol', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 9,title: 'Pickleball', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 10,title: 'Orfeon', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 11,title: 'Baile', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 12,title: 'Teatro', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 13,title: 'Oratoria', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 14,title: 'Inteligencia Emocional', seccion:'p-01', cupos:'20/20 (Lleno)'},
    {id: 15,title: 'Ajedrez', seccion:'p-01', cupos:'20/20 (Lleno)'},

]

const buttons = [
    {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]

interface Sport{
    id:number,
    titulo:string;
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

export default function page() {

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

    ///filtro estados   
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
                // Llama a tu endpoint de ofertas académicas
                const response = await fetch(`${API_URL}/academic-offerings`);
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.statusText}`);
                }
                const jsonData = await response.json();

                // Guarda el array que está dentro de la clave 'data'
                setOfferings(jsonData.data);

            } catch (e: any) {
                setError(e.message || "Error al cargar ofertas");
            } finally {
                setLoading(false);
            }
        }

        fetchOfferings();
    }, []); // Carga inicial

    if (loading) return <p>Cargando ofertas académicas...</p>;
    if (error) return <p>Error: {error}</p>;

            return(
                    <div className="Case2 overflow-y-auto">
                            <section className="grid grid-cols-1  space-y-3 lg:space-y-0 lg:gap-6 mb-4">

                                <div className="bg-white p-6 rounded-lg shadow col-span-2 space-y-1">
                                   
                                     <div className="flex justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-black">Ofertas Academicas Actuales</h3>

                                    </div>


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
                                                    <TableCell className="font-bold">{data.deporte.titulo}</TableCell>
                                                    <TableCell>{data.trimestre}</TableCell>
                                                    <TableCell>{data.entrenador.nombre}</TableCell>
                                                    <TableCell>{data.inscritos_actuales}/{data.cupos}</TableCell>
                                                    <TableCell className="place-items-center"><p  className={`rounded-full px-4 py-2 font-semibold text-gray-950 ${data.estado==='abierto'? ' bg-green-200/65 text-green-800' : (data.estado==='cerrado'? 'bg-gray-200 text-gray-800': 'bg-yellow-100/50 text-yellow-800')}`}>{data.estado}</p></TableCell>
                                                    <TableCell className="space-x-2 flex justify-evenly text-white">
                                                        {buttons.map((btn)=>(
                                                            <Button key={btn.id} className={`btn rounded-lg cursor-pointer size-12 ${btn.id ===1? 'hover:bg-unimar/10' : (btn.id===2? 'hidden': 'hidden' )}`}>
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

                                </div>



                                {/**
                                    <div className="bg-white p-6 rounded-lg shadow col-span-2">
                                        <div className="flex justify-between mb-6">
                                            <h3 className="text-2xl font-bold text-black">Ofertas recreativas</h3>
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


                                        <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-2 xl:flex xl:flex-row items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
                                            
                                            <div className="relative w-full flex col-span-2 text-black">
                                                
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

                                            <div className="w-full md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl text-black">
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
                                            
                                        </div>
                                        
                                    <Table className="w-full">
                                            <TableHead className="text-white bg-unimar">
                                                {titlesofertas.map((titulos)=>(
                                                    <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 border-b justify-end font-semibold ">
                                                        {titulos.titulo}
                                                    </TableHeaderCell>
                                                ))}
                                            </TableHead>

                                            <TableBody className="bg-white divide-y divide-gray-200">
                                                {recreativas.map((data)=>(
                                                    <TableRow key={data.id} className="hover:bg-gray-100 text-center">
                                                        <TableCell className="font-bold">{data.title}</TableCell>
                                                        <TableCell>{data.seccion}</TableCell>
                                                        <TableCell>{data.cupos}</TableCell>
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
                                 */}

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
                                                    <TableCell className="font-bold">{data.deporte.titulo}</TableCell>
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

                                </div>

                            </section>

                    </div>  
            );
}
