'use client'
import React, { useState, useEffect  } from 'react'
import Image from 'next/image'
import { 
  Input,
  Button, 
  Select, 
  Table, 
  TableBody, TableCell, TableRow,
  TableHead, TableHeaderCell,
  Modal, HeaderModal,ContainModal
 } from '@/types/ui_components'

  export interface currentProps{
      current:number;
  }
  
  const titlecoment = [
    {id:1, titulo:"Usuario"},
    {id:2, titulo:"Comentario"},
    {id:4, titulo:"Fecha"},
    {id:3, titulo:"Estado"},
    {id:5, titulo:"Acciones"},
  ]
    
  /*
  const coment = [
      {
          id: 1,
          email: "carlos.marquez@unimar.edu.ve",
          fecha: "2025-10-18T10:30:00Z",
          contenido: "Excelente iniciativa para las inscripciones deportivas. La interfaz de selección de categorías es muy intuitiva.",
          visibilidad: 'Publico',
      },
      {
          id: 2,
          email: "a.nimo@unimar.edu.ve",
          fecha: "2025-10-18T11:45:00Z",
          contenido: "Deberían agregar más deportes de mesa.",
          visibilidad: 'Anonimo',
      },
      {
          id: 3,
          email: "p.gonzalez@unimar.edu.ve",
          fecha: "2025-10-17T15:22:00Z",
          contenido: "Deberían agregar una vista de calendario en el dashboard para ver el cronograma de todos los partidos del mes en una sola pantalla.",
          visibilidad: 'Publico',
      },
      {
          id: 4,
          email: "n.imo.2@unimar.edu.ve",
          fecha: "2025-10-16T09:05:00Z",
          contenido: "El dashboard tarda mucho en cargar al aplicar filtros de fecha. Podrían optimizar la consulta a la base de datos para que sea más rápida.",
          visibilidad: 'Anonimo',
      },
      {
          id: 5,
          email: "maria.perez@unimar.edu.ve",
          fecha: "2025-10-16T18:01:00Z",
          contenido: "¡Me encanta el nuevo diseño! La opción de cerrar sesión es muy visible.",
          visibilidad: 'Publico',
      },
  ];*/

  const buttons = [
      {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
      {id:2, button:"Editar", img:"/lapiz (1).png"},
      {id:3, button:"Eliminar", img:"/basura (1).png"}
  ]

  interface ApiList{
    id:number
    estado: 'publico'|'privado';
    fecha_creacion:string;
    autor:string;
    comentario_extracto:string;
  }

  interface APIcoment{
     id: number;
    comentario: string;
    estado: string;
    autor: {
        id: number;
        nombre:string;
        email: string;
        cedula:string;
        telefono:string;
    };
    fecha_creacion:string;
  }

  export default function page() {
    const [isEstate, setSelectE] = useState<string|null>('Todos'); 
    const [isOpenE, setIsOpenE] = useState(false);

        const handleSelectE = (id: number, label:string) => {
        setSelectE(label);
        setIsOpenE(false);
    };

    const estate=[
        {id:1,label:'Activo'},
        {id:2,label:'Pausado'},
    ]


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


    const [posts, setPosts] = useState<ApiList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    // modal
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [loadingModal, setLoadingModal] = useState(false);
        const [selectedEntry, setSelectedEntry] = useState<ApiList | null>(null);
        const [selectedComent, setSelectedComent]=useState< APIcoment|null>(null);
        
    //


    useEffect(() => {
(async () => {
      try {
        setLoading(true);
        setError(null); 
        const API_URL = process.env.NEXT_PUBLIC_API_URL 

        const res = await fetch(`${API_URL}/posts`);

        if (!res.ok) { 
          throw new Error(`Error HTTP: ${res.statusText}`);
        }

        const json = await res.json();

        if (json && json.data) { 
             setPosts(json.data);
        } else {
  
             console.error("Formato de respuesta inesperado:", json);
             setPosts([]);
        }

      } catch (e: any) { 
        console.error("Error al cargar posts:", e);
        setError(e.message || "Error desconocido"); 
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Cargando posts...</p>;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleVerDetalle = async (entryComent:ApiList)=>{

        setSelectedEntry(entryComent);
        setIsModalOpen(true);
        setLoadingModal(true);
        setSelectedComent(null);

        try {
                const res = await fetch(`${API_URL}/posts/${entryComent.id}`);
                if (!res.ok) throw new Error(`Error en API subs: ${res.statusText}`);
                const jsonData = await res.json();
                setSelectedComent(jsonData.data); // Guardar detalles del equipo
            } catch (e: any) {
                console.error("Error al cargar detalles del autor:", e);
                // El modal mostrará un error
            } finally {
                setLoadingModal(false);
            }
    }

  return (
    <div>
      <div className="Case2 overflow-y-auto">
              <section className="grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">

                  <div className="bg-white p-6 rounded-xl shadow ">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Comentarios de usuario</h2>


                      <div className="Filtro flex flex-col md:flex-row items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
                          
                              <div className="relative w-full flex text-black ">
                                  
                                  <label htmlFor='buscar' className="h-full place-content-center absolute left-0 px-2 pl-3.5 cursor-pointer rounded-2xl">
                                      <Image
                                          className="size-8"
                                          src={'/lupa.png'}
                                          alt="buscar"
                                          width={60}
                                          height={60}
                                      />
                                  </label>
                                  <Input type="text" id="buscar" className="bg-gray-50 focus:ring-[1px] placeholder:text-gray-600 text-black focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-18 pr-3 py-3" placeholder="Buscar" required/>
                                  
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

                              <div className="w-full md:w-auto placeholder:text-gray-600 text-black bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl"       >
                                  <Select
                                          className="w-full md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl pl-6 pr-3 py-3 placeholder:text-gray-600 text-black"       
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
                          <TableHead className="text-gray-100 bg-unimar">
                              {titlecoment.map((titulos)=>(
                                  <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-center text-center font-semibold ">
                                      {titulos.titulo}
                                  </TableHeaderCell>
                              ))}
                          </TableHead>

                          <TableBody className="bg-white divide-y divide-gray-200">
                              {posts.map((data)=>(
                                  <TableRow key={data.id} className="hover:bg-gray-100 text-center cursor-pointer"
                                    onClick={()=>handleVerDetalle(data)}
                                  >
                                              <TableCell className="font-bold">{data.autor}</TableCell>
                                              <TableCell className="overflow-hidden"><p>{data.comentario_extracto}</p></TableCell>
                                              <TableCell>{data.fecha_creacion}</TableCell>
                                              <TableCell className="place-items-center">
                                                <p  className={`
                                                    inline-block items-center rounded-full px-4 py-2 text-sm font-semibold ${
                                                    data.estado === 'privado' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-200 text-gray-800'

                                                }`}>
                                                      {data.estado ? data.estado.charAt(0).toUpperCase() + data.estado.slice(1) : ''}
                                                </p>
                                              </TableCell>
                                              <TableCell className="space-x-2 flex justify-evenly text-white">
                                                  {buttons.map((btn)=>(
                                                      <React.Fragment key={btn.id}>
                                                          {btn.id===3 &&(
                                                            <div key={btn.id}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                }}
                                                            >
                                                                <Button className={`btn rounded-lg cursor-pointer size-12 ${btn.id ===3? 'hover:bg-rose-300/50':'hidden'}`}
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
                                                          )}
                                                      </React.Fragment>
                                                  ))}
                                              </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table> 
                  </div>

              </section>

            {/* --- El Modal autores --- */}
            {isModalOpen && (
                <DetalleSubs
                    entryData={selectedEntry}
                    userData={selectedComent}
                    isLoading={loadingModal}
                    state={isModalOpen===true ? true:false}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
      </div>        
    </div>
  )
}


interface ModalPropsSubs {
    entryData: ApiList | null;
    userData: APIcoment | null;
    isLoading: boolean;
    state:boolean;
    onClose: () => void;
}

function DetalleSubs({ entryData, userData, isLoading, onClose, state }: ModalPropsSubs) {
    if (!entryData) return null;

    return (
        <Modal state={state}>
            <ContainModal className='bg-white text-black'>
                <HeaderModal className="flex-none" onClose={onClose}>
                    <div className="text-start">
                        <h2 className="ml-5 title">Comentarios</h2>
                    </div>
                </HeaderModal>
                <div > {/* Fondo oscuro */}
                    <div > {/* Contenido del modal */}
                        
                        {/* 1. Información del autor */}
                        <p><strong>Fecha de publicación:</strong> {entryData.fecha_creacion}</p>
                        <p><strong>Comentario en estado:</strong> {entryData.estado}</p>
                        <hr />

                        {/* 2. Información del EQUIPO/JUGADOR (la que buscamos) */}
                        {isLoading ? (
                            <p>Cargando detalles del autor...</p>
                        )  : userData ? (
                            // Caso Equipo
                            <div>
                                <h3>Información del autor</h3>
                                <p><strong>Nombre:</strong> {userData.autor.nombre}</p>
                                <p><strong>Cedula:</strong> {userData.autor.cedula}</p>
                                <p><strong>Email:</strong> {userData.autor.email}</p>
                                <p><strong>Telefono:</strong> {userData.autor.telefono}</p>

                                <div>
                                    <p>{userData.comentario}</p>
                                </div>
                            </div>
                        ) : (
                            <p>No se pudieron cargar los detalles del autor.</p>
                        )}
                    </div>
                </div>
            </ContainModal>
        </Modal>
    );
}
