'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { 
  Input,
  Button, 
  Table, 
  TableBody, TableCell, TableRow,
  TableHead, TableHeaderCell,
} from '@/types/ui_components'
import Modal_EditUser from './modal_EditUser'; 
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'; 
import Modal_DetallesUser from './modal_DetallesUser';

interface UserInscriptionRow {
  user_id: number;
  nombre: string | null;
  email: string | null;
  cedula: string | null;
  telefono: string | null;
  img?: string;
  equipos: { id: number; nombre: string; disciplina: string }[];
  original_user_data: ApiUser; 
}

interface ApiUser {
  id: number;
  nombre: string | null;
  email: string | null;
  cedula: string | null;
  telefono: string | null;
}

interface ApiTeam {
  id: number;
  nombre: string;
  disciplina: string;
  integrantes_data: ApiUser[];
}

const titleintegrantes = [
    {id:1, titulo:"Usuario"},
    {id:2, titulo:"Cedula"},
    {id:4, titulo:"Telefono"},
    {id:5, titulo:"Acciones"},
]

const buttons = [
    //{id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"}, 
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]

export default function table_usuarios_inscritos() {

    const [users, setUsers] = useState<UserInscriptionRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    
    const [userToDelete, setUserToDelete] = useState<UserInscriptionRow | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [viewingUser, setViewingUser] = useState<UserInscriptionRow | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            
            const res = await fetch(`${API_URL}/teams-inscription`); 
            if (!res.ok) throw new Error(`Error al cargar usuarios: ${res.statusText}`);
            
            const jsonData = await res.json();
            processData(jsonData.data);

        } catch (e: any) {
            console.error("Error:", e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const processData = (teamsData: ApiTeam[]) => {
        const usersMap = new Map<number, UserInscriptionRow>();

        teamsData.forEach(entry => { 
            if (entry.integrantes_data) {
                entry.integrantes_data.forEach(user => {
                   
                    if (usersMap.has(user.id)) {
                        const existing = usersMap.get(user.id)!;

                        const alreadyHasTeam = existing.equipos.some(t => t.id === entry.id);
                        if (!alreadyHasTeam) {
                             existing.equipos.push({ 
                                id: entry.id, 
                                nombre: entry.nombre, 
                                disciplina: entry.disciplina || 'N/A'
                            });
                        }
                    } else {
                        usersMap.set(user.id, {
                            user_id: user.id,
                            nombre: user.nombre || 'Sin Nombre',
                            email: user.email,
                            cedula: user.cedula,
                            telefono: user.telefono,
                            img: (user as any).img,
                            equipos: [{ 
                                id: entry.id, 
                                nombre: entry.nombre,
                                disciplina: entry.disciplina || 'N/A'
                            }],
                            original_user_data: user
                        });
                    }
                });
            }
        });
        
        setUsers(Array.from(usersMap.values()));
    };

    useEffect(() => {
        fetchAllData();
    }, []); 


    const handleEditClick = (row: UserInscriptionRow) => {
        console.log("Editando usuario:", row.original_user_data);
        setEditingUser(row.original_user_data);
        setIsEditOpen(true);
    };

    const handleDeleteClick = (row: UserInscriptionRow) => {
        setUserToDelete(row);
    };

    const handleConfirmDelete = async () => {
        if(!userToDelete) return;
        setIsDeleting(true);
        alert("eliminar usuario pendiente de endpoint.");
        setIsDeleting(false);
        setUserToDelete(null);
    };

    const handleClickUser = (row: UserInscriptionRow) => {
        console.log("Viendo detalles de:", row);
        setViewingUser(row);
        setIsDetailOpen(true);
    };


    if (loading) return <p className="text-center p-4">Cargando usuarios...</p>;
    if (error) return <p className="text-center p-4 text-red-600">Error: {error}</p>;

  return (
    <section className="USERS INSRIPTION grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">

        <div className="bg-white p-6 rounded-lg shadow col-span-2">
            <h3 className="text-2xl font-bold mb-6">Usuarios Inscritos</h3>

            {users.length > 0 ?(
                <>
                    <div className="Filtro flex items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">            
                        <div className="relative w-full flex ">
                            <label htmlFor='buscar2' className="h-full place-content-center absolute left-0 px-2 pl-3.5 cursor-pointer rounded-2xl">
                                <Image className="size-8" src={'/lupa.png'} alt="buscar" width={60} height={60} />
                            </label>
                            <Input type="text" id="buscar2" className="bg-gray-50 focus:ring-[1px]  focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-18 pr-3 py-3" placeholder="Buscar" required/>
                            <Button className="h-full items-center px-2 pr-4 absolute right-0 rounded-2xl cursor-pointer ">
                                <Image className="size-4" src={'/cerca.png'} alt="buscar" width={60} height={60} />
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
                            {users.map((data, index)=>(
                                <TableRow key={`${data.user_id}-${index}`} 
                                className="hover:bg-gray-100 text-center cursor-pointer transition-colors" 
                                onClick={() => handleClickUser(data)}>
                                    
                                    <TableCell className="font-bold">
                                        <div className="flex items-center gap-3 justify-center md:justify-start">
                                            <div className="relative size-10 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
                                                <Image 
                                                    src={data.img 
                                                        ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${data.img}`
                                                        : '/persona.png'} 
                                                    alt="avatar"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span>{data.nombre}</span>
                                                <span className="text-xs text-gray-500">{data.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell>{data.cedula}</TableCell>
                                    <TableCell>{data.telefono}</TableCell>
                                    
                                    <TableCell className="space-x-2 flex justify-evenly text-white">
                                        {buttons.map((btn)=>(
                                            <div key={btn.id} onClick={(e) => {
                                                e.stopPropagation();
                                                if (btn.id === 2) handleEditClick(data);
                                                if (btn.id === 3) handleDeleteClick(data);
                                            }}>
                                                <Button className={`btn rounded-lg cursor-pointer size-12 ${btn.id ===1? 'hover:bg-unimar/10' : (btn.id===2? 'hover:bg-gray-300/50': 'hover:bg-rose-300/50' )}`}>
                                                    <Image className='scale-110' src={btn.img} alt={btn.button} width={500} height={500} />
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
                    <p className='pb-2'>No se han inscrito usuarios</p>
                    <hr className='bg-unimar w-full'/>
                </div>
            )}
        </div>

        {isEditOpen && editingUser && (
            <Modal_EditUser
                state={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                userToEdit={editingUser}
                onSaveSuccess={fetchAllData}
            />
        )}

        {userToDelete && (
            <ConfirmDeleteModal
                isOpen={!!userToDelete}
                title="Eliminar Usuario"
                message={`¿Desea eliminar a ${userToDelete.nombre}?`}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
            />
        )}

        {isDetailOpen && viewingUser && (
            <Modal_DetallesUser
                state={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                user={viewingUser}
            />
        )}

    </section>
  )
}