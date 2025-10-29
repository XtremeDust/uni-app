import Footer from '@/components/common/footer/MainFooter';
import Header from '@/components/common/header/MainHeader';
import {Banner} from '@/types/ui_components';
import Events from '@/components/sections_Main/events/events';

export default function events(){
    return(
        <div className='grid grid-rows-[auto_1fr_auto] min-h-dvh bg-white'>
            <Header/>
                <main className='bg-gray-100'>
                    <Banner 
                        SRC='https://res.cloudinary.com/dnfvfft3w/image/upload/v1758470460/Lucid_Origin_A_dynamic_wideformat_cinematic_photo_in_the_style_0_qx2poq.jpg'
                        ALT='eventos'
                    />
                    <Events/>
                </main>
            <Footer/>
        </div>
    );
}