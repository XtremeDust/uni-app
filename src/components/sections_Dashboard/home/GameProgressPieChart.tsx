import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GameProgressData {
    status: string;
    count: number; 
    color: string; 
}

const API_URL_GAMES = 'http://localhost:8000/api/analytics/game-progress';

export default function GameProgressPieChart() {
    const [data, setData] = useState<GameProgressData[]>([]); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGameProgress = async () => {
            try {
                const response = await fetch(API_URL_GAMES);
                if (!response.ok) throw new Error(`Error de API: ${response.status}`);
                
                const json: GameProgressData[] = await response.json(); 
                setData(json);

            } catch (error) {
                console.error('Error al obtener el progreso de juegos:', error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGameProgress();
    }, []);

    if (isLoading) return <div className="text-center p-4">Cargando progreso de partidos...</div>;
    if (data.length === 0) return <div className="text-center p-4">No hay datos de juegos disponibles.</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Progreso de Juegos Activos</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data as any} 
                        dataKey="count" 
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        labelLine={false}
                        label={({ status, count }: any) => { 
                            return `${status}: ${count}`;
                        }} 
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value, name, props) => ([
                            `${value} Partidos`, 
                            props.payload.status
                        ])}
                    />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}