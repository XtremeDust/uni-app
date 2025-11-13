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
  HeaderModal,
  ContainModal,
  Modal
 } from '@/types/ui_components'
import Modal_AddActivity from '@/components/sections_Dashboard/general/modal_Addactivity'
import ActivityDetailModal from './modal_DetailActivity'

 interface ApiActivityList {
  id: number;
  titulo: string;
  tipo: 'cultural' | 'general';
  estado: 'proximo' | 'finalizado' | 'activo';
  fecha_actividad: string;
  ubicacion: string;
  extracto_contenido: string;
  creador_nombre: string;
}

interface ApiCreator {
  id: number;
  nombre: string;
  email: string;

}

interface ApiRegulation {
  id: number;
  titulo: string;
  url_archivo: string;

}


interface ApiActivityDetail {
  id: number;
  titulo: string;
  contenido_completo: string;
  imagen_url: string;
  tipo: 'cultural' | 'general';
  estado: 'proximo' | 'finalizado' | 'activo';
  fecha_actividad: string;
  ubicacion: string;
  creador: ApiCreator;
  reglamentos: ApiRegulation[];
  creado_hace: string;
}

 const titleventos=[
    {id:1, titulo:"Evento"},
    {id:2, titulo:"Tipo"},
    {id:3, titulo:"Inscritos"},
    {id:4, titulo:"Fecha"},
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

const buttons = [
    {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]

export default function table_Activity() {
      const [isSelectJ, setSelectJ] = useState('Tipos'); 
        const [isOpenJ, setIsOpenJ] = useState(false);
    
            const handleSelectJ = (id: number, label:string) => {
            setSelectJ(label);
            setIsOpenJ(false);
        };
    
        const [isEstate, setSelectE] = useState('Estados'); 
        const [isOpenE, setIsOpenE] = useState(false);

        const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
            const handleSelectE = (id: number, label:string) => {
            setSelectE(label);
            setIsOpenE(false);
        };
    
    
        const selectTipoJ=[
            {id:1, label:'General'},
            {id:2, label:'Cultural'},
        ]
    
        const estate=[
            {id:1,label:'Activo'},
            {id:2,label:'Próximo'},
            {id:3,label:'Finalizado'},
        ]
    
        const filteredEstate = estate
        .filter(item => item.label !== isEstate)
        .map(item => ({
            id: item.id,
            label: item.label,
        }));

        
        const filteredTipo = selectTipoJ
        .filter(item => item.label !== isSelectJ)
        .map(item => ({
            id: item.id,
            label: item.label,
        }));
    
        const dropdownOptions= [
            ...(isSelectJ!== 'Tipos' ? [{id:0, label: 'Tipos'}]:[]),
            ...filteredTipo,
            
        ];
        
        const dropdownEstate = [
        ...(isEstate !== 'Estados' ? [{ id: 0, label: 'Estados' }] : []),
        ...filteredEstate,
        ];

    
    const [activities, setActivities] = useState<ApiActivityList[]>([]);
    const [loadingTable, setLoadingTable] = useState(true);
    const [errorTable, setErrorTable] = useState<string | null>(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<ApiActivityDetail | null>(null);

    useEffect(() => {
        async function fetchActivities() {
            setLoadingTable(true);
            setErrorTable(null);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            try {
                const res = await fetch(`${API_URL}/activities`);
                if (!res.ok) throw new Error(`Error HTTP: ${res.statusText}`);
                const jsonData = await res.json();
                setActivities(jsonData.data);
            } catch (e: any) {
                setErrorTable(e.message || "Error al cargar actividades");
            } finally {
                setLoadingTable(false);
            }
        }
        fetchActivities();
    }, []);


    const handleOpenModal = async (activityId: number) => {
        setIsModalOpen(true);
        setLoadingModal(true);
        setSelectedActivity(null);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const res = await fetch(`${API_URL}/activities/${activityId}`);
            if (!res.ok) throw new Error(`Error en API Activities: ${res.statusText}`);
            const jsonData = await res.json();
            setSelectedActivity(jsonData.data);
        } catch (e: any) {
            console.error("Error al cargar detalles de la actividad:", e);
        } finally {
            setLoadingModal(false);
        }
    };

    if (loadingTable) return <p>Cargando actividades...</p>;
    if (errorTable) return <p>Error: {errorTable}</p>;

  return (
    <div className="Case2 overflow-y-auto text-black">
            <section className="grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">


                <div className="bg-white p-6 rounded-lg shadow">

                    <div className="Titulo flex justify-between mb-6">
                        <h3 className="text-2xl font-bold">Actividades Generales</h3>
                        <Button className="bg-unimar flex place-items-center items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-6 py-7 md:py-2"
                            onClick={()=>setIsAddModalOpen(!isAddModalOpen)}
                        >
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

                    {activities.length > 0 ?(
                        <>
                            <div className="Filtro flex flex-col sm:grid sm:grid-cols-2  lg:grid lg:grid-cols-2 xl:flex xl:flex-row items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
                                
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

                                    <div className="w-full md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl"       >
                                        <Select
                                                className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-3 pr-3 py-3"
                                                options={dropdownOptions}
                                                currentValue={isSelectJ}
                                                isOpen={isOpenJ}
                                                setOpen={setIsOpenJ} 
                                                onSelect={handleSelectJ}
                                                placeholder="Seleccione el tipo de juego"
                                        />
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

                                    <div className="relative w-full md:w-auto col-span-2 bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl"       >
                                        <Input type="date" id="fecha" className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-3 pr-3 py-3 " required/>
                                    </div>
                                
                            </div>
                            
                            <Table className="Tabla w-full">
                                <TableHead className="text-gray-100  bg-unimar">
                                    {titleventos.map((titulos)=>(
                                        <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-end font-semibold ">
                                            {titulos.titulo}
                                        </TableHeaderCell>
                                    ))}
                                </TableHead>

                                <TableBody className="bg-white divide-y divide-gray-200">
                                    {activities.map((data)=>(
                                        <React.Fragment key={data.id}>
                                                <TableRow  className="hover:bg-gray-100 text-center" onClick={() => handleOpenModal(data.id)}>
                                                    <TableCell className="font-bold">{data.titulo}</TableCell>
                                                    <TableCell>{data.tipo}</TableCell>
                                                    <TableCell>{data.fecha_actividad}</TableCell>
                                                    <TableCell>{data.ubicacion}</TableCell>
                                                    <TableCell className="place-items-center"><p  className={`rounded-full p-2 w-40 font-semibold text-gray-950 ${data.estado==='activo'? ' bg-green-100 text-green-800' : (data.estado==='proximo'? 'bg-blue-100 text-blue-800': 'bg-purple-100 text-purple-800')}`}>{data.estado}</p></TableCell>
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
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>  
                        </>
                    ):(
                        <div className='justify-items-center text-xl font-semibold text-unimar'>
                            <p className='pb-2'>No se han creado actividades</p>
                            <hr className='bg-unimar w-full'/>
                        </div>
                    )}
                    
                    {isModalOpen && (
                        <ActivityDetailModal
                            activityData={selectedActivity}
                            isLoading={loadingModal}
                            onClose={() => setIsModalOpen(false)}
                        />
                    )}


                    {isAddModalOpen && (
                        <Modal_AddActivity
                            state={isAddModalOpen}
                            onClose={() => setIsAddModalOpen(false)}  
                            //onActivityCreated={}  
                        />
                    )}

                </div>


            </section>

    </div>  
  )
}

