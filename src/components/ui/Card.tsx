import React from "react";

interface CardProps{
    children:React.ReactNode;
    className?:string;
}

export function Card({children, className, ...props}:CardProps) {
  return (
    <div className={`  transition-all duration-500 ease-in-out rounded-2xl group ${className}`} {...props}
    >
            {children}
    </div>
  )
} export default Card
