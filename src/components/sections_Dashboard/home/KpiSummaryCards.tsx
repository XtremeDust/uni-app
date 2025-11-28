import React, { useState, useEffect } from 'react';

interface KpiData {
total_entries_accepted: number; 
    pending_requests: number;
    pending_games_load: number;
    finish_rate_percentage: number; 
    inscription_rate_goal: number;
    current_tournament_entries: number;
    current_tournament_name: string;
}

const API_URL_KPIS = 'http://localhost:8000/api/analytics/kpis';

interface CardProps {
    title: string;
    value: string | number;
    subValue?: string;
    colorClass: string;
}

const KpiCard: React.FC<CardProps> = ({ title, value, subValue, colorClass }) => (
    <div className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[200px] border-l-4" style={{ borderColor: colorClass }}>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h2 className={`text-3xl font-bold mb-1 ${colorClass}`}>{value}</h2>
        
        {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
    </div>
);


export default function KpiSummaryCards() {
    const [kpis, setKpis] = useState<KpiData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchKpis = async () => {
            try {
                const response = await fetch(API_URL_KPIS);
                if (!response.ok) throw new Error(`Error de API: ${response.status}`);
                const json: KpiData = await response.json(); 
                setKpis(json);
            } catch (error) {
                console.error('Error al obtener KPIs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchKpis();
    }, []);

    if (isLoading) return <div className="text-center p-4">Cargando indicadores clave...</div>;
    if (!kpis) return <div className="text-center p-4 text-red-500">No se pudieron cargar los datos de KPI.</div>;

    return (
        <div className="flex flex-wrap gap-4 justify-between mb-6">
                <KpiCard
                    title="Total de Inscripciones Aceptadas"
                    value={kpis.total_entries_accepted.toLocaleString()} 
                    colorClass="text-blue-600"
                />
                <KpiCard
                    title={`Inscripciones Torneo`}
                    value={kpis.current_tournament_entries.toLocaleString()} 
                    subValue={`${kpis.current_tournament_name}`}
                    colorClass="text-green-600"
                />

                <KpiCard
                    title="Solicitudes Pendientes"
                    value={kpis.pending_requests.toLocaleString()}
                    colorClass="text-yellow-600"
                />

                <KpiCard
                    title="Carga Partidos Pendientes"
                    value={kpis.pending_games_load.toLocaleString()}
                    colorClass="text-red-600"
                />

                <KpiCard
                    title="% Partidos Finalizados"
                    value={`${kpis.finish_rate_percentage}%`}
                    subValue={`Meta Inscripción: ${kpis.inscription_rate_goal.toLocaleString()}`}
                    colorClass="text-teal-600"
                />
        </div>
    );
}