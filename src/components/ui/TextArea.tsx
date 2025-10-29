import React from "react";

interface textAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{}

export function TextArea ({className,...props}:textAreaProps){
    return(
        <textarea name="comentarios" id="" placeholder="coment" className={`bg-white px-2 py-1.5 rounded-md focus:outline-none focus:ring-[1px] ring-unimar border border-gray-200 shadow-md resize-none ${className}`} {...props}/>
    )
}