'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Button, Modal, ContainModal, HeaderModal, FooterModal, 
  Input, Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell, InputGroup 
} from '@/types/ui_components';

interface ModalProps {
  state: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  tournamentId: number; 
}

interface ISelectItem {
  id: number;
  label: string;
  defaultMode?: string; 
}

interface TempDiscipline {
  tempId: number;
  sportId: number;
  sportLabel: string;
  category: string;
  gameMode: string;
  min: number;
  max: number;
}

const categories = [
  { id: 1, label: "masculina" },
  { id: 2, label: "femenina" },
  { id: 3, label: "mixta" },
];

export default function Modal_addDiscipline({ state, onClose, onSaveSuccess, tournamentId }: ModalProps) {
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sports, setSports] = useState<ISelectItem[]>([]);
  
  const [sportId, setSportId] = useState<number | null>(null);
  const [sportLabel, setSportLabel] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<string | null>(null); 
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(10);
  
  const [disciplinesList, setDisciplinesList] = useState<TempDiscipline[]>([]);

  const [OpenDep, setMDep] = useState(false);
  const [OpenCat, setMCat] = useState(false);
  
  const menuDep = useRef<HTMLDivElement>(null);
  const menuCat = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    function handleOutClick(event: globalThis.MouseEvent) {
      const target = event.target as Node;
      if (OpenDep && menuDep.current && !menuDep.current.contains(target)) setMDep(false);
      if (OpenCat && menuCat.current && !menuCat.current.contains(target)) setMCat(false);
    }
    if (OpenDep || OpenCat) document.addEventListener("mousedown", handleOutClick);
    return () => document.removeEventListener("mousedown", handleOutClick);
  }, [OpenDep, OpenCat]); 

  useEffect(() => {
    if (!state) return;
    setDisciplinesList([]);
    resetInputs();

    const fetchSports = async () => {
      setLoading(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      try {
        const res = await fetch(`${API_URL}/sports`);
        if (!res.ok) throw new Error('Error cargando deportes');
        const json = await res.json();
        
        const formattedSports = json.data.map((sport: any) => ({
          id: sport.id,
          label: sport.nombre || sport.title,
          defaultMode: sport.mode || sport.tipo || 'equipo' 
        }));
        setSports(formattedSports);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSports();
  }, [state]);

  const resetInputs = () => {
      setSportId(null);
      setSportLabel(null);
      setCategory(null);
      setGameMode(null);
      setMin(1);
      setMax(10);
  };

  const handleSelectSport = (sport: ISelectItem) => {
      setSportId(sport.id);
      setSportLabel(sport.label);
      setCategory(null);
      
      setMDep(false);
      setMCat(true); 

      if (sport.defaultMode) {
          setGameMode(sport.defaultMode);
          
          if (sport.defaultMode === 'individual') {
              setMin(1); setMax(1);
          } else if (sport.defaultMode === 'duplas') {
              setMin(2); setMax(2);
          } else {
              setMin(5); setMax(15);
          }
      } else {
          setGameMode("No definido");
      }
  };

  const handleSelectCategory = (label: string) => {
      setCategory(label);
      setMCat(false);
  };

  const handleMinChange = (val: number) => {
      if (val < 1) val = 1;
      setMin(val);
  };
  const handleMaxChange = (val: number) => {
      if (val < 1) val = 1;
      setMax(val);
  };

  const handleAddToList = () => {
    if (!sportId || !category || !gameMode) return;
    if (max < min) {
      alert("El máximo no puede ser menor que el mínimo.");
      return;
    }

    const isDuplicate = disciplinesList.some(
        d => d.sportId === sportId && d.category === category
    );

    if (isDuplicate) {
        alert("Ya agregaste esta combinación.");
        return;
    }

    const newDiscipline: TempDiscipline = {
        tempId: Date.now(),
        sportId,
        sportLabel: sportLabel || '?',
        category,
        gameMode,
        min,
        max
    };

    setDisciplinesList([...disciplinesList, newDiscipline]);
    setCategory(null); 
  };

  const handleRemoveFromList = (tempId: number) => {
      setDisciplinesList(prev => prev.filter(d => d.tempId !== tempId));
  };

  const handleSaveAll = async () => {
    if (disciplinesList.length === 0) return;
    setIsSaving(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    
    try {
        const promises = disciplinesList.map(d => {
            return fetch(`${API_URL}/disciplines`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    event_id: tournamentId,
                    sport_id: d.sportId,
                    category: d.category,
                    game_mode: d.gameMode,
                    min_participants: d.min,
                    max_participants: d.max,
                })
            }).then(async res => {
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message || 'Error');
                }
                return res.json();
            });
        });

        await Promise.all(promises);
        alert('¡Disciplinas guardadas correctamente!');
        onSaveSuccess();
        onClose(); 

    } catch (e: any) {
        alert("Error al guardar: " + e.message);
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <Modal state={state}>
      <ContainModal className="w-[95%] md:w-[90%] lg:w-[80%] bg-white text-black max-h-[90vh] flex flex-col">
        <HeaderModal onClose={onClose} className="flex-none">
          <h2 className="text-xl font-bold text-gray-800">
            Añadir Disciplinas
          </h2>
        </HeaderModal>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
            
            {loading ? (
                <div className="text-center p-10 text-gray-500">Cargando catálogo...</div>
            ) : error ? (
                <div className="text-center p-10 text-red-500">{error}</div>
            ) : (
                <>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
                        

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputGroup label="Deporte" For="sport" labelClass="text-gray-700 text-start">
                              <div className="relative" ref={menuDep} onClick={() => setMDep(!OpenDep)}>
                                  <Input 
                                      type='text' id="sport" 
                                      className="cursor-pointer input w-full pl-3 py-2 bg-white placeholder:text-black" 
                                      required readOnly 
                                      value={sportLabel ?? "Seleccione Deporte"}
                                  />
                                  <Button type="button" className="cursor-pointer absolute right-2 top-1/2 flex justify-center -translate-y-1/2">
                                      <Image className={`size-[1rem] transition-transform duration-300 ease-in-out ${OpenDep ? 'rotate-180' : 'rotate-0'}`} src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'} alt="v" width={16} height={16} />
                                  </Button>
                                  <div className={`absolute z-20 bg-white shadow-lg mt-1 rounded-xl overflow-hidden overflow-y-auto border border-gray-100 w-full left-0 ${OpenDep ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                      {sports.map((s) => (
                                          <div key={s.id} className="w-full flex gap-2 p-2.5 hover:bg-unimar/15 place-items-center cursor-pointer" onClick={() => handleSelectSport(s)}>
                                              <span className="ml-2 text-sm">{s.label}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </InputGroup>

                            <InputGroup label="Categoría" For="category" labelClass="text-gray-700 text-start">
                                <div className="relative" ref={menuCat} onClick={() => sportId && setMCat(!OpenCat)}>
                                    <Input 
                                        type='text' id="category" 
                                        className={`cursor-pointer input w-full pl-3 py-2 bg-white placeholder:text-black ${!sportId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        required readOnly 
                                        value={category ?? "Seleccione"}
                                        disabled={!sportId}
                                    />
                                    <Button type="button" className="cursor-pointer absolute right-2 top-1/2 flex justify-center -translate-y-1/2">
                                        <Image className={`size-[1rem] transition-transform duration-300 ease-in-out ${OpenCat ? 'rotate-180' : 'rotate-0'}`} src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'} alt="v" width={16} height={16} />
                                    </Button>
                                    <div className={`absolute z-20 bg-white shadow-lg mt-1 rounded-xl overflow-hidden overflow-y-auto border border-gray-100 w-full left-0 ${OpenCat ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                        {categories.map((c) => (
                                            <div key={c.id} className="w-full flex gap-2 p-2.5 hover:bg-unimar/15 place-items-center cursor-pointer" onClick={() => handleSelectCategory(c.label)}>
                                                <span className="ml-2 text-sm capitalize">{c.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </InputGroup>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <InputGroup label="Modo de Juego" For="gameMode" labelClass="text-gray-700 text-start">
                                <Input 
                                    type='text' 
                                    id="gameMode" 
                                    className="input w-full pl-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed" 
                                    required readOnly 
                                    value={gameMode || "Automático"}
                                    disabled
                                />
                            </InputGroup>

                            <InputGroup label="Min. Participantes" For="min" labelClass="text-gray-700 text-start">
                                <Input 
                                    id="min" type="number" min="1" 
                                    className={`input w-full bg-white ${!gameMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    value={min} onChange={(e) => handleMinChange(Number(e.target.value))}
                                    disabled={!gameMode}
                                />
                            </InputGroup>

                            <InputGroup label="Max. Participantes" For="max" labelClass="text-gray-700 text-start">
                                <Input 
                                    id="max" type="number" min="1"
                                    className={`input w-full bg-white ${!gameMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    value={max} onChange={(e) => handleMaxChange(Number(e.target.value))}
                                    disabled={!gameMode}
                                />
                            </InputGroup>
                        </div>
                        
                        <div className="flex justify-end pt-2">
                            <Button 
                                onClick={handleAddToList}
                                disabled={!sportId || !category}
                                className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors
                                    ${(!sportId || !category) 
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed grayscale' 
                                        : 'bg-unimar hover:bg-blue-900 text-white cursor-pointer'
                                    }`}
                            >
                                <Image src="/agregar.png" alt="+" width={18} height={18} className='invert grayscale-65'/>
                                <span>Añadir a la lista</span>
                            </Button>
                        </div>
                    </div>

                    {disciplinesList.length > 0 && (
                        <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
                            <Table className="w-full">
                                <TableHead className="bg-unimar border-b border-gray-400">
                                    <TableHeaderCell className="p-3 text-left font-bold text-gray-100 w-1/4">Deporte</TableHeaderCell>
                                    <TableHeaderCell className="p-3 text-center font-bold text-gray-100 w-1/5">Categoría</TableHeaderCell>
                                    <TableHeaderCell className="p-3 text-center font-bold text-gray-100 w-1/5">Modo</TableHeaderCell>
                                    <TableHeaderCell className="p-3 text-center font-bold text-gray-100 w-1/6">Cupos</TableHeaderCell>
                                    <TableHeaderCell className="p-3 text-center font-bold text-gray-100">Acción</TableHeaderCell>
                                </TableHead>
                                <TableBody className="divide-y divide-gray-200">
                                    {disciplinesList.map((item) => (
                                        <TableRow key={item.tempId} className="hover:bg-gray-50">
                                            <TableCell className="p-3 font-medium">{item.sportLabel}</TableCell>
                                            <TableCell className="p-3 text-center capitalize">{item.category}</TableCell>
                                            <TableCell className="p-3 text-center capitalize">{item.gameMode}</TableCell>
                                            <TableCell className="p-3 text-center">{item.min} - {item.max}</TableCell>
                                            <TableCell className="p-3 text-center">
                                                <button 
                                                    onClick={() => handleRemoveFromList(item.tempId)}
                                                    className="text-red-500 hover:text-red-700 font-bold p-2"
                                                    title="Quitar"
                                                >
                                                    <Image src="/basura (1).png" alt="X" width={16} height={16} />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </>
            )}
        </div>

        <FooterModal
          className="flex-none"
          BTmain={disciplinesList.length > 0 ? `Guardar (${disciplinesList.length})` : "Guardar"}
          BTSecond="Cancelar"
          onClose={onClose}
          onSumit={handleSaveAll}
          disabled={loading || isSaving || disciplinesList.length === 0}
        />
      </ContainModal>
    </Modal>
  );
}