'use client'
import {Button, Modal} from "@/types/ui_components";
import Navigation from "@/components/common/navigation"
import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Banner from "@/components/ui/Banner";
import ModalInscription from "./modal_Inscription";
import Steps from "./steps";
import Benefit from "./benefit";

export function ButtonInscription(){

        const [isHovered, setIsHovered] = useState(false);
        const iconMove = {
            initial: { rotate: 0},
            hover: { 
                rotate: [65,0,180,70],
            },
        };

        const [OpenModal, setModal] = useState(false);
        const handleOpenModal=()=>{
            setModal(true)  ;
        };
        const handleCloseModal=()=>{
            setModal(false);
        };
        
    return(
        <>
            <Banner
                SRC="https://res.cloudinary.com/dnfvfft3w/image/upload/v1758470460/Lucid_Origin_A_dynamic_wideformat_cinematic_photo_in_the_style_0_qx2poq.jpg"
                ALT="banner"
            >
                <>
                    <div className="absolute inset-0 z-10 backdrop-blur-md bg-black/40"/>
                    <section className="flex flex-col text-white absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <h2 className="sm:text-[1.3rem] title text-center font-bold">¡Lleva tu Pasión a la Cancha!</h2>
                        <div className="gap-5 flex flex-col items-center justify-center size-full">
                            <p className=" text-sm md:text-lg text-center w-sm sm:w-[75%]">Tu momento de competir y ganar está a solo un clic. Asegura tu lugar en la línea de salida con un proceso instantáneo y enfocado en ti.</p>
                            <Button className="btn-primary h-[3rem] xl:h-[4rem] flex place-items-center group not-hover:gap-0 hover:gap-3 transition-all"
                                onClick={handleOpenModal} 
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <p className="text-[14px]">¡Asegurar Mi Cupo Ahora!</p>
                                <motion.div className="m-0 group-hover:w-6 h-full relative"
                                    variants={iconMove}
                                    animate={isHovered?'hover':'inicial'}
                                >
                                    <Image
                                        src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759090778/seleccion_wlilfg.png'}
                                        alt="pointer"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </motion.div>    
                            </Button>
                        </div>
                    </section>
                </>
            </Banner>

            <section className=" space-y-10 bg-gray-100">
                <Steps/>
                <Benefit/>
                <Navigation/>
            </section>

            <Modal state={OpenModal}>
                {OpenModal &&(
                    <ModalInscription onCloseExternal={handleCloseModal}/>
                )}
            </Modal>
        </>
    );
}export default ButtonInscription