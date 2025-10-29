import React from 'react'
import Image from 'next/image'
import { motion } from "motion/react";
import {Card} from "@/types/ui_components";
import {beneficios} from "@/types/sports"

 export default function benefit() {
   return (
        <section className="flex flex-col p-3 space-y-12 text-black place-content-center place-items-center text-center m-0">
            <div className="mb-5 place-content-center place-items-center">
                <h3 className='title text-gray-800'>¡Inscríbete a Tiempo y Asegura tu Éxito!</h3>
            </div>
                
                <div className=" flex flex-col w-full">
                {beneficios.map((en)=>(
                    <Card key={en.id} 
                        className=" group text-center m-0">
                        <motion.div
                            className=" flex place-content-center"
                            animate={{scale:0.9}}
                            whileHover={{scale:0.9}}
                            transition={{
                                duration:0.3,
                                ease:"easeInOut",
                            }}
                        >
                            <div className="flex md:gap-6 gap-3 w-full md:w-[90%] relative lg:space-y-5">
                                <div className={` z-20 transition-all duration-300 ease-in-out ${en.style} ring-6 group-hover:ring-10 p-4   size-[3rem] lg:size-[5rem] rounded-full overflow-hidden bg-${en.style}-500`}>
                                    <Image
                                        className="  scale-225 lg:scale-90 "
                                        src={en.img}
                                        alt={en.titulo}
                                        width={200}
                                        height={200}
                                    />
                                </div>
                                <div className="text-start p-6 shadow-lg w-full bg-white rounded-2xl flex flex-col gap-3 z-20">
                                    <h3 className="text-xl font-bold text-gray-900">{en.titulo}</h3>
                                    <p className=" text-gray-600 ">{en.content}</p>
                                </div>
                                <div className={`absolute ${en.style} w-1 h-[80%] lg:h-[100%] left-5 lg:left-8.5   z-10`}/>
                            </div>
                        </motion.div>
                    </Card>
                ))}
                </div>
                
        </section>
   )
 }
 