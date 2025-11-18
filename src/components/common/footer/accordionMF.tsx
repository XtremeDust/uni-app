'use client'
import React, { useState } from "react";
import {sectionFs} from "@/types/footerSection";
import Redes from "@/components/common/footer/socialMedia"
import Image from "next/image";

function Accordion(){

const [isOpen, setOpen] = useState<number | null>(null);

const StatePanel = (index:number) =>{
// (isOpen===index ? setClose(index) : setOpen(null));
 setOpen(isOpen => isOpen === index ? null : index);
 };

    return(
        <div className="grid items-center lg:hidden w-full text-white"> 
            <div className="w-full bg-white p-3">
                <Redes/>         
            </div>  
            { sectionFs.map((section, index)=>(
                <div key={index} className="">
                    <div className="border border-transparent border-b-zinc-950 ">
                    <h2 key={section.id} className="font-bold">
                        <button className="p-4 w-full cursor-pointer grid grid-cols-2 justify-items-start items-center" onClick={() => StatePanel(index)}>
                            {section.title} 
                            <Image
                                className={`grid justify-self-end invert  transition-all ${isOpen === index ? 'rotate-180':'rotate-0'}`}
                                src={'/flecha-hacia-abajo-para-navegar.png'}
                                alt="flecha"
                                width={15}
                                height={15}
                            />
                        <span className="grid justify-self-end"></span>
                        </button>    
                    </h2>
                    </div>

                    <ul className={`transition-all  ease-in-out overflow-hidden 
                        ${isOpen === index ? 'delay-100  max-h-screen opacity-100 ' : 'max-h-0 opacity-0 '}`}>                      
                                {section.subsection?.map((sub)=>(
                                    <li key={sub.id} className="p-2">
                                    <a key={sub.id} href={sub.url} className="ml-5">
                                        {sub.title}
                                    </a>
                                    </li>
                                ))} 
                                
                    </ul>
                    
                </div>
            ))}   
        </div>
    )
 }

 export default Accordion;