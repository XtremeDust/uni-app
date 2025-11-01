import React from "react"
import {Button} from "@/types/ui_components"
import Image from "next/image";

 export interface PropsModal {
    children: React.ReactNode;
    onClose:()=>void;
    className?:string;
}

 export function HeaderModal({children,className,onClose,...props}:PropsModal){
    return(
        <div className={`flex flex-col header-modal items-end justify-center ${className}`} {...props}>
            <Button variant="btn-back" className="p-1 invert-70 hover:invert-0 rounded-full justify-center items-center flex" onClick={onClose}>
                <Image
                    className=" size-5 "
                    src={'/cerca.png'}
                    alt="cerrar"
                    width={500}
                    height={500}
                />
            </Button>                            
            <div className="text-center w-full ">
                {children}
            </div>                            
        </div> 
    );
 }export default HeaderModal