'use client';
import { useEffect, useRef, useState, ChangeEvent, useMemo } from "react"; 
import { Button, ContainModal, HeaderModal, FooterModal, Input, InputGroup } from "@/types/ui_components";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import UploadLogo from "@/components/ui/UpLoad_IMG";

interface ModalProps {
    onCloseExternal: () => void;
}

interface ApiDiscipline {
    id: number;
    categoria: string;
    modo_juego: string;
    nombre_deporte: string;
    min_participantes:number;
    max_participantes:number;
}

interface ApiTournament {
    id: number;
    nombre: string;
    descripcion: string;
    estado: 'proximo' | 'activo' | 'finalizado';
    creador: any;
    total_disiplinas: number;
    inicio: string;
    fin: string;
    disciplinas: ApiDiscipline[];
    reglamentos_torneo: any[];
}

export default function team_modal({onCloseExternal}:ModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tournament, setTournament] = useState<ApiTournament | null>(null);

  const [selectedSportName, setSelectedSportName] = useState<string | null>(null); 
  const [selectedDiscipline, setSelectedDiscipline] = useState<ApiDiscipline | null>(null); 

  const [OpenDep, setMDep] = useState(false);
  const [OpenCat, setMCat] = useState(false);
  const menuOut = useRef<HTMLDivElement>(null);
  const menuOutC = useRef<HTMLDivElement>(null); 

  const [teamData, setTeamData] = useState({
      nombre: "",
      madrina: "",
      color: "",
      logo: null as File | null,
      integrantes: [] as { dorsal: string; correo: string; cedula: string; telefono: string; isCaptain?: boolean }[],
    });

  const [integranteError, setIntegranteError] = useState({ dorsal: "", correo: "", cedula: "", telefono: "" });
  const [nuevo, setNuevo] = useState({ dorsal: "", correo: "", cedula: "", telefono:"" });
  const [editIndex, setEditIndex] = useState<number | null>(null); 
  const [captainIndex, setCaptainIndex] = useState<number | null>(null);

  const [errors, setErrors] = useState({
      nombre: "",
      madrina: "",
      color: "",
      logo: "",
      integrantes: [] as { dorsal: string; correo: string; cedula: string; telefono: string; isCaptain?: boolean }[],
    });

    const handleChange = (field: string, value: any) => {
    setTeamData((prev) => ({ ...prev, [field]: value }));
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const [minIntegrantes, maxIntegrantes] = useMemo(() => {
    if (!selectedDiscipline) {
      return [1, 12];
    }
    return [
      selectedDiscipline.min_participantes, 
      selectedDiscipline.max_participantes
    ];
  }, [selectedDiscipline]); 

  const validateIntegrante = (
    integrante: { dorsal: string, correo: string, cedula: string, telefono: string },
    currentIntegrantes: { dorsal: string, correo: string, cedula: string, telefono: string }[],
    currentIndex: number | null
  ) => {
    const newErrors = { dorsal: "", correo: "", cedula: "", telefono: "" };
    let isValid = true;
    
    const dorsal = integrante.dorsal.trim();
    const correo = integrante.correo.trim().toLowerCase();
    const cedula = integrante.cedula.trim(); // Solo números
    const telefono = integrante.telefono.trim();
    
    if (!/^[0-9]+$/.test(dorsal)) {
      newErrors.dorsal = "Solo números.";
      isValid = false;
    }

    if (!/^[0-9]{7,9}$/.test(cedula)) {
      newErrors.cedula = "Debe tener 7-9 dígitos.";
      isValid = false;
    }
    
    if (!/^[0-9]{10,11}$/.test(telefono)) {
      newErrors.telefono = "Teléfono inválido (10-11 dígitos).";
      isValid = false;
    }

    if (!/^[^@\s]+@unimar\.edu\.ve$/i.test(correo)) {
      newErrors.correo = "Debe ser @unimar.edu.ve";
      isValid = false;
    }

    if (isValid) {
      const nuevaCedulaNormalizada = `V-${cedula}`;
      currentIntegrantes.forEach((member, index) => {
        if (currentIndex !== null && index === currentIndex) {
          return;
        }
        if (member.dorsal === dorsal) {
          newErrors.dorsal = "Dorsal ya asignado.";
          isValid = false;
        }
        if (member.cedula === nuevaCedulaNormalizada) { 
          newErrors.cedula = "La Cédula ya está en la lista.";
          isValid = false;
        }
        if (member.correo === correo) {
          newErrors.correo = "El Correo ya está en la lista.";
          isValid = false;
        }
        if (member.telefono === telefono) {
          newErrors.telefono = "El Teléfono ya está en la lista.";
          isValid = false;
        }
      });
    }

    setIntegranteError(newErrors);
    return isValid;
  };
  
  const handleAddIntegrante = () => {
    if (!validateIntegrante(nuevo, teamData.integrantes, editIndex)) {
      return; 
    }
   
    const integranteNormalizado = {
      dorsal: nuevo.dorsal.trim(),
      correo: nuevo.correo.trim().toLowerCase(),
      cedula: `V-${nuevo.cedula.trim()}`,
      telefono: nuevo.telefono.trim(),
      isCaptain: false,
    };

    if (editIndex !== null) {
      const nuevosIntegrantes = [...teamData.integrantes];
      const isEditingCaptain = teamData.integrantes[editIndex].isCaptain;
      nuevosIntegrantes[editIndex] = { ...integranteNormalizado, isCaptain: isEditingCaptain }; 
      setTeamData({ ...teamData, integrantes: nuevosIntegrantes });
      setEditIndex(null);
    } else {
      if (teamData.integrantes.length >= maxIntegrantes) {
        alert(`Solo se permiten un máximo de ${maxIntegrantes} integrantes.`);
        return;
      }
      setTeamData({
        ...teamData,
        integrantes: [...teamData.integrantes, integranteNormalizado], 
      });
    }
    
    setNuevo({ dorsal: "", correo: "", cedula: "", telefono: "" });
    setIntegranteError({ dorsal: "", correo: "", cedula: "", telefono:"" });
  };

  const handleRemoveIntegrante = (index:number) => {
    if (index === captainIndex) {
      setCaptainIndex(null);
    }
    else if (captainIndex !== null && index < captainIndex) {
      setCaptainIndex(captainIndex - 1);
    }
    const nuevos = teamData.integrantes.filter((_, i) => i !== index);
    setTeamData({ ...teamData, integrantes: nuevos });
  };

  const handleEditIntegrante = (index:number) => {
    setEditIndex(index);
    const integranteAEditar = teamData.integrantes[index];
    
    setNuevo({
      dorsal: integranteAEditar.dorsal,
      correo: integranteAEditar.correo,
      telefono: integranteAEditar.telefono,
      cedula: integranteAEditar.cedula.replace("V-", "") 
    });
  };

  const validateStep3 = () => {
    const newErrors: any = { integrantes: [] };
    let valid = true;
    
    if (!teamData.nombre) { newErrors.nombre = "El nombre del equipo es obligatorio."; valid = false; }
    if (!teamData.color) { newErrors.color = "Debes indicar el color del uniforme."; valid = false; }
    if (!teamData.madrina) { newErrors.madrina = "Debes indicar el nombre de la madrina."; valid = false; }
    if (!teamData.logo) { newErrors.logo = "Debes subir el logo del equipo."; valid = false; }
    
    if (captainIndex === null) {
      alert("Debes seleccionar un capitán/delegado de la lista.");
      valid = false;
    }
    
    if (teamData.integrantes.length < minIntegrantes) { 
      alert(`Debes añadir al menos ${minIntegrantes} integrantes.`); 
      valid = false; 
    }
    if (teamData.integrantes.length > maxIntegrantes) { 
      alert(`No puedes exceder el máximo de ${maxIntegrantes} integrantes.`); 
      valid = false; 
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleFinalSubmit = async () => {
    if (!validateStep3()) {
      return;
    }
    
    setLoading(true); 
    
        
    const captainData = teamData.integrantes.find(int => int.isCaptain);
      if (!captainData) {
      alert("Error: Capitán no encontrado. Por favor, seleccione uno.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('discipline_id', selectedDiscipline!.id.toString());
    data.append('team_name', teamData.nombre);
    data.append('madrina', teamData.madrina);
    data.append('color', teamData.color);
    if (teamData.logo) data.append('logo', teamData.logo);
    data.append('delegado_correo', captainData.correo);
    data.append('delegado_telefono', captainData.telefono);
    data.append('integrantes', JSON.stringify(teamData.integrantes));

    console.log("Datos listos para enviar al backend:", Object.fromEntries(data.entries()));
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    try {
      const res = await fetch(`${API_URL}/discipline-entries`, {
        method: 'POST',
        body: data,
        // headers: { 'Authorization': `Bearer TU_TOKEN_AQUI` }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear la inscripción');
      }
      
      alert("¡Inscripción enviada con éxito!");
      handleCloseModal();

    } catch (e: any) {
      console.error("Error al enviar formulario:", e);
      alert(e.message);
    } finally {
      setLoading(false); 
    }
  };

    const uniqueSports = useMemo(() => {
    if (!tournament) return [];
    const allSportNames = tournament.disciplinas.map(d => d.nombre_deporte);
    return [...new Set(allSportNames)];
  }, [tournament]); 

  const availableCategories = useMemo(() => {
    if (!tournament || !selectedSportName) return [];
    return tournament.disciplinas.filter(d => d.nombre_deporte === selectedSportName);
  }, [tournament, selectedSportName]); 

    useEffect(() => {
    async function fetchCurrentTournament() {
      setLoading(true);
      setError(null);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      try {
        const res = await fetch(`${API_URL}/current-tournament`);
        if (!res.ok) {
          throw new Error(`No hay torneos abiertos para inscripción (${res.statusText})`);
        }
        const jsonData = await res.json();
        setTournament(jsonData.data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCurrentTournament();
  }, []);
  
  useEffect(()=>{
    function handleOutClick(event: globalThis.MouseEvent) {
      const target = event.target as Node;
      if (OpenDep && menuOut.current && !menuOut.current.contains(target)) {
        setMDep(false);
      }
      if (OpenCat && menuOutC.current && !menuOutC.current.contains(target)) {
        setMCat(false);
      }
    }
    if (OpenDep || OpenCat) {
      document.addEventListener("mousedown", handleOutClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutClick);
    };
  }, [OpenDep, OpenCat]); 

  const handleCloseModal=()=>{
    onCloseExternal();
    setSelectedSportName(null);
    setSelectedDiscipline(null);
    setMDep(false);
    setMCat(false);

    setTeamData({ nombre: "", madrina: "", color: "", logo: null, integrantes: [] });
    setErrors({ nombre: "", madrina: "", color: "", logo: "", integrantes: [] });
    setNuevo({ dorsal: "", correo: "", cedula: "", telefono: "" });
    setIntegranteError({ dorsal: "", correo: "", cedula: "", telefono: "" });
    setEditIndex(null);
    setCaptainIndex(null);
  };

  const handleSelectD = (sportName: string) => {
    setSelectedSportName(sportName); 
    setSelectedDiscipline(null);
    setMDep(false); 
    setMCat(true); 
  };

  const handleSelectC = (discipline: ApiDiscipline) => {
    setSelectedDiscipline(discipline); 
    setMCat(false); 
  };

    const handleSetCaptain = (index: number) => {
    setTeamData(prev => ({
      ...prev,
      integrantes: prev.integrantes.map((int, i) => ({
      ...int,
      isCaptain: i === index,
      }))
    }));
    setCaptainIndex(index);
  };

    if (loading) {
        return (
        <ContainModal className="w-full max-w-md p-6 flex items-center justify-center">
            <p>Cargando información del torneo...</p>
        </ContainModal>
        );
    }
  
    if (error) {
        return (
        <ContainModal className="w-full max-w-md p-6 bg-white rounded-2xl">
            <HeaderModal onClose={handleCloseModal} >
            <h3 className="text-xl font-bold text-red-600">Error</h3>
            </HeaderModal>
            <div className="p-4 text-center">
            <p className="text-gray-700 mt-2">{error}</p>
            <Button onClick={handleCloseModal} className="mt-4 bg-unimar text-white">Cerrar</Button>
            </div>
        </ContainModal>
        );
    }

 return (
        <ContainModal className={`grid grid-rows-[auto_minmax(0,1fr)_auto] text-black w-[95%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] space-y-3 bg-gray-200 rounded-2xl overflow-hidden max-h-[80vh]`}>
            
            <HeaderModal className="flex-none" onClose={handleCloseModal}>
              <div className="text-start">
                  <h2 className="ml-5 title">Añadir Nueva Inscripción</h2>
                  <p className="ml-5 text-[1.2rem]">Seleccione la disciplina y complete los datos del equipo.</p>
              </div>
            </HeaderModal>

            <div className="relative flex-grow main-modal overflow-y-auto px-4 space-y-2">
                <section className="flex flex-col p-4 shadow rounded-xl bg-gray-100">
                  <div className="section-title mt-2 flex flex-row gap-2 ml-3 place-items-center">
                      <div className="relative size-[52px] bg-unimar/8 rounded-full">
                          <Image
                              className=" absolute inset-0 object-contain scale-100"
                              src={'/informe.png'}
                              alt="Info"
                              fill
                          />
                      </div>
                      <div className="text-start">
                          <h3 className="text-[1.3rem] font-bold">1. Seleccione la Disciplina</h3>
                      </div>
                  </div>
                  <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 text-start p-3">
                  
                  <InputGroup For="deporte" label="Deporte" labelClass="text-gray-700">
                      <div className="relative" ref={menuOut} onClick={() => (setMDep(!OpenDep))}>
                        <Input 
                            type='text' 
                            id="deporte" 
                            className="cursor-pointer input w-full pl-3 py-3 placeholder:text-black" 
                            required readOnly 
                            value={selectedSportName ?? "Seleccione un deporte"}
                        />
                        <Button type="button" className=" cursor-pointer absolute right-1 md:right-1 lg:right-4 top-1/2 flex justify-center -translate-y-1/2 -translate-x-1/2">
                            <Image className={`size-[1rem] transition-transform duration-300 ease-in-out ${OpenDep ? 'rotate-180' : ' rotate-360'}`} src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'} alt="desplegar" width={100} height={100} />
                        </Button>
                        <div className={`absolute z-20 bg-white shadow-lg mt-1 rounded-xl overflow-hidden overflow-y-auto ${OpenDep ? 'w-full h-[6.75rem]' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                            {uniqueSports.map((sportName) => (
                            <div 
                                key={sportName} 
                                className="w-full flex gap-2 p-1.5 hover:bg-unimar/15 place-items-center" 
                                onClick={() => (handleSelectD(sportName))}
                            >
                                <span className="ml-2">{sportName}</span>
                            </div>
                            ))}
                        </div>
                      </div>
                  </InputGroup> 

                  <InputGroup For="Categoria" label="Categoría" labelClass="text-gray-700">
                      <div 
                      className="relative" 
                      ref={menuOutC} 
                      onClick={() => selectedSportName && setMCat(!OpenCat)}
                      >
                      <Input 
                          type='text' 
                          id="Categoria" 
                          className="cursor-pointer input w-full pl-3 pr-11 py-3 flex gap-0.5 disabled:text-gray-500 text-black" 
                          placeholder="Seleccione una categoría" 
                          readOnly 
                          value={selectedDiscipline?.categoria ?? "Seleccione una categoría"} 
                          required 
                          disabled={!selectedSportName} 
                      />
                      <Button type="button" className=" cursor-pointer absolute top-1/2 right-1 lg:right-4 flex justify-center -translate-y-1/2 -translate-x-1/2">
                          <Image className={`size-[1rem] transition-transform duration-300 ease-in-out ${OpenCat && selectedSportName ? 'rotate-180' : ' rotate-360'}`} src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'} alt="desplegar" width={100} height={100} />
                      </Button>
                      <div className={`absolute z-20 bg-white shadow-lg mt-1 rounded-xl overflow-hidden overflow-y-auto ${OpenCat ? 'w-full h-auto' : 'max-h-0 opacity-0 pointer-events-none'}`} >
                          {availableCategories.map((discipline) => (
                          <div 
                              key={discipline.id} 
                              className="w-full flex gap-2 p-1.5 hover:bg-unimar/15 place-items-center" 
                              onClick={() => handleSelectC(discipline)} 
                          >
                              <span className="ml-2">{discipline.categoria}</span>
                          </div>
                          ))}
                      </div>
                      </div>
                  </InputGroup> 

                  <InputGroup For="Torneo" label="Nombre del Torneo" labelClass="text-gray-700" className="md:col-span-2">
                      <div className="relative">
                      <Input 
                          type="text" 
                          id="Torneo" 
                          className="input w-full pl-6 pr-3 py-3 placeholder:text-black" 
                          value={tournament?.nombre || 'Cargando...'}
                          disabled
                      />
                      </div>
                  </InputGroup>
                  </div>
                </section>

            <AnimatePresence>
                {selectedDiscipline && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <section className="flex flex-col space-y-5 py-4">
                            <div className="section-title flex flex-col space-y-4 p-4 bg-gray-100 shadow rounded-xl">
                                <div className="flex place-items-center gap-2">
                                  <div className="relative size-[52px] bg-unimar/5 rounded-full">
                                      <Image
                                      className=" absolute inset-0 object-contain grayscale-20"
                                      src={'/personas.png'}
                                      alt="Equipo"
                                      fill
                                      />
                                  </div>
                                  <div className="text-start">
                                      <h3 className="text-[1.3rem] font-bold">2. Información del Equipo</h3>
                                  </div>
                                </div>
                                <div className="flex flex-col px-2">
                                  <div className="mb-6 px-2 gap-3 place-content-center">
                                      <div className="text-start space-y-3">
                                      <InputGroup label="Nombre del equipo" labelClass="text-gray-500" For="nombre">
                                          <Input
                                          className="input w-full"
                                          type="text"
                                          value={teamData.nombre}
                                          onChange={(e) => handleChange("nombre", e.target.value)}
                                          placeholder="Ej: Los Campeones"
                                          /> 
                                          {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                                      </InputGroup> 
                                      <InputGroup label="Madrina del equipo" labelClass="text-gray-500" For="madrina">
                                          <Input
                                          className="input"
                                          type="text"
                                          value={teamData.madrina}
                                          onChange={(e) => handleChange("madrina", e.target.value)}
                                          placeholder="Ej: María Villarroel"
                                          /> 
                                          {errors.madrina && <p className="text-red-500 text-sm mt-1">{errors.madrina}</p>}
                                      </InputGroup> 
                                      <InputGroup label="Color del uniforme" labelClass="text-gray-500" For="color">
                                          <Input
                                          className="input"
                                          type="text"
                                          value={teamData.color}
                                          onChange={(e) => handleChange("color", e.target.value)}
                                          placeholder="Ej: Azul y Blanco"
                                          /> 
                                          {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
                                      </InputGroup>  
                                      </div>
                                  </div>
                                </div>
                        </div>

                            <div className="flex flex-col p-3 bg-gray-100 shadow rounded-xl">
                                <UploadLogo
                                label="Logo del equipo"
                                file={teamData.logo}
                                error={errors.logo}
                                onFileChange={(file: File | null) => {
                                    setTeamData(prev => ({ ...prev, logo: file }));
                                    if (file) {
                                    setErrors(prev => ({ ...prev, logo: "" }));
                                    }
                                }}
                                />
                                {errors.logo && <p className="text-red-500 text-sm mb-0.5">{errors.logo}</p>}
                            </div>

                            <section className="flex flex-col space-y-4 p-4 bg-gray-100 shadow rounded-xl">
                                <div className="flex items-center gap-2">
                                    <div className="relative size-[52px] bg-unimar/8 rounded-full">
                                        <Image
                                            className="absolute inset-0 object-contain"
                                            src="/deporte.png"
                                            alt="Integrantes"
                                            fill
                                        />
                                    </div>
                                    <h3 className="text-[1.3rem] font-bold">Integrantes del Equipo</h3>
                                </div>

                                
                                <p className="text-gray-600 text-sm font-medium">
                                    Integrantes: {teamData.integrantes.length} / {maxIntegrantes}
                                    (Mínimo requerido: {minIntegrantes})
                                </p>

                                {teamData.integrantes.map((int, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">                                                
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-full">
                                                {int.dorsal}
                                            </div>
                                            <div className="text-start">
                                                <p className="font-semibold text-gray-900">{int.cedula}</p>
                                                <p className="text-gray-500 text-sm">{int.correo}</p>
                                                <p className="text-gray-500 text-sm">{int.telefono}</p>
                                            </div>

                                        </div>
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => handleSetCaptain(i)}
                                                title="Designar como Capitán"
                                                className={`p-2 rounded-full cursor-pointer transition-colors 
                                                    ${captainIndex === i 
                                                        ? 'bg-yellow-100/75 text-white' 
                                                        : 'grayscale hover:bg-yellow-200/75'
                                                    }`}
                                            >
                                                <Image
                                                    src={`/favorito.png`}
                                                    width={28}
                                                    height={36}
                                                    alt="capitan"
                                                />
                                            </button>
                                            <button
                                                onClick={() => handleEditIntegrante(i)}
                                                className=" hover:bg-gray-200 p-2 rounded-full cursor-pointer"
                                            >
                                                <Image src="/lapiz (1).png" alt="Editar" width={24} height={16} />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveIntegrante(i)}
                                                className=" hover:bg-rose-200 p-2 rounded-full cursor-pointer"
                                            >
                                                <Image src="/basura (1).png" alt="Eliminar" width={24} height={16} />
                                            </button>
                                        </div>
                                    </div>

                                ))}

                                    <div className="flex flex-wrap items-start gap-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        
                                        <div className="w-20"> 
                                            <Input
                                                placeholder="Dorsal"
                                                value={nuevo.dorsal}
                                                onChange={(e) => setNuevo({ ...nuevo, dorsal: e.target.value })}
                                                className="input w-full"
                                            />
                                            {integranteError.dorsal && <p className="text-red-500 text-xs mt-1">{integranteError.dorsal}</p>}
                                        </div>
                                    
                                        <div className="flex-1 min-w-[120px]"> 
                                            <Input
                                                placeholder="Teléfono (04...)"
                                                value={nuevo.telefono}
                                                onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })}
                                                className="input w-full"
                                            />
                                            {integranteError.telefono && <p className="text-red-500 text-xs mt-1">{integranteError.telefono}</p>}
                                        </div>
                                        
                                        <div className="flex-1 min-w-[150px]">
                                            <div className="relative flex items-center">
                                                <span className="absolute left-3 text-gray-500">V-</span>
                                                <Input
                                                    placeholder="Cédula (solo números)"
                                                    value={nuevo.cedula}
                                                    onChange={(e) => setNuevo({ ...nuevo, cedula: e.target.value })}
                                                    className="input w-full pl-8"
                                                />
                                            </div>
                                            {integranteError.cedula && <p className="text-red-500 text-xs mt-1">{integranteError.cedula}</p>}
                                        </div>

                                        <div className="flex-1 min-w-[180px]"> 
                                            <Input
                                                placeholder="usuario@unimar.edu.ve"
                                                value={nuevo.correo}
                                                onChange={(e) => setNuevo({ ...nuevo, correo: e.target.value })}
                                                className="input w-full"
                                            />
                                            {integranteError.correo && <p className="text-red-500 text-xs mt-1">{integranteError.correo}</p>}
                                        </div>

                                        <Button
                                            onClick={handleAddIntegrante}
                                            className={`${
                                                editIndex !== null ? "bg-blue-500" : "bg-unimar"
                                            } text-white font-bold rounded-xl px-4 w-full py-2 cursor-pointer mt-4`}
                                        >
                                            {editIndex !== null ? "Guardar cambios" : "Añadir integrante"}
                                        </Button>
                                    </div>
                            </section>
                        </section>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>

            <FooterModal
                className="flex-none"
                BTmain="Finalizar Inscripción"
                BTSecond="Cerrar"
                onClose={handleCloseModal}
                onSumit={handleFinalSubmit}
                disabled={!selectedDiscipline || loading} 
                />
                
        </ContainModal>
 );
}
