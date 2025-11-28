 "use client"

 'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
 import Btcomment from "@/components/sections_Main/coments/ButtonComent";
 import ComentCard from "@/components/sections_Main/coments/comentCard";
 import { Coment } from "@/types/comentarios"; // Asegúrese que esta interfaz es correcta
 import { coments } from "@/types/comentarios";
 import CommentModal from './comentModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function ComenSection() {
    const [allComments, setAllComments] = useState<Coment[]>([]);
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [loading, setLoading] = useState(true);

    const [selectedComment, setSelectedComment] = useState<Coment | null>(null);

    const handleCardClick = (coment: Coment) => {
        setSelectedComment(coment); // Abre el modal
    };

    const COMMENTS_PER_GROUP = 3;

    // 1. FETCH DE DATOS
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`${API_URL}/comments/public`);
                if (!res.ok) throw new Error('Error al obtener comentarios.');
                
                const json: Coment[] = await res.json();
                setAllComments(json);

            } catch (e) {
                console.error(e);
                setAllComments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, []);
const CARD_TRANSITION_MS = 1000;
const TOTAL_ROTATION_TIME_MS = 7000; // 7 segundos

const [isTransitionOut, setIsTransitionOut] = useState(false); // Controla la salida (Fade Out)

// 2. LÓGICA DE ROTACIÓN
useEffect(() => {
    if (allComments.length < COMMENTS_PER_GROUP) return;

    const totalGroups = Math.ceil(allComments.length / COMMENTS_PER_GROUP);

    const interval = setInterval(() => {
        // --- 1. Iniciar Desvanecimiento de Salida (Fade Out) ---
        setIsTransitionOut(true); 
        
        // --- 2. Esperar el Fade Out completo antes de cambiar los datos ---
        const dataChangeTimeout = setTimeout(() => {
            setCurrentGroupIndex(prevIndex => (prevIndex + 1) % totalGroups);
            setIsTransitionOut(false); // Reinicia el estado, forzando la reaparición (Fade In)
        }, CARD_TRANSITION_MS + 100); // Espera 100ms extra para asegurar el fin de la animación

        return () => clearTimeout(dataChangeTimeout);
    }, TOTAL_ROTATION_TIME_MS);

    return () => clearInterval(interval);
}, [allComments.length]);

    // 3. SELECCIÓN DE COMENTARIOS A MOSTRAR
    const startIndex = currentGroupIndex * COMMENTS_PER_GROUP;
    const currentComments = allComments.slice(startIndex, startIndex + COMMENTS_PER_GROUP);

    // 4. VALIDACIÓN DE ESTADOS
    const showPlaceholder = allComments.length === 0 && !loading;
    const canRotate = allComments.length >= COMMENTS_PER_GROUP;

    // COMPONENTE PLACEHOLDER SI NO HAY COMENTARIOS
    const PlaceholderCard = () => (
        <div className="p-10 text-center text-gray-500 bg-white rounded-xl shadow-lg border border-dashed border-gray-300 w-full xl:w-[40rem] transition-all duration-300">
            <p className="text-lg font-bold">¡Sé el primero!</p>
            <p className="text-sm">No hay comentarios públicos para mostrar. Tu voz puede ser la primera en aparecer aquí.</p>
        </div>
    );
    //elemnto para mapear de 0 a 6 elementos const commentsSubset = coments.slice(0, 6);
    //elemnto para mapear duplicar const duplicatedComments = [...commentsSubset, ...commentsSubset];
    return(
        <section className="comenSection gap-6 bg-transparent my-2 flex-col flex "> 
            <section className="flex flex-col gap-5 w-full m-0 place-items-center text-center place-content-center overflow-hidden p-1">
                <div className=" md:text-2xl flex flex-col gap-3 text-center place-items-center m-0">
                    <h3  className="text-[1.5rem] md:text-[2rem] xl:text-[2.5rem] font-bold ">Construyendo Un Futuro Deportivo Brillante</h3>
                        <p className="w-[90%] text-center text-[18px] text-gray-600">Juntos, podemos crear un deporte universitario más vibrante y lleno de vida.
                            <span className="text-univita text-[19px]"> Tu voz </span>es la energía que mueve este proyecto
                        </p>

                {/*aplicar  group a esta etiqueta para desbanecer comentarios con hover */}
                <div 
                    className={`flex flex-col xl:flex-row p-4 gap-5 transition-all duration-400 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                >
<AnimatePresence mode="wait">        
<motion.div
                        key={currentGroupIndex} // Clave que cambia con cada rotación
                        initial="hidden"
                        animate="visible"
                        exit="exit" // Define el estado de salida para AnimatePresence
                        
                        className="flex flex-col xl:flex-row p-4 gap-5 w-full justify-center"
                    >
                        {loading ? (
                            <div className="p-10">Cargando comentarios...</div>
                        ) : showPlaceholder ? (
                            <PlaceholderCard />
                        ) : (
                            // Mapeo con el componente ComentCard actualizado
                            currentComments.map((coment, index) => (
                                <ComentCard 
                                    key={coment.id} 
                                    coment={coment} 
                                    index={index}
                                    onClick={() => handleCardClick(coment)}
                                    // 🚨 Ya NO pasamos isTransitionOut
                                />
                            ))
                        )}
                    {/* Rellena con Placeholders si hay menos de 3 comentarios pero no 0 */}
                    {(!showPlaceholder && currentComments.length > 0 && currentComments.length < COMMENTS_PER_GROUP) && 
                        Array.from({ length: COMMENTS_PER_GROUP - currentComments.length }).map((_, i) => (
                            <PlaceholderCard key={`placeholder-${i}`} />
                        ))
                    }
                    </motion.div>
                    </AnimatePresence>
                
              
</div>
                <CommentModal 
                    coment={selectedComment}
                    onClose={() => setSelectedComment(null)}
                    />
                
            </div>
            </section>
            <div className="btComen place-items-center ">
                <Btcomment/>
            </div>  
        </section>
    )
 }