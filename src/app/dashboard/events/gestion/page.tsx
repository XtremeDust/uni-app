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

 const titleventos=[
    {id:1, titulo:"Evento"},
    {id:2, titulo:"Disiplinas"},
    {id:3, titulo:"Inicia"},
    {id:4, titulo:"Termina"},
    {id:5, titulo:"Estado"},
    {id:6, titulo:"Acciones"},
 ]

 const eventos = [
    {
        "id": 1, 
        "nombre": "Copa Unimar Diciembre 2025",
        "descripcion": "Los mejores de la universidad compiten por la gloria en la cancha.",
        "imagen_url": "https://url.a.imagen/copa-dic.jpg",
        "tipo_evento": "Deportivo",
        "estado": "Próximo",
        "fecha_inicio": "2025-12-15",
        "inscritos": 0,
    },
    {
        "id": 2, 
        "nombre": "Copa Unimar Primavera 2025",
        "descripcion": "La pasión del deporte une a todas las carreras en este emocionante torneo.",
        "imagen_url": "https://url.a.imagen/copa-primavera.jpg",
        "tipo_evento": "Deportivo",
        "estado": "Activo",
        "fecha_inicio": "2025-08-27",
        "inscritos": 184,
    },
    {
        "id": 3,
        "nombre": "Copa Unimar Aniversario 2025",
        "descripcion": "Vive los mejores momentos del torneo de la universidad.",
        "imagen_url": "https://url.a.imagen/copa-aniversario.jpg",
        "tipo_evento": "Deportivo",
        "estado": "Finalizado",
        "fecha_inicio": "2025-04-15",
        "inscritos": 120,
    },
    {
        "id": 4, 
        "nombre": "Copa Unimar Interdisciplinaria 2025",
        "descripcion": "Pon a prueba tu capacidad. Un evento para toda la comunidad universitaria.",
        "imagen_url": "https://url.a.imagen/copa-inter.jpg",
        "tipo_evento": "Deportivo",
        "estado": "Finalizado",
        "fecha_inicio": "2025-10-14",
        "inscritos": 50,
    },
    {
        "id": 5,
        "nombre": "Jornada de Recolección de Firmas",
        "descripcion": "Evento institucional de apoyo a la nueva directiva estudiantil.",
        "imagen_url": "https://url.a.imagen/recoleccion-firmas.jpg",
        "tipo_evento": "General",
        "estado": "Próximo",
        "fecha_inicio": "2025-11-01",
        "inscritos": 0,
    },
    {
        "id": 6, 
        "nombre": "Concurso Fotográfico Universitario",
        "descripcion": "Muestra tu visión de la vida en el campus. Abierto a todas las facultades.",
        "imagen_url": "https://url.a.imagen/concurso-foto.jpg",
        "tipo_evento": "Cultural",
        "estado": "Activo",
        "fecha_inicio": "2025-10-20",
        "inscritos": 35,
    },
    {
        "id": 7, 
        "nombre": "Ceremonia de Grado Septiembre",
        "descripcion": "Acto solemne para los egresados de la promoción 2025-II.",
        "imagen_url": "https://url.a.imagen/grado-sept.jpg",
        "tipo_evento": "General",
        "estado": "Finalizado",
        "fecha_inicio": "2025-09-28",
        "inscritos": 0,
    }
];

interface Creador {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  cedula: string;
  telefono: string;
}


interface ApiTournament {
  id: number;
  nombre: string;
  descripcion: string;
  estado: 'proximo' | 'activo' | 'finalizado'; 
  creador: Creador;
  total_disiplinas: number; 
  inicio: string;
  fin: string;
}

