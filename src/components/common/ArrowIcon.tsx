import Image from "next/image";

interface IconProps{
    alt:string;
}

export default function Arrow({alt}:IconProps){
    return(        
         <Image
            className="invert rotate-180 p-1"
            src="/vercel.svg"
            alt={alt}                                  
            width={13}
            height={13}
            priority
        />  
    );
}