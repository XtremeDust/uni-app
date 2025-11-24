
export interface card{
    id:number;
    sport:string;
    img:string;
    urlA:string;
    reglamento:number;
}

export interface categoria{
    id:number;
    category:string;
}

export const pasos=[
    {id:1,paso:"Selecciona tu Evento", content:"Elige el deporte y la categoría que te apasionan para participar.", img:"https://res.cloudinary.com/dnfvfft3w/image/upload/v1759086427/seleccione_1_r0ezsw.png"},
    {id:2,paso:"Completa tus Datos", content:"Llena el formulario con la información necesaria para el registro.", img:"https://res.cloudinary.com/dnfvfft3w/image/upload/v1759086426/formularios-de-google_x5vgjo.png"},
    {id:3,paso:"¡Envia y a Competir!", content:"Envía tu registro, espera confirmacion y prepárate para competir", img:"https://res.cloudinary.com/dnfvfft3w/image/upload/v1759086427/seleccione_ftz82y.png"},
]

export const beneficios=[
    {id:1, titulo:'Asegura tu lugar exclusivo', content:'Los cupos están reservados para quienes actúan con visión. Al registrarte con antelación, garantizas tu participación y el acceso a esta oportunidad única.', img:'/vip.png', style:'bg-blue-500 ring-blue-200'},
    {id:2, titulo:'Facilita una experiencia superior ', content:'Tu registro temprano nos ayuda a planificar un evento de primera clase, diseñado para tu máximo disfrute y beneficio.', img:'/estructura-jerarquica.png', style:'bg-green-500 ring-green-200'},
    {id:3, titulo:'Recibe información clave antes que nadie', content:'Serás el primero en enterarte de todos los detalles y actualizaciones importantes, asegurando que estés siempre un paso adelante.', img:'/noticias.png', style:'bg-violet-500 ring-violet-200'},
    {id:4, titulo:'Prepárate con total tranquilidad ', content:'Concéntrate en tu entrenamiento con la certeza de que todo está listo para ti, sin la presión de los últimos minutos.', img:'/preparate.png', style:'bg-orange-500 ring-orange-200'},
]

