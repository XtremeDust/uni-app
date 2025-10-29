import React from "react";

interface IntProps extends React.InputHTMLAttributes<HTMLInputElement>{}

export function Input ({className,...props}:IntProps){
    return(
        <input className={`px-2 py-1.5 ${className}`} {...props}/>        
    )
}