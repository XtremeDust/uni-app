export type Contenido = {
    contenido: string;
};

export interface Coment{
    id:number,
    name:string;
    email:string;
    date:string;
    content:Contenido;

}


export const contenido = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum nemo illum accusantium voluptates obcaecati dicta mollitia architecto? Rerum, aliquid, officia facilis nam tempore inventore, laboriosam deserunt dolor quod sapiente quisquam. Veritatis blanditiis quia fuga nam dolorem eaque assumenda deleniti nisi, quod iste, dolorum nemo totam voluptates labore odio adipisci neque corrupti! Commodi fuga perspiciatis adipisci ab omnis! Sunt, dolorum nam! Modi, expedita. Laboriosam aliquid sunt excepturi doloremque sit et blanditiis ut commodi nesciunt, saepe culpa animi repudiandae mollitia nobis cumque numquam dicta accusantium repellendus harum incidunt possimus dolorem earum quidem! Praesentium error quis optio fugiat quaerat molestias, modi voluptate. Et, voluptates natus totam adipisci vero explicabo quod libero magnam, minima maxime perferendis pariatur dolores architecto aspernatur enim ducimus expedita necessitatibus! Eveniet quod inventore optio reiciendis explicabo mollitia, hic culpa repellat! Voluptatem molestias libero aperiam fuga delectus ipsum accusamus, eius, cum dicta magni consequuntur architecto culpa dolores excepturi unde atque a."

export const coments = [
    {
        id:1 ,
        name:'Johny Granado',
        email:'jgranado@unimar.edu.ve',
        date:'15/08/2025',
        content:{contenido}
    },{
        id: 2,
        name:'Jose antonio',
        email:'jantonio@unimar.edu.ve',
        date:'15/08/2025',
        content:{contenido}
    },{
        id: 3,
        name:'Anónimo',
        email:'null',
        date:'15/08/2025',
        content:{contenido}
    },{
        id: 4,
        name:'4',
        email:'null',
        date:'15/08/2025',
        content:{contenido}
    },{
        id: 5,
        name:'5',
        email:'null',
        date:'15/08/2025',
        content:{contenido}
    },{
        id: 6,
        name:'6',
        email:'null',
        date:'15/08/2025',
        
        content:{contenido}
    }
    ,{
        id: 7,
        name:'7',
        email:'null',
        date:'15/08/2025',
        
        content:{contenido}
    }
        ,{
        id: 8,
        name:'8',
        email:'null',
        date:'15/08/2025',
        
        content:{contenido}
    }
]