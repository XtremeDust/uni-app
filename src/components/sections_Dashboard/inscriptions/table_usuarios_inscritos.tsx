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
import TeamModal from '@/components/sections_Dashboard/inscriptions/team_modal';

const titleintegrantes = [
    {id:1, titulo:"Usuario"},
    {id:2, titulo:"Cedula"},
    {id:4, titulo:"Telefono"},
    {id:3, titulo:"Equipo"},
    {id:5, titulo:"Acciones"},
]

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

export default function table_usuarios_inscritos() {

    const [userTeam, setUserTeam] = useState<ApiUsers[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        async function fetchAllData() {
            try {
                setLoading(true);
                setError(null);

                const API_URL = process.env.NEXT_PUBLIC_API_URL;

                const [ userTeamsRes] = await Promise.all([
                    fetch(`${API_URL}/teams`),
                ]);

                // Comprobamos si ambas respuestas son exitosas
                if (!userTeamsRes.ok) throw new Error(`Error en datos usuario inscrito: ${userTeamsRes.statusText}`);

                const userTeamData = await userTeamsRes.json();
                //const teamsData = await teamsRes.json();

                // 3. Guardamos los datos
                // Nota: Laravel API Resources envuelven la colección en una clave 'data'
                //setTeams(teamsData.data); 
                setUserTeam(userTeamData.data);

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
  )
}
