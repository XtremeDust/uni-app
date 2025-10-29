'use client'
import React from "react";
import Image from "next/image";


export default function page(){
            return(
                    <div className="Case1 overflow-y-auto">
                            <section>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                                    <div className="bg-white p-5 text-black rounded-lg shadow flex flex-col justify-between h-32">
                                        <p className="text-gray-500">Atletas Total Inscritos</p>
                                        <p className="text-3xl font-bold ">150</p>
                                    </div>
                                    <div className="bg-white p-5 text-black rounded-lg shadow flex flex-col justify-between h-32">
                                        <p className="text-gray-500">Ofetas Activas</p>
                                        <p className="text-3xl font-bold">20</p>
                                    </div>
                                    <div className="bg-white p-5 text-black rounded-lg shadow flex flex-col justify-between h-32">
                                        <p className="text-gray-500">Solicitudes Pendientes</p>
                                        <p className="text-3xl font-bold">50</p>
                                    </div>
                                    <div className="bg-white p-5 text-black rounded-lg shadow flex flex-col justify-between h-32">
                                        <p className="text-gray-500">Tasa de inscripción</p>
                                        <p className="text-3xl font-bold text-green-500">1,250</p>
                                        <p className="text-lg text-red-500">850</p>
                                    </div>
                                </div>
                            </section>

                            <section className="grid grid-cols-1 lg:grid-cols-3 space-y-3 lg:space-y-0 lg:gap-6 mb-4 text-black">

                                <div className="bg-white p-6 rounded-lg shadow col-span-2">
                                <h3 className="text-xl font-semibold mb-6">Deportes populares por evento</h3>
                                <div className="grafica">
                                    <div className="grid grid-rows-2">
                                    <div className="flex flex-row justify-between">
                                    <h3 className="text-lg mb-1">Fútbol</h3>
                                    <h3>50%</h3>
                                    </div>
                                    <div className="bg-gray-200 relative shadow-md rounded-4xl overflow-hidden">
                                        <div className="bg-blue-500 absolute inset-0 w-[50%] rounded-3xl"/>
                                    </div>
                                    </div>
                                    <div className="grid grid-rows-2">
                                    <div className="flex flex-row justify-between">
                                    <h3 className="text-lg mb-1">Voleibol</h3>
                                    <h3>23%</h3>
                                    </div>
                                    <div className="bg-gray-200 relative shadow-md rounded-4xl overflow-hidden">
                                        <div className="bg-green-500 absolute inset-0 w-[23%] rounded-3xl"/>
                                    </div>
                                    </div>
                                    <div className="grid grid-rows-2">
                                    <div className="flex flex-row justify-between">
                                    <h3 className="text-lg mb-1">Basquet</h3>
                                    <h3>18%</h3>
                                    </div>
                                    <div className="bg-gray-200 relative shadow-md rounded-4xl overflow-hidden">
                                        <div className="bg-yellow-500 absolute inset-0 w-[18%] rounded-3xl"/>
                                    </div>
                                    </div>
                                    <div className="grid grid-rows-2">
                                    <div className="flex flex-row justify-between">
                                    <h3 className="text-lg mb-1">Otros</h3>
                                    <h3>9%</h3>
                                    </div>
                                    <div className="bg-gray-200 relative shadow-md rounded-4xl overflow-hidden">
                                        <div className="bg-red-500 absolute inset-0 w-[9%] rounded-3xl"/>
                                    </div>
                                    </div>
                                </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow">
                                    <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
                                    <section className="flex flex-col gap-3">

                                    <div className="flex flex-row gap-2 cursor-pointer">
                                        <div className="bg-amber-200 rounded-2xl">
                                        <Image
                                            className="scale-80 size-14"
                                            src={'/calend.png'}
                                            alt=""
                                            width={500}
                                            height={500}
                                        />
                                        </div>
                                        <div>
                                        <h3 className="text-lg font-semibold">Crear un nuevo evento</h3>
                                        <p>Configura los detalles y publica</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2 cursor-pointer">
                                        <div className="bg-blue-200 rounded-2xl">
                                        <Image
                                            className="scale-80 size-14"
                                            src={'/calend.png'}
                                            alt=""
                                            width={500}
                                            height={500}
                                        />
                                        </div>
                                        <div>
                                        <h3 className="text-lg font-semibold">Crear un nuevo evento</h3>
                                        <p>Configura los detalles y publica</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2 cursor-pointer">
                                        <div className="bg-green-200 rounded-2xl">
                                        <Image
                                            className="scale-80 size-14"
                                            src={'/calend.png'}
                                            alt=""
                                            width={500}
                                            height={500}
                                        />
                                        </div>
                                        <div>
                                        <h3 className="text-lg font-semibold">Ver inscripciones recientes</h3>
                                        <p>Revisa las últimas solicitudes</p>
                                        </div>
                                    </div>
                                    </section>

                                </div>

                            </section>

                    </div>  
            );
}