import React, { HTMLAttributes, useState } from 'react';
import Image from "next/image";
import Avatar from '../../ui/Avatar';

import { menu, Submenu } from '@/types/dashbord/menu'; 
import { view } from 'framer-motion/client';
import { Button, Modal, ContainModal } from '@/types/ui_components';


interface HeaderProps extends HTMLAttributes<HTMLDivElement>{
  CurrentKey:number
  onToggle:()=>void
};

export default function Header({CurrentKey, onToggle,...props}:HeaderProps){
  let activeItem: Submenu | undefined = menu.find(item => item.id === CurrentKey);

  if (!activeItem) {
      menu.map(item => {
          if (item.submenu) {
              const subItem = item.submenu.find(sub => sub.id === CurrentKey);
              if (subItem) {
                  activeItem = subItem;
              }
          }
      });
  }

  const [openModal, setModal] = useState(false);
  const handleModal =()=>{
    setModal(!openModal)
  }

    return(
        <div {...props}>

          <div className='relative flex flex-row place-items-center justify-between py-4 px-6 w-full'>
                
            <div className='flex gap-5 items-center'>
              <Button className='hidden lg:flex cursor-pointer' onClick={onToggle}>
                <Image
                    className='size-6 invert'
                    src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759370748/bars-solid-full_uksvau.svg'}
                    alt='toggal'
                    width={500}
                    height={500}
                  />
              </Button>
                {activeItem?.id &&(
                    <h1 className={`text-xl md:text-2xl xl:text-3xl font-bold`}>{activeItem.section}</h1>
                  )}
            </div>

            <section className='flex  flex-row items-center gap-4'>
              <div className='size-6 cursor-pointer' onClick={handleModal}>
                <Image
                  src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759070639/el-sonar_cgjz7t.png'}
                  alt=''
                  width={500}
                  height={500}
                />
              </div>
              
              <div className={`size-12 rounded-full overflow-hidden flex place-content-center-safe items-center text-white font-semibold bg-gray-500 ring-gray-400`}> {/*bg-univita*/}
                  <Avatar email={'Walas.9519@unimar.edu.ve'}/>                      
              </div>

            </section>

            <div className={`fixed z-40 overflow-hidden inset-0 place-content-center place-items-center transition-all ease-in-out duration-500 
              ${openModal===true ? ' md:max-h-screen delay-400': 'delay-100 max-h-0' }`} onClick={openModal? ()=>handleModal(): ()=>{}} >
                {openModal&&(
                  <div className='flex flex-col absolute top-16 right-20 w-64 bg-gray-200 text-black shadow-2xl rounded-b-md p-0.5 gap-0.5'>
                    <div className='w-full border-l-3 border-b-2 border-green-600 px-6 py-2 rounded-md bg-white'>
                      notificar
                    </div>
                    <div className='w-full border-l-3 border-b-2 border-yellow-400 px-6 py-2 rounded-md bg-white'>
                      notificar
                    </div>
                    <div className='w-full border-l-3 border-b-2 border-red-600 px-6 py-2 rounded-md bg-white'>
                      notificar
                    </div>
                  </div>
                )}    
            </div>

          </div>
        </div>
    );
}