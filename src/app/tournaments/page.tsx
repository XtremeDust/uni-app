'use client'
import { motion } from "motion/react";
import Image from "next/image";
import Navigation from "@/components/common/navigation"
import {Button, Input, Card} from "@/types/ui_components";
import {eventos} from "@/types/eventos"
import { useState } from "react";
import {ActiveLink} from "@/components/ui/Router";


export default function Events(){

 const [isHovered, setIsHovered] = useState(false);
     const iconMove = {
        initial: { rotate: 0},
        hover: { 
            rotate: [0,45,-45,0], scale:[0.8,0.9,0.8]
        },
    };
    return(
        <div className="space-y-3  bg-amber-100 size-dvh">
            <section className="text-events flex flex-col text-center place-items-center mt-6 md:mt-3">
                <h3  className="title text-black">Campeonatos y Eventos Deportivos</h3>
                <p className="w-[90%] text-center text-[18px] text-gray-600">
                    Acceso inmediato a la información, resultados en vivo y la agenda completa de la acción deportiva.
                </p>

            </section>

             <section className="eventos p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
                {eventos.slice(0,4).map((card)=>(
                    <ActiveLink key={card.id} href={`tournaments/${card.id}`}>
                        <Card  className="relative bg-white max-w-sm cursor-pointer rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-104">
                            <div className="relative h-52 w-full">
                                <div className={`absolute px-2 py-1 rounded-xl top-2 right-2 z-10 
                                    ${card.estado==='Activo'?'bg-green-500':(card.estado==='Finalizado'?'bg-red-500':'bg-orange-500')}`}>
                                {card.estado}
                                </div>
                                <Image
                                    className="absolute object-cover bg-gray-200"
                                    src={card.img}
                                    alt="img"
                                    fill
                                />
                            </div>
                            <div className="flex flex-col flex-grow text-black px-6 py-4 space-y-1">
                                <h3 className="text-lg font-bold line-clamp-1">{card.title}</h3>
                                <p className=" line-clamp-2 text-gray-600 text-justify text-base">{card.contenido}</p>
                                <p className="text-center text-gray-8">{card.fecha}</p>
                            </div>
                        </Card>
                    </ActiveLink>
                ))}
             </section>
        </div>
    );
}

{/*
    para navegar dentro de eventos
                    <div className={`flex flex-col md:flex-row gap-1 bg-gray-300 p-2 rounded-full transition-all duration-300 w-full sm:w-[75%] md:w-auto`}>
                        <Button className={`flex gap-2 place-items-center md:place-content-center transition-all duration-300 ease-in-out text-[17px] btn bg-transparent text-gray-500`}>
                         todos
                        </Button>
                        <Button className={`flex gap-2 place-items-center md:place-content-center transition-all duration-300 ease-in-out text-[17px] btn bg-transparent text-gray-500`}>
                         futbol
                        </Button>
                        <Button className={`flex gap-2 place-items-center md:place-content-center transition-all duration-300 ease-in-out text-[17px] btn bg-transparent text-gray-500`}>
                         Basquet
                        </Button>
                        <Button className={`flex gap-2 place-items-center md:place-content-center transition-all duration-300 ease-in-out text-[17px] btn bg-transparent text-gray-500`}>
                         Voleibal
                        </Button>
                        <Button className={`flex gap-2 place-items-center md:place-content-center transition-all duration-300 ease-in-out text-[17px] btn bg-transparent text-gray-500`}>
                         Tenis de Mesa
                        </Button>
                </div>

    */}