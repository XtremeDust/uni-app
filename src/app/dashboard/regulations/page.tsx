'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { 
  Input,
  Button, 
  Select, 
  Table, 
  TableBody, TableCell, TableRow,
  TableHead, TableHeaderCell
 } from '@/types/ui_components'

const titlesreglas=[
    {id:1, titulo:"Documento"},
    {id:2, titulo:"Versión"},
    {id:3, titulo:"Fecha de Publicación"},
    {id:4, titulo:"Acciones"},
]

const tablareglas =[
    { id: 1, nombre: "Reglamneto General de Deportes", version:'V2.1', actualizacion: "15/03/2023" },
    { id: 2, nombre: "Normativa de Uso de Instalaciones", version:'V1.1', actualizacion: "01/02/2024" },
]

const titlesreglasdeporte=[
    {id:1, titulo:"Deporte"},
    {id:2, titulo:"Documento"},
    {id:3, titulo:"Última Actualización"},
    {id:4, titulo:"Acciones"},
]

const tablareglasdeporte=[
    { id: 1, nombre: "Inter-Copa", Documento:'Bases del Torneo Interfacultades', actualizacion: "10/09/2025" },
    { id: 2, nombre: "Copa Aniversario Unimar", Documento:'Reglas Especificas Copa Aniversario', actualizacion: "11/05/2025" },
]

const titlesreglasevento=[
    {id:1, titulo:"Evento"},
    {id:2, titulo:"Documento"},
    {id:3, titulo:"Fecha del Evento"},
    {id:4, titulo:"Acciones"},
]

const tablareglasevento=[
    { id: 1, nombre: "Futbol Sala", Documento:'Reglamento Especifico Futbol Sala', FechaE: "Septiembre 2025" },
    { id: 2, nombre: "Baloncesto", Documento:'Reglamento Especifico Futbol Sala', FechaE: "Noviembre 2025" },
]

