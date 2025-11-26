'use client'
import React from "react";
import Acciones_Rapidas from '@/components/sections_Dashboard/home/acciones_rapidas'
import Grafica from '@/components/sections_Dashboard/home/grafica'
import Informacion from "@/components/sections_Dashboard/home/informacion";
import EnrollmentPieChart from "@/components/sections_Dashboard/home/EnrollmentPieChart";
import PopularSportsBarChart from "@/components/sections_Dashboard/home/PopularSportsBarChart";
import KpiSummaryCards from "@/components/sections_Dashboard/home/KpiSummaryCards";
import GameProgressPieChart from "@/components/sections_Dashboard/home/GameProgressPieChart";
import TournamentEvolutionChart from "@/components/sections_Dashboard/home/TournamentEvolutionChart";

export default function page(){
            return(
                    <div className="Case1 overflow-y-auto">
                           {/*
                            <section>
                                <Informacion/>
                                
                            </section>
                           */}
                            <section>
                                <KpiSummaryCards/>
                            </section>  

                            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 space-y-3 lg:space-y-0 lg:gap-6 mb-4 text-black">
                                <PopularSportsBarChart/>
                                <EnrollmentPieChart/>    
                                <Acciones_Rapidas/>
                            </section>

                            {/**
                                <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 space-y-3 lg:space-y-0 lg:gap-6 mb-4 text-black">
                                    <Grafica/>
                                </section>
                             */}
                            
                            <section className="grid grid-cols-1 lg:grid-cols-2 space-y-3 lg:space-y-0 lg:gap-6 mb-4 text-black">
                                <TournamentEvolutionChart/>
                                <GameProgressPieChart/>
                            </section>

                    </div>  
            );
}