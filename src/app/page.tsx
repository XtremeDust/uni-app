import Image from "next/image";
import Header from "@/components/common/header/MainHeader";
import Footer from "@/components/common/footer/MainFooter";
import {Banner} from "@/types/ui_components";
import Features from "@/components/sections_Main/feacture/featuresSection";
import Comentsection from "@/components/sections_Main/coments/comentSection";
import Univita from "@/components/sections_Main/univita/Univita";



export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-dvh"
    
    >

      {/*Header*/}
      <Header></Header>
      
      {/*content*/}
      <main className="bg-gray-50 text-black space-y-5">          
            <div className="Hero Banner"> 
            <Banner SRC="https://res.cloudinary.com/dnfvfft3w/image/upload/v1758470460/Lucid_Origin_A_dynamic_wideformat_cinematic_photo_in_the_style_0_qx2poq.jpg" ALT="banner"></Banner>
            </div>
            <div className="features">
              <Features/>
            </div>
            <div className="Univita m-0">
              <Univita/>
            </div>
            <div className="Coments p-3 bg-gray-100">
              <Comentsection/>
            </div>
            
      </main>
      {/*Footer*/}
      <Footer></Footer>
    </div>
  );
}
