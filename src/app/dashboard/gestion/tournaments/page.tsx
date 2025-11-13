'use client'
import React from 'react'
import Table_Games from '@/components/sections_Dashboard/torneos/Table_Games'
import Table_Torneos from '@/components/sections_Dashboard/torneos/Table_Torneos'

export default function page() {

  return (
    <div className="Case2 overflow-y-auto text-black">
        <section className="grid grid-cols-1 space-y-3 lg:space-y-0 lg:gap-6 mb-4">
            <Table_Torneos/>
            <Table_Games/>
        </section>
    </div>
  )
}




