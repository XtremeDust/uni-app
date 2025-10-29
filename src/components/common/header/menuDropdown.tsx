'use client'
import React, {useRef, useState,useEffect} from "react";
import {sectionH} from "../../../types/headerSection";
import Arrow from "../ArrowIcon";

 export default function menuDropdown(){

    const [isOpenMenuD, setOpenMenuD] = useState<number | null>(null);
    const StateMenu = (i:number)=>{setOpenMenuD(isOpenMenuD => isOpenMenuD===i ? null : i)};

    const [isOpenSubD, setOpenSubD] = useState<number | null>(null);
    const StateSubD = (x:number)=>{setOpenSubD(isOpenSubD => isOpenSubD===x ? null : x)};

    const [isOpenSubs, setOpenSubs] = useState<number | null>(null);
    const StateSubs = (e:number)=>{setOpenSubs(isOpenSubs => isOpenSubs===e ? null : e)};

    const menuOut = useRef<HTMLLIElement>(null);
    useEffect(() => {
        function handleOutClick(event: globalThis.MouseEvent) {
            const currentMenu = menuOut.current;
            
            if (!currentMenu || !event.target || !(event.target instanceof Element)) {
                return;
            }

            if (!currentMenu.contains(event.target)) {
                setOpenMenuD(null);
                setOpenSubD(null);
                setOpenSubs(null);
            }
        }

        if (isOpenMenuD !== null) {
            document.addEventListener("mousedown", handleOutClick);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleOutClick);
        };
        
    }, [isOpenMenuD]);

    return(
        <li ref={menuOut} className="grid grid-flow-col-dense justify-end w-full gap-4 text-gray-400 xl:text-sm text-[10px]">

            {sectionH.map((list,i)=>(
                <div id={`id ${list.id}`} key={list.id} className={`relative text-[12px] ${ isOpenMenuD===i && list.img==="#"? 'text-black':'text-gray-500'}`}>
                <a key={list.id} href={list.url} className="hover:text-black flex"
                onClick={(list.img==="#" ? ()=> StateMenu(i):()=>(null))}
                >
                    {list.title}                   
                    {( list.img==="#") &&(
                    <Arrow alt={list.title} />                                         
                    )}
                </a>
    
                
                {( list.img==="#" && isOpenMenuD===i) &&(
                    <div className={`absolute left-0 top-full mt-3 rounded-md grid grid-flow-dense w-max bg-white  z-50 overflow-visible`}>
                    {list.subsectionH?.map((sublist,x)=>(
                        <div id={`id ${sublist.id} `} key={sublist.id} className={`grid grid-flow-dense relative rounded-md ${isOpenSubD===x && sublist.img==="#" ? ' bg-gray-200 text-black':'text-gray-500'}`}>
                            <a href={sublist.url} className="grid grid-flow-col p-2 justify-between hover:bg-gray-200 rounded-md hover:text-black overflow-hidden "
                            onClick={(sublist.img==="#" ? ()=>StateSubD(x):()=>(null))}
                            >
                            {sublist.title}
                            {( sublist.img==="#") &&(
                                <div className=" rotate-270">
                                <Arrow alt={sublist.title} />                                       
                                </div>
                            )}
                            </a>
                            

                            {( sublist.img==="#" && isOpenSubD===x ) &&(
                            <div className="absolute left-full top-0 ml-0.5 w-max z-40 overflow-visible rounded-md bg-white">
                            {sublist.subsectionH?.map((Subsublist,e)=>(
                                <div key={Subsublist.id} className={`grid grid-flow-dense relative ${isOpenSubs===e && Subsublist.img==="#" ? ' rounded-md bg-gray-200 text-black':'text-gray-500'}`}>
                                <a href={Subsublist.url} className={`grid grid-flow-col p-1.5 pe-5 justify-between rounded-md hover:bg-gray-200 hover:text-black  `}
                                onClick={(Subsublist.img==="#"? ()=>StateSubs(e):()=>(null) )}
                                >
                                    {Subsublist.title}
                                    {( Subsublist.img==="#") &&(
                                        <div className=" rotate-270">
                                            <Arrow alt={Subsublist.title} />                                       
                                        </div>                                         
                                    )}
                                </a>
    

                                {(Subsublist.img==="#" && isOpenSubs===e)&&(
                                    <div className=" absolute left-full top-0 ml-0.5 w-max overflow-visible rounded-md bg-white">
                                    {Subsublist.subsectionH?.map((endlist)=>(
                                        <div key={endlist.id} className="grid grid-flow-dense relative">
                                        <a href={endlist.url} className=" grid grid-flow-col p-1.5 pe-5 justify-between hover:bg-gray-200 hover:text-black rounded-md ">
                                            {endlist.title}
                                        </a>
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
                )}                      
                </div>
            ))}

        </li>
        
    );
 }