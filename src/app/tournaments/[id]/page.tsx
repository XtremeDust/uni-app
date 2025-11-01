'use client';
import React, { useState, useEffect } from 'react';
// Importa tus componentes de UI (Table, Button, etc.)
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableRow,
  TableHead, 
  TableHeaderCell,
  Button
} from '@/types/ui_components'; // Asumo tu ruta

// --- 1. DEFINE TUS INTERFACES ---

// Interfaz para el JSON de /api/inscripciones
interface ApiDisciplineEntry {
  id: number;
  nombre: string;
  disciplina: string;
  categoria: string;
  estado: 'Aceptado' | 'Rechazado' | 'Pendiente';
  integrantes_total: number;
  team_id_for_modal: number | null;
  user_id_for_modal: number | null;
}

// Interfaz para los miembros (de UserResource)
interface ApiUser {
  id: number;
  nombre: string; // Asegúrate que UserResource use 'nombre'
  email: string;
  rol: string;
  cedula: string;
  telefono: string;
}

// Interfaz para el JSON de /api/teams/{id}
interface ApiTeam {
  id: number;
  nombre: string;
  logo: string;
  color: string;
  captain: {
    id: number;
    name: string;
  } | null;
  integrantes_data: ApiUser[];
  integrantes_total: number;
}

// --- 2. EL COMPONENTE DE LA TABLA PRINCIPAL ---

