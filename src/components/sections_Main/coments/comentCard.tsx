'use client'
import { Avatar } from "@/types/ui_components"
import { Coment } from "@/types/comentarios"
import { motion, HTMLMotionProps, Variants } from 'framer-motion'; 

interface ComentProps extends HTMLMotionProps<'div'> {
    coment: Coment;
    index: number;
    onClick: () => void;
   
}

const cardVariants: Variants = { 
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.15,
            duration: 0.5,
            ease: "easeOut"
        },
    }),
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

export default function ComentarsCard({ coment, index, onClick, ...rest }: ComentProps) {
    
    return(
        <motion.div 
            onClick={onClick} 
            key={coment.id}
            variants={cardVariants}
            custom={index} 
            {...rest} 
            
            className={`drop-shadow-lg shadow-lg rounded-xl  duration-300 cursor-pointer p-2 text-[17px] transition-all
                         ${index % 2 ===0 ? 'bg-gray-50 scale-95 hover:scale-99 ring-univita ring-1' : 'bg-unimar text-white scale-103 hover:scale-105 ring-2 ring-white'} 
                         xl:w-1/3 flex-shrink-0
            `}
        >
            <div className={`flex-col p-2 space-y-3 w-full md:w-[40rem] xl:w-full py-6 place-content-around place-items-center `}>
                <div className="flex flex-row space-x-3 items-center w-full px-2 ">
                    <div className={`size-12 rounded-full overflow-hidden flex place-content-center-safe items-center ${index % 2 !==0 ?'bg-gray-50 border-blue-400 ring-unimar text-black': 'bg-univita text-white ring-gray-400'}`}>
                        <Avatar email={coment.name || coment.email}/>
                    </div>

                    <div className="flex flex-col items-start">
                        <h3 className="font-bold">{(coment.name ==='null' ? 'Anonimo' : (coment.name || coment.email))}</h3>
                        <span className="opacity-70">{coment.date}</span>
                    </div>
                </div>
                <p className={`line-clamp-3 xl:line-clamp-5 w-[95%] p-2 text-justify ${index % 2 ===0 ?'text-gray-600':'text-white'}`}>{coment.content.contenido}</p>
            </div> 
        </motion.div>
    );
}