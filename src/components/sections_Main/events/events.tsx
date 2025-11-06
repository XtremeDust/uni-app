'use client'
import { motion } from "motion/react";
import Image from "next/image";
import Navigation from "@/components/common/navigation"
import {Button, Input, Card} from "@/types/ui_components";
import {eventos} from "@/types/eventos"
import { useState } from "react";
import {ActiveLink} from "@/components/ui/Router";



export default function Events(){

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleSubmitSubscription = async (e: React.FormEvent) => {
        e.preventDefault(); // Evita que la página se recargue
        setIsLoading(true);
        setMessage(null);

        const trimmedEmail = email.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@unimar\.edu\.ve$/i;

   if (!trimmedEmail) {
        setMessage({ type: 'error', text: 'El correo no puede estar vacío.' });
        setIsLoading(false);
        return;
    }

    if (!emailRegex.test(trimmedEmail)) {
        setMessage({ type: 'error', text: 'Por favor, usa un correo institucional (@unimar.edu.ve) válido.' });
        setIsLoading(false);
        return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    try {
        const res = await fetch(`${API_URL}/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email: trimmedEmail })
        });

        const data = await res.json();

        if (!res.ok) {
            if (res.status === 422 && data.errors?.email) {
                throw new Error(data.errors.email[0]);
            }
            throw new Error(data.message || 'Error al suscribirse.');
        }

            setMessage({ type: 'success', text: data.message });
            setEmail("");

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsLoading(false);
        }
    };

     const iconMove = {
        initial: { rotate: 0},
        hover: { 
            rotate: [0,45,-45,0], scale:[0.8,0.9,0.8]
        },
    };
    return(
        <div className="space-y-3 mb-4">
            <section className="text-events flex flex-col text-center place-items-center mt-6 md:mt-3">
                <h3  className="title text-black">Campeonatos y Eventos Deportivos</h3>
                <p className="w-[90%] text-center text-[18px] text-gray-600">
                    Acceso inmediato a la información, resultados en vivo y la agenda completa de la acción deportiva.
                </p>

            </section>

             <section className="eventos p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
                {eventos.slice(0,4).map((card)=>(
                    <ActiveLink key={card.id} href={`events/${card.id}`}>
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

            <section className="notificar p-2 text-white">
                <motion.div className="relative text-events flex flex-col text-center place-items-center mt-6 md:mt-3 space-y-4 h-94  place-content-center rounded-xl"
                    animate={{
                        backgroundColor:['#0d4564','#0d4e90','#0d4564'],
                    }}
                    transition={{
                            duration:3,
                            ease:"linear",
                            repeat:Infinity
                    }}
                >

                    <div className="z-10 place-items-center space-y-1">
                        <h3  className="title ">¡Toma la Delantera en el Próximo Evento!</h3>
                        <p className="w-[95%] xl:w-[80%] text-center text-[18px] ">
                        Asegura tu lugar en la línea de partida. Únete ahora para recibir acceso prioritario a las inscripciones, noticias exclusivas y todos los detalles cruciales de los eventos.
                        </p>
                    </div>

                    <form className="z-10  relative bg-white rounded-lg shadow-2xl mt-3 py-6 lg:py-6.5 w-[90%] sm:w-[80%] md:w-[50%] lg:w-[33%] 2xl:w-[30%] "
                        onSubmit={handleSubmitSubscription}
                        noValidate
                    >
                            
                            <Input 
                                type="email" 
                                placeholder="example.0123@unimar.edu.ve"
                                className="absolute z-10 top-0 inset-0 text-sm md:text-md lg:text-lg text-black rounded-lg sm:pl-5 pr-22.5 sm:pr-23  focus:ring-[1px] ring ring-univita focus:ring-gray-700 focus:outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                            <Button 
                                className="absolute contain flex px-6 cursor-pointer font-semibold z-10 right-1 top-[3px]  bg-unimar text-sm md:text-[15px] sm:px-2.5 py-2 lg:py-2.5 md:px-6 rounded-lg hover:opacity-95 transition-all duration-300 place-items-center"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                type="submit"
                                disabled={isLoading}
                            >
                                <motion.div 
                                    variants={iconMove}
                                    animate={isHovered===true ? "hover" : "initial"}
                                    transition={isHovered?{
                                        duration:1,
                                        ease:"linear",
                                        repeat:Infinity
                                    }:{}}
                                >
                                    <Image
                                        className="object-cover"
                                        src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759070639/el-sonar_cgjz7t.png'}
                                        alt="notificacion"
                                        height={10}
                                        width={26}
                                        
                                    />

                                </motion.div >
                                
                            </Button>
                    </form>

                    {isLoading && (
                        <p className="z-10 text-white mt-2">Procesando...</p>
                    )}
                    {message && (
                        <p className={`z-10 ${
                            message.type === 'success' ? 'text-green-300' : 'text-red-300'
                        }`}>
                            {message.text}
                        </p>
                    )}
                    
                </motion.div>   
            </section>

             <Navigation/>
        </div>
    );
}