import React, { useState, useEffect } from 'react';
import { BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PopularSportsData {
    name: string;
    value: number;
    percentage: number; 
    color: string;
}

const API_URL_SPORTS = 'http://localhost:8000/api/analytics/popular-sports';

export default function PopularSportsBarChart() {
    const [data, setData] = useState<PopularSportsData[]>([]); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL_SPORTS);
                if (!response.ok) throw new Error(`Error de API: ${response.status}`);
                
                const json: any = await response.json(); 
                
                if (Array.isArray(json)) {
                    setData(json); 
                } else if (json.data && Array.isArray(json.data)) {
                    setData(json.data);
                } else {
                    setData([]); 
                }

            } catch (error) {
                console.error('Error al obtener datos de Deportes Populares:', error);
                setData([]); 
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div className="text-center p-4">Cargando deportes populares...</div>;
    if (data.length === 0) return <div className="text-center p-4">No hay inscripciones aceptadas para calcular popularidad.</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Deportes populares por evento</h3>
            <ResponsiveContainer width="100%" height={300}>
<BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                        dataKey="value" 
                        radius={[5, 50, 50, 30]}
                    >
                        {
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}