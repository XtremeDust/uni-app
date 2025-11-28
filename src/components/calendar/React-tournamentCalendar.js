'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Holidays from 'date-holidays';
import 'react-calendar/dist/Calendar.css'; 

// --- HERRAMIENTAS AUXILIARES ---

// Formatea fecha a "YYYY-MM-DD" para comparar strings fácilmente sin líos de horas
const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function TournamentCalendar() {
  // --- ESTADOS ---
  const [dateRange, setDateRange] = useState([null, null]); // Rango seleccionado
  const [stats, setStats] = useState({ totalDays: 0, playableDays: 0 }); // Contadores
  const [bookedDates, setBookedDates] = useState([]); // Fechas llenas (desde DB)
  const [isLoading, setIsLoading] = useState(true);

  // Inicializamos festivos de Venezuela
  const hd = new Holidays('VE');

  // --- 1. SIMULACIÓN DE BASE DE DATOS (AQUÍ CONECTARÍAS TU API) ---
  useEffect(() => {
    const fetchAvailability = async () => {
      // Simula una petición a tu backend
      setTimeout(() => {
        // Imagina que tu DB dice que estos días ya no caben más torneos
        // IMPORTANTE: El formato debe coincidir (YYYY-MM-DD)
        const dbResponse = [
          '2025-12-05', 
          '2025-12-10', 
          '2025-12-25' // Justo cae en navidad, igual estaría bloqueado
        ];
        setBookedDates(dbResponse);
        setIsLoading(false);
      }, 1000); // 1 segundo de retraso artificial
    };

    fetchAvailability();
  }, []);

  // --- 2. LÓGICA DE VALIDACIÓN ---

  const isHoliday = (date) => {
    const holiday = hd.isHoliday(date);
    // Solo consideramos festivos públicos ("public")
    return holiday && holiday[0].type === 'public';
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0=Domingo, 6=Sábado
  };

  const isFull = (date) => {
    return bookedDates.includes(formatDateKey(date));
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // La "Master Function" que decide si un día es inválido
  const isDateInvalid = (date) => {
    return isPastDate(date) || isWeekend(date) || isHoliday(date) || isFull(date);
  };

  // --- 3. LÓGICA DE CÁLCULO (DÍAS HÁBILES) ---
  
  const calculateStats = (start, end) => {
    if (!start || !end) return { totalDays: 0, playableDays: 0 };

    let total = 0;
    let playable = 0;
    let current = new Date(start);

    while (current <= end) {
      total++;
      // Si el día NO es inválido, suma como jugable
      if (!isDateInvalid(current)) {
        playable++;
      }
      current.setDate(current.getDate() + 1);
    }
    return { totalDays: total, playableDays: playable };
  };

  const handleDateChange = (nextValue) => {
    setDateRange(nextValue);
    
    if (Array.isArray(nextValue) && nextValue[0] && nextValue[1]) {
      const newStats = calculateStats(nextValue[0], nextValue[1]);
      setStats(newStats);
    } else {
      setStats({ totalDays: 0, playableDays: 0 });
    }
  };

  // --- 4. CONTROL VISUAL (TAILWIND) ---

  const getTileClass = ({ date, view }) => {
    if (view !== 'month') return '';

    // Prioridad 1: Fechas Llenas (Rojo)
    if (isFull(date)) {
      return 'bg-red-50 text-red-400 font-bold cursor-not-allowed opacity-100 decoration-slice'; 
    }

    // Prioridad 2: Festivos (Naranja/Amarillo suave)
    if (isHoliday(date)) {
       return 'bg-amber-50 text-amber-500 font-medium cursor-not-allowed';
    }

    // Prioridad 3: Fines de semana o Pasado (Gris)
    if (isWeekend(date) || isPastDate(date)) {
      return 'bg-gray-50 text-gray-300 cursor-not-allowed';
    }

    // Prioridad 4: Disponible (Azul al pasar el mouse)
    return 'hover:bg-blue-50 text-slate-700 font-semibold transition-all';
  };

  const getTileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    if (isFull(date)) return <div className="text-[9px] text-red-500 uppercase mt-1">Lleno</div>;
    if (isHoliday(date)) return <div className="text-[9px] text-amber-500 mt-1">Festivo</div>;
    
    return null;
  };

  // Esta función BLOQUEA el click real en el calendario
  const tileDisabled = ({ date, view }) => {
    if (view === 'month') return isDateInvalid(date);
    return false;
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* HEADER */}
      <div className="bg-slate-900 p-6 text-white">
        <h2 className="text-2xl font-bold">Reserva de Torneo 🏆</h2>
        <p className="text-slate-400 text-sm mt-1">Selecciona fecha de inicio y fin.</p>
      </div>

      <div className="p-6">
        {/* LEYENDA (Para que el usuario entienda los colores) */}
        <div className="flex flex-wrap gap-4 mb-6 text-xs font-medium text-slate-600 justify-center">
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600"></span> Seleccionado</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></span> Lleno</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-200"></span> Festivo</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></span> No laborable</div>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center space-x-2 animate-pulse">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full delay-75"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full delay-150"></div>
            <span className="text-slate-400 font-medium">Cargando disponibilidad...</span>
          </div>
        ) : (
          <div className="custom-calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={dateRange}
              selectRange={true}
              tileDisabled={tileDisabled}
              tileClassName={getTileClass}
              tileContent={getTileContent}
              locale="es-VE"
              className="w-full border-none font-sans"
              minDetail="month" // Evita que el usuario haga zoom out a "años"
            />
          </div>
        )}

        {/* FOOTER DE ESTADÍSTICAS */}
        <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 gap-4">
            <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Inicio - Fin</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                    {dateRange[0] ? dateRange[0].toLocaleDateString() : '--/--/--'} 
                    <span className="mx-2 text-slate-300">➔</span> 
                    {dateRange[1] ? dateRange[1].toLocaleDateString() : '--/--/--'}
                </p>
            </div>
            <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Días Hábiles</p>
                <div className="flex items-end justify-end gap-2">
                    <span className="text-3xl font-bold text-blue-600 leading-none">{stats.playableDays}</span>
                    <span className="text-xs text-slate-400 mb-1">/ {stats.totalDays} días totales</span>
                </div>
            </div>
        </div>
        
        {/* BOTÓN DE ACCIÓN */}
        <button 
            disabled={stats.playableDays === 0}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-200 disabled:shadow-none"
        >
            {stats.playableDays > 0 ? 'Confirmar Fechas' : 'Selecciona un rango válido'}
        </button>

      </div>
    </div>
  );
}