'use client'
import React, { HTMLAttributes, useState, useEffect } from 'react';
import Image from "next/image";
import Avatar from '../../ui/Avatar';
import { menu, Submenu } from '@/types/dashbord/menu'; 
import { Button } from '@/types/ui_components';
import Link from 'next/link'; 

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
  const [unreadCount, setUnreadCount] = useState(0);

  const handleModal = () => {
    setModal(!openModal)
  }

  const checkNotifications = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
        const res = await fetch(`${API_URL}/notifications`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (res.ok) {
            const data = await res.json();
            const unread = data.filter((n: any) => n.read_at === null).length;
            setUnreadCount(unread);
        }
    } catch (error) {
        console.error("Error verificando notificaciones", error);
    }
  };

  useEffect(() => {
    checkNotifications();

    const intervalId = setInterval(checkNotifications, 30000);

    return () => clearInterval(intervalId);
  }, []);


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

        <section className='flex flex-row items-center gap-4'>
          
          <div className='relative size-6 cursor-pointer' onClick={handleModal}>
            <Image
              src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759070639/el-sonar_cgjz7t.png'}
              alt='Notificaciones'
              width={500}
              height={500}
            />

            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
            )}
          </div>

          <div className={`size-12 rounded-full overflow-hidden flex place-content-center-safe items-center text-white font-semibold bg-gray-500 ring-gray-400`}> 
              <Avatar email={'Walas.9519@unimar.edu.ve'}/>                      
          </div>
        </section>

        <div className={`fixed z-40 overflow-hidden inset-0 place-content-center place-items-center transition-all ease-in-out duration-500 
          ${openModal===true ? ' md:max-h-screen delay-400': 'delay-100 max-h-0' }`} onClick={openModal? ()=>handleModal(): ()=>{}} >
            
            {openModal && (
              <div className='flex flex-col absolute top-16 right-20 w-72 bg-white text-black shadow-2xl rounded-lg overflow-hidden border border-gray-200'>
                
                <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-sm">Notificaciones</span>
                    {unreadCount > 0 && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{unreadCount} nuevas</span>}
                </div>

                <div className="p-4 text-center text-sm text-gray-500">
                    {unreadCount > 0 
                        ? `Tienes ${unreadCount} notificaciones sin leer.` 
                        : "No tienes notificaciones nuevas."}
                </div>

                <Link href="/dashboard?view=4" className="block w-full text-center p-3 bg-gray-50 hover:bg-gray-100 text-blue-600 text-sm font-semibold transition-colors border-t border-gray-200">
                    Ver todas las notificaciones
                </Link>
              </div>
            )}    
        </div>

      </div>
    </div>
  );
}