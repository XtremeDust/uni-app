'use client';
import { useState, ChangeEvent } from "react";
import { Button, ContainModal, HeaderModal, FooterModal, Input, InputGroup, Modal, Select } from "@/types/ui_components";
import Image from "next/image";

interface ModalProps {
  state: boolean;
  onClose: () => void;
  onGameCreated?: () => void;
}


const initialState = {
  disciplina:"",
  categoria:"",
  competidorA: "",
  competidorB:"",
  state: "proximo",
  init_date: "",
  hour:"",
};

// de prueva 
const Disciplinas = [
  { id: 1, label: "futbol" },
  { id: 2, label: "basquet" },
  { id: 3, label: "tenis de mesa" },
];
const Competidor_a = [
  { id: 1, label: "walas" },
  { id: 2, label: "jorge" },
  { id: 3, label: "cesar" },
];
const Competidor_b = [
  { id: 1, label: "moises" },
  { id: 2, label: "maria" },
  { id: 3, label: "samuel" },
];

const Categorias=[
  { id: 1, label: "masculina" },
  { id: 2, label: "femenina" },
  { id: 3, label: "mixta" },
]
export default function modal_AddGames({state, onClose, onGameCreated}:ModalProps) {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [isDisOpen, setIsDisOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isAOpen, setIsAOpen] = useState(false);
  const [isBOpen, setIsBOpen] = useState(false);

    const [errors, setErrors] = useState({
        disciplina:"",  
        categoria:"",  
        competidorA: "",
        competidorB:"",
        state: "proximo",
        init_date: "",
        hour:"",
    });

  const handleCloseModal = () => {
    setFormData(initialState);
    setErrors({
      disciplina: "",
      categoria: "",
      competidorA: "",
      competidorB: "proximo",
      state: "",
      init_date: "",
      hour: "",
    });
    setLoading(false);
    onClose(); 
  };


   const validateForm = (): boolean => {
    const newErrors = { ...initialState };
    let isValid = true;
    if (!formData.competidorA) { newErrors.competidorA = "Seleccione un competidor."; isValid = false; }
    if (!formData.competidorB) { newErrors.competidorB = "Seleccione un competidor."; isValid = false; }
    if (!formData.disciplina) { newErrors.disciplina = "Seleccione la disciplina."; isValid = false; }
    if (!formData.categoria) { newErrors.categoria = "Seleccione la categoria."; isValid = false; }
    if (!formData.init_date) { newErrors.init_date = "Seleccione una fecha."; isValid = false; }
    if (!formData.hour) { newErrors.hour = "Asigne una hora."; isValid = false; }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

   const handleSubmit = async () => {
    if (!validateForm()) return; 

    setLoading(true);

    const data = new FormData();
    data.append('competidorA', formData.competidorA);
    data.append('competidorB', formData.competidorB);
    data.append('disciplina', formData.disciplina!);
    data.append('categoria', formData.categoria!);
    data.append('init_date', formData.init_date!);
    data.append('hour', formData.hour!);
   }

  return (
    <Modal state={state}>
      <ContainModal className="grid grid-rows-[auto_minmax(0,1fr)_auto] text-black w-[95%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] space-y-3 bg-gray-200 rounded-2xl overflow-hidden max-h-[80vh]">
          <HeaderModal onClose={handleCloseModal}>
            <div className="text-start">
              <h2 className="ml-5 title">Añadir Nuevo Juego</h2>
              <p className="ml-5 text-[1.2rem]">Rellene la para realizar el versus.</p>
            </div>
          </HeaderModal>

        <div className="flex flex-col space-y-3.5 p-4">
            <div className="grid grid-cols-2 gap-2">
                 <InputGroup label="Disciplina" For="Disciplina" labelClass="text-gray-700 text-start">
                    <Select
                      className="cursor-pointer input w-full pl-3 py-2 placeholder:text-black" 
                      options={Disciplinas}
                      currentValue={formData.disciplina || ""}
                      isOpen={isDisOpen}
                      setOpen={setIsDisOpen}                  
                      onSelect={(id, label) => {
                            setFormData(prev => ({ ...prev, disciplina: label }));
                            if (errors.disciplina) setErrors(prev => ({ ...prev, disciplina: "" }));
                        }}
                      placeholder="Seleccionar"
                    />
                    {errors.disciplina && <p className="text-red-500 text-sm mt-1">{errors.disciplina}</p>}
                  </InputGroup>

                 <InputGroup label="Categoria" For="Categoria" labelClass="text-gray-700 text-start">
                    <Select
                      className="cursor-pointer input w-full pl-3 py-2 placeholder:text-black" 
                      options={Categorias}
                      currentValue={formData.categoria || ""}
                      isOpen={isCatOpen}
                      setOpen={setIsCatOpen}                  
                      onSelect={(id, label) => {
                            setFormData(prev => ({ ...prev, categoria: label }));
                            if (errors.categoria) setErrors(prev => ({ ...prev, categoria: "" }));
                        }}
                      placeholder="Seleccionar"
                    />
                    {errors.categoria && <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>}
                  </InputGroup>
                  
            </div>
            <div className="grid grid-cols-2 gap-2">
              <InputGroup label="Competidor A" For="a" labelClass="text-gray-700 text-start">
                <Select
                  className="cursor-pointer input w-full pl-3 py-2 placeholder:text-black" 
                  options={Competidor_a}
                  currentValue={formData.competidorA || ""}
                  isOpen={isAOpen}
                  setOpen={setIsAOpen}
                  onSelect={(id, label) => {
                        setFormData(prev => ({ ...prev, competidorA: label }));
                        if (errors.competidorA) setErrors(prev => ({ ...prev, competidorA: "" }));
                    }}
                  placeholder="Seleccionar"
                />
                {errors.competidorA && <p className="text-red-500 text-sm mt-1">{errors.competidorA}</p>}
              </InputGroup>
              <InputGroup label="Competidor B" For="b" labelClass="text-gray-700 text-start">
                <Select
                  className="cursor-pointer input w-full pl-3 py-2 placeholder:text-black" 
                  options={Competidor_b}
                  currentValue={formData.competidorB || ""}
                  isOpen={isBOpen}
                  setOpen={setIsBOpen}
                  onSelect={(id, label) => {
                        setFormData(prev => ({ ...prev, competidorB: label }));
                        if (errors.competidorB) setErrors(prev => ({ ...prev, competidorB: "" }));
                    }}
                  placeholder="Seleccionar"
                />
                {errors.competidorB && <p className="text-red-500 text-sm mt-1">{errors.competidorB}</p>}
              </InputGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputGroup label="Fecha del partido" For="init_date"labelClass="text-gray-500 text-start">
                <Input
                  id="init_date"
                  name="init_date"
                  type="date"
                  className="input w-full"
                  value={formData.init_date}
                  onChange={handleChange}
                />
                {errors.init_date && <p className="text-red-500 text-sm mt-1">{errors.init_date}</p>}
              </InputGroup>
              <InputGroup label="Hora del partido" For="init_date"labelClass="text-gray-500 text-start">
                <Input
                  id="hour"
                  name="hour"
                  type="hour"
                  className="input w-full"
                  value={formData.hour}
                  onChange={handleChange}
                />
                {errors.hour && <p className="text-red-500 text-sm mt-1">{errors.hour}</p>}
              </InputGroup>
            </div>
        </div>

          <FooterModal
            className="flex-none"
            BTmain="Crear Torneo"
            BTSecond="Cerrar"
            onClose={handleCloseModal}
            onSumit={handleSubmit}
            disabled={loading}
          />
      </ContainModal>
    </Modal>
  )
}
