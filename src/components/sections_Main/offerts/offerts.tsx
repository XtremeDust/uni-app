'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Card from "../../ui/Card"; 
import Navigation from "../../common/navigation";
import { Button } from "@/types/ui_components";

import Modal_DetallesDeporte, { ApiSportDetail } from "./modalViewSport"; 

interface SportCardSummary {
    id: number;
    title: string;      
    src: string;        
    descrip: string;    
}

export function Offers() {

    const [sportsList, setSportsList] = useState<SportCardSummary[]>([]);
    const [loadingList, setLoadingList] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSport, setSelectedSport] = useState<ApiSportDetail | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const getSportImage = (sportName: string) => {
        const imageMap: Record<string, string> = {
            'Futbol Sala': 'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759284280/Copilot_20250930_220402_vgzud9.png',
            'Basquet': 'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759284625/Copilot_20250930_220959_wjpnk7.png',
            'Voleibol': 'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759284988/Copilot_20250930_221605_ghc2vh.png',
            'Beisbol 5': 'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759285152/Copilot_20250930_221834_jnzebo.png',
            'Tenis de Mesa': 'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759285354/Copilot_20250930_222225_m97fmu.png',
            'Kickingball': 'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759285576/Copilot_20250930_222557_p5l3ux.png',
            'Karate-Do': 'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759285806/Copilot_20250930_222948_joqoag.png',
            'Beisbol':'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759284625/Copilot_20250930_220959_wjpnk7.png',
            'Pickleball':'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759284625/Copilot_20250930_220959_wjpnk7.png',
            'Softball':'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759284625/Copilot_20250930_220959_wjpnk7.png',
        };
        return imageMap[sportName] || '/assets/default_sport.png';
    };

    useEffect(() => {
        const fetchSports = async () => {
            try {
                setLoadingList(true);
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                const res = await fetch(`${API_URL}/sports`);
                
                if (!res.ok) throw new Error('Error al cargar ofertas');
                const jsonData = await res.json();
                
                const adaptedData: SportCardSummary[] = jsonData.data.map((item: any) => ({
                    id: item.id,
                    title: item.nombre,
                    src: item.logo_url 
                        ? (item.logo_url.startsWith('http') ? item.logo_url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${item.logo_url}`)
                        : getSportImage(item.nombre), 
                    descrip: item.descripcion || "Sin descripción disponible.",
                }));

                setSportsList(adaptedData);
            } catch (error) {
                console.error("Error fetching sports:", error);
            } finally {
                setLoadingList(false);
            }
        };

        fetchSports();
    }, []);

    const handleOpenDetail = async (id: number) => {
        setIsModalOpen(true);
        setLoadingDetail(true); 
        setSelectedSport(null); 

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            
            const res = await fetch(`${API_URL}/sports/${id}`);
            
            if (!res.ok) throw new Error('Error cargando detalle');
            
            const jsonData = await res.json();
            
            setSelectedSport(jsonData.data); 

        } catch (error) {
            console.error("Error al cargar detalle del deporte:", error);
        } finally {
            setLoadingDetail(false);
        }
    };

    if (loadingList) return (
        <div className="flex h-96 items-center justify-center">
            <p className="text-xl font-bold text-unimar animate-pulse">Cargando Ofertas Deportivas...</p>
        </div>
    );

    return (
        <div className="space-y-3">
            <section className="place-content-center place-items-center">
                <h3 className="title">Ofertas deportivas</h3>
                <p className="text-slate-700">Encuentra la información de tu deporte favorito</p>
            </section>
            
            <section className="place-items-center space-y-3">
                <div className="w-[90%] space-y-3">
                    {sportsList.length > 0 ? (
                        sportsList.map((dep) => (
                            <Card key={dep.id} className="w-full relative bg-amber-800 h-[36rem] 2xl:h-[48rem] rounded-lg overflow-hidden">
                                <>
                                    <Image 
                                        className="bg-amber-950 absolute inset-0" 
                                        src={dep.src} 
                                        alt={dep.title} 
                                        objectFit="cover" 
                                        layout="fill"
                                    />
                                    <div className="absolute inset-0 z-10 bg-black/60" />
                                    <div className="absolute z-20 bottom-10 left-5 md:bottom-10 md:left-10 lg:left-20 lg:bottom-25 space-y-3 text-white">
                                        <h4 className="text-[3rem] m-0 font-bold uppercase">{dep.title}</h4>
                                        <p className="text-lg line-clamp-1">{dep.descrip}</p>
                                        
                                        <Button className="px-10 py-4 rounded-2xl hover:opacity-85 hover:scale-103 transition-all duration-300 ease-in-out cursor-pointer bg-unimar"
                                            onClick={() => handleOpenDetail(dep.id)}
                                        >Ver más</Button>
                                    </div>
                                </>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center p-10 text-gray-500">No hay ofertas deportivas disponibles en este momento.</div>
                    )}
                </div>
            </section>

            <section>
                {isModalOpen && (
                    <Modal_DetallesDeporte
                        state={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        isLoading={loadingDetail}
                        sportData={selectedSport}
                    />
                )}
                
                <Navigation />
            </section>
        </div>
    );
}

export default Offers;