const buttons = [
    {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]


export default function page() {

    const [isEstate, setSelectE] = useState('Todos'); 
    const [isOpenE, setIsOpenE] = useState(false);

        const handleSelectE = (id: number, label:string) => {
        setSelectE(label);
        setIsOpenE(false);
    };

    const estate=[{id:1,label:'Activo'},{id:2,label:'Próximo'},{id:3,label:'Finalizado'},]

    const filteredEstate = estate
    .filter(item => item.label !== isEstate)
    .map(item => ({
        id: item.id,
        label: item.label,
    }));

    const dropdownEstate = [
    ...(isEstate !== 'Todos' ? [{ id: 0, label: 'Todos' }] : []),
    ...filteredEstate,
    ];

        ///filtro estados  2
            const [isEst, setSelectEst] = useState<string|null>('Todos'); 
            const [isOpenEst, setisEst] = useState(false);     
    
            const handleSelectEst = (id: number, label:string) => {
                setSelectEst(label);
                setisEst(false);
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
        
        const [tournaments, setTournaments] = useState<ApiTournament[]>([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            async function fetchTournaments() {
                setLoading(true);
                setError(null);
                 const API_URL = process.env.NEXT_PUBLIC_API_URL;
                try {
                    const response = await fetch(`${API_URL}/tournaments`);
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.statusText}`);
                    }
                    const jsonData = await response.json();
                    setTournaments(jsonData.data); // Obtiene el array desde la clave 'data'
                } catch (e: any) {
                    setError(e.message || "Error al cargar torneos");
                } finally {
                    setLoading(false);
                }
            }
            fetchTournaments();
        }, []);

        if (loading) return <p>Cargando torneos...</p>;
        if (error) return <p>Error: {error}</p>;

  return (
    <div className="Case2 overflow-y-auto text-black">
            <section className="grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between mb-6">
                        <h3 className="text-2xl font-bold">Torneos Deportivos</h3>
                        <Button className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0">
                            <Image
                            className="size-5"
                                src={'/mas.png'}
                                alt="plus"
                                width={500}
                                height={500}
                            />
                              <h3 className="font-semibold">Añadir Torneo</h3>
                        </Button>
                    </div>



                    <div className="Filtro flex flex-col sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-2 xl:flex xl:flex-row  items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
                        
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

                            <div className="w-full relative md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl">
                                <Input type="date" id="fecha" className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-3 pr-3 py-3" required/>
                            </div>

                            <div className="w-full md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl"       >
                                <Select
                                        className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-3 pr-3 py-3"
                                        options={dropdownEstate}
                                        currentValue={isEstate}
                                        isOpen={isOpenE}
                                        setOpen={setIsOpenE} 
                                        onSelect={handleSelectE}
                                        placeholder="Seleccione el estado"
                                />     
                            </div>  

                    </div>
                  
                    <Table className="w-full">
                        <TableHead className="text-gray-100  bg-unimar">
                            {titleventos.map((titulos)=>(
                                <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-end font-semibold ">
                                    {titulos.titulo}
                                </TableHeaderCell>
                            ))}
                        </TableHead>

                        <TableBody className="bg-white divide-y divide-gray-200">
                            {tournaments.map((tournament)=>(
                                <React.Fragment key={tournament.id}>
                                        <TableRow  className="hover:bg-gray-100 text-center">
                                            <TableCell className="font-bold">{tournament.nombre}</TableCell>
                                            <TableCell>{tournament.total_disiplinas}</TableCell>
                                            <TableCell>{tournament.inicio}</TableCell>
                                            <TableCell>{tournament.fin}</TableCell>
                                            <TableCell className="place-items-center">
                                            <p className={`inline-block items-center rounded-full px-3 py-2 text-sm font-semibold ${
                                                tournament.estado === 'proximo' ? 'bg-blue-100 text-blue-800' :
                                                tournament.estado === 'activo' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {/* Capitaliza la primera letra */}
                                                {tournament.estado.charAt(0).toUpperCase() + tournament.estado.slice(1)}
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
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>  
                    
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between mb-6">
                        <h3 className="text-2xl font-bold">Partidos Deportivos</h3>
                        <Button className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0">
                            <Image
                            className="size-5"
                                src={'/mas.png'}
                                alt="plus"
                                width={500}
                                height={500}
                            />
                              <h3 className="font-semibold">Añadir Evento</h3>
                        </Button>
                    </div>

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
                            {titleventos.map((titulos)=>(
                                <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-end font-semibold ">
                                    {titulos.titulo}
                                </TableHeaderCell>
                            ))}
                        </TableHead>

                        <TableBody className="bg-white divide-y divide-gray-200">
                            {eventos.map((data)=>(
                                <React.Fragment key={data.id}>
                                    {data.tipo_evento === 'Deportivo'  &&(
                                        <TableRow  className="hover:bg-gray-100 text-center">
                                            <TableCell className="font-bold">{data.nombre}</TableCell>
                                            <TableCell>{data.tipo_evento}</TableCell>
                                            <TableCell>{data.inscritos}</TableCell>
                                            <TableCell>{data.fecha_inicio}</TableCell>
                                            <TableCell className="place-items-center"><p  className={`inline-block items-center rounded-full px-4 py-2 text-sm font-semibold ${
                                                data.estado === 'Próximo' ? 'bg-blue-100 text-blue-800' :
                                                data.estado === 'Activo' ? 'bg-green-100 text-green-800' :
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

                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>  
                    
                </div>

            </section>

    </div>
  )
}
