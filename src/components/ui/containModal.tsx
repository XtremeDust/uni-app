"use client"
import React from "react"

export interface contentModalProps{
    children?: React.ReactNode;
    className?:string;
}

    export function ContainModal({children,className,...props}:contentModalProps){               
        return(
            <div className={` rounded-2xl p-5 text-center  ${className}`} onClick={(e) => e.stopPropagation()} {...props}>
                {children}
            </div>
        )
    }export default ContainModal