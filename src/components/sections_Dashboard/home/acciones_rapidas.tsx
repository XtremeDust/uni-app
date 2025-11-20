import React, { useState } from 'react'
import Image from "next/image";
import { Button } from '@/types/ui_components';
import Modal_AddSport from '../sports/modal_Addsport';
import Modal_addTorneos from '../torneos/modal_AddTorneos';
import Modal_addDiscipline from '../torneos/modal_Adddisciplinas';
import Modal_addTeams from '../inscriptions/modal_AddTeam';
import Modal_addRegulation from '../regulations/Modal_addRegulation';


const acciones = [
    {id:1,accion:'deporte', url:'', img:'/deporte (2).png', color:'bg-amber-300'},
    //{id:2,accion:'reglamento', url:'', img:'/reglamento (1).png', color:'bg-rose-300'},
    {id:3,accion:'torneo', url:'', img:'/torneo (1).png', color:'bg-green-300'},
    {id:4,accion:'inscripcion', url:'', img:'/reglamento (1).png', color:'bg-cyan-300'},
    //{id:5,accion:'partido', url:'', img:'/versus.png', color:'bg-orange-300'},
]

export default function Acciones_Rapidas() {

    const [modalState , setModalState] = useState({
        deporte:false,
        torneo:false,
        reglamento:false,
        inscripcion:false,
        partido:false,
    })

    const handleAccionClick = (accion:string)=>{
        if (accion === 'deporte'){
            setModalState(prev => ({ ...prev, deporte: true }));
        }
        if (accion === 'torneo') {
            setModalState(prev => ({ ...prev, torneo: true }));
        }
        if (accion === 'reglamento') {
            setModalState(prev => ({ ...prev, reglamento: true }));
        }
        if (accion === 'inscripcion') {
            setModalState(prev => ({ ...prev, inscripcion: true }));
        }
    }

    const handleClose = (modalName: string) => {
        setModalState(prev => ({ ...prev, [modalName]: false }));
    };

  return (
    <div className="bg-white p-6 rounded-lg shadow col-span-2 xl:col-span-1">
        <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
        <section className="flex flex-col  gap-3">
            {acciones.map((a)=>(
                <Button key={a.id} className="flex flex-row gap-5 cursor-pointer bg-gray-100 hover:bg-gray-200 shadow rounded-lg p-2 items-center "
                onClick={()=>(handleAccionClick(a.accion), console.log(a.accion))}
                >
                    <div className={`rounded-full  w-16 overflow-hidden ${a.color}`}>
                    <Image
                        className="scale-100"
                        src={a.img}
                        alt={a.accion}
                        width={500}
                        height={500}
                    />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-start">Crear un nuevo {a.accion}</h3>
                    </div>
                </Button>
            ))}
        </section>

        {modalState.deporte && (
            <Modal_AddSport
                state={modalState.deporte}
                onClose={() => handleClose('deporte')}
            />
        )}

        {modalState.torneo && (
            <Modal_addTorneos
                state={modalState.torneo}
                onClose={() => handleClose('torneo')}    
            />
        )}

        {modalState.inscripcion &&(
            <Modal_addTeams
                state={modalState.inscripcion}
                onCloseExternal={()=> handleClose('inscripcion')}
            />
        )}

        {/*modalState.reglamento &&(
            <Modal_addRegulation
                state={modalState.reglamento}
                onClose={()=>handleClose('reglamento')}
            />
        )*/}
    </div>
  )
}
