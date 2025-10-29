'use client'
import { useState } from 'react';
import Image from "next/image";
import {Button} from '@/types/ui_components';
import Navigate from '@/components/ui/Router'
import { AsideProps, menu } from '@/types/dashbord/menu';
import { AnimatePresence, motion } from 'framer-motion';


export default function Aside({onNavigate, isExpanded,  handleMouseLeave, handleMouseEnter ,CurrentKey,...props}:AsideProps){
     
    const [openSubmenu, setSubmenu] = useState<number | null>(null)
     const handleMenuClick = (id : number, active:boolean) =>{
        if(active){
            setSubmenu(openSubmenu===id? null:id)
        }else{
            onNavigate(id);
            setSubmenu(null);
        }
    }


    
    return(
        <div  {...props} 
            onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
            className={`text-black bg-white flex-col relative hidden lg:flex lg:row-span-full shadow-2xl overflow-hidden group transition-all duration-300 ease-in-out ${isExpanded === true ? 'w-[250px]':'w-[65px]'}`}>
            <section className='absolute top-0 justify-content-center overflow-hidden ml-0.5'>
                <div className=' h-16 overflow-hidden px-2 flex items-center gap-3 cursor-pointer'>
                    <div>
                        <Image
                        className='size-10 ml-1'
                        src={'/isoTipo.png'}
                        alt='logo'
                        width={500}
                        height={500}
                        />
                    </div>

                    <AnimatePresence>
                        {isExpanded&&(
                            <motion.div
                                key={'logotipo'}
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }} 
                                transition={{ duration: 0.15 }}
                                className='overflow-hidden'
                            >
                                 <Image
                                    className='w-33 h-11'
                                    src={'/LogoTipo.png'}
                                    alt='logo'
                                    width={500}
                                    height={500}
                                    />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className=' mt-0.5 px-1 border-t pt-1.5 border-gray-300 '>
                    {menu.map((aside)=>(
                        <div key={aside.id}>
                            <div className={`mt-0.5 p-3 flex items-center gap-3 hover:bg-unimar/15 cursor-pointer rounded-lg ${CurrentKey===aside.id || aside.submenu?.some(sub => sub.id === CurrentKey) ?'bg-unimar/15 font-medium text-unimar':' grayscale-95'} `} onClick={()=>handleMenuClick(aside.id, !!aside.submenu)} >
                                    <Image
                                        className='size-6 ml-0.5'
                                        src={aside.img}
                                        alt={aside.section}
                                        width={100}
                                        height={100}
                                    />
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.h3
                                                key={`text-${aside.id}`} 
                                                initial={{ opacity: 0, x: -10 }} 
                                                animate={{ opacity: 1, x: 0 }} 
                                                exit={{ opacity: 0, x: -10 }} 
                                                transition={{ duration: 0.15 }}
                                                className="whitespace-nowrap overflow-hidden"
                                            >
                                                {aside.section}
                                            </motion.h3>
                                        )}
                                    </AnimatePresence>

                                    {aside.submenu&&(
                                        <motion.div 
                                        className={`w-2.5 ${!isExpanded ? 'mr-0' : 'mr-'}`}
                                             animate={{
                                                rotate:aside.id===openSubmenu?0:90,
                                                opacity:isExpanded?1:0,
                                             }}
                                             transition={{
                                                duration:0.15,
                                                ease:"easeInOut"
                                             }}
                                        >
                                            <Image  
                                                src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'}
                                                alt="flecha"
                                                width={100}
                                                height={100}
                                            />
                                        </motion.div>
                                    )}
                            </div>

                        {aside.submenu && aside.id===openSubmenu&&(
                            <div className="border-gray-300 space-y-1 mt-1">
                                {aside.submenu.map((sub)=>(
                                    <div key={sub.id} className={`mt-0.5 p-3 flex items-center gap-3 hover:bg-unimar/15 cursor-pointer rounded-lg ${CurrentKey===sub.id?'bg-unimar/15 font-medium text-unimar':' grayscale-95'}`} onClick={()=>onNavigate(sub.id)} >
                                        <Image
                                            className='size-6'
                                            src={sub.img}
                                            alt={sub.section}
                                            width={100}
                                            height={100}
                                        />
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.h3
                                                key={`text-${sub.section}`} 
                                                initial={{ opacity: 0, x: -10 }} 
                                                animate={{ opacity: 1, x: 0 }} 
                                                exit={{ opacity: 0, x: -10 }} 
                                                transition={{ duration: 0.2 }}
                                                className="whitespace-nowrap overflow-hidden"
                                            >
                                                {sub.section}
                                            </motion.h3>
                                        )}
                                    </AnimatePresence>                                        
                                </div>
                                ))}
                            </div>
                        )}

                        </div>
                    ))}
                </div>

            </section>
            <section className='absolute bottom-3 left-1 right-1 mt-0.5 border-t pt-1.5 ml-0.5 border-gray-300 '>
                <Navigate href='/'>
                    <Button className='w-full p-3 flex gap-3 items-center hover:bg-red-200 text-red-700  cursor-pointer text-start rounded-lg '>
                        <Image
                            className='size-6 ml-1'
                            src={'/cerrar-sesion.png'}
                            alt={'cerrar'}
                            width={100}
                            height={100}
                        />                
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.h3
                                    key={`text-exit`} 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: -10 }} 
                                    transition={{ duration: 0.15 }}
                                    className="whitespace-nowrap overflow-hidden"
                                >
                                    Cerrar Sesión
                                </motion.h3>
                            )}
                        </AnimatePresence>  
                    </Button>
                </Navigate>
            </section>
        </div>
    );
}