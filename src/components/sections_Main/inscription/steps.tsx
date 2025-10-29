import React from 'react'
import {Card} from "@/types/ui_components";
import {pasos} from "@/types/sports"
import Image from "next/image";
import { motion} from "motion/react";

export default function steps() {
  return (
    <section className="flex flex-col p-3 space-y-12 text-black place-content-center place-items-center text-center m-0">
        <div className="mb-5 place-content-center place-items-center">
            <h3 className='title text-gray-800'>Tu Enfoque: Más Acción, Más Libertad</h3>
            <p className="text-sm md:text-lg w-sm md:w-md xl:w-lg 2xl:w-2xl text-gray-600 text-center">Nuestro proceso de registro te libera de tareas para que puedas dedicarte por completo a la victoria: competir y entrenar.</p>
        </div>
            
            <div className=" flex flex-wrap w-full justify-evenly gap-3">
            {pasos.map((en)=>(
                <Card key={en.id} 
                    className=" group block place-items-center place-content-center text-center gap-3 m-0">
                    <motion.div
                        className=" place-items-center"
                        animate={{scale:0.9}}
                        whileHover={{scale:1.0}}
                        transition={{
                            duration:0.3,
                            ease:"easeInOut",
                        }}
                    >
                            <div className="transition-all duration-300 ease-in-out ring-blue-200 ring-6 group-hover:ring-10 p-4 bg-unimar bg mb-4 w-[9rem] rounded-full overflow-hidden">
                            <Image
                                className=" p-2 md:p-0 scale-70"
                                src={en.img}
                                alt={en.paso}
                                width={200}
                                height={200}
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{en.id}. {en.paso}</h3>
                            <p className="text-sm md:text-lg text-gray-600 w-sm">{en.content}</p>
                        </div>
                    </motion.div>
                </Card>
            ))}
            </div>
    </section>
  )
}
