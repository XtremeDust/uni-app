'use client'
import React from 'react'
import Image from 'next/image'
import {
  Modal,
  ContainModal,
  HeaderModal,
  Button
} from '@/types/ui_components'
import { useRouter } from 'next/router';

interface ApiCompetidor {
  entry_id: number | null;
  nombre: string;
  score: number | null;
}

interface ApiGames {
  id: number;
  estado: string;
  fecha: string;
  ronda: number;
  competidor_a: ApiCompetidor;
  competidor_b: ApiCompetidor;
  disciplina_nombre: string;
}

interface ModalPropsGame {
    gameData: ApiGames | null;
    isLoading: boolean;
    state: boolean;
    onClose: () => void;
    onStartArbitrate: (gameId: number) => void;
}

export default function Modal_DetallesPartido({ state, isLoading, gameData, onClose, onStartArbitrate }: ModalPropsGame) {

    const getStatusColor = (estado: string) => {
        switch(estado) {
            case 'finalizado': return 'bg-purple-600 text-white';
            case 'en partido': return 'bg-green-600 text-white';
            case 'pendiente': return 'bg-yellow-500 text-white';
            case 'cancelado': return 'bg-rose-600 text-white';
            default: return 'bg-gray-600 text-white';
        }
    };
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

    return (
        <Modal state={state}>
            <ContainModal className="bg-gray-50 max-w-3xl w-full h-[90vh] md:h-auto md:max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">               
                <div className="relative w-full flex-none ">
                    <div className="absolute top-3 right-3 z-20">
                        <HeaderModal onClose={onClose} className="text-white/90 hover:text-white hover:bg-black/20 rounded-full transition-all">
                             <></>
                        </HeaderModal>
                    </div>

                    <div className=" inset-0 flex flex-col justify-end p-6 text-black">
                        <p className="text-xs font-bold uppercase tracking-wider mb-1">
                            {gameData?.disciplina_nombre || 'Disciplina'}
                        </p>
                        <h2 className="text-xl md:text-2xl font-bold mb-2 text-start truncate">
                            {gameData ? `${gameData.competidor_a.nombre} vs ${gameData.competidor_b.nombre}` : 'Detalles del Partido'}
                        </h2>
                       
                        {gameData?.estado && (
                            <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(gameData.estado)}`}>
                                {gameData.estado}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-400 text-sm">Cargando detalles...</div>
                    ) : gameData ? (
                        <>
                             <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-gray-100 pb-2 text-center">
                                    Marcador
                                </h3>
                                <div className="flex items-center justify-between px-2 md:px-8 py-2">
                                    <div className="flex flex-col items-center text-center w-1/3">
                                        <div className="bg-blue-50 text-blue-700 font-bold text-3xl md:text-4xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl border border-blue-100 mb-2">
                                            {gameData.competidor_a.score ?? '-'}
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                                            {gameData.competidor_a.nombre}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center justify-center w-1/3">
                                        <span className="text-gray-300 font-black text-2xl italic">VS</span>
                                    </div>

                                    <div className="flex flex-col items-center text-center w-1/3">
                                        <div className="bg-red-50 text-red-700 font-bold text-3xl md:text-4xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl border border-red-100 mb-2">
                                            {gameData.competidor_b.score ?? '-'}
                                        </div>
                                        <p className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                                            {gameData.competidor_b.nombre}
                                        </p>
                                    </div>
                                </div>
                             </section>

                            <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-gray-100 pb-2">
                                    Información Técnica
                                </h3>
                               
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 text-gray-400">
                                              <Image src={'/flecha.png'} alt={'flecha'} width={25} height={25}/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Ronda</p>
                                            <p className="font-medium text-slate-700">Ronda {gameData.ronda}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 text-gray-400">
                                              <Image src={'/calendario (4).png'} alt={'calendario'} width={25} height={25}/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Fecha</p>
                                            <p className="font-medium text-slate-700">{gameData.fecha}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 text-gray-400">
                                            <Image src={'/etiqueta (2).png'} alt={'etiqueta'} width={25} height={25}/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Disciplina</p>
                                            <p className="font-medium text-slate-700">{gameData.disciplina_nombre}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    ) : (
                        <p className="text-red-500 text-center text-sm">No se pudieron cargar los detalles del partido.</p>
                    )}
                </div>

                {gameData?.estado !== 'finalizado' && 
                gameData?.competidor_a.nombre !== 'Oponente por definir' && 
                gameData?.competidor_b.nombre !== 'Oponente por definir' && (
                    
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <Button 
                            className='bg-unimar/90 hover:bg-unimar cursor-pointer text-white py-3 w-full rounded-xl font-bold text-lg shadow-md transition-transform active:scale-95 flex justify-center items-center gap-2'
                            onClick={() => {
                                if (gameData?.id) {
                                    onClose();
                                    onStartArbitrate(gameData.id);
                                }
                            }}
                        >
                            <span>Arbitrar Partido</span>
                        </Button>
                    </div>
                )}
            </ContainModal>
        </Modal>
    )
}