'use client'
import React from 'react'

import Tabla_Rsport from '@/components/sections_Dashboard/regulations/Table_Rsport'
import Table_Rtorneo from '@/components/sections_Dashboard/regulations/Table_Rtorneo'
import Table_Ractivity from '@/components/sections_Dashboard/regulations/Table_Ractivity'
import Tabla_Rdisciplina from '@/components/sections_Dashboard/regulations/Tabla_Rdisciplina'

export default function page() {
    
  return (
      <div className="Case2 overflow-y-auto text-black">
              <section className="grid grid-cols-1  space-y-3 lg:space-y-0 lg:gap-6 mb-4">
                  <Table_Ractivity/>
                  <Table_Rtorneo/>
                  <Tabla_Rdisciplina/>
                  <Tabla_Rsport/>
              </section>

      </div>  
  )
}
