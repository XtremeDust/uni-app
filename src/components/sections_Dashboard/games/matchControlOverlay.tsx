'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/types/ui_components' 

const SPORT_RULES: Record<string, { points: number[]; label: string; autoWin?: number | null }> = {
  'Baloncesto': { points: [1, 2, 3], label: 'Puntos', autoWin: null },
  'Basket 3x3': { points: [1, 2], label: 'Puntos', autoWin: 21 },
  'Fútbol Sala': { points: [1], label: 'Goles', autoWin: null },
  'Voleibol': { points: [1], label: 'Sets', autoWin: 25 },
  'Tenis de Mesa': { points: [1], label: 'Puntos', autoWin: 11 },
  'default': { points: [1], label: 'Puntos', autoWin: null },
}

const useStopwatch = (isRunning: boolean) => {
    const [seconds, setSeconds] = useState(0)
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isRunning) {
            interval = setInterval(() => setSeconds(s => s + 1), 1000)
        } else if (!isRunning && interval) {
            clearInterval(interval)
        }
        return () => { if (interval) clearInterval(interval) }
    }, [isRunning])

    const formatTime = () => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return { seconds, setSeconds, formatTime }
}

function useDebouncedSave(callback: (...args: any[]) => void, delay = 1500) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const save = useCallback((...args: any[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => callback(...args), delay)
  }, [callback, delay])
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }, [])
  return save
}

interface Props { gameId: number; onClose: () => void; onUpdate: () => void }

