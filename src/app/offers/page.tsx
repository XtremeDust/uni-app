import Footer from "@/components/common/footer/MainFooter";
import Header from "@/components/common/header/MainHeader";
import Offerts from "@/components/sections_Main/offerts/offerts";
import { Banner } from "@/types/ui_components";

export default function sportOffers (){
    return(
        <div className="grid grid-rows-[auto_1fr_auto] min-h-dvh">
            <Header/>
            <main className="bg-gray-50 text-black space-y-5">
                <Banner 
                    SRC="https://res.cloudinary.com/dnfvfft3w/image/upload/v1758470460/Lucid_Origin_A_dynamic_wideformat_cinematic_photo_in_the_style_0_qx2poq.jpg"
                    ALT="banner">
                 </Banner>
                <Offerts></Offerts>
            </main>
            <Footer/>
        </div>
    );
}