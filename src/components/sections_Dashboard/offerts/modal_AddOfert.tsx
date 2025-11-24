'use client'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Input, 
  Button, 
  Modal, 
  ContainModal, 
  HeaderModal, 
  FooterModal 
} from '@/types/ui_components'

interface User {
  id: number;
  nombre: string; 
  cedula: string;
  email: string;
  telefono?: string;
}

interface Discipline {
  id: number;
  nombre: string;
  tipo: 'Deporte' | 'Cultural' | 'deporte' | 'cultura';
}

interface OfferingFormData {
  sport_id: number | null;
  coach_user_id: number | null;
  trimester: string;
  max_students: number;
  state: 'abierto' | 'cerrado' | 'lleno';
  students: User[];
}

interface ModalProps {
  state: boolean;
  onClose: () => void;
  isEditMode?: boolean;
  offeringToEdit?: any;
}

const InputGroup = ({ label, children, className = "" }: { label: string, children: React.ReactNode, className?: string }) => (
  <div className={`flex flex-col space-y-1.5 text-start ${className}`}>
    <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
    {children}
  </div>
);

export default function ModalOfertaAcademica({ state, onClose, isEditMode = false }: ModalProps) {
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [formData, setFormData] = useState<OfferingFormData>({
    sport_id: null, coach_user_id: null, trimester: '2025-1',
    max_students: 20, state: 'abierto', students: []
  });

  const [disciplinesList, setDisciplinesList] = useState<Discipline[]>([]);
  const [coachesList, setCoachesList] = useState<User[]>([]);
  
  const [openDiscipline, setOpenDiscipline] = useState(false);
  const [openCoach, setOpenCoach] = useState(false);
  
  const [searchCedula, setSearchCedula] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', telefono: '' });
  const [newUserErrors, setNewUserErrors] = useState({ name: '', email: '', telefono: '' });
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const disciplineRef = useRef<HTMLDivElement>(null);
  const coachRef = useRef<HTMLDivElement>(null);
  
  const trimesters = ['2025-3', '2025-1', '2025-2', '2026-3'];

  useEffect(() => {
      if (state) {
          if(!isEditMode) {
             setFormData({
                sport_id: null, coach_user_id: null, trimester: '2025-3',
                max_students: 20, state: 'abierto', students: []
             });
          }
          setSearchError('');
          setShowCreateUser(false);
          setSearchCedula('');
          setNewUserErrors({ name: '', email: '', telefono: '' });
          
          const fetchData = async () => {
              try {
                  const res = await fetch(`${API_URL}/academic-offerings/create-info`);
                  if(!res.ok) throw new Error("Error API");
                  const json = await res.json();
                  setDisciplinesList(json.disciplines || []);
                  setCoachesList(json.coaches || []);
              } catch (error) {
                  console.error("Error cargando listas:", error);
              }
          };
          fetchData();
      }
  }, [state, API_URL, isEditMode]);

  
  const handleNumericInput = (setter: (val: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (/^\d*$/.test(val)) setter(val);
  };

  const handleAddStudent = async () => {
    if (!/^[0-9]{7,9}$/.test(searchCedula)) {
        setSearchError("La cédula debe tener entre 7 y 9 dígitos.");
        return;
    }

    setSearchError('');
    setShowCreateUser(false); 
    setNewUserErrors({ name: '', email: '', telefono: '' });
    setIsSearching(true);

    try {
        const cedulaNormalizada = `V-${searchCedula}`;
        const res = await fetch(`${API_URL}/users/search?cedula=${cedulaNormalizada}`);
        
        if (res.status === 404) {
            setSearchError('Estudiante no encontrado.');
            setShowCreateUser(true); 
            return;
        }
        
        if (!res.ok) throw new Error('Error en búsqueda');

        const data = await res.json();
        addStudentToList(data.data);

    } catch (error) { 
        setSearchError('Error de conexión.');
    } finally {
        setIsSearching(false);
    }
  };

  const addStudentToList = (user: User) => {
      if (formData.students.some(s => s.cedula === user.cedula)) {
          setSearchError('El estudiante ya está en la lista.');
          return;
      }
      if (formData.students.length >= formData.max_students) {
          setSearchError('Cupos llenos.');
          return;
      }
      setFormData(prev => ({
          ...prev,
          students: [...prev.students, user]
      }));
      setSearchCedula('');
      setNewUser({ name: '', email: '', telefono: '' });
      setShowCreateUser(false);
      setSearchError('');
  };

  const validateNewUser = () => {
      let isValid = true;
      const errors = { name: '', email: '', telefono: '' };

      if (!newUser.name.trim()) {
          errors.name = 'Nombre obligatorio.';
          isValid = false;
      }
      if (!/^[^@\s]+@unimar\.edu\.ve$/i.test(newUser.email)) {
          errors.email = 'Correo debe ser @unimar.edu.ve';
          isValid = false;
      }
      if (newUser.telefono && !/^\d{10,11}$/.test(newUser.telefono)) {
          errors.telefono = 'Teléfono inválido (10-11 dígitos).';
          isValid = false;
      }

      setNewUserErrors(errors);
      return isValid;
  };

  const handleCreateUser = async () => {
      if (!validateNewUser()) return;
      
      setIsCreatingUser(true);
      try {
          const cedulaNormalizada = `V-${searchCedula}`;
          const payload = {
              name: newUser.name,
              email: newUser.email,
              cedula: cedulaNormalizada, 
              telefono: newUser.telefono,
              password: 'password123', 
              password_confirmation: 'password123',
              role: 'user'
          };

          const res = await fetch(`${API_URL}/users`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (!res.ok) {
              const errData = await res.json();
              if(errData.message?.includes('Duplicate entry')) throw new Error('Correo o cédula ya existen.');
              throw new Error(errData.message || 'Error al registrar');
          }

          const json = await res.json();
          const createdUser = json.data || json; 
          
          addStudentToList({
              id: createdUser.id,
              nombre: createdUser.name,
              cedula: createdUser.cedula,
              email: createdUser.email,
              telefono: createdUser.telefono
          });
          
          alert("Usuario registrado y agregado.");

      } catch (error: any) {
          alert("Error: " + error.message);
      } finally {
          setIsCreatingUser(false);
      }
  };

  const handleRemoveStudent = (cedula: string) => {
    setFormData(prev => ({
        ...prev,
        students: prev.students.filter(s => s.cedula !== cedula)
    }));
  };

  const handleSubmit = async () => {
      try {
          const response = await fetch(`${API_URL}/academic-offerings`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
          });

          if (!response.ok) {
              const err = await response.json();
              throw new Error(err.message || 'Error al guardar');
          }
          
          alert("Oferta creada con éxito");
          onClose(); 
      } catch (error: any) {
          alert(error.message);
      }
  };

  const selectedDisciplineName = disciplinesList.find(d => d.id === formData.sport_id)?.nombre;
  const selectedCoachName = coachesList.find(c => c.id === formData.coach_user_id)?.nombre;

  useEffect(() => {
    function handleClickOutside(event: any) {
        if (disciplineRef.current && !disciplineRef.current.contains(event.target)) setOpenDiscipline(false);
        if (coachRef.current && !coachRef.current.contains(event.target)) setOpenCoach(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Modal state={state}>
      <ContainModal className="grid grid-rows-[auto_minmax(0,1fr)_auto] text-black w-[95%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] space-y-3 bg-gray-200 rounded-2xl overflow-hidden max-h-[90vh]">
        
        <HeaderModal className="flex-none" onClose={onClose}>
          <div className="text-start">
            <h2 className="ml-5 title">
                {isEditMode ? 'Editar Oferta' : 'Nueva Oferta Académica'}
            </h2>
            <p className="ml-5 text-[1.2rem]">
                {isEditMode ? 'Modifica los datos de la oferta.' : 'Configure la disciplina, profesor y cupos.'}
            </p>
          </div>
        </HeaderModal>

        <div className="relative flex-grow main-modal overflow-y-auto px-4 space-y-2">
          
          <section className="flex flex-col p-4 shadow rounded-xl bg-gray-100 ">
            <div className="section-title mt-2 flex flex-row gap-2 ml-3 place-items-center">
               <div className="relative size-[52px] bg-unimar/8 rounded-full">
                  <Image className="absolute inset-0 object-contain scale-100" src={'/informe.png'} alt="Info" fill />
               </div>
               <div className="text-start">
                  <h3 className="text-[1.3rem] font-bold">1. Detalles de la Oferta</h3>
               </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 text-start p-3">
                
                <InputGroup label="Disciplina / Cultura">
                    <div className="relative" ref={disciplineRef}>
                        <div onClick={() => setOpenDiscipline(!openDiscipline)} className="relative cursor-pointer">
                            <Input 
                                readOnly 
                                placeholder={disciplinesList.length > 0 ? "Seleccione..." : "Cargando..."}
                                value={selectedDisciplineName || ''} 
                                className="cursor-pointer input w-full pl-3 py-3 placeholder:text-black" 
                            />
                            <Button type="button" className="cursor-pointer absolute right-1 md:right-1 lg:right-4 top-1/2 flex justify-center -translate-y-1/2 -translate-x-1/2">
                                <Image className={`size-[1rem] transition-transform duration-300 ease-in-out ${openDiscipline ? 'rotate-180' : 'rotate-360'}`} src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'} alt="flecha" width={100} height={100} />
                            </Button>
                        </div>
                        <div className={`absolute z-20 bg-white shadow-lg mt-1 rounded-xl overflow-hidden overflow-y-auto ${openDiscipline ? 'w-full max-h-60' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                            {disciplinesList.map(d => (
                                <div key={d.id} onClick={() => { setFormData(prev => ({ ...prev, sport_id: d.id })); setOpenDiscipline(false); }} className="w-full flex gap-2 p-1.5 hover:bg-unimar/15 place-items-center cursor-pointer">
                                    <span className="ml-2 font-medium">{d.nombre}</span>
                                    <span className="text-xs bg-gray-100 px-2 rounded-full text-gray-500">{d.tipo}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </InputGroup>

                <InputGroup label="Trimestre">
                    <div className="relative">
                        <select 
                            className="cursor-pointer input w-full pl-3 py-3 appearance-none bg-white"
                            value={formData.trimester}
                            onChange={(e) => setFormData({...formData, trimester: e.target.value})}
                        >
                            {trimesters.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <Button type="button" className="cursor-pointer absolute right-1 md:right-1 lg:right-4 top-1/2 flex justify-center -translate-y-1/2 -translate-x-1/2 pointer-events-none">
                            <Image className="size-[1rem]" src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'} alt="flecha" width={100} height={100} />
                        </Button>
                    </div>
                </InputGroup>

                <InputGroup label="Profesor / Entrenador" className="lg:col-span-2">
                     <div className="relative" ref={coachRef}>
                        <div onClick={() => setOpenCoach(!openCoach)} className="relative cursor-pointer">
                            <Input 
                                readOnly 
                                placeholder={coachesList.length > 0 ? "Seleccione..." : "Cargando..."}
                                value={selectedCoachName || ''} 
                                className="cursor-pointer input w-full pl-3 py-3 placeholder:text-black" 
                            />
                            <Button type="button" className="cursor-pointer absolute right-1 md:right-1 lg:right-4 top-1/2 flex justify-center -translate-y-1/2 -translate-x-1/2">
                                <Image className={`size-[1rem] transition-transform duration-300 ease-in-out ${openCoach ? 'rotate-180' : 'rotate-360'}`} src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'} alt="flecha" width={100} height={100} />
                            </Button>
                        </div>
                        <div className={`absolute z-20 bg-white shadow-lg mt-1 rounded-xl overflow-hidden overflow-y-auto ${openCoach ? 'w-full max-h-60' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                            {coachesList.map(c => (
                                <div key={c.id} onClick={() => { setFormData(prev => ({ ...prev, coach_user_id: c.id })); setOpenCoach(false); }} className="w-full flex flex-col p-2 hover:bg-unimar/15 cursor-pointer border-b border-gray-50">
                                    <span className="ml-2 font-semibold">{c.nombre}</span>
                                    <span className="ml-2 text-xs text-gray-500">{c.email}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </InputGroup>

                <InputGroup label="Cupos Máximos">
                    <Input type="number" className="input w-full pl-3 py-3" value={formData.max_students} onChange={(e) => setFormData({...formData, max_students: parseInt(e.target.value)})} />
                </InputGroup>

                <InputGroup label="Estado">
                     <select className="input w-full pl-3 py-3 appearance-none bg-white" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value as any})}>
                        <option value="abierto">Abierto</option>
                        <option value="cerrado">Cerrado</option>
                        <option value="lleno">Lleno</option>
                    </select>
                </InputGroup>
            </div>
          </section>

          <AnimatePresence>
             {formData.sport_id && (
                <motion.section 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex flex-col space-y-4 p-4 bg-gray-100 shadow rounded-xl overflow-hidden"
                >
                    <div className="flex place-items-center gap-2 ml-3 mt-2">
                        <div className="relative size-[52px] bg-unimar/8 rounded-full">
                            <Image className="absolute inset-0 object-contain scale-100" src={'/personas.png'} alt="Equipo" fill />
                        </div>
                        <div className="text-start">
                            <h3 className="text-[1.3rem] font-bold">2. Estudiantes Inscritos</h3>
                            <p className="text-sm text-gray-600 ml-1">Total: {formData.students.length} / {formData.max_students}</p>
                        </div>
                    </div>

                    <div className="space-y-2 px-2">
                        {formData.students.map((student) => (
                            <div key={student.cedula} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-full">
                                        {student.nombre.charAt(0)}
                                    </div>
                                    <div className="text-start">
                                        <p className="font-semibold text-gray-900">{student.nombre}</p>
                                        <p className="text-gray-500 text-sm">{student.cedula} • {student.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleRemoveStudent(student.cedula)} className="p-2 hover:bg-rose-200 rounded-full cursor-pointer">
                                    <Image src="/basura (1).png" alt="Eliminar" width={24} height={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {formData.students.length !== formData.max_students&&(
                        <div className="flex flex-col gap-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300 mx-2">
                            <p className="text-sm font-bold text-gray-600 ml-1 text-start">Buscar o Registrar Estudiante</p>
                                <div className="flex gap-2 items-start">
                                    <div className="flex-1 relative flex items-center">
                                        <span className="absolute left-3 text-gray-500 pointer-events-none z-10">V-</span>
                                        <Input 
                                            type="text" 
                                            placeholder="Cédula (solo números)..."
                                            className="input w-full pl-9 py-2 bg-white"
                                            value={searchCedula}
                                            onChange={handleNumericInput(setSearchCedula)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
                                        />
                                    </div>
                                    <Button onClick={handleAddStudent} disabled={isSearching} className="bg-unimar text-white font-bold px-6 py-2 rounded-xl hover:bg-unimar/90 disabled:opacity-50">
                                        {isSearching ? '...' : 'Buscar'}
                                    </Button>
                                </div>
                        

                            {searchError && (
                                <div className="p-3 bg-unimar/5 border border-unimar rounded-xl animate-in fade-in slide-in-from-top-2 text-start">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-unimar text-sm font-bold">{searchError}</p>
                                        <button onClick={() => setSearchError('')} className="text-red-400 hover:text-red-600 font-bold text-xs">✕</button>
                                    </div>

                                    {showCreateUser && (
                                        <div className="pt-2 border-t border-red-200 space-y-3">
                                            <p className="text-sm text-gray-700 font-medium">Registrar nuevo estudiante para <span className="font-bold">V-{searchCedula}</span>:</p>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                <div className="flex-1 min-w-[200px]">
                                                    <Input 
                                                        placeholder="Nombre Completo" 
                                                        className="input w-full py-2 bg-white"
                                                        value={newUser.name}
                                                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                                                    />
                                                    {newUserErrors.name && <p className="text-red-500 text-xs mt-1">{newUserErrors.name}</p>}
                                                </div>
                                                <div className="flex-1 min-w-[200px]">
                                                    <Input 
                                                        placeholder="Correo @unimar.edu.ve" 
                                                        className="input w-full py-2 bg-white"
                                                        value={newUser.email}
                                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                                                    />
                                                    {newUserErrors.email && <p className="text-red-500 text-xs mt-1">{newUserErrors.email}</p>}
                                                </div>
                                                <div className="flex-1 min-w-[200px]">
                                                    <Input 
                                                        placeholder="Teléfono (Solo números)" 
                                                        className="input w-full py-2 bg-white"
                                                        value={newUser.telefono}
                                                        onChange={handleNumericInput((val) => setNewUser({...newUser, telefono: val}))}
                                                    />
                                                    {newUserErrors.telefono && <p className="text-red-500 text-xs mt-1">{newUserErrors.telefono}</p>}
                                                </div>
                                            </div>
                                            
                                            <Button 
                                                onClick={handleCreateUser}
                                                disabled={isCreatingUser}
                                                className="w-full bg-unimar/90 hover:bg-unimar cursor-pointer text-white font-bold py-2 rounded-xl shadow-sm"
                                            >
                                                {isCreatingUser ? 'Registrando...' : 'Registrar y Añadir a Lista'}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                     )}
                </motion.section>
             )}
          </AnimatePresence>
          
        </div>

        <FooterModal 
            className="flex-none"
            BTmain={isEditMode ? "Guardar Cambios" : "Publicar Oferta"}
            BTSecond="Cancelar"
            onClose={onClose}
            onSumit={handleSubmit}
            disabled={!formData.sport_id || !formData.coach_user_id || formData.students.length === 0}
        />

      </ContainModal>
    </Modal>
  );
}