'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Navigation from "@/components/common/navigation";
import SportInfo from "../offerts/sportinfo";
import { Card, Button } from "@/types/ui_components";

interface ApiSportRegulation {
    id: number;
    deporte: {
        id: number;
        nombre: string;
        img:string;
    };
    reglamento: {
        id: number;
        titulo: string;
        archivo_url: string;
        alcance: string;
    };
}

export function Sport() {

    const [sportList, setSportList] = useState<ApiSportRegulation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const getSportImage = (sportName: string) => {
        const imageMap: Record<string, string> = {
            'Fútbol Sala': 'https://res.cloudinary.com/dnfvfft3w/image/upload/v17600000/futsal.png', // Ejemplo
            'Baloncesto': '/assets/basketball.png', 
            'Voleibol': '/assets/volleyball.png',
        };
        return imageMap[sportName] || '/assets/default_sport.png';
    };

    useEffect(() => {
        const fetchRegulations = async () => {
            try {
                setLoading(true);
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                const res = await fetch(`${API_URL}/sport-regulations`);
                
                if (!res.ok) throw new Error('Error al cargar normativas');
                
                const jsonData = await res.json();
                setSportList(jsonData.data); 
            } catch (err: any) {
                console.error("Error fetching sports:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRegulations();
    }, []);

    const handleClickSport = (id: number) => {
        setSelectedId(selectedId === id ? null : id);
    };

    const handleHovered = (id: number) => {
        setHoveredId(hoveredId === id ? null : id);
    };

    const selectedNorma = sportList.find(c => c.id === selectedId);

    const iconMove = {
        initial: { rotate: -90 },
        click: { rotate: 90 },
        hover: { rotate: 25 }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <p className="text-xl animate-pulse text-unimar font-bold">Cargando Normativas...</p>
        </div>
    );

    if (error) return <div className="text-center text-red-500 p-10">Error: {error}</div>;

    return (
        <>
            <section className="encabezado text-black flex flex-col gap-1 px-5 text-center">
                <h2 className="title">Normativas, guías y reglamentos</h2>
                <span className="text-sm md:text-lg">
                    Toda gran experiencia comienza con reglas claras y justas. Accede de inmediato a las guías...
                </span>
            </section>

            <section className="Cartas place-items-center place-content-center px-6 py-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5 ">
                {sportList.map((norma) => (
                    <React.Fragment key={norma.id}>
                        <Card className={`relative w-full md:max-w-md lg:max-w-lg xl:max-w-lg 2xl:max-w-xl cursor-pointer rounded-lg overflow-hidden transform transition-all duration-300 ${selectedId === norma.id ? 'scale-104 bg-white shadow-blue-200 shadow-lg' : ' bg-white hover:scale-102 shadow-xl'}`}>
                            <Button 
                                className='w-full flex items-center text-start p-2 px-3 cursor-pointer' 
                                onClick={() => handleClickSport(norma.id)} 
                                onMouseEnter={() => handleHovered(norma.id)} 
                                onMouseLeave={() => handleHovered(norma.id)}
                            >
                                <div className="relative size-18">
                                    <Image
                                        className="bg-unimar rounded-full ring-4 ring-blue-200/80 "
                                        src={  norma.deporte.img || '/deporte (2).png'}
                                        alt={norma.deporte.nombre}
                                        width={100}
                                        height={100}
                                    />
                                </div>
                                <div className="flex flex-col flex-grow text-black px-6 py-4 space-y-1">
                                    <h3 className="text-lg font-bold line-clamp-1">{norma.deporte.nombre}</h3>
                                    <p className=" line-clamp-2 text-gray-600">Consultar el reglamento</p>
                                </div>
                                <motion.div className="w-5 m-1 lg:mr-3 -rotate-90"
                                    variants={iconMove}
                                    animate={
                                        selectedId === norma.id ? 'click' : (hoveredId === norma.id ? 'hover' : 'inicial')
                                    }
                                >
                                    <Image
                                        src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'}
                                        alt="flecha"
                                        width={100}
                                        height={100}
                                    />
                                </motion.div>
                            </Button>
                        </Card>
                        
                        <div className={`Informacion transition-all duration-300 place-content-center place-items-center ${selectedNorma && selectedId === norma.id ? ' max-h-screen opacity-100 block  md:hidden p-4' : 'max-h-0 opacity-0 md:hidden'}`}>
                            {selectedNorma && (
                                <SportInfo
                                    card={{
                                        id:norma.id,
                                        sport:norma.deporte.nombre,
                                        reglamento:norma.reglamento.id,
                                        img:norma.deporte.img || 'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759284280/Copilot_20250930_220402_vgzud9.png',
                                        urlA: norma.reglamento.archivo_url
                                    }} 
                                />
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </section>

            <section className={` transition-all place-content-center place-items-center duration-700 linear ${selectedNorma ? ' max-h-screen opacity-100 hidden md:block p-4' : 'hidden md:block max-h-0 opacity-0'}`}>
                {selectedNorma && (
                    <SportInfo
                        card={{
                            id: selectedNorma.id,
                            reglamento:selectedNorma.reglamento.id,
                            sport: selectedNorma.deporte.nombre,
                            img: selectedNorma.deporte.img,
                            urlA: selectedNorma.reglamento.archivo_url
                        }}
                    />
                )}
            </section>

            <Navigation />
        </>
    );
}

export default Sport;