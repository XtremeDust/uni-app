// src/components/sections/Dashboard/home/EnrollmentPieChart.tsx

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EnrollmentData {
    name: string;
    value: number; 
    color: string;
}

const API_URL = 'http://localhost:8000/api/analytics/enrollment-stats'; 
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
export default function EnrollmentPieChart() {
    const [data, setData] = useState<EnrollmentData[]>([]); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                const json: EnrollmentData[] = await response.json(); 
                setData(json);
            } catch (error) {
                console.error('Error al obtener datos de Inscripciones:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);


    if (isLoading) return <div className="text-center p-4">Cargando estadísticas de inscripción...</div>;
    if (data.length === 0) return <div className="text-center p-4">No hay datos de inscripción disponibles.</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md outline-none">
            <h3 className="text-xl font-semibold mb-4">Estado de Inscripciones a Disciplinas</h3>
            <ResponsiveContainer className={'outline-none'} width="100%" height={300}> 
                <PieChart className='outline-none'>
                    <Pie
                        data={data as any} 
                        dataKey="value" 
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        innerRadius={60}  
                        
                        labelLine={false}
                        
                        label={({ name, percent, fill }: any) => { 
                            const percentage = (percent * 100)?.toFixed(1) ?? 'N/A';
                            return `${name} ${percentage}%`; 
                        }} 
                        
                    >
                        {data.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color || COLORS[index % COLORS.length]} 
                            />
                        ))}
                    </Pie>
                    
                    <Tooltip 
                        labelClassName='outline-none font-bold'
                        formatter={(value, name, props) => ([`${value} inscripciones`, props.payload.name])}
                    />
                    
                    <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}