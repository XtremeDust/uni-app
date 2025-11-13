import React from 'react'

export default function informacion() {
  return (
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
  )
}
