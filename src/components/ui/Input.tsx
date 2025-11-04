import React, { forwardRef } from "react";

interface IntProps extends React.InputHTMLAttributes<HTMLInputElement>{}

interface IntProps extends React.InputHTMLAttributes<HTMLInputElement>{}

export const Input = forwardRef<HTMLInputElement, IntProps>(
    ({ className, ...props }, ref) => {
    
    return (
        <input 
            className={`px-2 py-1.5 ${className}`} 
            ref={ref} 
            {...props}
        />     
    )
});