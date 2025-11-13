'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Modal, ContainModal, HeaderModal, FooterModal, Select, InputGroup, Input } from '@/types/ui_components';

interface ModalProps {
  state: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  tournamentId: number; 
}

interface ISelectItem {
  id: number;
  label: string;
}

const categories = [
  { id: 1, label: "masculina" },
  { id: 2, label: "femenina" },
  { id: 3, label: "mixta" },
];
const gameModes = [
  { id: 1, label: "equipo" },
  { id: 2, label: "individual" },
  { id: 3, label: "duplas" },
];

export default function Modal_addDiscipline({ state, onClose, onSaveSuccess, tournamentId }: ModalProps) {
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sports, setSports] = useState<ISelectItem[]>([]);
  
  const [sportId, setSportId] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(1);
  
  const [isSportOpen, setIsSportOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);

  useEffect(() => {
    if (!state) return;

    const fetchSports = async () => {
      setLoading(true);
      setError(null);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      try {
        const res = await fetch(`${API_URL}/sports`);
        if (!res.ok) throw new Error('Error cargando la lista de deportes');
        
        const json = await res.json();
        const formattedSports = json.data.map((sport: any) => ({
          id: sport.id,
          label: sport.nombre || sport.title
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

  const handleSave = async () => {
    if (!sportId || !category || !gameMode || min <= 0 || max < min) {
      alert("Por favor, complete todos los campos. El máx. debe ser >= al mín.");
      return;
    }
    
    setIsSaving(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    
    const body = {
      event_id: tournamentId,
      sport_id: sportId,
      category: category,
      game_mode: gameMode,
      min_participants: min,
      max_participants: max,
    };

    try {
      const res = await fetch(`${API_URL}/disciplines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || 'Error al guardar la disciplina');
      }

      alert('¡Disciplina creada con éxito!');
      onSaveSuccess();
      onClose(); 

    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal state={state}>
      <ContainModal className="w-full max-w-lg bg-white text-black">
        <HeaderModal onClose={onClose}>
          <h2 className="text-xl font-bold text-gray-800">
            Añadir Nueva Disciplina
          </h2>
        </HeaderModal>

        {loading ? (
          <div className="p-6 text-center">Cargando deportes...</div>
        ) : error ? (
          <div className="p-6 text-red-500 text-center">{error}</div>
        ) : (
          <div className="p-6 space-y-4">
            
            <InputGroup label="Deporte" For="sport" labelClass="text-gray-700 text-start">
              <Select
                className="cursor-pointer input w-full pl-3 py-2 placeholder:text-black" 
                options={sports}
                currentValue={sports.find(s => s.id === sportId)?.label || ""}
                isOpen={isSportOpen}
                setOpen={setIsSportOpen}
                onSelect={(id, label) => setSportId(id)}
                placeholder="Buscar Deporte..."
              />
            </InputGroup>
            
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Categoría" For="category" labelClass="text-gray-700 text-start">
                <Select
                  className="cursor-pointer input w-full pl-3 py-2 placeholder:text-black" 
                  options={categories}
                  currentValue={category || ""}
                  isOpen={isCatOpen}
                  setOpen={setIsCatOpen}
                  onSelect={(id, label) => setCategory(label)}
                  placeholder="Seleccionar"
                />
              </InputGroup>
              <InputGroup label="Modo de Juego" For="gameMode" labelClass="text-gray-700 text-start">
                <Select
                  className="cursor-pointer input w-full pl-3 py-2 placeholder:text-black" 
                  options={gameModes}
                  currentValue={gameMode || ""}
                  isOpen={isModeOpen}
                  setOpen={setIsModeOpen}
                  onSelect={(id, label) => setGameMode(label)}
                  placeholder="Seleccionar"
                />
              </InputGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Min. Participantes" For="min" labelClass="text-gray-700 text-start">
                    <Input 
                        id="min" name="min" type="number"
                        className="input w-full"
                        value={min}
                        onChange={(e) => setMin(Number(e.target.value))}
                    />
                </InputGroup>
                <InputGroup label="Max. Participantes" For="max" labelClass="text-gray-700 text-start">
                    <Input 
                        id="max" name="max" type="number"
                        className="input w-full"
                        value={max}
                        onChange={(e) => setMax(Number(e.target.value))}
                    />
                </InputGroup>
            </div>

          </div>
        )}

        <FooterModal
          BTmain="Guardar Disciplina"
          BTSecond="Cancelar"
          onClose={onClose}
          onSumit={handleSave}
          disabled={loading || isSaving}
        />
      </ContainModal>
    </Modal>
  );
}