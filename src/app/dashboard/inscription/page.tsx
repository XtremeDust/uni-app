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
  InputGroup
 } from '@/types/ui_components'

//tabla inscripciones
interface ApiTeam {
  id: number;
  nombre: string;
  disciplina: string;
  categoria: string;
  integrantes_total: number;
  estado: 'Aceptado' | 'Rechazado' | 'Pendiente';
}

//tabla usuarios por equipo api/teams
interface ApiUser {
  name: string | null;
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


        const [teams, setTeams] = useState<ApiTeam[]>([]);
        const [userTeam, setUserTeam] = useState<ApiUsers[]>([]);
        const [sub, setSub] = useState<ApiSub[]>([]);

        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string|null>(null);

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
                    if (!userTeamsRes.ok) throw new Error(`Error en equipos: ${userTeamsRes.statusText}`);
                    if (!teamsRes.ok) throw new Error(`Error en inscripciones: ${teamsRes.statusText}`);
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
                                <TableRow key={entry.id} className="hover:bg-gray-100 text-center">
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

            <section className="grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">

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

            <section className="grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">

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
                            {sub.map((sub)=>(
                                
                                <TableRow  key={sub.id_suscripcion} className="hover:bg-gray-100 text-center">
                                
                                    <TableCell className="font-bold">{sub.suscriptor.email}</TableCell>
                                    <TableCell>{sub.fecha_suscripcion}</TableCell>
                                    <TableCell>{sub.hace_tiempo}</TableCell>
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
  )
}
