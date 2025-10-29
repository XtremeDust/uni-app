export interface sectionF {
    id:number;
    title:string;
    url:string;
    subsection?: sectionF[];
}

export const sectionFs: sectionF[] =[
    {
        id:1,
        title:"Nuestra Institución",
        url:"#",
        subsection:[
            {id:11, title:"Rectorado", url:"#"},
            {id:12, title:"Vicerrectorados", url:"#"},
            {id:13, title:"Decanatos", url:"#"},
            {id:14, title:"Bienestar Estudiantil", url:"#"}
        ],
    },
    {
        id:2,
        title:"Ofertas de Estudios",
        url:"#",
        subsection:[
            {id:21, title:"Pregrado", url:"#"},
            {id:22, title:"Postgrado", url:"#"},
            {id:23, title:"Diplomados", url:"#"},
            {id:24, title:"Cursos y Talleres", url:"#"}
        ],
    },
    {
        id:3,
        title:"Servicios web",
        url:"#",
        subsection:[
            {id:31, title:"Académicos", url:"#"},
            {id:32, title:"Biblioteca UNIMAR", url:"#"},
            {id:33, title:"Educación Virtual", url:"#"},
            {id:34, title:"Pagos Online", url:"#"}
        ],
    },
    {
        id:4,
        title:"Accesos Rápidos",
        url:"#",
        subsection:[
            {id:41, title:"Directorio Académico", url:"#"},
            {id:42, title:"Calendario Académico", url:"#"},
            {id:43, title:"Contáctanos a través de", url:"#"},        
        ],
    }
]

