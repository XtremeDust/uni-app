import Image from "next/image";
import {Card} from '@/types/ui_components'
import {univita} from '@/types/univita'
import {ActiveLink} from "@/components/ui/Router";
import { usePathname } from "next/navigation";

export function navigate(){
        const ruta = usePathname();
    return(
        <section className=" max-w-screen-2xl space-y-2  mx-auto p-4 md:p-8 text-black">
                <h2 className="title text-center">¡Tu Éxito Universitario Comienza Aquí!</h2>
                <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
                  Acceso directo e inmediato a herramientas esenciales para dominar tu vida académica y deportiva.
                </p>
                <div className="flex flex-wrap justify-evenly gap-6">
                {univita.map((card)=>(
                            <Card key={card.id} className={` 
                                group block text-center  bg-white rounded-lg shadow-lg cursor-pointer
                                 transition-transform transform duration-300 ease-in-out
                                   w-full md:w-[24rem] place-content-center
                                    ${ruta===card.url ? 'hidden':'visible hover:scale-103 hover:ring-0'}`}>
                                <ActiveLink href={card.url} className="size-full p-6">
                                    <div className="flex flex-col items-center justify-center p-4 h-full">
                                        <div className="p-2 bg-blue-200/80 rounded-full flex items-center justify-center mb-4">
                                            <Image
                                                className=" w-[7rem] p-2 md:p-0 transition-all duration-300 ease-in  group-hover:scale-93 bg-unimar rounded-full"
                                                src={card.img}
                                                width={500}
                                                height={500}
                                                alt={card.title}
                                                /> 
                                        </div>
                                        <div className="flex flex-col flex-grow">
                                            <h3 className='text-lg font-bold mb-2 text-gray-800'>{card.title}</h3>
                                            <p className="text-sm text-gray-600">{card.content}</p>
                                        </div>
                                    </div>
                                </ActiveLink>
                            </Card>
                        ))}
                </div>
            </section>
    );
}export default navigate;