export default function EquiposInscritosPage() {
    // --- Estados para la Tabla ---
    const [entries, setEntries] = useState<ApiDisciplineEntry[]>([]);
    const [loadingTable, setLoadingTable] = useState(true);
    const [errorTable, setErrorTable] = useState<string | null>(null);

    // --- Estados para el Modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<ApiDisciplineEntry | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<ApiTeam | null>(null);

    // --- Carga de datos para la TABLA (se ejecuta 1 vez) ---
    useEffect(() => {
        async function fetchEntries() {
            setLoadingTable(true);
            setErrorTable(null);
            try {
                const res = await fetch("http://localhost:8000/api/teams-inscription");
                if (!res.ok) throw new Error(`Error en API inscripciones: ${res.statusText}`);
                const jsonData = await res.json();
                setEntries(jsonData.data);
            } catch (e: any) {
                setErrorTable(e.message || "Error al cargar inscripciones");
            } finally {
                setLoadingTable(false);
            }
        }
        fetchEntries();
    }, []);

    // --- Función para abrir el MODAL y buscar detalles ---
    const handleVerDetalles = async (entry: ApiDisciplineEntry) => {
        // 1. Guardar datos que ya tenemos (de la inscripción)
        setSelectedEntry(entry);
        setIsModalOpen(true);
        setLoadingModal(true);
        setSelectedTeam(null); // Limpiar datos de equipo anterior

        // 2. Determinar si es un equipo o un usuario individual
        if (entry.team_id_for_modal) {
            // Es un equipo, buscar en /api/teams
            try {
                const res = await fetch(`http://localhost:8000/api/teams/${entry.team_id_for_modal}`);
                if (!res.ok) throw new Error(`Error en API teams: ${res.statusText}`);
                const jsonData = await res.json();
                setSelectedTeam(jsonData.data); // Guardar detalles del equipo
            } catch (e: any) {
                console.error("Error al cargar detalles del equipo:", e);
                // El modal mostrará un error
            } finally {
                setLoadingModal(false);
            }
        } else if (entry.user_id_for_modal) {
            // Es un individual. No necesitamos buscar en /api/teams.
            // (Podríamos buscar en /api/users/{id} si quisiéramos más detalles)
            // Por ahora, solo indicamos que la carga terminó.
            setLoadingModal(false);
        } else {
            // No hay ID, solo cerrar
            setLoadingModal(false);
        }
    };

    // --- Renderizado ---
    if (loadingTable) return <p>Cargando inscripciones...</p>;
    if (errorTable) return <p>Error: {errorTable}</p>;

    return (
        <div>
            <h2>Equipos Inscritos</h2>
            {/* Aquí irían tus filtros */}

            <Table className="w-full">
                <TableHead>
                    <TableRow>
                        <TableHeaderCell>Equipo</TableHeaderCell>
                        <TableHeaderCell>Deporte</TableHeaderCell>
                        <TableHeaderCell>Categoría</TableHeaderCell>
                        <TableHeaderCell>Cantidad</TableHeaderCell>
                        <TableHeaderCell>Estado</TableHeaderCell>
                        <TableHeaderCell>Acciones</TableHeaderCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entries.map((entry) => (
                        <TableRow key={entry.id}>
                            <TableCell>{entry.nombre}</TableCell>
                            <TableCell>{entry.disciplina}</TableCell>
                            <TableCell>{entry.categoria}</TableCell>
                            <TableCell>{entry.integrantes_total}</TableCell>
                            <TableCell>{entry.estado}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleVerDetalles(entry)}>
                                    Ver Detalles (👁️)
                                </Button>
                                {/* ... otros botones (editar, borrar) */}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* --- El Modal (renderizado condicional) --- */}
            {isModalOpen && (
                <DetalleEquipoModal
                    entryData={selectedEntry}
                    teamData={selectedTeam}
                    isLoading={loadingModal}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}


// --- 3. EL COMPONENTE DEL MODAL (en el mismo archivo o importado) ---

interface ModalProps {
    entryData: ApiDisciplineEntry | null;
    teamData: ApiTeam | null;
    isLoading: boolean;
    onClose: () => void;
}

function DetalleEquipoModal({ entryData, teamData, isLoading, onClose }: ModalProps) {
    if (!entryData) return null;

    const esIndividual = !!entryData.user_id_for_modal;

    return (
        <div style={modalBackdropStyle}> {/* Fondo oscuro */}
            <div style={modalContentStyle}> {/* Contenido del modal */}
                
                <Button onClick={onClose} style={{ float: 'right' }}>X</Button>
                
                <h2>Detalles de la Inscripción</h2>
                
                {/* 1. Información de la INSCRIPCIÓN (la que ya teníamos) */}
                <p><strong>Deporte:</strong> {entryData.disciplina}</p>
                <p><strong>Categoría:</strong> {entryData.categoria}</p>
                <p><strong>Estado:</strong> {entryData.estado}</p>
                <hr />

                {/* 2. Información del EQUIPO/JUGADOR (la que buscamos) */}
                {isLoading ? (
                    <p>Cargando detalles del competidor...</p>
                ) : esIndividual ? (
                    // Caso Individual
                    <div>
                        <h3>Jugador Individual</h3>
                        <p><strong>Nombre:</strong> {entryData.nombre}</p>
                        {/* Aquí podrías mostrar más detalles si el API de 'user' se llamara */}
                    </div>
                ) : teamData ? (
                    // Caso Equipo
                    <div>
                        <h3>Detalles del Equipo</h3>
                        <p><strong>Nombre:</strong> {teamData.nombre}</p>
                        <p><strong>Capitán:</strong> {teamData.captain?.name || 'No asignado'}</p>
                        <p><strong>Color:</strong> {teamData.color}</p>
                        {/* <img src={teamData.logo} alt="Logo" /> */}
                        <h4>Integrantes ({teamData.integrantes_total}):</h4>
                        <ul>
                            {teamData.integrantes_data.map(member => (
                                <li key={member.id}>
                                    {member.nombre} ({member.email})
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No se pudieron cargar los detalles del equipo.</p>
                )}
            </div>
        </div>
    );
}

// Estilos de ejemplo para el modal
const modalBackdropStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000,
};
const modalContentStyle: React.CSSProperties = {
    backgroundColor: 'white', padding: '2rem',
    borderRadius: '8px', minWidth: '300px', maxWidth: '600px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
};