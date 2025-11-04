'use client';
import { useEffect, useRef, useState, ChangeEvent, useMemo } from "react"; 

import { Button, ContainModal, HeaderModal, FooterModal, Input, InputGroup } from "@/types/ui_components";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import UploadLogo from "@/components/ui/UpLoadLogo"; 

interface ModalProps {
  onCloseExternal: () => void;
}

interface ApiDiscipline {
  id: number;
  categoria: string;
  modo_juego: string;
  nombre_deporte: string;
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

export default function modal_Inscription({onCloseExternal}:ModalProps) {

const [isSept, setStep] = useState(1);

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
        delegadoCorreo: "",
        delegadoTelefono: "",
        logo: null as File | null,
        integrantes: [] as { dorsal: string; correo: string; cedula: string }[],
    });

    const [nuevo, setNuevo] = useState({ dorsal: "",  correo: "", cedula: "" });
    const [editIndex, setEditIndex] = useState<number | null>(null); 
    const [maxIntegrantes, setMaxIntegrantes] = useState(12);
    
    const [errors, setErrors] = useState({
        nombre: "",
        madrina: "",
        color: "",
        delegadoCorreo: "",
        delegadoTelefono: "",
        logo: "",
        integrantes: [] as { dorsal?: string; correo?: string; cedula?: string }[],
    });

    
    const setVariant = {
        entre: { x: 50, opacity: 0, trasition: { duration: 0.5 } },
        center: { x: 0, opacity: 1, trasition: { duration: 0.5 } },
        exit: { x: -50, opacity: 0, trasition: { duration: 0.5 } }
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

    
    useEffect(() => {
        const limits: { [key: string]: number } = {
            'futbol sala': 12, 
            'basquet': 10,
            'voleibol': 8,
            'atletismo': 6,
        };
        const deporteKey = selectedDiscipline?.nombre_deporte.toLowerCase() || ""; 
        setMaxIntegrantes(limits[deporteKey] || 12); 
    }, [selectedDiscipline]); 

    
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


    const next = () => (setStep(isSept =>isSept+1));
    const prev = () => (setStep(isSept=>isSept-1));

    const handleCloseModal=()=>{
        onCloseExternal();
        setStep(1);
        setSelectedSportName(null);
        setSelectedDiscipline(null);
        setMDep(false);
        setMCat(false);

        setTeamData({
            nombre: "", madrina: "", color: "",
            delegadoCorreo: "", delegadoTelefono: "",
            logo: null, integrantes: []
        });
        setErrors({
            nombre: "", madrina: "", color: "",
            delegadoCorreo: "", delegadoTelefono: "",
            logo: "", integrantes: []
        });
    };

    
    const handleSelectD = (sportName: string) => {
        if (selectedSportName === sportName) {
            
            setSelectedSportName(null);
            setSelectedDiscipline(null);
            setMDep(false);
        } else {
            
            setSelectedSportName(sportName); 
            setSelectedDiscipline(null);    
            setMDep(false);                  
            setMCat(true);                  
        }
    };

    const handleSelectC = (discipline: ApiDiscipline) => {
        setSelectedDiscipline(discipline); 
        setMCat(false);                    
    };


    const canAdvanceStep1 = selectedSportName !== null && selectedDiscipline !== null;

    const handleNextClick = () => {
        if (isSept === 1) {    
            if (!canAdvanceStep1) {        
                alert("Por favor, seleccione un deporte y una categoría para continuar.");
                return; 
            }
        }
        next();
    };

    const handleChange = (field: string, value: any) => {
        setTeamData((prev) => ({ ...prev, [field]: value }));
        if (errors[field as keyof typeof errors]) {
             setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };
    
    const handleAddIntegrante = () => {
        if (!nuevo.dorsal || !nuevo.correo || !nuevo.cedula) {
            alert("Completa todos los campos del integrante.");
            return;
        }
        if (editIndex !== null) {
            const nuevosIntegrantes = [...teamData.integrantes];
            nuevosIntegrantes[editIndex] = nuevo;
            setTeamData({ ...teamData, integrantes: nuevosIntegrantes });
            setEditIndex(null);
        } else {
            if (teamData.integrantes.length >= maxIntegrantes) {
                alert(`Solo se permiten ${maxIntegrantes} integrantes para este deporte.`);
                return;
            }
            setTeamData({
                ...teamData,
                integrantes: [...teamData.integrantes, nuevo],
            });
        }
        setNuevo({ dorsal: "", correo: "", cedula: "" });
    };

    const handleRemoveIntegrante = (index:number) => {
        const nuevos = teamData.integrantes.filter((_, i) => i !== index);
        setTeamData({ ...teamData, integrantes: nuevos });
    };

    const handleEditIntegrante = (index:number) => {
        setEditIndex(index);
        setNuevo(teamData.integrantes[index]);
    };

    const validateStep3 = () => {
        const newErrors: any = { integrantes: [] };
        let valid = true;
        
        if (!teamData.nombre) { newErrors.nombre = "El nombre del equipo es obligatorio."; valid = false; }
        if (!teamData.color) { newErrors.color = "Debes indicar el color del uniforme."; valid = false; }
        if (!teamData.delegadoCorreo.match(/^[^@]+@[^@]+\.[^@]+$/)) { newErrors.delegadoCorreo = "Correo inválido."; valid = false; }
        if (!teamData.delegadoTelefono.match(/^[0-9]{10,}$/)) { newErrors.delegadoTelefono = "Número inválido."; valid = false; }
        if (!teamData.logo) { newErrors.logo = "Debes subir el logo del equipo."; valid = false; }
        if (teamData.integrantes.length === 0) { alert("Debes añadir al menos un integrante."); valid = false; }
        
        setErrors(newErrors);
        return valid;
    };

    const handleFinalSubmit = async () => {
        if (!validateStep3()) {
            return; 
        }
        
        setLoading(true); 
        
        const data = new FormData();
        data.append('discipline_id', selectedDiscipline!.id.toString());
        data.append('team_name', teamData.nombre);
        data.append('madrina', teamData.madrina);
        data.append('color', teamData.color);
        data.append('delegadoCorreo', teamData.delegadoCorreo);
        data.append('delegadoTelefono', teamData.delegadoTelefono);
        data.append('logo', teamData.logo!);
        data.append('integrantes', JSON.stringify(teamData.integrantes));

        console.log("Datos listos para enviar al backend:", Object.fromEntries(data.entries()));
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        try {
            const res = await fetch(`${API_URL}/discipline-entries`, {
                method: 'POST',
                body: data,
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

    if (loading) {
        return (
            <ContainModal className="w-full max-w-md p-6 flex items-center justify-center">
                <p>Cargando información del torneo...</p>
            </ContainModal>
        );
    }
    
    if (error) {
         return (
            <ContainModal className="w-full max-w-md p-6">
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
        <ContainModal className={`grid-flow-row-dense md:flex md:flex-col text-black ${ isSept===1 ? 'w-[95%] h-[82%] md:w-[80%] md:h-[70%] lg:w-[75%] lg:h-[70%] xl:w-[60%] xl:h-[80%] 2xl:w-[50%] 2xl:h-[70%]':(isSept===2 ? 'w-[95%] h-[89%] md:w-[85%] md:h-[90%] lg:w-[75%] lg:h-[85%] xl:w-[55%] xl:h-[85%] 2xl:w-[50%] 2xl:h-[88%]':'size-[95%] md:h-[95%]  xl:w-[35%]') }  space-y-3 overflow-y-auto bg-gray-200`}>
            <HeaderModal className="flex-none" onClose={handleCloseModal}>
                <div className="text-start">
                    <h2 className="ml-5 title">Formulario de Inscripción</h2>
                    <p className="ml-5 text-[1.2rem]">complete los detalles de su equipo para finalizar la inscripción.</p>
                </div>
            </HeaderModal>

            <div className="fases grid grid-cols-3">
                <div className="place-items-center space-y-2">
                    <h2 className={`rounded-full p-2 size-[48px] place-content-center ${isSept===1 ? 'bg-unimar text-white':'bg-gray-300 '}`}>1</h2>
                    <p className={`${isSept===1 ? 'text-unimar font-bold':'text-gray-700'}`}>Informacion Básica</p>
                </div>
                <div className="place-items-center space-y-2">
                    <h2 className={`rounded-full p-2 size-[48px] place-content-center ${isSept===2 ? 'bg-unimar text-white':'bg-gray-300 '}`}>2</h2>
                    <p className={`${isSept===2 ? 'text-unimar font-bold':'text-gray-700'}`}>Detelles del Torneo</p>
                </div>
                <div className="place-items-center space-y-2">
                    <h2 className={`rounded-full p-2 size-[48px] place-content-center ${isSept===3 ? 'bg-unimar text-white':'bg-gray-300 '}`}>3</h2>
                    <p className={`${isSept===3 ? 'text-unimar font-bold':'text-gray-700'}`}>Información del Equipo</p>
                </div>
            </div>

            <div className="relative flex-grow main-modal  place-content-center">
                <AnimatePresence mode="wait">
                    <motion.div
                    key={isSept}
                    variants={setVariant}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className={` space-y-2 transition-opacity flex flex-col p-2 `}>
                        
                        {isSept ===1 &&(
                            <>
                                <section className="flex flex-col p-2 shadow rounded-xl bg-gray-100">
                                    <div className="section-title mt-3 flex flex-row gap-2 ml-3 place-items-center">
                                        <div className="relative size-[52px] bg-unimar/8 rounded-full">
                                            <Image
                                                className=" absolute inset-0 object-contain scale-100"
                                                src={'/informe.png'}
                                                alt="lol"
                                                fill
                                            />
                                        </div>
                                        <div className="text-start">
                                            <h3 className="text-[1.3rem] font-bold">Información Básica</h3>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:grid md:grid-cols-2 gap-3 text-start p-3">
                                                    
                                    <InputGroup For="deporte" label="Deporte" labelClass="text-gray-700">
                                    <div className="relative" ref={menuOut} onClick={() => (setMDep(!OpenDep))}>
                                        <Input 
                                            type='text' 
                                            id="deporte" 
                                            className="cursor-pointer input w-full pl-6 pr-3 py-3 placeholder:text-black" 
                                            required readOnly 
                                            value={selectedSportName ?? "Seleccione un deporte"}
                                        />
                                        <Button type="button" className=" cursor-pointer absolute right-1 md:right-1 lg:right-4 top-1/2 flex justify-center -translate-y-1/2 -translate-x-1/2">
                                        <Image className={`size-[1rem] transition-transform duration-300 ease-in-out ${OpenDep ? 'rotate-180' : ' rotate-360'}`} src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'} alt="desplegar" width={100} height={100} />
                                        </Button>
                                        

                                        <div className={`absolute z-20 bg-white shadow-lg mt-1.5 rounded-xl overflow-hidden overflow-y-auto ${OpenDep ? 'w-full h-[7.5rem]' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                        {uniqueSports.map((sportName) => (
                                            <div 
                                                key={sportName} 
                                                className="w-full flex gap-2 p-2 hover:bg-unimar/15 place-items-center" 
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
                                            className="cursor-pointer input w-full pl-6 pr-3 py-3 disabled:text-gray-500 text-black" 
                                            placeholder="Seleccione una Categoría" 
                                            readOnly 
                                            value={selectedDiscipline?.categoria ?? "Seleccione una Categoría"} 
                                            required 
                                            disabled={!selectedSportName} 
                                        />
                                        <Button type="button" className=" cursor-pointer absolute top-1/2 right-1 lg:right-4 flex justify-center -translate-y-1/2 -translate-x-1/2">
                                        <Image className={`size-[1rem] transition-transform duration-300 ease-in-out ${OpenCat && selectedSportName ? 'rotate-180' : ' rotate-360'}`} src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1759101273/flecha-hacia-abajo-para-navegar_zixe1b.png'} alt="desplegar" width={100} height={100} />
                                        </Button>

                                        
                                        <div className={`absolute z-20 bg-white shadow-lg mt-1.5 rounded-xl overflow-hidden overflow-y-auto ${OpenCat ? 'w-full h-auto' : 'max-h-0 opacity-0 pointer-events-none'}`} >
                                        {availableCategories.map((discipline) => (
                                            <div 
                                                key={discipline.id} 
                                                className="w-full flex gap-2 p-2 hover:bg-unimar/15 place-items-center" 
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
                                            value={tournament?.nombre || 'Cargando...'} // <-- Muestra el nombre real
                                            disabled
                                            />
                                        </div>
                                        </InputGroup>

                                        <div className=" border-l-4 border-yellow-600 col-span-2 p-4 bg-yellow-100 text-yellow-800 rounded-xl mb-3">
                                            <span>
                                                La fecha límite de inscripción: {tournament?.inicio ?? '...'} {/* <-- Muestra fecha real (o una fecha de 'cierre_inscripcion' si la añades a la API) */}
                                            </span>
                                        </div>
                                    </div>

                                    
                                </section>
                                
                            </>
                        )}
                        
                        {isSept ===2 &&(
                            <>
                                <section className="flex flex-col py-2 px-3 shadow rounded-xl bg-gray-100/75">

                                    <div className="section-title  flex flex-col space-y-3">
                                        <div className="flex flex-col place-items-start mt-3 ml-5">
                                            <div className="text-start">
                                                <h3 className="text-[1.5rem] font-bold ">{tournament?.nombre}</h3>
                                                <p className="text-gray-500">{tournament?.descripcion}</p>
                                            </div>
                                            <p className="text-gray-500">"Uniendo comunidades a través del deporte"</p>
                                        </div>

                                        
                                        <div className="py-1 px-2 place-content-center text-start gap-3 mb-3 flex flex-col">
                                                <div className="bg-white p-4 rounded-2xl shadow-md flex gap-3">
                                                    <div className=" relative size-[48px] bg-unimar/15 rounded-full">
                                                        <Image
                                                            className=" absolute inset-0 object-contain scale-85"
                                                            src={'/fecha.png'}
                                                            alt="lol"
                                                            fill
                                                        />
                                                    </div>
                                                    <div className=" items-center">
                                                        <h3 className="text-[1.1rem] font-bold ">Fechas Clave</h3>
                                                        <div className="font-medium text-gray-400">
                                                            <p>Inscripciones: 15 de Agosto - 25 de Agosto</p>
                                                            <p>Inicio del Torneo: 1 de Septiembre</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-3">
                                                    <div className="bg-white p-4 rounded-2xl shadow-md">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative size-[48px] bg-unimar/15 rounded-full">
                                                                <Image
                                                                    className=" absolute inset-0 object-contain scale-80"
                                                                    src={'/deporte.png'}
                                                                    alt="lol"
                                                                    fill
                                                                />
                                                            </div>
                                                            <div className="text-start">
                                                                <h3 className=" font-semibold text-gray-400">Deporte</h3>
                                                                <p className="text-[1.1rem] font-bold">{selectedDiscipline?.nombre_deporte}</p>
                                                            </div>
                                                        </div>
                                                    </div>   

                                                    <div className="bg-white p-4 rounded-2xl shadow-md">
                                                        <div className="flex items-center  text-gray-700  gap-3">
                                                            <div className="relative size-[48px] bg-unimar/15 rounded-full">
                                                                <Image
                                                                    className=" absolute inset-0 object-contain scale-85"
                                                                    src={'/categoria.png'}
                                                                    alt="lol"
                                                                    fill
                                                                />
                                                            </div>
                                                            <div className="text-start">
                                                                <h3 className="font-semibold text-gray-400">Categoría</h3>
                                                                <p className="text-[1.1rem] font-bold">{selectedDiscipline?.categoria}</p>
                                                            </div>
                                                        </div>
                                                    </div>                                                         
                                                </div>
                                                
                                                <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-center gap-3">

                                                        <div className="flex  gap-1.5">
                                                            <div className="relative size-[48px] bg-unimar/15 rounded-full">
                                                                <Image
                                                                    className=" absolute inset-0 object-contain"
                                                                    src={'/informe.png'}
                                                                    alt="lol"
                                                                    fill
                                                                />
                                                            </div>
                                                            <div >
                                                                <h3 className="text-[1.1rem] font-bold ">Reglamento de la Disciplina</h3>
                                                                <p className="text-gray-400">consulte las reglas antes de inscribirse.</p>
                                                            </div>
                                                        </div>
                                                        <Button className="cursor-pointer bg-blue-100 px-4 py-2 rounded-xl flex gap-1.5 items-center font-bold text-unimar">
                                                            <Image
                                                                className="size-4 scale-245"
                                                                src={'/descarga.png'}
                                                                alt="descargar"
                                                                width={500}
                                                                height={500}
                                                            />
                                                            <p className="text-blue-700">Descargar</p>
                                                        </Button>

                                                </div> 
                                        </div>
                                        
                                    </div>
                                    
                                </section>
                                
                            </>
                        )}

                        {isSept ===3 &&(
                            <>
                                <section className="flex flex-col space-y-5 py-4 px-3">

                                    <div className="section-title  flex flex-col space-y-4 px-3 bg-gray-100  shadow rounded-xl">
                                        <div className="flex place-items-center mt-3 gap-2 ml-2">
                                            <div className="relative size-[52px] bg-unimar/5 rounded-full">
                                                <Image
                                                    className=" absolute inset-0 object-contain grayscale-20"
                                                    src={'/personas.png'}
                                                    alt="lol"
                                                    fill
                                                />
                                            </div>
                                            <div className="text-start">
                                                <h3 className="text-[1.3rem] font-bold">Información del Equipo</h3>
                                            </div>
                                        </div>

                                        
                                        <div className="flex flex-col px-2">
                                                <div className="  mb-6 px-2 gap-3 place-content-center ">
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
                                                        <InputGroup label="Madriana del equipo" labelClass="text-gray-500" For="nombre">
                                                            <Input
                                                                className="input"
                                                                type="text"
                                                                value={teamData.madrina}
                                                                onChange={(e) => handleChange("madrina", e.target.value)}
                                                                placeholder="Ej: María Villarroel"
                                                            /> 
                                                            {errors.madrina && <p className="text-red-500 text-sm mt-1">{errors.madrina}</p>}
                                                        </InputGroup> 
                                                        <InputGroup label="Color del uniforme"labelClass="text-gray-500" For="nombre">
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


                                    <div className="flex flex-col space-y-5 p-4 bg-gray-100 shadow rounded-xl">
                                        <div className="flex place-items-center gap-2">
                                            <div className="relative size-[52px] bg-unimar/5 rounded-full">
                                                <Image
                                                    className=" absolute inset-0 object-contain grayscale-40"
                                                    src={'/persona.png'}
                                                    alt="lol"
                                                    fill
                                                />
                                            </div>
                                            <div className="text-start">
                                                <h3 className="text-[1.3rem] font-bold">Información del Delegado</h3>
                                            </div>
                                        </div>
                                        <div className="text-start  flex flex-col lg:flex-row gap-3 p-2 ">
                                            <InputGroup label="Correo institucional del delegado" labelClass="text-gray-500" For="nombre">
                                                <Input
                                                    className="input"
                                                    type="email"
                                                    value={teamData.delegadoCorreo}
                                                    onChange={(e) => handleChange("delegadoCorreo", e.target.value)}
                                                    placeholder="delegado@unimar.edu.ve"
                                                />
                                                {errors.delegadoCorreo && <p className="text-red-500 text-sm mt-1">{errors.delegadoCorreo}</p>}
                                            </InputGroup> 
                                            <InputGroup label="Numero del Telefono" labelClass="text-gray-500" For="nombre">
                                                <Input
                                                    className="input"
                                                    type="text"
                                                    value={teamData.delegadoTelefono}
                                                    onChange={(e) => handleChange("delegadoTelefono", e.target.value)}
                                                    placeholder="04242575321"
                                                />
                                                {errors.delegadoTelefono && <p className="text-red-500 text-sm mt-1">{errors.delegadoTelefono}</p>}
                                            </InputGroup>                                                            
                                        </div>
                                    </div>

                                    <div className="flex flex-col p-3 bg-gray-100 shadow rounded-xl">
                                        <UploadLogo
                                            file={teamData.logo}
                                            
                                            error={errors.logo}

                                            onFileChange={(file: File | null) => {
                                                setTeamData(prev => ({ ...prev, logo: file }));
                                                
                                                if (file) {
                                                    setErrors(prev => ({ ...prev, logo: "" }));
                                                }
                                            }}
                                        />
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
                                </p>

                                
                                {teamData.integrantes.map((int, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-full">
                                        {int.dorsal}
                                        </div>
                                        <div>
                                        <p className="font-semibold text-gray-900">{int.cedula}</p>
                                        <p className="text-gray-500 text-sm">{int.correo}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                        onClick={() => handleEditIntegrante(i)}
                                        className=" hover:bg-gray-200 p-1 rounded-full cursor-pointer"
                                        >
                                            <Image src="/lapiz (1).png" alt="Eliminar" width={24} height={24} className="scale-90" />
                                        </button>
                                        <button
                                        onClick={() => handleRemoveIntegrante(i)}
                                        className=" hover:bg-rose-200 p-1 rounded-full cursor-pointer"
                                        >
                                            <Image src="/basura (1).png" alt="Eliminar" width={24} height={24} className="scale-90" />
                                        </button>
                                    </div>
                                    </div>
                                ))}

                                <div className="flex flex-wrap items-end gap-3 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <Input
                                    placeholder="Dorsal"
                                    value={nuevo.dorsal}
                                    onChange={(e) => setNuevo({ ...nuevo, dorsal: e.target.value })}
                                    className="input w-20"
                                    />
                                    
                                    <Input
                                    placeholder="Correo institucional"
                                    value={nuevo.correo}
                                    onChange={(e) => setNuevo({ ...nuevo, correo: e.target.value })}
                                    className="input flex-1"
                                    />
                                    <Input
                                    placeholder="Cédula"
                                    value={nuevo.cedula}
                                    onChange={(e) => setNuevo({ ...nuevo, cedula: e.target.value })}
                                    className="input flex-1"
                                    />

                                    <Button
                                    onClick={handleAddIntegrante}
                                    className={`${
                                        editIndex !== null ? "bg-blue-500" : "bg-unimar"
                                    } text-white font-bold rounded-xl px-4 py-2 cursor-pointer`}
                                    >
                                    {editIndex !== null ? "Guardar cambios" : "Añadir integrante"}
                                    </Button>
                                </div>
                                </section>

                                                                    
                                </section>
                                
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>

                

            </div>

            <FooterModal
                className="flex-none"
                BTmain={isSept > 2 ? 'Finalizar Inscripción' : 'Siguiente'}
                BTSecond={isSept > 1 ? 'Atrás' : 'Cerrar'}
                onClose={isSept > 1 ? prev : handleCloseModal}
                onSumit={
                    isSept === 1
                    ? handleNextClick
                    : isSept === 2
                    ? next
                    : () => {
                        if (validateStep3()) {
                            console.log("Datos completos:", teamData);
                            alert("Formulario completo ✅");
                            handleCloseModal();
                        }
                    }
                }
                
            />
                
            
        </ContainModal>
  )
}
