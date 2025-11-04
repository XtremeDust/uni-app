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

 import Tabla_Rsport from '@/components/sections_Dashboard/regulations/Table_Rsport'
import Table_Rtorneo from '@/components/sections_Dashboard/regulations/Table_Rtorneo'
import Table_Ractivity from '@/components/sections_Dashboard/regulations/Table_Ractivity'

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

const buttons = [
    {id:1, button:"Desacargar", img:"/bandeja-de-descarga.png"},
    {id:2, button:"Editar", img:"/lapiz (1).png"},
    {id:3, button:"Eliminar", img:"/basura (1).png"}
]


export default function page() {
    
  return (
      <div className="Case2 overflow-y-auto text-black">
              <section className="grid grid-cols-1  space-y-3 lg:space-y-0 lg:gap-6 mb-4">

                  <Table_Ractivity/>
                  <Table_Rtorneo/>
                  <Tabla_Rsport/>

                  

              </section>

      </div>  
  )
}
