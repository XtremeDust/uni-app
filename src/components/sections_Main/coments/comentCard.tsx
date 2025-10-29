'use client'
import {Avatar} from "@/types/ui_components"
import { Coment} from "@/types/comentarios"

interface ComentProps{
    coment:Coment
    index:number
}

    export default function ComentarsCard({coment, index}:ComentProps){
        return(
            <div  className={`drop-shadow-lg shadow-lg rounded-xl opacity-100 group-hover:opacity-50 hover:opacity-100 transition-all duration-400 scale-95 ${index % 2 ===0 ?'bg-gray-50 hover:scale-97 ring-univita ring-1':'bg-unimar text-white scale-103 hover:scale-105 ring-2 ring-white'} `}>
                    
                    <div key={coment.id} className={`flex-col p-2 space-y-3 w-full md:w-[40rem] xl:w-full py-6 place-content-around place-items-center `}>
                        <div className="flex flex-row space-x-3 items-center w-full px-2 ">
                            <div className={`size-12 rounded-full overflow-hidden flex place-content-center-safe items-center ${index % 2 !==0 ?'bg-gray-50 border-blue-400 ring-unimar text-black': 'bg-univita text-white ring-gray-400'}`}>
                                <Avatar email={coment.email}/>                      
                            </div>

                            <div className="flex flex-col items-start">
                                <h3 className="font-bold">{(coment.name ==='null' ? 'Anonimo' : coment.name)}</h3>
                                <span className="opacity-70">{coment.date}</span>
                            </div>
                        </div>
                        <p className={`line-clamp-3 xl:line-clamp-5 w-[95%] text-justify ${index % 2 ===0 ?'text-gray-600':'text-white'}`}>{coment.content.contenido}</p>
                    </div> 
            </div> 
        )
    }