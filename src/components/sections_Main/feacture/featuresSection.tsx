"use client"
import Image from "next/image";
import React, {useState} from "react";
import {featS} from "@/types/feactures";

 export default function featuresS(){

    const [isHoverS, setHoverS] = useState<number|null>(null);
        const HoverS = (index:number)=>{setHoverS(isHoverS => isHoverS===index ? null : index)};

    return(
        <div className=" p-3 text-black">
            <div className=" text-[20px] md:text-3xl font-medium flex flex-col gap-1">
                <h2 className="text-[1.5rem] md:text-[2rem] xl:text-[2.5rem] font-bold">Vive la Nueva Experiencia del Deporte</h2>
                <span className="text-justify text-[16px] md:text-[18px]">Inscríbete en eventos, consulta cronogramas, accede a normativas y sigue resultados todo desde tu portal favorito. Univita centraliza las herramientas para que participar sea simple y rápido.</span>
            </div>
            <div className="flex flex-wrap justify-around space-y-1 mt-5 group">
                {featS.map((events, index)=>(
                    <a key={events.id} /*href={events.src}*/ className=" lg:h-50 w-full md:w-11/11 lg:w-[95%] xl:w-[30%]  2xl:w-[30%] rounded-2xl flex flex-col gap-1 place-content-center p-[3px] transition-all  duration-500 group-hover:opacity-50 hover:!opacity-100 hover:scale-102 lg:hover:scale-102  place-items-center overflow-hidden relative "
                        onMouseEnter={()=>HoverS(index)} onMouseLeave={()=>HoverS(index)}>

                        <div className="flex flex-col md:flex-row flex-nowrap md:justify-start xl:place-content-center  place-content-center place-items-center card group hover:bg-unimar hover:text-white bg-gray-100 size-full rounded-2xl p-3 gap-3
                            ring-unimar ring-2 hover:ring-0 transition-all z-10">
                             <div className="relative transition-all duration-300 ease-in-out
                              group-[.card:hover]:bg-gray-400 
                              overflow-hidden bg-unimar rounded-full ">
                                <Image
                                    className=" scale-80"
                                    src={events.img}
                                    width={100}
                                    height={100}
                                    alt={events.title}
                                /> 
                             </div>
                             <div className="text-center md:text-justify xl:w-md">
                                <h3 className="text-[22px] font-bold ">{events.title}</h3>                        
                                    <p>{events.text}</p>
                             </div>
                        </div>

                        <div className={` ${isHoverS===index ? 'animate-spin-gradient absolute inset-0 ':' pointer-events-none'}`}/>
                    </a>
                ))}
            </div>
        </div>
    );
 }