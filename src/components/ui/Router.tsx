
import { useRouter } from 'next/navigation'

export interface RouterProps{
    children:React.ReactNode;
    href:string;
    className?:string;
}

export function ActiveLink({ children, href, className,...props }:RouterProps) {
  const router = useRouter();

 
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    router.push(href)
  }
 
  return (
    <a href={href} onClick={handleClick} {...props} className={` ${className}`}>
      {children}
    </a>
  )
}
 
export default ActiveLink