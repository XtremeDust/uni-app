 "use client"
import Btcomment from "@/components/sections_Main/coments/ButtonComent";
import ComentCard from "@/components/sections_Main/coments/comentCard";
import { coments } from "@/types/comentarios";

 export default function comenSection(){
    //elemnto para mapear de 0 a 6 elementos const commentsSubset = coments.slice(0, 6);
    //elemnto para mapear duplicar const duplicatedComments = [...commentsSubset, ...commentsSubset];
    return(
        <section className="comenSection gap-6 bg-transparent my-2 flex-col flex "> 
            <section className="flex flex-col gap-5 w-full m-0 place-items-center text-center place-content-center overflow-hidden p-1">
                <div className=" md:text-2xl flex flex-col gap-3 text-center place-items-center m-0">
                    <h3  className="text-[1.5rem] md:text-[2rem] xl:text-[2.5rem] font-bold ">Construyendo Un Futuro Deportivo Brillante</h3>
                        <p className="w-[90%] text-center text-[18px] text-gray-600">Juntos, podemos crear un deporte universitario más vibrante y lleno de vida.
                            <span className="text-univita text-[19px]"> Tu voz </span>es la energía que mueve este proyecto
                        </p>
                </div>

                {/*aplicar  group a esta etiqueta para desbanecer comentarios con hover */}
                    <div className=" flex flex-col xl:flex-row p-4 gap-5">
                           {coments.slice(0,3).map((coment, index) => (
                            <ComentCard 
                                key={index} 
                                coment={coment} 
                                index={index}
                            />
                        ))}
                    </div>
                
            </section>
            <div className="btComen place-items-center ">
                <Btcomment/>
            </div>  
        </section>
    )
 }