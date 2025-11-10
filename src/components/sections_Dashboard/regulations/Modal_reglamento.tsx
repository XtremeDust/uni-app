'use client';
import React from 'react';
import { Modal, ContainModal, HeaderModal } from '@/types/ui_components';

interface ModalVerReglamentoProps {
  url: string | null;
  state:boolean;
  onClose: () => void;
}

export default function Modal_VerReglamento({ url, state, onClose }: ModalVerReglamentoProps) {
  if (!url) return null;

  // Construye la URL completa al archivo en tu backend
  const fullUrl = `${process.env.NEXT_PUBLIC_API_PDF || 'http://localhost:8000'}${url}`;

  return (
    <Modal state={state}>
      {/* Haz el modal grande para que quepa el PDF */}
      <ContainModal className="w-11/12 h-5/6 max-w-4xl bg-gray-800 text-white flex flex-col">
        <HeaderModal onClose={onClose}>
          <h3 className="text-xl font-bold">Vista Previa del Reglamento</h3>
        </HeaderModal>
        
        {/* El iframe ocupará todo el espacio restante */}
        <div className="flex-1 p-4">
          <iframe
            src={fullUrl}
            className="w-full h-full border-0 rounded-md"
            title="Vista previa del PDF"
          />
        </div>
      </ContainModal>
    </Modal>
  );
}