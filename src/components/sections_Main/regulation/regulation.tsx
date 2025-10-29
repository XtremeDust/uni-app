'use client'
import Sports from "@/components/common/sportsCard";
import {sports} from "@/types/sports"
import { useState } from "react";
import SportInfo from "../offerts/sportinfo"
import Navigation from "@/components/common/navigation"
import React from "react";
import {Card, Button} from "@/types/ui_components";
import Image from "next/image";
import { motion } from "motion/react";

export function Sport(){

    const [isSport, setSport] = useState<number|null>(null);
    const handleClickSport=(id: number)=>{
        setSport(isSport === id ? null:id);
    };
    const Normas = sports.find(c=> c.id === isSport);

    const [isHovered, setIsHovered] = useState<number|null>(null);
        const handleHovered=(id: number)=>{
        setIsHovered(isHovered === id ? null:id);
    };
    const iconMove = {
        initial: { rotate: -90},
        click: { 
            rotate: 90,
        },
        hover:{
            rotate:25,
        }
    };

    return(
        <>
            <section className="encabezado text-black flex flex-col gap-1 px-5 text-center">
                <h2 className="title">Normativas, guías y reglamentos</h2>
                <span className="text-sm md:text-lg">
                    Toda gran experiencia comienza con reglas claras y justas. Accede de inmediato a las guías y normativas que garantizan un entorno justo, seguro y transparente. Descubre cómo tu participación suma valor al espíritu de nuestra comunidad.
                </span>
            </section>

            <section className="Cartas place-items-center place-content-center px-6 py-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-5 ">
                {sports.map((norma)=>(
                    <React.Fragment  key={norma.id}>
                        <Card className={`relative w-full md:max-w-md lg:max-w-lg xl:max-w-lg 2xl:max-w-xl cursor-pointer rounded-lg overflow-hidden transform transition-all duration-300 ${isSport  === norma.id  ?'scale-104 bg-white shadow-blue-200 shadow-lg':' bg-white hover:scale-102 shadow-xl'}`}>
                            <Button className='w-full flex items-center text-start p-2 px-3 cursor-pointer' onClick={()=>handleClickSport(norma.id)} onMouseEnter={() => handleHovered(norma.id)} onMouseLeave={() => handleHovered(norma.id)}>
                                <div className="relative size-18">
                                    <Image
                                        className="bg-unimar rounded-full ring-4 ring-blue-200/80 "
                                        src={norma.img}
                                        alt="img"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                                <div className="flex flex-col flex-grow text-black px-6 py-4 space-y-1">
                                    <h3 className="text-lg font-bold line-clamp-1">{norma.sport}</h3>
                                    <p className=" line-clamp-2 text-gray-600">Consultar el reglamento</p>
                                </div>
                                <motion.div className="w-5 m-1 lg:mr-3 -rotate-90"
                                     variants={iconMove}
                                    animate={
                                        isSport === norma.id?'click': (isHovered === norma.id?'hover':'inicial')
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
                            <div className={`Informacion transition-all duration-300 place-content-center place-items-center ${Normas && isSport === norma.id ? ' max-h-screen opacity-100 block  md:hidden p-4':'max-h-0 opacity-0 md:hidden'}`}>
                                 { Normas &&(
                                    <SportInfo
                                    card={norma}
                                    />
                                )}
                            </div>  
                    </React.Fragment>
                ))}
                {/*{sports.map((card)=>(
                   <React.Fragment key={card.id}>
                        <Sports 
                            key={card.id}
                            card={card}
                            className=" w-sm sm:w-[70%] md:w-[30%] md:h-[12rem] h-[14rem] xl:w-[30%] 2xl:w-2/11 drop-shadow-md"
                            state={isSport === card.id}
                            onClick={()=>handleClickSport(card.id)}
                        />

                        <div className={`Informacion transition-all duration-500 place-content-center place-items-center ${CardA && isSport === card.id ? ' max-h-screen opacity-100 block  md:hidden p-4':'max-h-0 opacity-0 md:hidden'}`}>
                            <SportInfo
                                card={card}
                            />
                        </div>
                    </React.Fragment>
                ))}*/}
            </section>
            
                <section className={` transition-all place-content-center place-items-center duration-700 linear ${Normas ? ' max-h-screen opacity-100 hidden md:block p-4':'hidden md:block max-h-0 opacity-0'}`}>
                    { Normas &&(
                        <SportInfo
                        card={Normas}
                        />
                    )}
                </section>
            


            <Navigation/>  
        </>
    );
}export default Sport