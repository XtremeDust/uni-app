import React,{useState} from "react";
import {Button, Modal, ContainModal, Input, InputGroup, TextArea, HeaderModal, FooterModal} from "@/types/ui_components";
import Image from "next/image";

export default function Comment() {
    const [OpenModal, setModal] = useState(false);

    const handleOpenModal=()=>{
        setModal(true)  
          
    };

    const handleCloseModal=()=>{
        setModal(false)    
    };

    const [isChecked, setIsChecked] = useState("public");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.value);
    };

    return(
        <>
        <div className="relative flex flex-col text-[24px] items-center justify-center space-y-3 p-3 lg:gap-5 shadow-lg drop-shadow-sm rounded-xl bg-gray-50 w-[95%] xl:w-[85%]">
            <div className="flex flex-col lg:w-3/5 space-y-3">
                <h2 className=" text-[1.5rem] md:text-[2rem] xl:text-[2.5rem] font-bold text-center ">¿Listo Para Elevar el nivel de la Experiencia Deportiva?</h2>
                <p className="text-[18px] text-gray-600 text-center ">Queremos crecer contigo. Cada idea, cada comentario y cada experiencia compartida nos ayuda a perfeccionar Univita para que refleje lo mejor de nuestra comunidad universitaria.</p>
            </div>
            <Button onClick={handleOpenModal} className="text-[18px] bg-unimar hover:opacity-90 hover:scale-102 transition-all duration-300 px-5 py-2 text-white rounded-full flex gap-2 items-center">
                    Deja Tu Opinión
                        <Image 
                        className="w-9 h-8"
                        src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758905980/flecha-correcta_2_l0zpid.png'}
                        alt={'logo'}
                        width={150}
                        height={150}
                    />
            </Button>

           
        </div>
        <Modal state={OpenModal}>
            {OpenModal &&(
                <ContainModal className="grid-flow-row-dense md:flex md:flex-col text-black h-[67%] md:h-[70%] size-[95%] sm:w-[80%] md:w-[60%] lg:w-[45%] xl:w-[40%] 2xl:w-[30%] space-y-3 overflow-y-auto bg-gray-200">
                    
                    <HeaderModal onClose={handleCloseModal} className="flex-none text-[1.5rem] font-bold">
                        Buzón de Comentarios
                    <p className="font-normal text-gray-600 text-[18px]">Nos encantaría conocer tu opinión</p>    
                    </HeaderModal>                            

                    <section className="w-full relative place-items-center flex-grow">
                        <div className="main-modal flex-grow space-y-3 w-[95%]">

                            <div className="Email flex  space-y-3 md:gap-3 flex-col">
                                <InputGroup For="Email" label="Correo Institucional" labelClass="text-[18px] text-start" className="w-full" >
                                    <div className="relative">
                                        <Image
                                            className="absolute left-3 top-3 h-4 w-4 text-slate-400"
                                            src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758905312/correo-electronico_kqhai5.png'}
                                            alt="correo"
                                            width={50}
                                            height={50}
                                        />
                                        <Input type="Email" id="Email" className="input w-full pl-10 pr-3 py-2 bg-gray-100" placeholder="example.1234@unimar.edu.ve" required/>
                                    </div>
                                </InputGroup>

                                <div className="space-y-2">
                                    <div className="visibilidad con imagenes Seletion flex flex-row space-x-3  ">
                                        <InputGroup For="Seletion" label="Visibilidad del comentario" labelClass="col-span-3" className="w-full text-start">
                                        <div className="w-full grid grid-cols-2 gap-3 mt-2">
                                        <Button className={`relative bg-gray-100 rounded-2xl h-22 cursor-pointer ${isChecked === 'public'? 'text-unimar border-4 border-unimar':'text-gray-500 border-4 border-gray-500'}`}  value="public" onClick={()=>setIsChecked('public')}>
                                                <Image
                                                className={`absolute object-cover scale-35 -translate-y-2.5 ${isChecked === 'public'? '':'grayscale'}`}
                                                    src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758905672/ver_1_errsdi.png'}
                                                    alt="visible"
                                                    fill
                                                />
                                                <p className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 font-semibold`}>Público</p>

                                            </Button>
                                            <Button className={`relative bg-gray-100 rounded-2xl h-22 cursor-pointer ${isChecked === 'private'? 'text-unimar border-4 border-unimar':'text-gray-500 border-4 border-gray-500'}`} value={'private'} onClick={()=>setIsChecked('private')}>
                                                <Image
                                                className={`absolute object-cover scale-35 -translate-y-2.5 ${isChecked === 'private'? '':'grayscale'}`}
                                                    src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758905672/ocultar_1_mdw2qo.png'}
                                                    alt="invisible"
                                                    fill
                                                />
                                                <p className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 font-semibold `}>Anónimo</p>
                                            </Button>
                                        </div>
                                        </InputGroup>
                                    
                                    </div>

                                    {/*eliminar */}
                                    <div className="Seletion  flex-row space-x-3 hidden">
                                        <InputGroup For="Seletion" label="Visibilidad del comentario" labelClass="col-span-3" className="w-full gap-1 grid grid-cols-3 place-items-start">
                                        <>
                                            <InputGroup For="public" label="Público" className={`flex flex-row-reverse gap-2 ${isChecked === 'public'? 'text-black':'text-gray-500'}`}>
                                                <Input id="public" type="radio" name="correo" value="public" checked={isChecked === 'public'} onChange={handleChange}/>
                                            </InputGroup>

                                            <InputGroup For="private" label="Anónimo" className={`flex flex-row-reverse gap-2 ${isChecked === 'private'? 'text-black':'text-gray-500'}`}>
                                                <Input id="private" type="radio" name="correo" value="private" checked={isChecked === 'private'} onChange={handleChange}/>
                                            </InputGroup>
                                        </>
                                        </InputGroup>
                                    
                                    </div>

                                    <span className={`text-[16px]  text-justify text-gray-700 ${isChecked==='public' ? 'flex': 'hidden'}`}>
                                        Si eliges 'Público', tu informacion de usuario será visible en la sección  de comentarios
                                    </span>

                                    <span className={`text-[16px] text-justify text-gray-700 ${isChecked==='private' ? 'block': 'hidden'}`}>
                                        Si eliges 'Anónimo', tu información de usuario no será visible en la sección  de comentarios
                                    </span>
                                </div>

                            </div>

                            <div className="Coment flex space-y-3 md:gap-3 flex-col">
                                <InputGroup label="Comentario" For="Comentario" labelClass="text-[18px] text-start ">
                                    <TextArea id="Comentario" className="h-[8rem] input " placeholder="Escribe tu comentario aquí..."/>
                                </InputGroup>
                            </div>

                        </div>
                    </section>

                    <FooterModal BTmain="Enviar" BTSecond="Cerrar" onClose={handleCloseModal} className="flex-none mt-8"/>
                        
                    
                </ContainModal>
            )}
        </Modal>
        </>
    )
}