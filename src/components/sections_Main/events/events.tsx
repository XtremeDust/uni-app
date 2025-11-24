'use client'
import { motion } from "motion/react";
import Image from "next/image";
import Navigation from "@/components/common/navigation"
import { Button, Input, Card } from "@/types/ui_components";
import { useState, useEffect } from "react";
import { ActiveLink } from "@/components/ui/Router";

interface TournamentSummary {
    id: number;
    nombre: string;
    descripcion: string;
    img: string | null;
    inicio: string;
    fin: string;
    estado: 'proximo' | 'activo' | 'finalizado';
}

export default function Events() {

    const [tournaments, setTournaments] = useState<TournamentSummary[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);

    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const API_BASE = API_URL.replace('/api', ''); 

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                setLoadingEvents(true);
                const res = await fetch(`${API_URL}/tournaments`);
                if (!res.ok) throw new Error('Error al cargar torneos');
                
                const jsonData = await res.json();
                
                const sorted = jsonData.data.sort((a: any, b: any) => 
                    new Date(b.inicio).getTime() - new Date(a.inicio).getTime()
                ).slice(0, 4);

                setTournaments(sorted);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingEvents(false);
            }
        };

        fetchTournaments();
    }, []);

    const handleSubmitSubscription = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true); 
        setMessage(null);
        const trimmedEmail = email.trim();
        const emailRegex = /^[a-zA-Z0m9._%+-]+@unimar\.edu\.ve$/i;

        if (!trimmedEmail) {
            setMessage({ type: 'error', text: 'El correo no puede estar vacío.' });
            setIsSubmitting(false); return;
        }
        if (!emailRegex.test(trimmedEmail)) {
            setMessage({ type: 'error', text: 'Por favor, usa un correo institucional (@unimar.edu.ve) válido.' });
            setIsSubmitting(false); return;
        }

        try {
            const res = await fetch(`${API_URL}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email: trimmedEmail })
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 422 && data.errors?.email) throw new Error(data.errors.email[0]);
                throw new Error(data.message || 'Error al suscribirse.');
            }
            setMessage({ type: 'success', text: data.message });
            setEmail("");
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const iconMove = {
        initial: { rotate: 0 },
        hover: { rotate: [0, 45, -45, 0], scale: [0.8, 0.9, 0.8] },
    };

    return (
        <div className="space-y-3 mb-4">
            <section className="text-events flex flex-col text-center place-items-center mt-6 md:mt-3">
                <h3 className="title text-black">Campeonatos y Eventos Deportivos</h3>
                <p className="w-[90%] text-center text-[18px] text-gray-600">
                    Acceso inmediato a la información, resultados en vivo y la agenda completa de la acción deportiva.
                </p>
            </section>

            <section className="eventos p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center">
                {loadingEvents ? (
                    <div className="col-span-full py-10 flex flex-col items-center">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-unimar mb-2"></div>
                         <p className="text-gray-500">Cargando eventos recientes...</p>
                    </div>
                ) : tournaments.length > 0 ? (
                    tournaments.map((card) => (
                        <ActiveLink key={card.id} href={`events/${card.id}`}>
                            <Card className="relative bg-white max-w-sm cursor-pointer rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-104">
                                <div className="relative h-52 w-full">
                                    <div className={`absolute px-2 py-1 rounded-xl top-2 right-2 z-10 text-white text-xs font-bold uppercase
                                        ${card.estado === 'activo' ? 'bg-green-500' : (card.estado === 'finalizado' ? 'bg-red-500' : 'bg-orange-500')}`}>
                                        {card.estado}
                                    </div>
                                    <Image
                                        className="absolute object-cover bg-gray-200"
                                        src={card.img 
                                            ? (card.img.startsWith('http') ? card.img : `${API_BASE}${card.img}`) 
                                            : '/assets/default_event.png'} 
                                        alt={card.nombre}
                                        fill
                                    />
                                </div>
                                <div className="flex flex-col flex-grow text-black px-6 py-4 space-y-1">
                                    <h3 className="text-lg font-bold line-clamp-1">{card.nombre}</h3>
                                    <p className="line-clamp-2 text-gray-600 text-justify text-base h-12">
                                        {card.descripcion || "Sin descripción disponible."}
                                    </p>
                                    <p className="text-center text-gray-800 font-semibold text-sm mt-2">
                                        Inicio: {card.inicio} Final:{card.fin}
                                    </p>
                                </div>
                            </Card>
                        </ActiveLink>
                    ))
                ) : (
                    <div className="col-span-full text-gray-500 italic">No hay eventos recientes.</div>
                )}
            </section>

            <section className="notificar p-2 text-white">
                <motion.div className="relative text-events flex flex-col text-center place-items-center mt-6 md:mt-3 space-y-4 h-94  place-content-center rounded-xl"
                    animate={{ backgroundColor: ['#0d4564', '#0d4e90', '#0d4564'] }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                >
                    <div className="z-10 place-items-center space-y-1">
                        <h3 className="title ">¡Toma la Delantera en el Próximo Evento!</h3>
                        <p className="w-[95%] xl:w-[80%] text-center text-[18px] ">
                            Asegura tu lugar en la línea de partida. Únete ahora para recibir acceso prioritario a las inscripciones, noticias exclusivas y todos los detalles cruciales de los eventos.
                        </p>
                    </div>

                    <form className="z-10 relative bg-white rounded-lg shadow-2xl mt-3 py-6 lg:py-6.5 w-[90%] sm:w-[80%] md:w-[50%] lg:w-[33%] 2xl:w-[30%] "
                        onSubmit={handleSubmitSubscription} noValidate>
                        <Input
                            type="email"
                            placeholder="example.0123@unimar.edu.ve"
                            className="absolute z-10 top-0 inset-0 text-sm md:text-md lg:text-lg text-black rounded-lg sm:pl-5 pr-22.5 sm:pr-23 focus:ring-[1px] ring ring-univita focus:ring-gray-700 focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                        />
                        <Button
                            className="absolute contain flex px-6 cursor-pointer font-semibold z-10 right-1 top-[3px] bg-unimar text-sm md:text-[15px] sm:px-2.5 py-2 lg:py-2.5 md:px-6 rounded-lg hover:opacity-95 transition-all duration-300 place-items-center"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            <motion.div
                                variants={iconMove}
                                animate={isHovered === true ? "hover" : "initial"}
                                transition={isHovered ? { duration: 1, ease: "linear", repeat: Infinity } : {}}
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

                    {isSubmitting && <p className="z-10 text-white mt-2">Procesando...</p>}
                    {message && (
                        <p className={`z-10 ${message.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                            {message.text}
                        </p>
                    )}
                </motion.div>
            </section>

            <Navigation />
        </div>
    );
}