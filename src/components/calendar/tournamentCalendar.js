'use client';

import { useState, useEffect } from 'react';
import Holidays from 'date-holidays';

// Ya no hay import de lucide-react

export default function CustomTournamentCalendar() {
  // --- ESTADOS ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]); 
  const [stats, setStats] = useState({ total: 0, playable: 0 });
  
  const hd = new Holidays('VE');

  // --- 1. SIMULACIÓN DB ---
  useEffect(() => {
    setTimeout(() => {
      setBookedDates(['2026-01-10', '2026-01-15', '2026-01-20']);
    }, 500);
  }, []);

  // --- 2. LÓGICA DE ESTADÍSTICAS ---
  const calculateStats = (start, end) => {
    if (!start || !end) return { total: 0, playable: 0 };
    
    let total = 0;
    let playable = 0;
    let loopDate = new Date(start); 

    while (loopDate <= end) {
      total++;
      const isWknd = loopDate.getDay() === 0 || loopDate.getDay() === 6;
      const isHol = hd.isHoliday(loopDate) && hd.isHoliday(loopDate)[0].type === 'public';
      const isFull = bookedDates.includes(formatDateKey(loopDate));

      if (!isWknd && isHol === false && !isFull) {
        playable++;
      }
      loopDate.setDate(loopDate.getDate() + 1);
    }
    return { total, playable };
  };

  // --- 3. HELPER FUNCTIONS ---
  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const isHoliday = (date) => {
    const h = hd.isHoliday(date);
    return h && h[0].type === 'public';
  };
  const isWeekend = (date) => {
    const d = date.getDay();
    return d === 0 || d === 6;
  };
  const isFull = (date) => bookedDates.includes(formatDateKey(date));
  const isPast = (date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return date < today;
  };

  // --- 4. MANEJADORES ---
  const handleDayClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    if (isPast(clickedDate) || isWeekend(clickedDate) || isHoliday(clickedDate) || isFull(clickedDate)) {
      return;
    }

    let newStart = startDate;
    let newEnd = endDate;

    if (!startDate || (startDate && endDate)) {
      newStart = clickedDate;
      newEnd = null;
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        newStart = clickedDate;
      } else {
        newEnd = clickedDate;
      }
    }

    setStartDate(newStart);
    setEndDate(newEnd);

    if (newStart && newEnd) {
      setStats(calculateStats(newStart, newEnd));
    } else {
      setStats({ total: 0, playable: 0 });
    }
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  // --- 5. RENDERIZADO DEL GRID ---
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate); 
    const daysArray = [];

    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="h-14 md:h-16"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const _isFull = isFull(dateObj);
      const _isHoliday = isHoliday(dateObj);
      const _isWeekend = isWeekend(dateObj);
      const _isPast = isPast(dateObj);

      const isStart = startDate && dateObj.getTime() === startDate.getTime();
      const isEnd = endDate && dateObj.getTime() === endDate.getTime();
      const isInRange = startDate && endDate && dateObj > startDate && dateObj < endDate;

      let tileClass = "bg-white text-slate-700 hover:bg-blue-50 cursor-pointer border border-slate-100";
      
      if (_isPast || _isWeekend) tileClass = "bg-slate-50 text-slate-300 cursor-not-allowed";
      else if (_isFull) tileClass = "bg-red-50 text-red-300 font-bold cursor-not-allowed border-red-100";
      else if (_isHoliday) tileClass = "bg-amber-50 text-amber-400 font-bold cursor-not-allowed border-amber-100";
      
      if (isInRange) tileClass = "bg-blue-100 text-blue-800 border-blue-200";
      if (isStart || isEnd) tileClass = "bg-blue-600 text-white shadow-md scale-105 z-10 border-blue-600";

      daysArray.push(
        <div 
          key={day}
          onClick={() => handleDayClick(day)}
          className={`
            h-14 md:h-16 flex flex-col items-center justify-start pt-2 transition-all duration-200 relative rounded-xl mx-1 my-1
            ${tileClass}
          `}
        >
          <span className="text-sm font-semibold">{day}</span>
          {_isFull && <span className="text-[8px] uppercase mt-1">Lleno</span>}
          {_isHoliday && <span className="text-[8px] mt-1">Festivo</span>}
        </div>
      );
    }
    return daysArray;
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 font-sans">
      
      {/* HEADER */}
      <div className="bg-slate-900 p-6 text-white">
        <div className="flex items-center gap-2 mb-1">
            {/* Trofeo: Usamos Emoji en lugar de librería */}
            <span className="text-xl">🏆</span>
            <h2 className="text-xl font-bold">Reserva de Torneo</h2>
        </div>
        <p className="text-slate-400 text-sm">Selecciona fecha de inicio y fin.</p>
      </div>

      <div className="p-6">
        
        {/* LEYENDA */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-md border border-blue-100">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> 
                <span className="text-xs text-blue-900 font-medium">Seleccionado</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 rounded-md border border-red-100">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> 
                <span className="text-xs text-red-900 font-medium">Lleno</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-md border border-amber-100">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> 
                <span className="text-xs text-amber-900 font-medium">Festivo</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md border border-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> 
                <span className="text-xs text-slate-500 font-medium">No laborable</span>
            </div>
        </div>

        {/* NAVEGACIÓN MES */}
        <div className="flex items-center justify-between mb-4 px-2">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
                {/* Icono Flecha Izquierda (SVG Nativo) */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
            <h2 className="text-lg font-bold text-slate-800 capitalize">
                {monthNames[currentDate.getMonth()]} <span className="text-slate-400">{currentDate.getFullYear()}</span>
            </h2>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition">
                {/* Icono Flecha Derecha (SVG Nativo) */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>

        {/* DÍAS SEMANA */}
        <div className="grid grid-cols-7 mb-2">
            {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map(d => (
            <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase">
                {d}
            </div>
            ))}
        </div>

        {/* GRID CALENDARIO */}
        <div className="grid grid-cols-7 mb-6">
            {renderCalendarDays()}
        </div>

        {/* FOOTER DE ESTADÍSTICAS */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 grid grid-cols-2 gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-bl-full opacity-50 -mr-4 -mt-4"></div>

            <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Inicio - Fin</p>
                <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span>{startDate ? startDate.toLocaleDateString('es-VE') : '--/--'}</span>
                    <span className="text-slate-400">➔</span>
                    <span>{endDate ? endDate.toLocaleDateString('es-VE') : '--/--'}</span>
                </div>
            </div>
            <div className="text-right relative z-10">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Días Hábiles</p>
                <div className="flex items-baseline justify-end gap-1">
                    <span className="text-2xl font-black text-blue-600">{stats.playable}</span>
                    <span className="text-xs text-slate-400 font-medium">/ {stats.total} días totales</span>
                </div>
            </div>
        </div>

        {/* BOTÓN CONFIRMAR */}
        <button 
            disabled={!startDate || !endDate || stats.playable === 0}
            className="w-full mt-4 bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg disabled:shadow-none"
        >
            Confirmar Reserva
        </button>

      </div>
    </div>
  );
}

/*'use client';

import { useState, useEffect } from 'react';
import Holidays from 'date-holidays';


export default function CustomTournamentCalendar() {
  // --- ESTADOS ---
  const [currentDate, setCurrentDate] = useState(new Date()); // Para saber qué mes estamos viendo
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]); // Fechas llenas (DB)
  
  const hd = new Holidays('VE');

  // --- 1. SIMULACIÓN DB ---
  useEffect(() => {
    // Simulamos carga de datos
    setTimeout(() => {
      setBookedDates(['2025-12-05', '2025-12-10', '2025-12-25']);
    }, 500);
  }, []);

  // --- 2. AYUDANTES DE FECHA (La lógica dura) ---
  
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    // 0 = Domingo, 1 = Lunes... Ajustamos para que Lunes sea el primer día si quieres, 
    // pero el estándar suele ser Domingo como 0.
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year, month, day) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // --- 3. VALIDACIONES ---
  
  const checkStatus = (year, month, day) => {
    const dateObj = new Date(year, month, day);
    const dateKey = formatDateKey(year, month, day);
    
    // Validar Pasado
    const today = new Date();
    today.setHours(0,0,0,0);
    if (dateObj < today) return 'disabled';

    // Validar Finde
    const dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'disabled';

    // Validar Festivo
    const holiday = hd.isHoliday(dateObj);
    if (holiday && holiday[0].type === 'public') return 'holiday';

    // Validar DB Full
    if (bookedDates.includes(dateKey)) return 'full';

    return 'available';
  };

  // --- 4. MANEJADORES ---

  const handleDayClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const status = checkStatus(currentDate.getFullYear(), currentDate.getMonth(), day);

    if (status === 'disabled' || status === 'full' || status === 'holiday') return;

    if (!startDate || (startDate && endDate)) {
      // Iniciar nuevo rango
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      // Cerrar rango
      if (clickedDate < startDate) {
        setStartDate(clickedDate); // Si clickea antes, se vuelve el inicio
      } else {
        setEndDate(clickedDate);
      }
    }
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  // --- 5. RENDERIZADO DEL GRID ---
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate); // 0 (Domingo) a 6 (Sábado)
    
    const daysArray = [];

    // Celdas vacías antes del día 1
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="h-14 md:h-20 bg-gray-50/30"></div>);
    }

    // Celdas con días
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const status = checkStatus(currentDate.getFullYear(), currentDate.getMonth(), day);
      
      // Lógica visual de selección
      let selectionClass = '';
      const isStart = startDate && dateObj.getTime() === startDate.getTime();
      const isEnd = endDate && dateObj.getTime() === endDate.getTime();
      const isInRange = startDate && endDate && dateObj > startDate && dateObj < endDate;

      if (isStart || isEnd) selectionClass = 'bg-blue-600 text-white shadow-lg scale-105 z-10';
      else if (isInRange) selectionClass = 'bg-blue-100 text-blue-800';
      else if (status === 'full') selectionClass = 'bg-red-100 text-red-400 cursor-not-allowed';
      else if (status === 'holiday') selectionClass = 'bg-amber-100 text-amber-600 cursor-not-allowed';
      else if (status === 'disabled') selectionClass = 'bg-gray-100 text-gray-300 cursor-not-allowed';
      else selectionClass = 'hover:bg-blue-50 cursor-pointer text-slate-700 bg-white';

      daysArray.push(
        <div 
          key={day}
          onClick={() => handleDayClick(day)}
          className={`
            h-14 md:h-20 border border-gray-100 flex flex-col items-center justify-start pt-2 transition-all duration-200 relative
            ${selectionClass}
          `}
        >
          <span className="text-sm font-semibold">{day}</span>
          
          {status === 'full' && <span className="text-[9px] font-bold mt-1 uppercase">Lleno</span>}
          {status === 'holiday' && <span className="text-[9px] font-bold mt-1">Festivo</span>}
          {(isStart || isEnd) && <span className="text-[9px] mt-1">{isStart ? 'Inicio' : 'Fin'}</span>}
        </div>
      );
    }
    return daysArray;
  };

  // Calcular estadísticas simples
  const daysCount = startDate && endDate 
    ? Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1 
    : 0;

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-700 rounded-full transition">
  
        </button>
        <h2 className="text-xl font-bold tracking-wide">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-700 rounded-full transition">
           Siguiente
        </button>
      </div>

      <div className="grid grid-cols-7 bg-slate-100 border-b border-gray-200">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
          <div key={d} className="py-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 bg-gray-50">
        {renderCalendarDays()}
      </div>

      <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center">
         <div>
            <p className="text-xs text-gray-500 uppercase">Selección</p>
            <p className="font-bold text-gray-800">
              {startDate ? startDate.toLocaleDateString() : '-'} al {endDate ? endDate.toLocaleDateString() : '-'}
            </p>
         </div>
         <div className="text-right">
             <button 
               className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
               disabled={!startDate || !endDate}
             >
                Confirmar ({daysCount} días)
             </button>
         </div>
      </div>
    </div>
  );
}*/