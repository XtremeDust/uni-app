import Card from "../ui/Card";
import { card } from "@/types/sports";
import Image from "next/image";

interface SportProps{
    className:string;
    classImg?:string;
    onClick:()=>void;
    card:card;
    state:boolean;
}

export function Sports({className,classImg, onClick, state, card, ...props}:SportProps){

    return(
        <Card className={`relative  text-black shadow-lg  
                ${state ? ` border-[3px] border-univita bg-unimar/85 text-white actual scale-103`:' bg-unimar/8 border-[2px] border-univita/25 text-gray-600 hover:text-black  hover:bg-unimar/20 hover:scale-102 hover:border-unimar/75'}
                 ${className}`} {...props}>
            <a className="absolute inset-0 z-0 place-content-center place-items-center space-y-1" onClick={onClick}>
                <Image
                    className={`transition-all duration-300 ease-in-out rounded-full ${classImg} ${state ?'scale-100 ring-white ring-2':'scale-95 ring-white ring-3'}`}
                    src={card.img}
                    width={105}
                    height={105}
                    alt={card.sport}
                /> 
                <h3 className='text-[20px]'>{card.sport}</h3>
                <div className={`absolute top-2 right-2 size-[12px] rounded-full ${state ?'ring-gray-400 ring-3 bg-gray-400':'scale-95 bg-transparent ring-3 ring-unimar'}`}>
                    <div className={` size-full rounded-full scale-95 ${state ?'border-white border-2 bg-univita':' bg-gray-100'}`}/>
                </div>
            </a>
        </Card>
    );
}export default Sports;