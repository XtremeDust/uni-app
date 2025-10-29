import React, {HTMLAttributes} from "react";

type Navigate = (newKey: number) => void;
export interface AsideProps extends HTMLAttributes<HTMLDivElement>{
    onNavigate:Navigate;
    CurrentKey:number;
    isExpanded?:boolean;
    handleMouseEnter?:()=>void
     handleMouseLeave?:()=>void
};


export interface Submenu{
    id:number;
    section:string;
    img:string;
    src?:string;
    submenu?:Submenu[];
}

export const menu:Submenu[]=[
    {id:1, section:'Home', img:'/hogar.png',src:''},
    {id:2, section:'Normativas', img:'/martillo-de-subasta.png',src:''},
    {id:3, section:'Inscripciones', img:'/contrato (1).png',src:''},
    {id:4, section:'Eventos y Actividades', img:'/calendario (3).png',
        submenu:[   
            {id:4, section:'Actividades generales', img:'/numero.png',src:''},
            {id:5, section:'Gestion de Torneos', img:'/eficiencia.png',src:''}
        ]
    },
    {id:6, section:'Ofertas Deportivas', img:'/etiqueta (1).png',src:''},
    {id:7, section:'Comentarios', img:'/insertar-comentario.png',src:''},
]