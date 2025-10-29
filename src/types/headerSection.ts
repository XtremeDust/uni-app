
export const pago = [
  {
  id:1,
  red:"pagos unimar",
  Url:"",
  icon:"https://res.cloudinary.com/dnfvfft3w/image/upload/v1759370231/login-vertical_chy2iu.png",
  size:"w-28"
  }
]

 export interface sectionHs {
     id:number;
     title:string;
     url:string;
     img?:string | undefined;
     subsectionH?:sectionHs[];
 }

 export const sectionH:sectionHs[] = [
    {
        id:1,
        title:"Inicio",
        url:"https://portalunimar.unimar.edu.ve/home",
    },
    {
        id:2,
        title:"Nuestra Institucion",
        url:"#",
        img:"#",
        subsectionH:[
            {id:21, title:"UNIMAR", url:"https://portalunimar.unimar.edu.ve/our-institution"},
            {id:22, title:"Organización", url:"https://portalunimar.unimar.edu.ve/organization"},
            {
                id:23,
                    title:"Rectorado",
                    url:"#",
                    img:"#",
                    subsectionH:[
                    {id:231, title:"Nuestro Subsistema", url:"https://portalunimar.unimar.edu.ve/rectorate"},
                    {id:232, title:"Planificación, Desarrollo y Evaluación Institucional", url:"https://portalunimar.unimar.edu.ve/curricula-dir"},
                    {id:233, title:"Talento Humano", url:"https://portalunimar.unimar.edu.ve/RRHH-department"},
                    {id:234, title:"Evaluación y Apoyo Psicológico", url:"https://portalunimar.unimar.edu.ve/psychological-support"}
                ]
            },
            {
                id:24, 
                    title:"Secretaría General", 
                    url:"#",
                    img:"#",
                    subsectionH:[
                    {id:241, title:"Nuestro Subsistema", url:"https://portalunimar.unimar.edu.ve/general-secretary-department",},
                    {id:242, title:"Control de Estudios", url:"https://portalunimar.unimar.edu.ve/study-control",},
                    {id:243, title:"Bienestar Estudiantil", url:"https://portalunimar.unimar.edu.ve/student-welfare",},
                    {id:244, title:"Auditoría de grado", url:"https://portalunimar.unimar.edu.ve/audit-of-records-degree-applicants",},
                ]
            },
            {id:25, title:"Administración", url:"https://portalunimar.unimar.edu.ve/administration-dir"},
            {
                id:26,
                    title:"Académico",
                    url:"#",
                    img:"#",
                    subsectionH:[
                    {id:261, title:"Vicerrectorado", url:"https://portalunimar.unimar.edu.ve/academic-vicerectorate"},
                    {id:262, title:"Biblioteca UNIMAR", url:"https://portalunimar.unimar.edu.ve/library"},
                    {
                        id:263,
                            title:"Decanatos",
                            url:"#",
                            img:"#",
                            subsectionH:[
                            {id:264,title:"Estudios Generales",url:"https://portalunimar.unimar.edu.ve/general-studies-deanery"},
                            {id:265,title:"Humanidades, Artes y Eduación",url:"https://portalunimar.unimar.edu.ve/humarte-deanery"},
                            {id:266,title:"Ciencias Económicas y Sociales",url:"https://portalunimar.unimar.edu.ve/ceys-deanery"},
                            {id:267,title:"ciencias Jurídicas y Políticas",url:"https://portalunimar.unimar.edu.ve/cjyp-deanery"},
                            {id:268,title:"Ingenieria y Afines",url:"https://portalunimar.unimar.edu.ve/engineering-deanery"}
                        ]
                    }
                ]
            },
            {
                id:27,
                    title:"Extensión",
                    url:"#",img:"#",
                    subsectionH:[
                    {id:271, title:"Vicerrectorado", url:"https://portalunimar.unimar.edu.ve/extension-vicerectorate"},
                    {id:272, title:"Servicio Comunitario", url:"https://portalunimar.unimar.edu.ve/community-service"},
                    {id:273, title:"Univita", url:"/"}
                ]
            },
            {id:28, title:"Normativas", url:"https://portalunimar.unimar.edu.ve/regulations"},
            {id:29, title:"Publicaciones Oficiales", url:"https://portalunimar.unimar.edu.ve/university-gazette"},            
            {id:211, title:"Comisión Electoral", url:"https://portalunimar.unimar.edu.ve/electoral-commission"},  
            ]
    },
    {
        id:3,
        title:"Estudia en UNIMAR",
        url:"#",
        img:"#",
        subsectionH:[
            {
                id:31,
                    title:"Pregrado",
                    url:"#",
                    img:"#",
                    subsectionH:[
                    {id:331, title:"Requisitos", url:"https://portalunimar.unimar.edu.ve/new-students"},
                    {id:332, title:"Carreras", url:"https://portalunimar.unimar.edu.ve/undergraduate"}
                ]
            },
            {
                id:32,
                    title:"Postgrado",
                    url:"#",
                    img:"#",
                    subsectionH:[
                    {id:321, title:"Requisitos", url:"https://portalunimar.unimar.edu.ve/postgraduate/new-students"}
                ]
            },
            {id:33, title:"Diplomados", url:"https://portalunimar.unimar.edu.ve/extension-diploma/offers"},
            {id:34, title:"Cursos y Tallerres", url:"https://portalunimar.unimar.edu.ve/extension-course/offers"},
            {id:35, title:"Egresados", url:"https://portalunimar.unimar.edu.ve/graduate-registration"}
            ]
    },
    {
        id:4,
        title:"Postgrado",
        url:"https://portalunimar.unimar.edu.ve/postgraduate-department",
    },
    {
        id:5,
        title:"Investigación",
        url:"https://portalunimar.unimar.edu.ve/research-dir",
    },
    {
        id:6,
        title:"Servicios  ",
        url:"https://portalunimar.unimar.edu.ve/services",
    },
 ]

