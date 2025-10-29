import Image from "next/image";

interface ImageProps{
    Src:string,
    Width:number,
    Height:number,
    Alt:string,
}

export default function imagen({Src,Width,Height,Alt}:ImageProps){
    return(
        <Image
            src={Src}
            width={Width}
            height={Height}
            alt={Alt}
        />
    )
}