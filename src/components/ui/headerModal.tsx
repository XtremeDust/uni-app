import React from "react"
import {Button} from "@/types/ui_components"

 export interface PropsModal {
    children: React.ReactNode;
    onClose:()=>void;
    className?:string;
}

 export function HeaderModal({children,className,onClose,...props}:PropsModal){
    return(
        <div className={`flex flex-col header-modal items-end justify-center ${className}`} {...props}>
            <Button variant={"btn-back"} className="rounded-full" onClick={onClose}>X</Button>                            
            <div className="text-center w-full ">
                {children}
            </div>                            
        </div> 
    );
 }export default HeaderModal