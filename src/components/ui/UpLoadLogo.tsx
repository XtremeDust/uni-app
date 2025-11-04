'use client';
import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button, Input } from '@/types/ui_components';

// 1. Define la interfaz de PROPS que este componente recibe
interface UploadLogoProps {
  file: File | null; // El archivo actual (viene del padre)
  onFileChange: (file: File | null) => void; // Función para notificar al padre
  error?: string | null; // Mensaje de error (viene del padre)
}

// 2. Acepta los props 'file', 'onFileChange', y 'error'
export default function UploadLogo({ file, onFileChange, error }: UploadLogoProps) {
  
  // El estado local para 'file' y 'error' ya no es necesario
  
  const [isDragging, setIsDragging] = useState(false);
  // 3. Referencia al input para poder resetearlo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Genera la URL de previsualización desde el prop 'file'
  const previewUrl = file ? URL.createObjectURL(file) : null;

  // Se llama cuando el usuario selecciona un archivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    validateAndSetFile(selected || null);

    // --- ¡FIX 1: BUG DE RE-SELECCIÓN! ---
    // Resetea el input para que 'onChange' se dispare
    // si el usuario vuelve a seleccionar el mismo archivo.
    if (e.target) {
      e.target.value = ''; 
    }
  };

  // Se llama cuando el usuario suelta un archivo
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    validateAndSetFile(dropped || null);
  };

  // Valida el archivo y notifica al componente padre
  const validateAndSetFile = (selected: File | null) => {
    if (!selected) {
      onFileChange(null); // Notifica al padre que no hay archivo
      return;
    }

    // --- Validación (puedes moverla al padre si prefieres) ---
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeMB = 10;

    if (!validTypes.includes(selected.type)) {
      alert("Formato no permitido. Solo JPG, PNG o WEBP.");
      onFileChange(null); // Notifica al padre
      return;
    }
    if (selected.size > maxSizeMB * 1024 * 1024) {
      alert("El archivo supera el tamaño máximo de 10MB.");
      onFileChange(null); // Notifica al padre
      return;
    }
    // --- Fin Validación ---

    // --- ¡FIX 3: BUG DE GUARDADO! ---
    // Notifica al padre del NUEVO archivo.
    onFileChange(selected);
  };

  // Se llama al hacer clic en la 'X' de la vista previa
  const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Evita que se abra el selector de archivos

    // --- ¡FIX 2: BUG DE QUITAR! ---
    // Notifica al padre que el archivo ha sido eliminado (es 'null').
    onFileChange(null); 
  };

  return (
    <div className="flex flex-col p-3">
      <div className="text-start">
        <h3 className="text-[1.3rem] font-bold ml-3 pb-2">Logo del equipo</h3>
      </div>

      <Input
        ref={fileInputRef} // Asigna el ref
        id="logoFile"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 4. Lee desde el prop 'file' (no desde un estado local) */}
      {!file ? (
        // --- ZONA DE CARGA ---
        <label
          htmlFor="logoFile"
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed text-center cursor-pointer transition-all
            ${error ? "border-red-500 bg-red-50" : " border-gray-400"}
            ${isDragging ? "grayscale-0 border-blue-700 bg-blue-50" : "grayscale hover:grayscale-0 hover:border-blue-700"}
          `}
        >
          <div className="relative size-[58px] mb-4">
            <Image
              className="absolute inset-0 object-contain bg-unimar/15 rounded-full scale-120"
              src="/subir.png"
              alt="subir"
              fill
            />
          </div>
          <p>
            <span className="text-unimar font-bold">Seleccionar</span> o arrastra la imagen aquí
          </p>
          <p className="text-[12px] text-gray-500">
            JPG, PNG o WEBP -- Máx. 10MB
          </p>
          {/* Muestra el error del padre */}
          {error && (
            <p className="text-[13px] text-red-600 mt-2">{error}</p>
          )}
        </label>
      ) : (
        // --- VISTA PREVIA ---
        <div className="relative flex flex-col items-center">
          <div className="relative w-48 h-48 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={previewUrl!} // Usa la URL de previsualización
              alt="Logo del equipo"
              fill
              className="object-cover"
            />
            <button
              type="button" // Importante
              onClick={removeFile} // Llama a removeFile
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full size-6 flex items-center justify-center"
            >
              ✕
            </button>
            <div className="absolute bottom-0 bg-black/70 text-white text-center w-full py-1 font-semibold text-sm rounded-b-xl">
              LOGO DEL EQUIPO
            </div>
          </div>
        </div>
      )}
    </div>
  );
}