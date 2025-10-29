'use client'
import { HTMLAttributes, useState } from 'react';
import Image from "next/image";
import {Button} from '@/types/ui_components';
import Navigate from '@/components/ui/Router';
import { AsideProps, menu } from '@/types/dashbord/menu';

export default function AsideMobile({onNavigate, CurrentKey,...props}:AsideProps){
    
    const visibleOption = menu.slice(0, 3);
    const invisibleOptions = menu.slice(3);

    const [isOptionOpen, setOptionOpen] = useState(false);

    const handleOptions = ()=>{
        setOptionOpen(!isOptionOpen);
    }

    const [openSubmenu, setSubmenu] = useState<number | null>(null)
     const handleMenuClick = (id : number, active:boolean) =>{
        if(active){
            setSubmenu(openSubmenu===id? null:id)
        }else{
            setSubmenu(null);
            onNavigate(id);
        }
    }

    const isActive = invisibleOptions.some(item =>{
        if( item.id === CurrentKey){
            return true;
        }
        if( item.submenu){
            return item.submenu.some(sub=>sub.id===CurrentKey)
        }
    });
    
    return(
       <div className="grid grid-cols-4 justify-around items-center h-full w-full gap-1">
            {visibleOption.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => onNavigate(item.id)} 
                    className={`flex flex-col items-center justify-center p-1.5 text-xs cursor-pointer rounded-xl first:ml-1
                        ${item.id === CurrentKey ? 'text-unimar font-semibold bg-unimar/16' : 'text-gray-500 hover:bg-unimar/10'}
                    `}
                >
                    <Image src={item.img} alt={item.section} className='size-6' width={500} height={500} />
                    <span>{item.section}</span>
                </div>
            ))}
            
                <Button onClick={handleOptions} id='mas opciones'
                    className={`flex flex-col items-center justify-center p-1 text-xs cursor-pointer rounded-xl mr-1
                        ${ isOptionOpen || isActive ? 'text-unimar font-semibold bg-unimar/16' : 'text-gray-500 hover:bg-unimar/10'}
                         
                    `}
                >
                    <Image
                        src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1760923859/solicitud_1_rsmllv.png'}
                        alt='mas'
                        className='size-7 rotate-90'
                        width={500}
                        height={500}
                    />
                    <span>Más</span>
                </Button>


                {isOptionOpen&&(
                    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end" onClick={()=>handleOptions()}>
                        <div className="bg-white absolute bottom-0 h-auto w-full  shadow-2xl p-4 flex flex-col gap-1.5 ">

                        {invisibleOptions.map((item)=>(
                            <div key={item.id}>
                                <div
                                    onClick={(e) => { 
                                        if(!item.submenu){
                                            handleMenuClick(item.id, !!item.submenu); 
                                        }else{
                                                
                                            e.stopPropagation(); 
                                            handleMenuClick(item.id, !!item.submenu); 
                                        }
                                    }}
                                    className={`flex items-center gap-3 p-3 text-unimar/65 cursor-pointer rounded-lg bg-unimar/7 space-y-2
                                        ${item.id === CurrentKey ? 'bg-unimar/18 font-medium text-unimar' : 'hover:bg-unimar/11'}
                                    `}>
                                        <Image src={item.img} alt={item.section} className='size-6' width={500} height={500} />
                                        <span>{item.section}</span>
                                </div>

                                {item.submenu && item.id===openSubmenu&&(
                                    <div className={`ml-3 pl-2 pr-2 border-l border-gray-300 mt-1.5 gap-1 flex flex-col`}>
                                        {item.submenu.map((sub)=>(
                                            <div key={sub.id} className={`mt-0.5 p-3 flex items-center gap-3 text-unimar/65 bg-unimar/7 cursor-pointer rounded-lg ${CurrentKey===sub.id?'bg-unimar/18  font-medium text-unimar':'hover:bg-unimar/10'}`} 
                                                onClick={()=>{onNavigate(sub.id); setSubmenu(null); setOptionOpen(false)}}
                                            >
                                                    <Image
                                                        className='size-8'
                                                        src={sub.img}
                                                        alt={sub.section}
                                                        width={100}
                                                        height={100}
                                                    />
                                                <h3>{sub.section}</h3>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        ))}

                            <div className=' border-t pt-1.5'>
                                <Navigate href='/'>
                                    <Button className='w-full p-3 flex gap-3 items-center bg-red-200/50 hover:bg-red-200/75 text-red-700  cursor-pointer text-start rounded-lg '>
                                            <Image
                                                className='size-8'
                                                src={'/cerrar-sesion.png'}
                                                alt={'cerrar'}
                                                width={100}
                                                height={100}
                                            />                            
                                            Cerrar Sesión
                                    </Button>
                                </Navigate>
                            </div>
                        </div>
                    </div>
                )}

        </div>
    );
}
