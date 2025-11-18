'use client';
import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button, Input } from '@/types/ui_components';

interface UploadImgProps {
  file: File | null; 
  onFileChange: (file: File | null) => void;
  error?: string | null;
  previewUrl?: string | null;
  label:string
}

export default function UploadIMG({ file, onFileChange, error, previewUrl: existingPreviewUrl,label }: UploadImgProps) {
    
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const newFilePreview = file ? URL.createObjectURL(file) : null;

  const displayUrl = newFilePreview || existingPreviewUrl;
  const showPreview = !!displayUrl;
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    validateAndSetFile(selected || null);

    if (e.target) {
      e.target.value = ''; 
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    validateAndSetFile(dropped || null);
  };

  const validateAndSetFile = (selected: File | null) => {
    if (!selected) {
      onFileChange(null);
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeMB = 10;

    if (!validTypes.includes(selected.type)) {
      alert("Formato no permitido. Solo JPG, PNG o WEBP.");
      onFileChange(null);
      return;
    }
    if (selected.size > maxSizeMB * 1024 * 1024) {
      alert("El archivo supera el tamaño máximo de 10MB.");
      onFileChange(null);
      return;
    }

    onFileChange(selected);
  };

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    onFileChange(null); 
  };

  return (
    <div className="flex flex-col p-3">
      <div className="text-start">
        <h3 className="text-[1.3rem] font-bold ml-3 pb-2">{label}</h3>
      </div>

      <Input
        ref={fileInputRef}
        id="logoFile"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
     
      {!showPreview ? (
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
          {error && (
            <p className="text-[13px] text-red-600 mt-2">{error}</p>
          )}
        </label>
      ) : (
        <div className="relative flex flex-col items-center">
          <div className="relative w-48 h-48 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={displayUrl!} 
              alt={label}
              fill
              className="object-cover"
            />
            <button
              type="button" 
              onClick={removeFile}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full size-6 flex items-center justify-center"
            >
              ✕
            </button>
            <div className="absolute bottom-0 bg-black/70 text-white text-center w-full py-1 font-semibold text-sm rounded-b-xl">
              {label}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}