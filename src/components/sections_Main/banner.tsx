import Image from "next/image";

 export default function Banner(){
    return(
        <div className=" relative w-full aspect-video sm:h-80 md:h-96 overflow-hidden bg-gray-400 ">   
             <img src="prueba.jpg" alt="logo unimar" className=" absolute top-0 left-0 object-cover w-full h-full"/>
        </div>
    );
 }