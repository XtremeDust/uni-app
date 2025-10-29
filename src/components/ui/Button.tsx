interface BtProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    variant?: string;
    onClick?:()=>void;
}


export function Button ({children, className, variant, onClick,...props}:BtProps){
    
    
    return(
        <button className={`${className} ${variant}`}
        onClick={onClick}
        {...props}
        >
            {children}            
        </button>
   ) 
 } export default Button