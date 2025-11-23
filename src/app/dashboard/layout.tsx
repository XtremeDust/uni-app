'use client'; 
import React, { Suspense, useState } from 'react'; 
import Header from "@/components/common/dashboard/dashHeader";
import Aside from "@/components/common/dashboard/dashSideBar";
import AsideMobile from "@/components/common/dashboard/dashSideBarMobile";
import Footer from "@/components/common/dashboard/dashFooter";
import ContentRenderer from "@/components/common/dashboard/contentR";
import { useRouter, useSearchParams } from 'next/navigation';
import Auth from '@/components/common/Auth';


function NavigationLogic() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const currentView = parseInt(searchParams.get('view') || '1');

    const handleChange = (newKey: number) => {
        router.push(`?view=${newKey}`);
    };

    const [isToggle, setToggle] = useState(false);
    const handleToggle =()=>{
        setToggle(!isToggle)
    }

    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const isExpanded = isToggle || isHovered;
    
    return (
        <Auth>
            <React.Fragment>
        
                <Header CurrentKey={currentView} onToggle={handleToggle} className="shadow-sm h-16 bg-unimar w-full flex lg:col-start-2 col-span-full" />
        
                <Aside 
                    onNavigate={handleChange} 
                    CurrentKey={currentView}
                    isExpanded={isExpanded} 
                    handleMouseEnter={handleMouseEnter}
                    handleMouseLeave={handleMouseLeave}
                />

                <main className="p-6 md:p-8 bg-gray-100 col-span-full lg:col-auto overflow-y-auto">
                    <ContentRenderer currentKey={currentView} />
                </main>

                <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-2xl z-40 lg:hidden">
                    <AsideMobile onNavigate={handleChange} CurrentKey={currentView} />
                </nav>
            </React.Fragment>
        </Auth>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    
    return (
 
        <div className="grid grid-rows-[auto_1fr_auto] grid-cols-1 lg:grid-cols-[auto_1fr] min-h-dvh bg-gray-200">

            <Suspense fallback={
                <div className="col-span-full grid grid-cols-1  lg:grid-cols-[245px_1fr]">
                    <div className="col-span-full bg-unimar h-16"></div>
                    <div className="col-span-full p-4 text-center text-gray-600">Cargando datos de navegación...</div>
                </div>
            }>
                <NavigationLogic />
            </Suspense>

            <Footer className="bg-white p-3 text-sm text-gray-500 text-center border-t border-gray-200 lg:col-start-2 col-span-full"/>
            
        </div>
    );
}