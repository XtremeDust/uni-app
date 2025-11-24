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
 } from '@/types/ui_components';
import Modal_AddSport from './modal_Addsport'
import Delete_Modal from '@/components/ui/ConfirmDeleteModal';
import Modal_DetallesDeporte, { ApiSportDetail } from './modal_DetalleSport';

export interface ApiSports {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  img:string;
  equipamiento:string;
}

export interface ApiSportList {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string | null;
}

const buttons = [
    //{id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]

const titlesport = [
    {id:1,titulo:'Deporte'},
    {id:2,titulo:'Modo'},
    {id:3,titulo:'Descripción'},
    {id:5,titulo:'Acciones'},
]


export default function Table_Sports() {

      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      const [sportRegs, setSportRegs] = useState<ApiSportList[]>([]);

      const [isAddModalOpen, setIsAddModalOpen] = useState(false);
      const [editingSport, setEditingSport] = useState<ApiSports | null>(null);

      const [isDeleting, setIsDeleting] = useState(false);
      const [sportToDelete, setSportToDelete] = useState<ApiSportList | null>(null);

      //
      const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
      const [loadingModal, setLoadingModal] = useState(false);
      const [selectedSportDetail, setSelectedSportDetail] = useState<ApiSportDetail | null>(null);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

       const fetchSport = async () => {
              setLoading(true);
              setError(null);
              
              try {
                const res = await fetch(`${API_URL}/sports`);
                if (!res.ok) throw new Error(`Error HTTP: ${res.statusText}`);
                const jsonData = await res.json();
                setSportRegs(jsonData.data);
              } catch (e: any) {
                setError(e.message || "Error al cargar los deportes");
              } finally {
                setLoading(false);
              }
          };
      
          useEffect(() => {
              fetchSport();
          }, []);


  const handleDeleteClick = (sport: ApiSportList) => {
        console.log("Abriendo modal para eliminar:", sport);
        setSportToDelete(sport); 
    };

    const handleDeleteSport = async () => {
  if (!sportToDelete) return; 
  
  setIsDeleting(true);
  try {
    const res = await fetch(`${API_URL}/sports/${sportToDelete.id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      const errorData = await res.json(); 
      throw new Error(errorData.message || `Error ${res.status}: No se pudo eliminar`);
    }
    
    setSportToDelete(null); 
    fetchSport(); 
    
    alert('¡Deporte eliminado con éxito!'); 

  } catch (e: any) {
  
    console.error("Error al eliminar:", e);
    alert(e.message); 
  } finally {
    setIsDeleting(false);
  }
};

    const handleDetailsClick = async (sport: ApiSportList) => {
    setIsDetailModalOpen(true); 
    setLoadingModal(true);      
    setSelectedSportDetail(null); 

    try {
        const res = await fetch(`${API_URL}/sports/${sport.id}`);
        if (!res.ok) throw new Error(`Error en API de Deporte: ${res.statusText}`);
        const jsonData = await res.json();
        setSelectedSportDetail(jsonData.data);
    } catch (e: any) {
        console.error("Error al cargar detalles del deporte:", e);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleEditClick = async (sport: ApiSportList) => {
    console.log("Editando:", sport);
    try {
        const res = await fetch(`${API_URL}/sports/${sport.id}`);
        if (!res.ok) throw new Error('No se pudo cargar la info para editar');
        const jsonData = await res.json();
        setEditingSport(jsonData.data);
    } catch(e) {
        alert('Error al cargar datos de edición');
    }
  }
  
        const handleActionClick = (btnId: number, sport: ApiSports) => {
            if (btnId === 2) { 
                setEditingSport(sport);
            }
            if (btnId === 3) { 
                setSportToDelete(sport);
            }
        }

        const handleCloseEdit = () => {
            setEditingSport(null);
        };

        const handleRefresh = () => {
            fetchSport();
        };

    if (loading) return <p className="text-center p-4">Cargando reglas de actividad...</p>;
    if (error) return <p className="text-center p-4 text-red-600">Error: {error}</p>;


  return (
    <div className="bg-white p-6 rounded-lg shadow text-black">
        <div className="flex justify-between ">
            <h3 className="text-2xl font-bold mb-6">Deportes</h3>
            <Button className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0"
                onClick={()=>setIsAddModalOpen(!isAddModalOpen)}
            >
                <Image
                className="size-5"
                    src={'/mas.png'}
                    alt="plus"
                    width={500}
                    height={500}
                />
                <h3 className="font-semibold">Añadir Deporte</h3>
            </Button>
        </div>

        {sportRegs.length > 0 ?(
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
                        {titlesport.map((titulos)=>(
                            <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-end font-semibold ">
                                {titulos.titulo}
                            </TableHeaderCell>
                        ))}
                    </TableHead>

                    <TableBody className="bg-white divide-y divide-gray-200">
                        {sportRegs.map((data)=>(
                            <TableRow key={data.id} className="hover:bg-gray-100 text-center cursor-pointer"
                                onClick={()=>handleDetailsClick(data)}
                            >
                                <TableCell className="font-bold">{data.nombre}</TableCell>
                                <TableCell>{data.tipo}</TableCell>
                                <TableCell>{data.descripcion}</TableCell>
                                <TableCell className="space-x-2 flex justify-center gap-5 text-white">
                                    {buttons.map((btn) => (
                                        <div 
                                            key={btn.id}
                                            onClick={(e) => {
                                            e.stopPropagation();
                                            if (btn.id === 2) handleEditClick(data);
                                            if (btn.id === 3) handleDeleteClick(data);
                                            }}
                                        >
                                            <Button 
                                            className={`btn rounded-lg cursor-pointer size-12 ${
                                                btn.id === 2 ? 'hover:bg-gray-300/50' : 'hover:bg-rose-300/50'
                                            }`}
                                            >
                                            <Image
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

        {isAddModalOpen && (
            <Modal_AddSport
                state={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSportCreated={() => {
                    fetchSport();
                }}
            />

        )}
      
        {editingSport && (
            <Modal_AddSport
                state={!!editingSport} 
                onClose={handleCloseEdit}
                onSportCreated={handleRefresh}
                sportToEdit={editingSport}
            />
        )}

        {sportToDelete && (
            <Delete_Modal
                isOpen={!!sportToDelete}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que quieres eliminar el deporte "${sportToDelete.nombre}"? Esta acción no se puede deshacer.`}
                onClose={() => {
                    if (!isDeleting) setSportToDelete(null);
                }}
                onConfirm={handleDeleteSport}
                isLoading={isDeleting} 
            />
        )}

        {isDetailModalOpen && (
            <Modal_DetallesDeporte
            state={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            isLoading={loadingModal}
            sportData={selectedSportDetail}
            />
        )}

    </div>
  )
}
