'use client'
import React, { useEffect, useState, useCallback } from 'react'
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
import type { GameToEdit } from "./modal_AddGames"; 
import Modal_DetallesPartido from './moda_DetallesGame'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import MatchControlOverlay from '../games/matchControlOverlay'; 

interface ApiCompetidor{
  entry_id: number | null;
  nombre: string;
  score: number | null;
}

interface ApiGames{
  id: number;
  estado: string;
  fecha: string;
  ronda: number;
  tournament_id: number;
  tournament_nombre: string;
  disciplina_id: number;
  competidor_a: ApiCompetidor;
  competidor_b: ApiCompetidor;
  disciplina_nombre: string; 
  fecha_completa?: string; 
}

const buttons = [
    {id:1, button:"Descargar", img:"/bandeja-de-descarga.png"},
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
    
    const [allGames, setAllGames] = useState<ApiGames[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [gameToEditData, setGameToEditData] = useState<GameToEdit | null>(null);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<ApiGames | null>(null);

    const [gameToDelete, setGameToDelete] = useState<ApiGames | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [gameInPlay, setGameInPlay] = useState<ApiGames | null>(null);

    const [isEst, setSelectEst] = useState<string|null>('Todos'); 
    const [isOpenEst, setisEst] = useState(false);      

    const fetchAllGames = useCallback(async () => {
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
    }, [API_URL]);

    useEffect(() => {
        fetchAllGames();
    }, [fetchAllGames]);

    const refreshGames = () => {
        fetchAllGames(); 
    };

    const handleSelectEst = (id: number, label:string) => {
        setSelectEst(label);
        setisEst(false);
    };
    
    const dropdownEst = [ 
        ...(isEst !== 'Todos' ? [{ id: 0, label: 'Todos' }] : []), 
        {id:1,label:'Activo'},{id:2,label:'Próximo'},{id:3,label:'Finalizado'} 
    ];

    const handleOpenCreate = () => {
        setGameToEditData(null); 
        setIsFormModalOpen(true); 
    };

    const handleEditClick = (game: ApiGames) => {
        let formattedDate = "";
        let formattedTime = "00:00";
        try {
            const fechaObj = new Date(game.fecha); 
            if (!isNaN(fechaObj.getTime())) { 
                formattedDate = fechaObj.toISOString().split('T')[0];
                formattedTime = fechaObj.toTimeString().substring(0, 5);
            } else { 
                const parts = game.fecha.split(" ");
                const datePart = parts[0]; 
                const timePart = parts[1] || "00:00";
                if (datePart.includes("-")) {
                    const [d, m, y] = datePart.split("-"); 
                    if (d.length === 4) formattedDate = datePart; 
                    else formattedDate = `${y}-${m}-${d}`;
                }
                formattedTime = timePart;
            }
        } catch (e) { console.error(e); }

        const formatted: GameToEdit = {
            id: game.id,
            tournament_id: game.tournament_id,
            tournament_label: game.tournament_nombre || "Torneo",
            discipline_id: game.disciplina_id,
            discipline_label: game.disciplina_nombre || "Disciplina",
            competidor_a_id: game.competidor_a.entry_id ?? 0,
            competidor_b_id: game.competidor_b.entry_id ?? 0,
            competidor_a_label: game.competidor_a.nombre || "",
            competidor_b_label: game.competidor_b.nombre || "",
            date: formattedDate,
            time: formattedTime,
            round: game.ronda.toString(),
        };

        setGameToEditData(formatted); 
        setIsFormModalOpen(true);    
    };

    const handleDeleteClick = (game: ApiGames) => {
        setGameToDelete(game);
    };

    const handleConfirmDelete = async () => {
        if (!gameToDelete) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`${API_URL}/games/${gameToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' }
            });
            if (!res.ok) throw new Error('Error al eliminar');
            alert('¡Partido eliminado con éxito!');
            setGameToDelete(null);
            refreshGames();
        } catch (e: any) {
            alert(e.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleGameClick = (game: ApiGames) => {
        setSelectedGame(game);
        setIsDetailModalOpen(true);
    };

    const handleStartArbitration = (game: ApiGames) => {
        setIsDetailModalOpen(false); 
        setGameInPlay(game);   
    };

    const refreshTable = () => {
        console.log("Recargando datos de la tabla...");
    };

    const [showDetails, setShowDetails] = useState(false);
    const [arbitratingGameId, setArbitratingGameId] = useState<number | null>(null);

    if (loading && allGames.length === 0) return <p>Cargando todos los partidos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="Case2 overflow-y-auto text-black">
            <section className="grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="Titulo flex justify-between mb-6">
                        <h3 className="text-2xl font-bold">Partidos Deportivos</h3>
                        <Button onClick={handleOpenCreate} className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0">
                            <Image className="size-5" src={'/mas.png'} alt="plus" width={500} height={500} />
                            <h3 className="font-semibold">Añadir Partido</h3>
                        </Button>
                    </div>

                    {allGames.length > 0 ? (
                        <>
                            <div className="Filtro flex flex-col sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-2 xl:flex xl:flex-row items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
                                <div className="relative w-full flex col-span-2">
                                    <label htmlFor='buscar' className="h-full place-content-center absolute left-0 px-2 pl-3.5 cursor-pointer rounded-2xl">
                                        <Image className="size-8" src={'/lupa.png'} alt="buscar" width={60} height={60} />
                                    </label>
                                    <Input type="text" id="buscar" className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-18 pr-3 py-3" placeholder="Buscar" required/>
                                </div>
                                <div className="w-full md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl text-black">
                                    <Select className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-6 pr-3 py-3" options={dropdownEst} currentValue={isEst} isOpen={isOpenEst} setOpen={setisEst} onSelect={handleSelectEst} placeholder="Seleccione el tipo de juego" />
                                </div>                             
                                <div className="w-full md:w-auto bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl relative">
                                    <Input type="date" id="fecha" className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-3 pr-3 py-3" required/>
                                </div>
                            </div>
                            <Table className="w-full">
                                <TableHead className="text-gray-100 bg-unimar">
                                    {tituloPartidos.map((t) => <TableHeaderCell key={t.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-end font-semibold ">{t.titulo}</TableHeaderCell>)}
                                </TableHead>
                                <TableBody className="bg-white divide-y divide-gray-200">
                                    {allGames.map((data) => (
                                        <TableRow key={data.id} className="hover:bg-gray-100 text-center cursor-pointer" onClick={() => handleGameClick(data)}>
                                            <TableCell className="font-bold">{data.disciplina_nombre}</TableCell>
                                            <TableCell>{data.ronda}</TableCell>
                                            <TableCell>{data.fecha}</TableCell>
                                            <TableCell>{data.competidor_a.nombre}</TableCell>
                                            <TableCell>{data.competidor_a.score ?? '-'} vs {data.competidor_b.score ?? '-'}</TableCell>
                                            <TableCell>{data.competidor_b.nombre}</TableCell>
                                            <TableCell className="place-items-center">
                                                <p className={`inline-block items-center rounded-full px-4 py-2 text-sm font-semibold ${data.estado === 'finalizado' ? 'bg-purple-100 text-purple-800' : data.estado === 'en partido' ? 'bg-green-100 text-green-800' : data.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>
                                                    {data.estado}
                                                </p>
                                            </TableCell>
                                            <TableCell className="space-x-2 flex justify-evenly text-white">
                                                {buttons.map((btn) => (
                                                    <div key={btn.id} onClick={(e) => { e.stopPropagation(); if (btn.id === 2) handleEditClick(data); if (btn.id === 3) handleDeleteClick(data); }}> 
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
                    ) : (
                        <div className='justify-items-center text-xl font-semibold text-unimar'><p>No se han creado partidos</p></div>
                    )}

                    {isFormModalOpen && (
                        <Modal_AddGames
                            state={isFormModalOpen}
                            onClose={() => setIsFormModalOpen(false)}
                            onGameCreated={refreshGames}
                            gameToEdit={gameToEditData}
                        />
                    )} 

                    {isDetailModalOpen && selectedGame && (
                        <Modal_DetallesPartido
                            state={isDetailModalOpen}
                            isLoading={false}
                            gameData={selectedGame}
                            onClose={() => setIsDetailModalOpen(false)}
                            onStartArbitrate={(gameId) => {
                                setIsDetailModalOpen(false);
                                const game = allGames.find(g => g.id === gameId);
                                if (game) setGameInPlay(game);
                            }}
                        />
                    )}

                    {gameToDelete && (
                        <ConfirmDeleteModal
                            isOpen={!!gameToDelete}
                            title="Eliminar Partido"
                            message={`¿Estás seguro de eliminar el partido?`}
                            onClose={() => setGameToDelete(null)}
                            onConfirm={handleConfirmDelete}
                            isLoading={isDeleting}
                        />
                    )}

                    {gameInPlay && (
                        <MatchControlOverlay 
                            gameId={gameInPlay.id} 
                            onClose={() => setGameInPlay(null)} 
                            onUpdate={refreshGames} 
                        />
                    )}
                </div>
            </section>
        </div>
    );
}