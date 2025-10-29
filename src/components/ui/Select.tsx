'use client'
import React, { HTMLAttributes, useRef } from "react";
import {Button, Input} from "@/types/ui_components"
import Image from "next/image";

export interface DropdownOption{
    id:number;
    label:string;
    data?:any;
}

export interface SelectProps {
    options: DropdownOption[];        
    currentValue: string | null;      
    isOpen: boolean;                  
    setOpen: (isOpen: boolean) => void; 
    onSelect: ( id: number, label: string) => void; 
    placeholder: string;
    className?:string;
}




export function Select({options,currentValue,className,isOpen,setOpen,onSelect,placeholder,...props}: SelectProps){

  const menuOut = useRef<HTMLDivElement>(null); 

  const Value = currentValue === null ? placeholder : currentValue;

  const toggleDropdown = () => setOpen(!isOpen);

    return(
        <div className="relative"  ref={menuOut} onClick={toggleDropdown} {...props}>

            <Input 
                type='text'id={'custom-select'}
                className={`${className}`} 
                required 
                readOnly 
                value={Value} 
                placeholder={placeholder}
            />
                <Button type="button" className="cursor-pointer absolute right-1 md:right-1  lg:right-4 top-1/2 flex justify-center -translate-y-1/2 -translate-x-1/2 ">
                    <Image
                    className={`size-[1rem] transition-transform duration-300 ease-in-out ${isOpen ? ' rotate-180' : 'rotate-360'}`}
                    src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'}
                    alt="desplegar"
                    width={100}
                    height={100}
                    />
                </Button>

                
                   <div className={`
                        absolute z-20 bg-white shadow-lg mt-1.5 rounded-xl overflow-hidden overflow-y-auto 
                        ${isOpen ? 'w-full ' : 'max-h-0 opacity-0 pointer-events-none'}
                    `}>
                        {options.map((option) => (
                        <div 
                            key={option.id} 
                            className="w-full flex gap-2 p-2 hover:bg-unimar/15 place-items-center cursor-pointer" 
                            onClick={(e) => {
                            e.stopPropagation(); 
                            onSelect(option.id, option.label);
                            }}
                        >
                            {option.label}
                        </div>
                        ))}
                </div>                                                                    
        </div>
    );
}export default Select