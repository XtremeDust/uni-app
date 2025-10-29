import React from "react";

export interface PropsLabel{
    children?:React.ReactNode;
    label:string;
    For:string;
    labelClass?:string;
    className?:string;
}

export  function InputGroup({label,labelClass,For,className,children,...props}:PropsLabel){
    return(
        <div className={` flex flex-col ${className}`} {...props}>
            {label &&(
                <label htmlFor={For} className={`text-[16px] font-medium ${labelClass}`}>
                    {label}
                </label>
            )}
            {children}
        </div>
    )
}