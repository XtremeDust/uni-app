//iconos de las redes
import {redes} from "@/types/socialmedia"
import Image from "next/image";

  export default function Redes(){
   
     return(
        <ul className="grid grid-flow-col place-items-center gap-1">
            {redes.map((icon)=>(
                <li key={icon.id}>                   
                    <a href={icon.Url}>
                       
                         <Image
                            className="hover:scale-115 transition-all duration-300 ease-in-out"
                            src={icon.img}
                            width={32}
                            height={32}
                            alt={icon.red}
                        /> 
                        
                    </a>
                </li>
            ))}
        </ul>
    );
 }