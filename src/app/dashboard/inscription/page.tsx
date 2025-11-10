'use client'
import React from 'react'
import Table_Usuarios_Inscritos from '@/components/sections_Dashboard/inscriptions/table_usuarios_inscritos';
import Table_Subscripts from '@/components/sections_Dashboard/inscriptions/table_subscripts';
import Table_Teams from '@/components/sections_Dashboard/inscriptions/table_teams_inscritos';

export default function page() {
  return (
    <div className="Case2 overflow-y-auto text-black">

        <Table_Teams/>
        <Table_Usuarios_Inscritos/>         
        <Table_Subscripts/>

    </div>
  )
}

