import Footer from "@/components/common/footer/MainFooter";
import Header from "@/components/common/header/MainHeader";
import Inscription from "@/components/sections_Main/inscription/content";


export default function inscription(){
    return(
        <div className='grid grid-rows-[auto_1fr_auto] min-h-dvh bg-white'>
            <Header/>
                <main className='bg-gray-50'>
                    <Inscription/>
                </main>
            <Footer/>
        </div>
    );
}