export const catPredt=[
    {id:1,category:'Masculina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857071/Group_381_rnpdb0.png'},
    {id:2,category:'Femenina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857070/Group_380_mr3n9u.png'},
    {id:3,category:'Mixta', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857071/Group_379_rxuiqt.png'},
]

export const sports=[ 
    {
        id:1,
        sport:'Futbol Sala',
        img:"https://res.cloudinary.com/dnfvfft3w/image/upload/v1759877199/Gemini_Generated_Image_x3t86px3t86px3t8-removebg-preview_s7yeed.png",
        urlA:"normas",
        categoria:[
            {id:1,category:'Masculina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857071/Group_381_rnpdb0.png'},
            {id:2,category:'Femenina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857070/Group_380_mr3n9u.png'},
    
        ],
    },
        {
        id:2,
        sport:'Basquet',
        img:"https://res.cloudinary.com/dnfvfft3w/image/upload/v1759877244/Copilot_20251007_175456_mnxvph.png",
        urlA:"normas",
        categoria:[
            {id:1,category:'Masculina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857071/Group_381_rnpdb0.png'},
            {id:2,category:'Femenina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857070/Group_380_mr3n9u.png'},
        ],
    },
        {
        id:3,
        sport:'Voleibol',
        img:"https://res.cloudinary.com/dnfvfft3w/image/upload/v1759877213/Copilot_20251007_183650_pphh5q.png",
        urlA:"normas",
        categoria:[
            {id:31,category:'Masculina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857071/Group_381_rnpdb0.png'},
            {id:32,category:'Femenina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857070/Group_380_mr3n9u.png'},
            {id:33,category:'Mixta', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857071/Group_379_rxuiqt.png'},
        ],
    },
        {
        id:4,
        sport:'Beisbol 5',
        img:"https://res.cloudinary.com/dnfvfft3w/image/upload/v1759877289/Copilot_20251007_182012_xwvrs5.png",
        urlA:"normas",
        categoria:[
            {id:41,category:'Masculina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857071/Group_381_rnpdb0.png'},
        ],
    },
        {
        id:5,
        sport:'Tenis de Mesa',
        img:"https://res.cloudinary.com/dnfvfft3w/image/upload/v1759877243/Copilot_20251007_175700_n0dovz.png",
        urlA:"normas",
        categoria:[
            {id:33,category:'Mixta', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857071/Group_379_rxuiqt.png'},
        ],
    },
        {
        id:6,
        sport:'kickingball',
        img:"https://res.cloudinary.com/dnfvfft3w/image/upload/v1759877199/Copilot_20251007_173057_yxhefo.png",
        urlA:"normas",
        categoria:[
            {id:62,category:'Femenina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857070/Group_380_mr3n9u.png'},
        ],
    },
        {
        id:7,
        sport:'Karate-Do',
        img:"https://res.cloudinary.com/dnfvfft3w/image/upload/v1759877212/Copilot_20251007_183055_qbp0ah.png",
        urlA:"normas",
        categoria:[
            {id:71,category:'Masculina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857071/Group_381_rnpdb0.png'},
            {id:72,category:'Femenina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857070/Group_380_mr3n9u.png'},
            {id:73,category:'Mixta', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857071/Group_379_rxuiqt.png'},            
        ]
    },
    {
        id:8,
        sport:'Softball',
        img:"https://res.cloudinary.com/dnfvfft3w/image/upload/v1759877245/Copilot_20251007_173927_n8abzb.png",
        urlA:"normas",
        categoria:[
            {id:81,category:'Masculina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857071/Group_381_rnpdb0.png'},
        ],
    },
    {
        id:9,
        sport:'Pickleball',
        img:"https://res.cloudinary.com/dnfvfft3w/image/upload/v1759877200/Copilot_20251007_182357_mnrqyc.png",
        urlA:"normas",
        categoria:[
            {id:91,category:'Masculina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857071/Group_381_rnpdb0.png'},
            {id:92,category:'Femenina', img:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758857070/Group_380_mr3n9u.png'},
    
        ],
    }
]

export const equipos=[
    {id:1,nombre:'Equipo ',img:'/'},
    {id:2,nombre:'Equipo ',img:'/'},
    {id:3,nombre:'Equipo ',img:'/'},
    {id:4,nombre:'Equipo ',img:'/'},
    {id:5,nombre:'Equipo ',img:'/'},
    {id:6,nombre:'Equipo ',img:'/'},
    {id:7,nombre:'Equipo ',img:'/'},
    {id:8,nombre:'Equipo ',img:'/'},
    {id:9,nombre:'Equipo ',img:'/'},
    {id:10,nombre:'Equipo ',img:'/'},
]

export const partidos=[
    {id:1,equipo1:'Equipo 1',img1:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759361303/escudo_kz6svs.png',macador1:'0', equipo2:'Equipo 2',img2:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759361303/escudo_kz6svs.png', marcador2:'0', fecha:'00/00/0000', estado:'En vivo'},
    {id:2,equipo1:'Equipo 3',img1:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759361303/escudo_kz6svs.png',macador1:'0', equipo2:'Equipo 4',img2:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759361303/escudo_kz6svs.png', marcador2:'0', fecha:'00/00/0000', estado:'Proximo'},
    {id:3,equipo1:'Equipo 5',img1:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759361303/escudo_kz6svs.png',macador1:'0', equipo2:'Equipo 6',img2:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759361303/escudo_kz6svs.png', marcador2:'0', fecha:'00/00/0000', estado:'Finalizado'},
    {id:4,equipo1:'Equipo 7',img1:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759361303/escudo_kz6svs.png',macador1:'0', equipo2:'Equipo 8',img2:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759361303/escudo_kz6svs.png', marcador2:'0', fecha:'00/00/0000', estado:'Proximo'},
    {id:5,equipo1:'Equipo 9',img1:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759361303/escudo_kz6svs.png',macador1:'0', equipo2:'Equipo 10',img2:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759361303/escudo_kz6svs.png', marcador2:'0', fecha:'00/00/0000', estado:'Finalizado'},
    {id:6,equipo1:'Equipo 11',img1:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759361303/escudo_kz6svs.png',macador1:'0', equipo2:'Equipo 12',img2:'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759361303/escudo_kz6svs.png', marcador2:'0', fecha:'00/00/0000', estado:'Finalizado'}
]