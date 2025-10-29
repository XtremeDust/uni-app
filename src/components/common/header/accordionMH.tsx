'use client'
import React, { useState } from "react";
import {sectionH} from "@/types/headerSection";
import Arrow from "../ArrowIcon";


function Accordeon (){

    const [isOpen, setOpen] = useState<number|null>(null);
    const StatePanel = (index:number)=>{setOpen(isOpen => isOpen===index ? null : index)};

    const [isSubOpen, setSubOpen]  = useState<number|null>(null);
    const SubStatePanel = (i:number)=>{setSubOpen(isSubOpen => isSubOpen===i ? null : i)};

    const [isSub_MenuOpen, setSub_MenuOpen]  = useState<number|null>(null);
    const Sub_MenuStatePanel = (x:number)=>{setSub_MenuOpen(isSub_MenuOpen => isSub_MenuOpen===x ? null : x)};

    return(
        <div className="p-1 text-[12px]">   
            {sectionH.map((menu, index)=>(
                <div key={menu.id} className={` grid p-1  ${isOpen===index && menu.img==="#" ? 'text-black ' :'text-gray-500'}`}>
                    {/*principal*/}
                       <a href={menu.url} className=" cursor-pointer grid grid-flow-col justify-start items-center hover:text-black"
                        onClick={( menu.img==="#"?() => StatePanel(index):()=>(null))}
                        >
                            {menu.title}                             
                                {( menu.img==="#") &&(
                                    <Arrow alt={menu.title}/>
                                )}
                        </a>

                      {/*secundario*/} 
                      {( isOpen===index && menu.img==="#")&&(
                        <div className="shadow-lg rounded-b-xl  overflow-hidden">                        
                            {menu.subsectionH?.map((sub,i)=>(    
                             <div key={sub.id} className={`p-0.5 transition-all ease-in-out overflow-hidden md:hidden ${isOpen===index  ? ' max-h-[400px] opacity-100   ' :' max-h-0 opacity-0   pointer-events-none'}`}>

                                    
                                    <a href={sub.url} className={`p-0.5 grid grid-flow-col justify-start items-center hover:text-black hover:bg-gray-300 ${isSubOpen===i && sub.img==="#" ? 'text-black bg-gray-300' :'text-gray-500'}`}
                                     onClick={( sub.img==="#"?() => SubStatePanel(i):()=>(null))}
                                    >
                                        {sub.title}
                                        {( sub.img==="#") &&(
                                            <Arrow alt={sub.title}/>

                                        )}
                                    </a>
                                                                        
                                    {/*sub secudario*/}
                                    {(isSubOpen===i && sub.img==="#")&&(
                                        <div className={` transition-all rounded-md shadow-2xl ease-in-out  md:hidden  ${isSubOpen===i ? ' max-h-[400px] opacity-100 text-black ' :' max-h-0 opacity-0 text-gray-500 pointer-events-none'}`}>
                                            {sub.subsectionH?.map((sub_menu,x)=>(                                
                                            <div key={sub_menu.id} className="p-0.5 shadow-2xl rounded-md grid overflow-hidden  ">                                                
                                                < a href={sub_menu.url} className={`p-0.5  grid grid-flow-col justify-start items-center hover:text-black hover:bg-gray-300 ${isSub_MenuOpen===x  && sub_menu.img==="#" ? 'text-black bg-gray-300' :'text-gray-500 '}`}
                                                    onClick={( sub_menu.img==="#"?() => Sub_MenuStatePanel(x):()=>(null))}
                                                >
                                                    {sub_menu.title}
                                                    {( sub_menu.img==="#") &&(
                                                        <Arrow alt={sub_menu.title}/>
                                                    )}
                                                </a>

                                                    {/*Academico*/}
                                                    {(isSub_MenuOpen===x && sub_menu.img==="#") &&(                                                    
                                                    <ul className={` px-1 transition-all ease-in-out md:hidden text-gray-500 ${isSub_MenuOpen===x ? ' max-h-[400px] opacity-100 text-black  pb-1 ' :' max-h-0 opacity-0  pointer-events-none'}`}>
                                                        <div className=" shadow-md rounded-b-lg grid overflow-hidden">

                                                        {sub_menu.subsectionH?.map((sub_submenu)=>(                                
                                                            <li key={sub_submenu.id} className=" p-1 hover:text-black hover:bg-gray-300 rounded-sm">
                                                                <a href={sub_submenu.url} className="grid grid-flow-col justify-start items-center">
                                                                    {sub_submenu.title}                                                                       
                                                                </a>                                            
                                                            </li>
                                                        ))} 
                                                        </div>
                                                    </ul>
                                                    )}                                                
                                            </div>
                                            ))} 
                                        </div>   
                                    )}

                                
                             </div>
                            ))} 
                        </div>
                      )}
                </div>
            ))}         
        </div>
    );
}

export default Accordeon