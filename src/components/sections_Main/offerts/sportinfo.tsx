import { card } from "@/types/sports";

interface SportProps{
    card:card;
}

export function sportInfo({card}:SportProps){
    if(!card){
        return null
    }

    return(
        <div className={`${card ? 'text-red-400':'bg-amber-500'}`}>
        <a href={`${card.urlA}`}>enlaces de descaarga {card.sport} href{card.urlA}</a>
        </div>
    );
}export default sportInfo;