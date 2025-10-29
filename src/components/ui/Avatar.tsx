export interface AvatarPros{
    email:string;
}

 export function Avatar({email}:AvatarPros){
 
    if(!email || email.length < 2){
        return null
    }
    const leteer = email.substring(0,2);
    const img = leteer.toUpperCase();
    return <p className="font-sans text-[16px]">{img}</p>

 }export default Avatar