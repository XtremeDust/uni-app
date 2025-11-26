import React, { useState, useEffect } from 'react';

interface KpiData {
    total_teams: number;
    pending_requests: number;
    active_offers: number;
    inscription_rate: number;
    inscription_rate_goal: number;
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
        <h2 className={`text-3xl font-bold ${colorClass}`}>{value}</h2>
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
                title="Total de Equipos Inscritos"
                value={kpis.total_teams.toLocaleString()}
                colorClass="text-blue-600"
            />
            <KpiCard
                title="Ofertas Activas"
                value={kpis.active_offers.toLocaleString()}
                colorClass="text-green-600"
            />
            <KpiCard
                title="Solicitudes Pendientes"
                value={kpis.pending_requests.toLocaleString()}
                colorClass="text-yellow-600"
            />
            <KpiCard
                title="Tasa de Inscripción"
                value={`${kpis.inscription_rate}%`}
                subValue={`Meta: ${kpis.inscription_rate_goal}`}
                colorClass="text-teal-600"
            />
        </div>
    );
}