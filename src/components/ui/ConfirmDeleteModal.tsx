import React from 'react';
// Asumo que tienes componentes de Modal, Button, etc.
import { Modal, ContainModal, HeaderModal, FooterModal, Button } from '@/types/ui_components';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean; // Para deshabilitar el botón mientras se elimina
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}: ConfirmDeleteModalProps) {

  if (!isOpen) {
    return null;
  }

  return (
    <Modal state={isOpen}>
      <ContainModal className="text-black w-[95%] md:w-[60%] lg:w-[40%] xl:w-[30%] bg-gray-200 rounded-2xl">
        <HeaderModal onClose={onClose}>
          <div className="text-start">
            <h2 className="ml-5 title text-xl font-bold text-gray-800">{title}</h2>
          </div>
        </HeaderModal>

        <div className="main-modal p-6 text-gray-700">
          <p>{message}</p>
        </div>

        <FooterModal
          className="flex-none"
          BTmain="Confirmar y Eliminar"
          BTSecond="Cancelar" 
          onClose={onClose}
          onSumit={onConfirm}
          disabled={isLoading}           
          //mainButtonClass="bg-red-600 hover:bg-red-700 text-white" 
        />
      </ContainModal>
    </Modal>
  );
}