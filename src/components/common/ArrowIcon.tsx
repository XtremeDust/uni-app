import Image from "next/image";

interface IconProps{
    alt:string;
}

export default function Arrow({alt}:IconProps){
    return(        
         <Image
            className="invert rotate-180 p-1"
            src="https://res.cloudinary.com/dnfvfft3w/image/upload/v1759370950/vercel_xark08.svg"
            alt={alt}                                  
            width={13}
            height={13}
            priority
        />  
    );
}