export default function MatchControlOverlay({ gameId, onClose, onUpdate }: Props) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

  const [game, setGame] = useState<any>(null)
  const [state, setState] = useState({ scoreA: 0, scoreB: 0, status: 'pendiente' })
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [showWOMenu, setShowWOMenu] = useState(false)
  
  const isFirstRun = useRef(true)
  const { formatTime } = useStopwatch(state.status === 'en partido')

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`${API_URL}/games/${gameId}`)
        if (!res.ok) throw new Error('Error API')
        const json = await res.json()
        const g = json.data || json
        setGame(g)
        setState({
            scoreA: Number(g.competidor_a?.score ?? 0),
            scoreB: Number(g.competidor_b?.score ?? 0),
            status: g.estado ?? 'pendiente'
        })
      } catch (e) { console.error(e); onClose() } 
      finally { setLoading(false) }
    }
    fetchGame()
  }, [gameId, onClose])

  const rules = useMemo(() => {
    const name = (game?.disciplina_nombre || '').toString()
    const key = Object.keys(SPORT_RULES).find(k => name.includes(k)) || 'default'
    return SPORT_RULES[key] ?? SPORT_RULES['default']
  }, [game])

  const rawSave = useCallback(async (sA: number, sB: number, status: string) => {
    setSaveState('saving')
    try {
      await fetch(`${API_URL}/games/${gameId}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score_a: sA, score_b: sB, estado: status }),
      })
      setSaveState('saved')
    } catch (e) { console.error(e); setSaveState('unsaved') }
  }, [gameId, onUpdate])

  const debouncedSave = useDebouncedSave(rawSave, 1500)

  useEffect(() => {
    if (isFirstRun.current) { isFirstRun.current = false; return }
    setSaveState('unsaved')
    debouncedSave(state.scoreA, state.scoreB, state.status)
  }, [state.scoreA, state.scoreB, state.status])

  const isMatchActive = state.status === 'en partido';

  const modifyScore = (team: 'A' | 'B', amount: number) => {
    if (!isMatchActive) return; 
    setState(prev => ({
        ...prev,
        [team === 'A' ? 'scoreA' : 'scoreB']: Math.max(0, (team === 'A' ? prev.scoreA : prev.scoreB) + amount)
    }))
  }

  const handleWalkover = (winner: 'A' | 'B' | 'CANCEL') => {
      if(!confirm("¿Confirmar acción irreversible?")) return;
      let newStatus = winner === 'CANCEL' ? 'cancelado' : 'finalizado';
      const newScoreA = winner === 'A' ? Math.max(state.scoreA, 3) : (winner === 'B' ? 0 : state.scoreA);
      const newScoreB = winner === 'B' ? Math.max(state.scoreB, 3) : (winner === 'A' ? 0 : state.scoreB);

      if (winner !== 'CANCEL') {
          setState({ ...state, status: newStatus, scoreA: newScoreA, scoreB: newScoreB });
          rawSave(newScoreA, newScoreB, newStatus);
      } else {
          setState({ ...state, status: newStatus });
          rawSave(state.scoreA, state.scoreB, newStatus);
      }
      onClose();
  }

  if (loading) return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-slate-800 border-t-transparent rounded-full"/>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-blue-50/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-in fade-in zoom-in-95 duration-200 font-sans">
      
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        <div className="px-8 py-6 flex justify-between items-start border-b border-slate-100">
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{game?.disciplina_nombre}</h1>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">RONDA {game?.ronda}</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="bg-slate-100 px-5 py-2 rounded-lg text-3xl font-black text-slate-800 font-mono tracking-tight">
                    {formatTime()}
                </div>
                <button onClick={onClose} className="bg-slate-100 cursor-pointer hover:bg-slate-200 text-slate-600 font-bold px-4 py-3 rounded-lg text-sm transition-colors">
                    Salir
                </button>
            </div>
        </div>

        <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-white">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className={`md:col-span-4 border border-slate-200 rounded-xl p-8 shadow-sm relative transition-all ${!isMatchActive ? 'opacity-50' : ''}`}>
                    <div className="absolute top-0 left-4 right-4 h-1.5 bg-unimar/90  rounded-b-md"></div>
                    
                    <div className="mt-4 text-center">
                        <h2 className="text-xl font-bold text-slate-800 truncate">{game?.competidor_a?.nombre}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">LOCAL</p>
                    </div>
                    
                    <div className="text-center py-8">
                        <div className="text-8xl font-black text-slate-900 leading-none">
                            {state.scoreA}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <button 
                            disabled={!isMatchActive} 
                            onClick={() => modifyScore('A', -1)} 
                            className="w-14 h-14 flex items-center justify-center rounded-lg cursor-pointer bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 font-bold text-2xl transition-colors disabled:cursor-not-allowed"
                        >-</button>
                        
                        {rules.points.map(p => (
                             <button 
                                key={p} 
                                disabled={!isMatchActive} 
                                onClick={() => modifyScore('A', p)} 
                                className="flex-1 h-14 rounded-lg bg-slate-100 cursor-pointer text-slate-800 hover:bg-slate-200 font-black text-xl transition-colors flex items-center justify-center gap-1 disabled:cursor-not-allowed disabled:text-slate-300"
                            >
                                <span className="text-sm font-bold align-top">+</span>{p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-4 flex flex-col items-center justify-center h-full gap-6">
                    
                    <div className="w-full border border-slate-100 rounded-lg p-6 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">ESTADO ACTUAL</p>
                        <div className="text-2xl font-black text-slate-700 uppercase">
                             {state.status.replace('_', ' ')}
                        </div>
                    </div>

                    {state.status === 'pendiente' && (
                         <button 
                            onClick={() => setState(s => ({...s, status: 'en partido'}))}
                            className="w-full py-4 bg-unimar/90 cursor-pointer text-white rounded-lg font-bold hover:bg-unimar transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                        >
                            ▶ Iniciar
                         </button>
                    )}
                    {state.status === 'en partido' && (
                         <button 
                            onClick={() => setState(s => ({...s, status: 'pausado'}))}
                            className="w-full py-4 bg-unimar/90 cursor-pointer text-white rounded-lg font-bold hover:bg-unimar transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                        >
                            ⏸ Pausar
                         </button>
                    )}
                    {state.status === 'pausado' && (
                         <button 
                            onClick={() => setState(s => ({...s, status: 'en partido'}))}
                            className="w-full py-4 bg-unimar/90 cursor-pointer text-white rounded-lg font-bold hover:bg-unimar transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                        >
                            ▶ Reanudar
                         </button>
                    )}

                    <div className="relative w-full">
                         <button 
                            onClick={() => setShowWOMenu(!showWOMenu)}
                            className="w-full border border-dashed cursor-pointer border-slate-200 text-slate-400 text-xs font-bold py-3 rounded-lg hover:text-slate-600 hover:border-slate-300 transition-colors"
                        >
                             ⚠️ Opciones de Retiro / Cancelar
                        </button>

                        {showWOMenu && (
                            <div className="absolute bottom-full mb-2 w-full bg-white border border-slate-200 shadow-xl rounded-lg p-2 z-10">
                                 <button onClick={() => handleWalkover('A')} className="w-full cursor-pointer text-left px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded">Gana {game?.competidor_a?.nombre}</button>
                                 <button onClick={() => handleWalkover('B')} className="w-full cursor-pointer text-left px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded">Gana {game?.competidor_b?.nombre}</button>
                                 <div className="border-t border-slate-100 my-1"></div>
                                 <button onClick={() => handleWalkover('CANCEL')} className="w-full text-left cursor-pointer px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded">Cancelar Partido</button>
                            </div>
                        )}
                    </div>

                </div>

                <div className={`md:col-span-4 border border-slate-200 rounded-xl p-8 shadow-sm relative transition-all ${!isMatchActive ? 'opacity-50' : ''}`}>
                    <div className="absolute top-0 left-4 right-4 h-1.5 bg-slate-400 rounded-b-md"></div>
                    
                    <div className="mt-4 text-center">
                        <h2 className="text-xl font-bold text-slate-800 truncate">{game?.competidor_b?.nombre}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">VISITANTE</p>
                    </div>
                    
                    <div className="text-center py-8">
                        <div className="text-8xl font-black text-slate-900 leading-none">
                            {state.scoreB}
                        </div>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <button 
                            disabled={!isMatchActive} 
                            onClick={() => modifyScore('B', -1)} 
                            className="w-14 h-14 flex items-center cursor-pointer justify-center rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 font-bold text-2xl transition-colors disabled:cursor-not-allowed"
                        >-</button>
                        
                        {rules.points.map(p => (
                             <button 
                                key={p} 
                                disabled={!isMatchActive} 
                                onClick={() => modifyScore('B', p)} 
                                className="flex-1 h-14 rounded-lg bg-slate-100 cursor-pointer text-slate-800 hover:bg-slate-200 font-black text-xl transition-colors flex items-center justify-center gap-1 disabled:cursor-not-allowed disabled:text-slate-300"
                            >
                                <span className="text-sm font-bold align-top">+</span>{p}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>

        <div className="px-8 py-6 border-t border-slate-100 flex justify-between items-center bg-white">
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ESTADO DE SINCRONIZACIÓN</p>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${saveState === 'saved' ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                    <span className="text-sm font-bold text-slate-700">{saveState === 'saved' ? 'Todo guardado' : 'Guardando...'}</span>
                </div>
             </div>
             
             <button 
                disabled={state.status === 'pendiente'}
                onClick={() => {
                    if(confirm("¿Finalizar partido?")) {
                        setState(s => ({...s, status: 'finalizado'}));
                        rawSave(state.scoreA, state.scoreB, 'finalizado');
                        onClose();
                    }
                }}
                className="bg-unimar/90 hover:bg-unimar cursor-pointer text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                FINALIZAR PARTIDO
             </button>
        </div>

      </div>
    </div>
  )
}