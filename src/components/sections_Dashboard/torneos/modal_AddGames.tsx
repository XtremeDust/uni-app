'use client';
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button, ContainModal, HeaderModal, FooterModal, Input, InputGroup, Modal } from "@/types/ui_components";
import Image from "next/image";

interface ModalProps {
  state: boolean;
  onClose: () => void;
  onGameCreated?: () => void;
  tournamentId?: number;
}

interface ISelectItem {
  id: number;
  label: string;
  // --- AÑADE ESTOS CAMPOS ---
  inicio?: string; 
  fin?: string;
}

const initialState = {
  tournament_id: null as number | null,
  discipline_id: null as number | null,
  competitor_a_id: null as number | null,
  competitor_b_id: null as number | null,
  date: "",
  time: "",
  round: "1",
};

export default function Modal_AddGames({ state, onClose, onGameCreated, tournamentId }: ModalProps) {
  
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tournaments, setTournaments] = useState<ISelectItem[]>([]);
  const [disciplines, setDisciplines] = useState<ISelectItem[]>([]);
  const [allCompetitors, setAllCompetitors] = useState<ISelectItem[]>([]);

  const [tournLabel, setTournLabel] = useState<string | null>(null);

  const [selectedTournamentDates, setSelectedTournamentDates] = useState<{inicio: string, fin: string} | null>(null);

  const [discLabel, setDiscLabel] = useState<string | null>(null);
  const [compALabel, setCompALabel] = useState<string | null>(null);
  const [compBLabel, setCompBLabel] = useState<string | null>(null);

  const [openTourn, setOpenTourn] = useState(false);
  const [openDisc, setOpenDisc] = useState(false);
  const [openCompA, setOpenCompA] = useState(false);
  const [openCompB, setOpenCompB] = useState(false);

  const menuTournRef = useRef<HTMLDivElement>(null);
  const menuDiscRef = useRef<HTMLDivElement>(null);
  const menuCompARef = useRef<HTMLDivElement>(null);
  const menuCompBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutClick(event: globalThis.MouseEvent) {
      const target = event.target as Node;
      if (openTourn && menuTournRef.current && !menuTournRef.current.contains(target)) setOpenTourn(false);
      if (openDisc && menuDiscRef.current && !menuDiscRef.current.contains(target)) setOpenDisc(false);
      if (openCompA && menuCompARef.current && !menuCompARef.current.contains(target)) setOpenCompA(false);
      if (openCompB && menuCompBRef.current && !menuCompBRef.current.contains(target)) setOpenCompB(false);
    }
    if (openTourn || openDisc || openCompA || openCompB) document.addEventListener("mousedown", handleOutClick);
    return () => document.removeEventListener("mousedown", handleOutClick);
  }, [openTourn, openDisc, openCompA, openCompB]);


  useEffect(() => {
    if (state) {
        setFormData(initialState);
        setTournLabel(null); setDiscLabel(null); setCompALabel(null); setCompBLabel(null);
        setTournaments([]); setDisciplines([]); setAllCompetitors([]);
        setError(null);
        setSelectedTournamentDates(null);

        if (tournamentId) {
            setFormData(p => ({ ...p, tournament_id: tournamentId }));
            setTournLabel("Torneo Seleccionado"); 
            
            fetchSingleTournament(tournamentId);
        }
    }
  }, [state, tournamentId]);

  const fetchSingleTournament = async (id: number) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      try {
          const res = await fetch(`${API_URL}/tournaments/${id}`);
          const json = await res.json();
          setSelectedTournamentDates({ inicio: json.data.inicio, fin: json.data.fin });
      } catch(e) { console.error(e); }
  };

  useEffect(() => {
    if (!state || tournamentId) return;
    const fetchTournaments = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        try {
            const res = await fetch(`${API_URL}/tournaments`);
            const json = await res.json();
            const active = json.data.filter((t: any) => t.estado !== 'finalizado');
            
            setTournaments(active.map((t: any) => ({ 
                id: t.id, 
                label: t.nombre,
                inicio: t.inicio, 
                fin: t.fin 
            })));
        } catch (e) { console.error(e); }
    };
    fetchTournaments();
  }, [state, tournamentId]);

  useEffect(() => {
    if (!formData.tournament_id) {
        setDisciplines([]);
        return;
    }
    const fetchDisciplines = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        try {
            const res = await fetch(`${API_URL}/tournaments/${formData.tournament_id}`);
            const json = await res.json();
            const formatted = json.data.disciplinas.map((d: any) => ({
                id: d.id,
                label: `${d.nombre_deporte} (${d.categoria})`
            }));
            setDisciplines(formatted);
        } catch (e) { console.error(e); }
    };
    fetchDisciplines();
  }, [formData.tournament_id]);

  useEffect(() => {
    if (!formData.discipline_id) {
        setAllCompetitors([]);
        return;
    }
    const fetchCompetitors = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        try {
            const res = await fetch(`${API_URL}/discipline-entries?discipline_id=${formData.discipline_id}&state=Aceptado`);
            const json = await res.json();
            const formatted = json.data.map((entry: any) => ({
                id: entry.id,
                label: entry.nombre 
            }));
            setAllCompetitors(formatted);
        } catch (e) { console.error(e); }
    };
    fetchCompetitors();
  }, [formData.discipline_id]);

  const competitorsForB = allCompetitors.filter(c => c.id !== formData.competitor_a_id);

  const handleSelectTournament = (item: ISelectItem) => {
      setFormData(p => ({ ...initialState, tournament_id: item.id }));
      setTournLabel(item.label);
      
      if (item.inicio && item.fin) {
          setSelectedTournamentDates({ inicio: item.inicio, fin: item.fin });
      }

      setDiscLabel(null); setCompALabel(null); setCompBLabel(null);
      setOpenTourn(false);
  };

  const handleSelectDiscipline = (item: ISelectItem) => {
      setFormData(p => ({ ...p, discipline_id: item.id, competitor_a_id: null, competitor_b_id: null }));
      setDiscLabel(item.label);
      setCompALabel(null); setCompBLabel(null);
      setOpenDisc(false);
  };

  const handleSelectCompA = (item: ISelectItem) => {
      setFormData(p => ({ ...p, competitor_a_id: item.id, competitor_b_id: null }));
      setCompALabel(item.label);
      setCompBLabel(null);
      setOpenCompA(false);
  };

  const handleSelectCompB = (item: ISelectItem) => {
      setFormData(p => ({ ...p, competitor_b_id: item.id }));
      setCompBLabel(item.label);
      setOpenCompB(false);
  };

  const handleCloseModal = () => {
    setFormData(initialState);
    setTournLabel(null); setDiscLabel(null); setCompALabel(null); setCompBLabel(null);
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.discipline_id) { setError("Seleccione la disciplina."); return; }
    if (!formData.competitor_a_id || !formData.competitor_b_id) { setError("Seleccione ambos competidores."); return; }
    if (!formData.date || !formData.time) { setError("Seleccione fecha y hora."); return; }

    setLoading(true);
    setError(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    try {
        const res = await fetch(`${API_URL}/games`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                discipline_id: formData.discipline_id,
                competitor_a_id: formData.competitor_a_id,
                competitor_b_id: formData.competitor_b_id,
                date_time: `${formData.date} ${formData.time}`,
                round: formData.round
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error al crear el partido');
        
        alert("Partido creado con éxito");
        if (onGameCreated) onGameCreated();
        handleCloseModal();
    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal state={state}>
      <ContainModal className="grid grid-rows-[auto_minmax(0,1fr)_auto] text-black w-[95%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] space-y-3 bg-gray-200 rounded-2xl overflow-hidden max-h-[90vh]">
        <HeaderModal onClose={handleCloseModal} className="flex-none">
            <div className="text-start">
              <h2 className="ml-5 title">Añadir Nuevo Juego</h2>
              <p className="ml-5 text-[1.2rem]">Programe el encuentro deportivo.</p>
            </div>
        </HeaderModal>

        <div className="relative flex-grow main-modal overflow-y-auto px-4 space-y-4">
            <section className="flex flex-col p-4 shadow rounded-xl bg-gray-100 space-y-4">
                
                {!tournamentId && (
                    <InputGroup label="Torneo" For="tourn" labelClass="text-gray-700 text-start">
                        <div className="relative" ref={menuTournRef}>
                            <div onClick={() => setOpenTourn(!openTourn)}>
                                <Input type='text' className="cursor-pointer input w-full pl-3 py-2 bg-white placeholder:text-black" required readOnly value={tournLabel ?? "Seleccione Torneo"} />
                                <Button type="button" className="cursor-pointer absolute right-2 top-1/2 flex justify-center -translate-y-1/2">
                                    <Image className={`size-[1rem] transition-transform duration-300 ease-in-out ${openTourn ? 'rotate-180' : 'rotate-0'}`} src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'} alt="v" width={16} height={16} />
                                </Button>
                            </div>
                            <div className={`absolute z-30 bg-white shadow-lg mt-1 rounded-xl overflow-hidden overflow-y-auto border border-gray-100 w-full left-0 ${openTourn ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                {tournaments.map((t) => (
                                    <div key={t.id} className="w-full flex gap-2 p-2.5 hover:bg-unimar/15 place-items-center cursor-pointer" onClick={() => handleSelectTournament(t)}>
                                        <span className="ml-2 text-sm">{t.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </InputGroup>
                )}

                <InputGroup label="Disciplina" For="disc" labelClass="text-gray-700 text-start">
                    <div className="relative" ref={menuDiscRef}>
                        <div onClick={() => formData.tournament_id && setOpenDisc(!openDisc)}>
                            <Input type='text' className={`cursor-pointer input w-full pl-3 py-2 bg-white placeholder:text-black ${!formData.tournament_id ? 'opacity-50 cursor-not-allowed' : ''}`} required readOnly disabled={!formData.tournament_id} value={discLabel ?? "Seleccione Disciplina"} />
                             <Button type="button" className="cursor-pointer absolute right-2 top-1/2 flex justify-center -translate-y-1/2">
                                <Image className={`size-[1rem] transition-transform duration-300 ease-in-out ${openDisc ? 'rotate-180' : 'rotate-0'}`} src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'} alt="v" width={16} height={16} />
                            </Button>
                        </div>
                        <div className={`absolute z-20 bg-white shadow-lg mt-1 rounded-xl overflow-hidden overflow-y-auto border border-gray-100 w-full left-0 ${openDisc ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                            {disciplines.map((d) => (
                                <div key={d.id} className="w-full flex gap-2 p-2.5 hover:bg-unimar/15 place-items-center cursor-pointer" onClick={() => handleSelectDiscipline(d)}>
                                    <span className="ml-2 text-sm">{d.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </InputGroup>

                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Competidor A" For="a" labelClass="text-gray-700 text-start">
                        <div className="relative" ref={menuCompARef}>
                            <div onClick={() => formData.discipline_id && allCompetitors.length >= 2 && setOpenCompA(!openCompA)}>
                                <Input type='text' className={`cursor-pointer input w-full pl-3 py-2 bg-white placeholder:text-black ${(!formData.discipline_id || allCompetitors.length < 2) ? 'opacity-50 cursor-not-allowed' : ''}`} required readOnly disabled={!formData.discipline_id || allCompetitors.length < 2} value={!formData.discipline_id ? "Seleccione Disciplina" : allCompetitors.length < 2 ? "Insuficientes equipos" : compALabel ?? "Seleccione"} />
                                <Button type="button" className="cursor-pointer absolute right-2 top-1/2 flex justify-center -translate-y-1/2">
                                    <Image className={`size-[1rem] transition-transform duration-300 ease-in-out ${openCompA ? 'rotate-180' : 'rotate-0'}`} src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'} alt="v" width={16} height={16} />
                                </Button>
                            </div>
                            <div className={`absolute z-20 bg-white shadow-lg mt-1 rounded-xl overflow-hidden overflow-y-auto border border-gray-100 w-full left-0 ${openCompA ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                {allCompetitors.map((c) => (
                                    <div key={c.id} className="w-full flex gap-2 p-2.5 hover:bg-unimar/15 place-items-center cursor-pointer" onClick={() => handleSelectCompA(c)}>
                                        <span className="ml-2 text-sm">{c.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </InputGroup>
                    <InputGroup label="Competidor B" For="b" labelClass="text-gray-700 text-start">
                        <div className="relative" ref={menuCompBRef}>
                            <div onClick={() => formData.competitor_a_id && setOpenCompB(!openCompB)}>
                                <Input type='text' className={`cursor-pointer input w-full pl-3 py-2 bg-white placeholder:text-black ${!formData.competitor_a_id ? 'opacity-50 cursor-not-allowed' : ''}`} required readOnly disabled={!formData.competitor_a_id} value={compBLabel ?? "Seleccione"} />
                                <Button type="button" className="cursor-pointer absolute right-2 top-1/2 flex justify-center -translate-y-1/2">
                                    <Image className={`size-[1rem] transition-transform duration-300 ease-in-out ${openCompB ? 'rotate-180' : 'rotate-0'}`} src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'} alt="v" width={16} height={16} />
                                </Button>
                            </div>
                            <div className={`absolute z-20 bg-white shadow-lg mt-1 rounded-xl overflow-hidden overflow-y-auto border border-gray-100 w-full left-0 ${openCompB ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                {competitorsForB.map((c) => (
                                    <div key={c.id} className="w-full flex gap-2 p-2.5 hover:bg-unimar/15 place-items-center cursor-pointer" onClick={() => handleSelectCompB(c)}>
                                        <span className="ml-2 text-sm">{c.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </InputGroup>
                </div>

                {selectedTournamentDates && (
                    <div className="rounded-2xl bg-gray-100 border border-blue-200 p-3 text-sm text-blue-800 flex justify-between items-center">
                        <span className="font-bold">Rango:</span>
                        <span>Del <strong>{selectedTournamentDates.inicio}</strong> al <strong>{selectedTournamentDates.fin}</strong></span>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup label="Fecha" For="date" labelClass="text-gray-700 text-start">
                        <Input 
                            id="date" type="date" className="input w-full" 
                            value={formData.date} 
                            onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))} 
                        />
                    </InputGroup>
                    <InputGroup label="Hora" For="time" labelClass="text-gray-700 text-start">
                        <Input id="time" type="time" className="input w-full" value={formData.time} onChange={(e) => setFormData(p => ({ ...p, time: e.target.value }))} />
                    </InputGroup>
                    <InputGroup label="Ronda" For="round" labelClass="text-gray-700 text-start">
                         <Input id="round" type="number" min="1" className="input w-full" value={formData.round} onChange={(e) => setFormData(p => ({ ...p, round: e.target.value }))} />
                    </InputGroup>
                    
                </div>
            </section>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm font-bold text-center">{error}</div>}
        </div>

        <FooterModal className="flex-none" BTmain="Crear Partido" BTSecond="Cancelar" onClose={handleCloseModal} onSumit={handleSubmit} disabled={loading} />
      </ContainModal>
    </Modal>
  );
}