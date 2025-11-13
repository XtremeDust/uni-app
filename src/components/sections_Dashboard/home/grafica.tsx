import React from 'react'

export default function grafica() {
  return (
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
  )
}
