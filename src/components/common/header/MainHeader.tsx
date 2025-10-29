// header de la page principal
'use client'
import Redes from "@/components/common/footer/socialMedia";
import {pago} from "@/types/headerSection";
import Accordeon from "@/components/common/header/accordionMH"
import React, {useState, useEffect} from "react";
import Image from "next/image";
import {ActiveLink} from "@/components/ui/Router";
import MenuDropdown from "@/components/common/header/menuDropdown";

function Header(){

const [isOpenMenu, setOpenMenu] = useState(false);
let date: Date=new Date();

 const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dolar")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <header>Cargando dólar...</header>;



    return(
    
      <header className=" flex flex-col w-full  items-center text-center justify-center gap-1 bg-blue-50">
          
          {/*Span*/}
          <div className="nav grid w-full overflow-hidden bg-blue-200 pb-1 text-blue-800">
            <section className="mov left flex items-center gap-2">
            <Image
                  src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1756314739/informacion_teugd3.png'}
                      width= {18}
                      height= {18}
                  alt={'info'}
            />
            <p className=" flex flex-none gap-1">
              El valor del dólar, según el BCV, para el día de hoy {`${date.getDate()}/${date.getUTCMonth()+1}/${date.getUTCFullYear()}`}
             <span> es </span>
              <strong> {data.oficial?.promedio.toFixed(2)} </strong> Bs
              
            </p>
            </section>
          </div>

          {/*iconos*/}
          <div className="flex flex-wap p-1 bg-blue-50 w-full justify-between lg:justify-items-stretch">
            {/*iconos izquierdos*/}
            <div className="flex flex-wap w-full h-8 items-center justify-start lg:justify-center">      
              <Redes/>
              {pago.map((icons) =>(
                <a key={icons.id} href={icons.Url}>
                  <img src={icons.icon} alt={icons.red} className={icons.size}/>
                </a>
              ))}              
            </div>

            {/*icono derecho*/}
            <div className="grid col-4">
              <a href="" className="w-28 justify-center">
                <img src="https://res.cloudinary.com/dnfvfft3w/image/upload/v1759370231/online-payments-vertical_k6hpfe.png" alt="login" className="h-full" />
              </a>
            </div>
          </div>

          {/*Navbar*/}
          <div className="nav grid bg-blue-50 px-2 grid-flow-col w-full">
            <nav className="flex md:flex-col xl:flex-row ">

              {/*LOGO unimar*/}
              <div className="grid place-items-center xl:justify-items-normal ">
                <ActiveLink href="https://portalunimar.unimar.edu.ve/home">
                <img src="https://res.cloudinary.com/dnfvfft3w/image/upload/v1759370231/logounimar-25-aniversario_lmjwkc.png" alt="logo unimar" className="w-2/3 md:w-xl  xl:ml-12"/>              
                </ActiveLink>
              </div>

              {/*menu panel*/}
              <div className="md:grid place-content-center xl:justify-end xl:mr-14 h-10 xl:h-auto w-full hidden">
                  <MenuDropdown/>             
              </div>
              
            </nav>

            {/*button menu mobile*/}
            <button className="md:hidden cursor-pointer justify-start" onClick={()=>setOpenMenu(!isOpenMenu)}>
              <img src="https://res.cloudinary.com/dnfvfft3w/image/upload/v1759370748/bars-solid-full_uksvau.svg" alt="menu" className=" size-8"/>
            </button>

          </div>
          
          {/*menu mobile desplegable */}                
          <div className={`w-full transition-all ease-in-out overflow-hidden md:hidden text-black ${isOpenMenu ? ' max-h-screen opacity-100 ' :' max-h-0 opacity-0  pointer-events-none'}`}>
            <Accordeon/>
          </div>


      </header>
    );
}

export default Header;
