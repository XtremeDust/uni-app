'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { 
  Select, 
  Table, 
  TableBody, TableCell, TableRow,
  TableHead, TableHeaderCell,
  InputGroup,
  TextArea,
  Modal,
  ContainModal,
  HeaderModal,
  FooterModal
 } from '@/types/ui_components'

export interface ModalCambioEstadoProps {
  teamName: string;
  currentState: 'Aceptado' | 'Rechazado' | 'Pendiente';
  state: boolean;
  onClose: () => void;
  onSave: (newState: string) => void;
  isLoading: boolean;
}

export default function ModalCambioEstado({
  teamName,
  currentState,
  state,
  onClose,
  onSave,
  isLoading,
}: ModalCambioEstadoProps) {

  const [newState, setNewState] = useState(currentState);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  
  const options = [
    { id: 1, label: "Aceptado" },
    { id: 2, label: "Rechazado" },
  ];

  const filteredOptions = options.filter(opt => opt.label !== newState);

    const handleLocalSelect = (id: number, label: string) => {
        setNewState(label as 'Aceptado' | 'Rechazado');
        setIsSelectOpen(false);
    };

  return (
    <Modal state={state}>
      <ContainModal className="w-full max-w-md bg-white rounded-2xl shadow-lg">
        <HeaderModal onClose={onClose}>
            <h2 className="text-xl font-bold text-gray-800">Cambiar Estado</h2>
        </HeaderModal>
        
        <div className="p-6">
          <p className="mb-4 text-gray-700">
            <strong>Equipo:</strong> {teamName}
          </p>

          <InputGroup label="Nuevo Estado" For="estado" className='mb-3'>
            <Select
                className="bg-gray-50 focus:ring-[1px] focus:ring-unimar focus:outline-none ring ring-gray-300 shadow-sm rounded-lg w-full pl-3 pr-3 py-3"
                options={filteredOptions}
                currentValue={newState}
                isOpen={isSelectOpen}       
                setOpen={setIsSelectOpen}   
                onSelect={handleLocalSelect}
                placeholder="Seleccionar estado"
            />
          </InputGroup> 

          {newState==='Rechazado' &&(
            <div>
                <InputGroup label="Deje un Comentario" For="Comentario">
                     <TextArea id="Comentario" className="h-[8rem] input " placeholder="Escribe tu comentario aquí..."/>       
                </InputGroup> 
            </div>
          )}
        </div>

        <FooterModal 
            BTmain="Guardar Cambios"
            BTSecond="Cancelar"
            onClose={onClose}
            onSumit={() => onSave(newState)}
            disabled={isLoading} 
        />
      </ContainModal>
    </Modal>
  );
}

