import React, { useState, useEffect } from 'react';
import { LineChart, Line,AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
interface EvolutionData {
    tournament_name: string;
    tournament_id: number;
    entries_count: number;
}

const API_URL_EVOLUTION = 'http://localhost:8000/api/analytics/tournament-evolution';

export default function TournamentEvolutionChart() {
    const [data, setData] = useState<EvolutionData[]>([]); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvolution = async () => {
            try {
                const response = await fetch(API_URL_EVOLUTION);
                if (!response.ok) throw new Error(`Error de API: ${response.status}`);
                
                const json: EvolutionData[] = await response.json(); 
                setData(json);

            } catch (error) {
                console.error('Error al obtener la evolución de torneos:', error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvolution();
    }, []);

    if (isLoading) return <div className="text-center p-4">Cargando evolución de torneos...</div>;
    if (data.length === 0) return <div className="text-center p-4">Historial de torneos insuficiente.</div>;

return (
        <div className="bg-white p-6 rounded-lg shadow-md ">
            <h3 className="text-xl font-semibold mb-4">Evolución de Inscripciones (Últimos {data.length} Torneos)</h3>
            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tournament_name" /> 
                    <YAxis dataKey="entries_count" />
                    <Tooltip 
                        formatter={(value, name) => ([`${value} Inscripciones`, name])}
                    />
                    <Legend />
                    <Area 
                        type="monotone" 
                        dataKey="entries_count" 
                        name="Inscripciones Aceptadas" 
                        stroke="#1F77B4" 
                        fill="#1F77B4"
                        fillOpacity={0.3} 
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}