import Image from "next/image";

export interface IMGProps{
    SRC:string,
    ALT:string,
    children?:React.ReactElement;
}

  export function Banner({SRC, ALT, children ,...props}:IMGProps){
    return(
        <div className=" relative w-full aspect-video sm:h-80 md:h-96 overflow-hidden bg-gray-400 ">   
            <Image 
                className="absolute top-0 left-0 object-cover w-full h-full"
                {...props}
                src={SRC}
                alt={ALT}
                fill 
            />
            {children}
        </div>
    );
  }export default Banner