const buttons = [
    {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]


export default function page() {
    
  return (
      <div className="Case2 overflow-y-auto text-black">
              <section className="grid grid-cols-1  space-y-3 lg:space-y-0 lg:gap-6 mb-4">

                  <div className="bg-white p-6 rounded-lg shadow ">

                      <div className="flex justify-between">
                          <h3 className="text-2xl font-bold mb-6">Reglas Generales</h3>
                          <Button className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0">
                              <Image
                              className="size-5"
                                  src={'/mas.png'}
                                  alt="plus"
                                  width={500}
                                  height={500}
                              />
                                <h3 className="font-semibold">Añadir Regla</h3>
                          </Button>
                      </div>

                      <div className="Filtro grid grid-rows-2 md:flex items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
                          
                              <div className="relative w-full flex ">
                                  <label htmlFor='buscar' className="h-full place-content-center absolute left-0 px-2 pl-3.5 cursor-pointer rounded-2xl">
                                      <Image
                                          className="size-8"
                                          src={'/lupa.png'}
                                          alt="buscar"
                                          width={60}
                                          height={60}
                                      />
                                  </label>
                                  <Input type="text" id="buscar" className="bg-gray-50 focus:ring-[1px]  focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-18 pr-3 py-3" placeholder="Buscar" required/>
                                  
                                      <Button className="h-full items-center px-2 pr-4 absolute right-0 rounded-2xl cursor-pointer ">
                                          <Image
                                              className="size-4"
                                              src={'/cerca.png'}
                                              alt="buscar"
                                              width={60}
                                              height={60}
                                          />
                                      </Button>
                              </div>
                          
                              <div className="relative">
                                  <Input type="date" id="fecha" className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-3 pr-3 py-3" required/>
                              </div>
                          
                      </div>

                      <Table className="w-full">
                          <TableHead className="text-gray-100  bg-unimar">
                              {titlesreglas.map((titulos)=>(
                                  <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-end font-semibold ">
                                      {titulos.titulo}
                                  </TableHeaderCell>
                              ))}
                          </TableHead>

                          <TableBody className="bg-white divide-y divide-gray-200">
                              {tablareglas.map((data)=>(
                                  <TableRow key={data.id} className="hover:bg-gray-100 text-center">
                                      <TableCell className="font-bold">{data.nombre}</TableCell>
                                      <TableCell>{data.version}</TableCell>
                                      <TableCell>{data.actualizacion}</TableCell>
                                      <TableCell className="space-x-2 flex justify-evenly text-white">
                                          {buttons.map((btn)=>(
                                              <Button key={btn.id} className={`btn rounded-lg cursor-pointer size-14 ${btn.id ===1? 'hover:bg-unimar/10' : (btn.id===2? 'hover:bg-gray-300/50': 'hover:bg-rose-300/50' )}`}>
                                                  <Image
                                                      src={btn.img}
                                                      alt={btn.button}
                                                      width={500}
                                                      height={500}
                                                  />
                                              </Button>
                                          ))}
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>    
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex justify-between">
                          <h3 className="text-2xl font-bold mb-6">Reglas por deporte</h3>
                          <Button className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0">
                              <Image
                              className="size-5"
                                  src={'/mas.png'}
                                  alt="plus"
                                  width={500}
                                  height={500}
                              />
                                <h3 className="font-semibold">Añadir Regla</h3>
                          </Button>
                      </div>

                      <div className="Filtro grid grid-rows-2 md:flex items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
                          
                              <div className="relative w-full flex ">
                                  <label htmlFor='buscar' className="h-full place-content-center absolute left-0 px-2 pl-3.5 cursor-pointer rounded-2xl">
                                      <Image
                                          className="size-8"
                                          src={'/lupa.png'}
                                          alt="buscar"
                                          width={60}
                                          height={60}
                                      />
                                  </label>
                                  <Input type="text" id="buscar" className="bg-gray-50 focus:ring-[1px]  focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-18 pr-3 py-3" placeholder="Buscar" required/>
                                  
                                      <Button className="h-full items-center px-2 pr-4 absolute right-0 rounded-2xl cursor-pointer ">
                                          <Image
                                              className="size-4"
                                              src={'/cerca.png'}
                                              alt="buscar"
                                              width={60}
                                              height={60}
                                          />
                                      </Button>
                              </div>
                          
                              <div className="relative">
                                  <Input type="date" id="fecha" className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-3 pr-3 py-3" required/>
                              </div>
                          
                      </div>

                          <Table className="w-full">
                          <TableHead className="text-gray-100  bg-unimar">
                              {titlesreglasdeporte.map((titulos)=>(
                                  <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-center font-semibold ">
                                      {titulos.titulo}
                                  </TableHeaderCell>
                              ))}
                          </TableHead>

                          <TableBody className="bg-white divide-y divide-gray-200">
                              {tablareglasdeporte.map((data)=>(
                                  <TableRow key={data.id} className="hover:bg-gray-100 text-center">
                                      <TableCell className="font-bold">{data.nombre}</TableCell>
                                      <TableCell>{data.Documento}</TableCell>
                                      <TableCell>{data.actualizacion}</TableCell>
                                      <TableCell className="space-x-2 flex justify-evenly text-white">
                                          {buttons.map((btn)=>(
                                              <Button key={btn.id} className={`btn rounded-lg cursor-pointer size-14 ${btn.id ===1? 'hover:bg-unimar/10' : (btn.id===2? 'hover:bg-gray-300/50': 'hover:bg-rose-300/50' )}`}>
                                                  <Image
                                                      src={btn.img}
                                                      alt={btn.button}
                                                      width={500}
                                                      height={500}
                                                  />
                                              </Button>
                                          ))}
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table> 
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow ">
                      <div className="flex justify-between">
                          <h3 className="text-2xl font-bold mb-6">Reglas por evento</h3>
                          <Button className="bg-unimar flex items-center gap-2 hover:bg-unimar/90 cursor-pointer h-10 text-white rounded-2xl px-4 py-7 md:py-0">
                              <Image
                              className="size-5"
                                  src={'/mas.png'}
                                  alt="plus"
                                  width={500}
                                  height={500}
                              />
                                <h3 className="font-semibold">Añadir Regla</h3>
                          </Button>
                      </div>       

                      <div className="Filtro flex items-center mb-6 gap-3 shadow p-3 bg-gray-800/8 rounded-2xl">
                          <div className="relative w-full flex ">
                              <label htmlFor='buscar' className="h-full place-content-center absolute left-0 px-2 pl-3.5 cursor-pointer rounded-2xl">
                                  <Image
                                      className="size-8"
                                      src={'/lupa.png'}
                                      alt="buscar"
                                      width={60}
                                      height={60}
                                  />
                              </label>
                              <Input type="text" id="buscar" className="bg-gray-50 focus:ring-[1px]  focus:ring-unimar focus:outline-none ring ring-gray-400 shadow-md rounded-2xl w-full pl-18 pr-3 py-3" placeholder="Buscar" required/>
                              
                                  <Button className="h-full items-center px-2 pr-4 absolute right-0 rounded-2xl cursor-pointer ">
                                      <Image
                                          className="size-4"
                                          src={'/cerca.png'}
                                          alt="buscar"
                                          width={60}
                                          height={60}
                                      />
                                  </Button>
                          </div>
                      </div>
                      
                      <Table className="w-full">
                          <TableHead className="text-gray-100  bg-unimar">
                              {titlesreglasevento.map((titulos)=>(
                                  <TableHeaderCell key={titulos.id} className="first:rounded-l-lg last:rounded-r-lg p-4 justify-end font-semibold ">
                                      {titulos.titulo}
                                  </TableHeaderCell>
                              ))}
                          </TableHead>

                          <TableBody className="bg-white divide-y divide-gray-200">
                              {tablareglasevento.map((data)=>(
                                  <TableRow key={data.id} className="hover:bg-gray-100 text-center">
                                      <TableCell className="font-bold">{data.nombre}</TableCell>
                                      <TableCell>{data.Documento}</TableCell>
                                      <TableCell>{data.FechaE}</TableCell>
                                      <TableCell className="space-x-2 flex justify-evenly text-white">
                                          {buttons.map((btn)=>(
                                              <Button key={btn.id} className={`btn rounded-lg cursor-pointer size-14 ${btn.id ===1? 'hover:bg-unimar/10' : (btn.id===2? 'hover:bg-gray-300/50': 'hover:bg-rose-300/50' )}`}>
                                                  <Image
                                                      src={btn.img}
                                                      alt={btn.button}
                                                      width={500}
                                                      height={500}
                                                  />
                                              </Button>
                                          ))}
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>  
                  </div>


                  

              </section>

      </div>  
  )
}
