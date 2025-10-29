'use client'
import { useEffect, useRef, useState } from "react";
import {sports} from "@/types/sports"
import {Button,ContainModal,HeaderModal,FooterModal, Input, InputGroup} from "@/types/ui_components";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface ModalProps {
    onCloseExternal: () => void;
}

export default function modal_Inscription({onCloseExternal}:ModalProps) {

        const handleCloseModal=()=>{
            onCloseExternal(); // Cierra el modal en la página principal
            setSport(null);
            setCategory(null);
            setMDep(false);
            setMCat(false);
            setDeport('Seleccione un deporte');
            setCategory('Seleccione un deporte');
            setStep(1);
        };

        //const enlistada = categoria?.categoria[0].id;

        const [isSport, setSport] = useState<number|null>(null);
        const [SelectCat, setSelectCat] = useState<number|null>(null);
        const categoria = sports.find((c=> c.id === isSport));
        const [OpenCat, setMCat] = useState(false);

        const setVariant = {
            entre:{
                x:1000,
                opacity:0,
                trasition: {duration:0.5}
            },
            center:{
                x:0,
                opacity:1,
                trasition: {duration:0.5}
            },
            exit:{
                x:-1000,
                opacity:0,
                trasition: {duration:0.5}
            }
        }        

        const [isSept, setStep] = useState(1);
        const next = () => (setStep(isSept =>isSept+1));
        const prev = () => (setStep(isSept=>isSept-1));


        const [isDeport, setDeport]=useState<String|null>(null);

        const [isCategory, setCategory]=useState<String|null>(null);
        
        const [OpenDep, setMDep] = useState(false);
        

        const menuOut = useRef<HTMLDivElement>(null);
        const menuOutC = useRef<HTMLDivElement>(null)

        const handleSelectD=(id:number,sport:string)=>{
            const select = isSport === id;

            if(select){
                setSport(null);
                setCategory(null);

                setDeport('Seleccione un deporte');
                setCategory('Seleccione una Categoria');
                setMDep(false);
            }else{
                setSport(id);
                setCategory(null);
                setDeport(sport);
                setMDep(false);
                setMCat(false);
            }
        }

        const handleSelectC=(id:number,categoria:string)=>{
            const select = SelectCat === id;

            if(select){
                setSelectCat(null);

                setCategory('Seleccione una Categoria');
                setMCat(false);
            }else{
                setSelectCat(id);
                setCategory(categoria);
                setMDep(false);
                setMCat(false);
            }
        }
        
    useEffect(()=>{
        function handleOutClick(event: globalThis.MouseEvent) {
            const target = event.target as Node;
            
            const currentMenu = menuOut.current;
            
            if (OpenDep && currentMenu && !currentMenu.contains(target)) {
                setMDep(false);
                return;
            }
            
            const currentMenuC = menuOutC.current;
            if(OpenCat && currentMenuC && !currentMenuC.contains(target)){
                setMCat(false);
                return;
            }
        }

       
        if (OpenDep || OpenCat) {
            document.addEventListener("mousedown", handleOutClick);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleOutClick);
        };
        
    }, [OpenDep, OpenCat, setMDep, setMCat]);    
  return (
        <ContainModal className={`grid-flow-row-dense md:flex md:flex-col text-black ${ isSept===1 ? 'w-[95%] h-[82%] md:w-[80%] md:h-[70%] lg:w-[75%] lg:h-[70%] xl:w-[60%] xl:h-[80%] 2xl:w-[50%] 2xl:h-[70%]':(isSept===2 ? 'w-[95%] h-[89%] md:w-[85%] md:h-[90%] lg:w-[75%] lg:h-[85%] xl:w-[55%] xl:h-[85%] 2xl:w-[50%] 2xl:h-[88%]':'size-[95%] md:h-[95%]  xl:w-[55%]') }  space-y-3 overflow-y-auto bg-gray-200`}>
            <HeaderModal className="flex-none" onClose={handleCloseModal}>
                <div className="text-start">
                    <h2 className="ml-5 title">Formulario de Inscripción</h2>
                    <p className="ml-5 text-[1.2rem]">complete los detalles de su equipo para finalizar la inscripción.</p>
                </div>
            </HeaderModal>

            <div className="fases grid grid-cols-3">
                <div className="place-items-center space-y-2">
                    <h2 className={`rounded-full p-2 size-[48px] place-content-center ${isSept===1 ? 'bg-unimar text-white':'bg-gray-300 '}`}>1</h2>
                    <p className={`${isSept===1 ? 'text-unimar font-bold':'text-gray-700'}`}>Informacion Básica</p>
                </div>
                <div className="place-items-center space-y-2">
                    <h2 className={`rounded-full p-2 size-[48px] place-content-center ${isSept===2 ? 'bg-unimar text-white':'bg-gray-300 '}`}>2</h2>
                    <p className={`${isSept===2 ? 'text-unimar font-bold':'text-gray-700'}`}>Detelles del Torneo</p>
                </div>
                <div className="place-items-center space-y-2">
                    <h2 className={`rounded-full p-2 size-[48px] place-content-center ${isSept===3 ? 'bg-unimar text-white':'bg-gray-300 '}`}>3</h2>
                    <p className={`${isSept===3 ? 'text-unimar font-bold':'text-gray-700'}`}>Información del Equipo</p>
                </div>
            </div>

            <div className="relative flex-grow main-modal  place-content-center">
                <AnimatePresence mode="wait">
                    <motion.div
                    key={isSept}
                    variants={setVariant}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className={` space-y-2 transition-opacity flex flex-col p-2 `}>
                        
                        {isSept ===1 &&(
                            <>
                                <section className="flex flex-col p-2 shadow rounded-xl bg-gray-100">
                                    <div className="section-title mt-3 flex flex-row gap-2 ml-3 place-items-center">
                                        <div className="relative size-[52px] bg-unimar rounded-full">
                                            <Image
                                                className=" absolute inset-0 object-contain scale-100"
                                                src={'/normas.png'}
                                                alt="lol"
                                                fill
                                            />
                                        </div>
                                        <div className="text-start">
                                            <h3 className="text-[1.3rem] font-bold">Información Básica</h3>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:grid md:grid-cols-2 gap-3 text-start p-3">
                                    
                                        <InputGroup For="deporte" label="Deporte" labelClass="text-gray-700">
                                            <div className="relative"  ref={menuOut} onClick={()=>(setMDep(!OpenDep))}>
                                              
                                                    <Input type='text' id="deporte" className="cursor-pointer input w-full pl-6 pr-3 py-3 placeholder:text-black" required readOnly  value={isDeport === null? "Seleccione un deporte"  : `${isDeport}`}/>
                                                        <Button type="button" className=" cursor-pointer absolute right-1 md:right-1 lg:right-4 top-1/2 flex justify-center -translate-y-1/2 -translate-x-1/2">
                                                            <Image
                                                            className={`size-[1rem] transition-transform duration-300 ease-in-out ${OpenDep? 'rotate-180':' rotate-360'}`}
                                                            src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'}
                                                            alt="desplegar"
                                                            width={100}
                                                            height={100}
                                                        />
                                                        </Button>

                                                        
                                                            <div className={`absolute z-20 bg-white shadow-lg mt-1.5 rounded-xl overflow-hidden overflow-y-auto ${OpenDep? 'w-full h-[12rem]' : 'max-h-0 opacity-0  pointer-events-none'}`}>
                                                                {sports.map((deporte)=>(
                                                                    <div key={deporte.id} id={deporte.sport} className="w-full flex gap-2 p-2 hover:bg-unimar/15 place-items-center" onClick={()=>(handleSelectD(deporte.id, deporte.sport))}>
                                                                        <Image
                                                                            className="size-[2rem] bg-unimar rounded-full "
                                                                            src={deporte.img}
                                                                            alt={`${deporte.categoria}`}
                                                                            width={100}
                                                                            height={100}
                                                                        />
                                                                        {deporte.sport}
                                                                    </div>
                                                                ))}
                                                            </div>

                                                </div>
                                            </InputGroup>

                                            <InputGroup For="Categoria" label="Categoria" labelClass="text-gray-700">
                                                <div className="relative" ref={menuOutC} onClick={()=>setMCat(!OpenCat)}>
                                                    <Input type='text' id="Categoria" className="cursor-pointer input w-full pl-6 pr-3 py-3 disabled:text-gray-500 text-balck"  placeholder="Seleccione una Categoria" readOnly  value={isCategory === null? "Seleccione una Categoria"  : `${isCategory}`} required  />
                                                        <Button type="button" className=" cursor-pointer absolute top-1/2 right-1 md:right-1 lg:right-4 flex justify-center -translate-y-1/2 -translate-x-1/2 ">
                                                            <Image
                                                            className={`size-[1rem] transition-transform duration-300 ease-in-out ${OpenCat && isDeport!=='Seleccione un deporte' ? 'rotate-180':' rotate-360'}`}
                                                            src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'}
                                                            alt="desplegar"
                                                            width={100}
                                                            height={100}
                                                        />
                                                        </Button>

                                                        
                                                            <div className={`absolute z-20 bg-white shadow-lg mt-1.5 rounded-xl overflow-hidden overflow-y-auto ${OpenCat? 'w-full h-auto' : 'max-h-0 opacity-0  pointer-events-none'}`} >
                                                                {categoria?.categoria.map((cat)=>(
                                                                    <div key={cat.id} id={cat.category} className="w-full flex gap-2 p-2 hover:bg-unimar/15 place-items-center" onClick={()=>handleSelectC(cat.id, cat.category)}>
                                                                        <Image
                                                                            className="size-[2rem] bg-unimar rounded-full "
                                                                            src={cat.img}
                                                                            alt={`${cat.category}`}
                                                                            width={100}
                                                                            height={100}
                                                                        />
                                                                        {cat.category}
                                                                    </div>
                                                                ))}
                                                            </div>                                                                    
                                                </div>
                                            </InputGroup>                                                

                                        <InputGroup For="Torneo" label="Nombre del Torneo"  labelClass="text-gray-700" className="md:col-span-2">
                                            <div className="relative">
                                                <Input type="text" id="Torneo" className="input w-full pl-6 pr-3 py-3 placeholder:text-black" placeholder="Copa Unimar Primavera 2025" disabled/>
                                            </div>                                                    
                                        </InputGroup>

                                        <div className=" border-l-4 border-unimar col-span-2 p-4 bg-gray-300 rounded-xl mb-3">
                                            <span>
                                                La fecha de las inscripciones para este torneo son hasta el xxx  
                                            </span>
                                        </div>
                                    </div>

                                    
                                </section>
                                
                            </>
                        )}
                        
                        {isSept ===2 &&(
                            <>
                                <section className="flex flex-col py-4 px-3 shadow rounded-xl bg-gray-100/75">

                                    <div className="section-title  flex flex-col space-y-3">
                                        <div className="flex place-items-center mt-3 gap-2 ml-2">
                                            <div className="relative size-[52px] bg-unimar rounded-2xl">
                                                <Image
                                                    className=" absolute inset-0 object-contain scale-120"
                                                    src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759870087/Gemini_Generated_Image_eew6jreew6jreew6-removebg-preview_dqebiq.png'}
                                                    alt="lol"
                                                    fill
                                                />
                                            </div>
                                            <div className="text-start">
                                                <h3 className="text-[1.3rem] font-bold text-unimar">Nombre del Torneo</h3>
                                            </div>
                                        </div>

                                        
                                                <div className="py-2 px-4 gap-3 place-content-center text-start space-y-3.5 lg:space-y-1 mb-3 flex flex-col">
                                                        <div className="bg-white p-4 rounded-2xl shadow-md flex gap-3">
                                                            <div className=" relative size-[48px] bg-unimar rounded-full">
                                                                <Image
                                                                    className=" absolute inset-0 object-contain scale-55"
                                                                    src={'/calend.png'}
                                                                    alt="lol"
                                                                    fill
                                                                />
                                                            </div>
                                                            <div className=" items-center">
                                                                <h3 className="text-[1.1rem] font-bold ">Fechas Clave</h3>
                                                                <div className="font-medium text-gray-700">
                                                                    <p>Inscripciones: 15 de Agosto - 25 de Agosto</p>
                                                                    <p>Inicio del Torneo: 1 de Septiembre</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid md:grid-cols-2 gap-3">
                                                            <div className="bg-white p-4 rounded-2xl shadow-md">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="relative size-[48px] bg-unimar rounded-full">
                                                                        <Image
                                                                            className=" absolute inset-0 object-contain"
                                                                            src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759870088/Group_365_no_blue_wkn7xq.png'}
                                                                            alt="lol"
                                                                            fill
                                                                        />
                                                                    </div>
                                                                    <div className="text-start">
                                                                        <h3 className="text-[1.1rem] font-bold text-black">Deporte</h3>
                                                                        <p className="font-medium text-gray-700">Futbol Sala</p>
                                                                    </div>
                                                                </div>
                                                            </div>   

                                                            <div className="bg-white p-4 rounded-2xl shadow-md">
                                                                <div className="flex items-center  text-gray-700  gap-3">
                                                                    <div className="relative size-[48px] bg-unimar rounded-full">
                                                                        <Image
                                                                            className=" absolute inset-0 object-contain scale-70"
                                                                            src={'/categorias.png'}
                                                                            alt="lol"
                                                                            fill
                                                                        />
                                                                    </div>
                                                                    <div className="text-start">
                                                                        <h3 className="text-[1.1rem] font-bold text-black ">Categoria</h3>
                                                                        <p className=" font-medium text-gray-700">Categoria --</p>
                                                                    </div>
                                                                </div>
                                                            </div>                                                         
                                                        </div>
                                                        
                                                        <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-center gap-3">

                                                                <div className="flex  gap-1.5">
                                                                    <div className="relative size-[48px] bg-unimar rounded-full">
                                                                        <Image
                                                                            className=" absolute inset-0 object-contain"
                                                                            src={'/normas.png'}
                                                                            alt="lol"
                                                                            fill
                                                                        />
                                                                    </div>
                                                                    <div >
                                                                        <h3 className="text-[1.1rem] font-bold ">Reglamento de la Disciplina</h3>
                                                                        <p>consulte las reglas antes de inscribirse.</p>
                                                                    </div>
                                                                </div>
                                                                <Button className="cursor-pointer bg-unimar/20 px-4 py-2 rounded-xl flex gap-1.5 items-center font-bold text-unimar">
                                                                    <Image
                                                                        className="size-8"
                                                                        src={'/R-02.png'}
                                                                        alt="descargar"
                                                                        width={500}
                                                                        height={500}
                                                                    />
                                                                    <p>Descargar</p>
                                                                </Button>

                                                        </div> 
                                                </div>
                                        
                                    </div>
                                    
                                </section>
                                
                            </>
                        )}

                            {isSept ===3 &&(
                            <>
                                <section className="flex flex-col py-4 px-3 shadow rounded-xl bg-gray-100">

                                    <div className="section-title  flex flex-col space-y-4">
                                        <div className="flex place-items-center mt-3 gap-2 ml-2">
                                            <div className="relative size-[52px] bg-unimar rounded-full">
                                                <Image
                                                    className=" absolute inset-0 object-contain scale-60"
                                                    src={'/silueta-de-usuarios-de-pareja.png'}
                                                    alt="lol"
                                                    fill
                                                />
                                            </div>
                                            <div className="text-start">
                                                <h3 className="text-[1.3rem] font-bold">Información del Equipo</h3>
                                            </div>
                                        </div>

                                        <div className="flex flex-col border-b-2 border-gray-400">
                                                <div className="lg:grid lg:grid-cols-2 py-4 mb-6 px-2 gap-3 place-content-center ">
                                                    <div className="text-start space-y-3">
                                                        <InputGroup label="Nombre del equipo" className="" For="nombre">
                                                            <Input className="input bg-white" name="" type="text"></Input>
                                                        </InputGroup> 
                                                        <InputGroup label="Madriana del equipo" className="" For="nombre">
                                                            <Input className="input bg-white" type="text"/>
                                                        </InputGroup> 
                                                        <InputGroup label="Color del uniforme" className="" For="nombre">
                                                            <Input className="input bg-white col-start-3" type="text"/>
                                                        </InputGroup>                                                             
                                                    </div>
                                                    <InputGroup label="Logo del equipo" className="text-start" For="nombre">
                                                        <Input className="hidden" id="sumitFile" type="file" accept="image/*"/>
                                                        <div className=" items-center p-1 h-full">
                                                            <label htmlFor="sumitFile" className="flex flex-col  h-full
                                                                rounded-lg border-2 border-dashed  bg-white hover:bg-white/60 text-center cursor-pointer
                                                                font-bold py-1  mb-1 place-items-center justify-center">
                                                                <div className="relative size-[58px] rounded-2xl">
                                                                    <Image
                                                                        className=" absolute inset-0 object-contain p-2"
                                                                        src={'/file.svg'}
                                                                        alt="lol"
                                                                        fill
                                                                    />
                                                                </div>
                                                                <p>Subir un Archivo</p>
                                                            </label>
                                                            
                                                        </div>
                                                    </InputGroup> 
                                                </div>
                                        </div>


                                    </div>


                                    <div className="flex flex-col space-y-5 py-4 px-2 border-b-2 border-gray-400">
                                        <div className="flex place-items-center mt-3 gap-2">
                                            <div className="relative size-[52px] bg-unimar rounded-full">
                                                <Image
                                                    className=" absolute inset-0 object-contain scale-50"
                                                    src={'/usuario.png'}
                                                    alt="lol"
                                                    fill
                                                />
                                            </div>
                                            <div className="text-start">
                                                <h3 className="text-[1.3rem] font-bold">Información del Delegado</h3>
                                            </div>
                                        </div>
                                        <div className="text-start space-y-3 flex flex-col lg:flex-row gap-3 p-2 ">
                                            <InputGroup label="Correo institucional del delegado" className="w-full" For="nombre">
                                                <Input className="input bg-white" name="" type="text"></Input>
                                            </InputGroup> 
                                            <InputGroup label="Numero del Telefono" className="w-full" For="nombre">
                                                <Input className="input bg-white" type="text"/>
                                            </InputGroup>                                                            
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-5 py-4 px-2">
                                        <div className="flex place-items-center mt-3 gap-2 ml-2">
                                            <div className="relative size-[52px] bg-unimar rounded-full">
                                                <Image
                                                    className=" absolute inset-0 object-contain scale-70"
                                                    src={'/usuarios-de-grupo.png'}
                                                    alt="lol"
                                                    fill
                                                />
                                            </div>
                                            <div className="text-start">
                                                <h3 className="text-[1.3rem] font-bold">Información de los Integrantes del Equipo</h3>
                                            </div>
                                        </div>                                                    
                                        
                                        <div className="text-start  flex flex-wrap gap-3 p-4 bg-gray-200/65 shadow-md rounded-lg ">
                                            <InputGroup label="Dorsal" className="w-[64px]" For="Dorsal">
                                                <Input className="input bg-white"id="Dorsal" type="text"></Input>
                                            </InputGroup> 
                                            <InputGroup label="Cédula" className="" For="nombre">
                                                <Input className="input bg-white" name="" type="text"></Input>
                                            </InputGroup> 
                                            <InputGroup label="Correo institucional" className="" For="nombre">
                                                <Input className="input bg-white" name="" type="text"></Input>
                                            </InputGroup> 
                                            <InputGroup label="Numero del Telefono" className="" For="nombre">
                                                <Input className="input bg-white" type="text"/>
                                            </InputGroup>
                                        </div>
                                            <Button className="flex items-center text-white place-content-center hover:bg-unimar/92 gap-1.5 cursor-pointer bg-unimar p-2 rounded-2xl">
                                                <div className="relative size-[32px]">
                                                    <Image
                                                        className=" absolute inset-0 object-contain scale-80"
                                                        src={'/ubicacion.png'}
                                                        alt="lol"
                                                        fill
                                                    />
                                                </div>
                                                <p className=" font-bold">Añadir integrante</p>
                                            </Button>  
                                    </div>
                                    
                                </section>
                                
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>

                

            </div>

            <FooterModal className="flex-none" BTmain={isSept > 1 ? (isSept > 2 ? 'Finalizar Inscripción': 'Siguiente'):'Siguiente'} BTSecond={isSept > 1 ? 'Atras': (isSept > 2 ? 'Atras': 'Cerrar')} onClose={ isSept > 1? prev: (isSept > 2 ? prev :  handleCloseModal)} onSumit={isSept > 1 ? (isSept > 2 ?  handleCloseModal :  next) : next}/>
                
            
        </ContainModal>
  )
}
