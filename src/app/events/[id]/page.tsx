import Footer from '@/components/common/footer/MainFooter';
import Header from '@/components/common/header/MainHeader';
import {Banner, Button, Card} from '@/types/ui_components';
import {sports,partidos} from '@/types/sports'
import {eventos} from "@/types/eventos"
import Image from 'next/image';

interface PropsID{
    params:Promise<{
        id:string;
    }>;
}

export default async function ID({params}:PropsID){
    const {id} = await params;
    const actual= eventos.find(d=>d.id===parseInt(id));
    const envivo = partidos.filter(partidos=>{
        return partidos.estado.includes('En vivo')
    })
    const otros = partidos.filter(partidos=>{
        if(partidos.estado!=='En vivo'){
            return true
        }
        return false;
    })
    return(
        <div className='grid grid-rows-[auto_1fr_auto] min-h-dvh bg-white'>
            <Header/>
                <main className='bg-gray-100'>
                    <Banner 
                        SRC='https://res.cloudinary.com/dnfvfft3w/image/upload/v1758470460/Lucid_Origin_A_dynamic_wideformat_cinematic_photo_in_the_style_0_qx2poq.jpg'
                        ALT='eventos'
                    />
                    <div className='space-y-5 my-5'>
                        <section className="text-partidos flex flex-col text-center place-items-center mt-6 md:mt-3">
                            <h3  className="title text-black">¡Sigue a tus Campeones Unimar!</h3>
                            <p className="w-[90%] text-[18px] text-gray-600">Accede en vivo a la emoción, resultados y agenda completa de tus equipos favoritos.</p>
                        </section>

                        <section className='Partidos w-full flex flex-col text-2xl items-center justify-center overflow-hidden'>
                            <div className='filtro hidden gap-3 lg:flex justify-around w-[90%] border-b-2 border-gray-400'>
                                {sports.map((deport)=>(
                                    <Button key={deport.id} className='text-slate-800 hover:text-univita cursor-pointer border-y-transparent border-b-2 text-center hover:border-b-2 hover:border-b-unimar w-full transition-all duration-150 ease-linear py-3'>
                                        {deport.sport}
                                    </Button>
                                ))}
                            </div>

                                <section className='  space-y-5  mt-5 p-2 w-full place-items-center'>
                                    <div className='partido/present w-[95%] text-black bg-white shadow-2xl rounded-2xl '> 
                                        {envivo.map((vivo)=>(
                                            <Card key={vivo.id} className='space-y-5 flex flex-col lg:flex-row justify-around p-6 lg:h-[25rem] items-center'>
                                                <>
                                                <div className='flex  flex-col space-y-5 items-center'>
                                                    <div className='p-4 bg-gray-500 rounded-full'>
                                                        <Image
                                                        className='p-4  size-[12rem]'
                                                            src={vivo.img1}
                                                            alt='equipo'
                                                            width={500}
                                                            height={500}
                                                        />
                                                    </div>
                                                    
                                                    <h4 className='text-center'>{vivo.equipo1}</h4>
                                                </div>

                                                <div className=' flex flex-col text-center '>
                                                    <span className='font-bold text-[6rem]'>{vivo.macador1} - {vivo.marcador2}</span>
                                                    <p>{vivo.estado}</p>
                                                    <span>{vivo.fecha}</span>
                                                </div>

                                                <div className='flex  flex-col space-y-5 items-center'>
                                                    <div className='p-4 bg-gray-500 rounded-full'>
                                                        <Image
                                                        className='p-4 size-[12rem]'
                                                            src={vivo.img2}
                                                            alt='equipo'
                                                            width={500}
                                                            height={500}
                                                        />
                                                    </div>
                                                    <h4 className='text-center'>{vivo.equipo2}</h4>
                                                </div>
                                                </>
                                            </Card>
                                        ))}
                                    </div>

                                    <section className='finaliza/en_vivo gap-3 items-center justify-center space-y-5 mt-10 p-2 w-full'>
                                        <div className='flex justify-around w-95%'>
                                            <h4 className='subtitle text-4xl text-center font-bold text-black'>{actual?.title}</h4>
                                        </div>
                                    </section>
                                    
                                    <div className='filtro_Categoria/estado w-[90%] flex justify-end'>
                                        <Button className='btn-secondary '>Filtro: Categoria</Button>
                                    </div>
                                    <div className='partidos w-[95%] space-y-5 mb-3'>
                                        {otros.map((partidos)=>(
                                            <Card key={partidos.id} className='w-full flex justify-around text-black bg-white shadow-2xl p-6'>
                                                <>
                                                <div className='flex  flex-col space-y-5 '>
                                                    <div className='p-4 bg-gray-500 rounded-full'>
                                                        <Image
                                                        className='p-4 size-[6rem] md:size-[8rem]'
                                                            src={partidos.img1}
                                                            alt='equipo'
                                                            width={500}
                                                            height={500}
                                                        />
                                                    </div>
                                                    
                                                    <h4 className='text-center text-[18px] md:text-[1.5rem]'>{partidos.equipo1}</h4>
                                                </div>

                                                <div className=' flex flex-col text-center justify-center'>
                                                    <span className='font-bold text-[3rem] md:text-[4rem]'>{partidos.macador1} - {partidos.marcador2}</span>
                                                    <p className='text-center text-[18px] md:text-[1.5rem]'>{partidos.estado}</p>
                                                    <span className='text-center text-[18px] md:text-[1.5rem]'>{partidos.fecha}</span>
                                                </div>

                                                <div className='flex  flex-col space-y-5 items-center'>
                                                    <div className='p-4 bg-gray-500 rounded-full'>
                                                        <Image
                                                        className='p-4 size-[6rem] md:size-[8rem]'
                                                            src={partidos.img2}
                                                            alt='equipo'
                                                            width={500}
                                                            height={500}
                                                        />
                                                    </div>
                                                    <h4 className='text-center text-[18px] md:text-[1.5rem]'>{partidos.equipo2}</h4>
                                                </div>
                                                </>
                                            </Card>
                                        ))}
                                    </div>
                                </section>
                        </section>
                        <section></section>
                    </div>
                </main>
            <Footer/>
        </div>
    );
}