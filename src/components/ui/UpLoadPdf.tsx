'use client';
import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { Input, InputGroup } from '@/types/ui_components';

interface PdfUploaderProps {
  file: File | null;
  onFileChange: (file: File | null) => void; 
  error?: string | null; 
  label?: string;
  existingFileUrl?: string | null; 
}

export default function PdfUploader({ 
  file, 
  onFileChange, 
  error, 
  label = "Archivo PDF (requerido)",
  existingFileUrl 
}: PdfUploaderProps) {
  
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const newFilePreviewUrl = file ? URL.createObjectURL(file) : null;
  
  const fullExistingUrl = existingFileUrl 
    ? `${process.env.NEXT_PUBLIC_API_PDF || 'http://localhost:8000'}${existingFileUrl}` 
    : null;

  const displayUrl = newFilePreviewUrl || fullExistingUrl;
  
  const fileName = file ? file.name : (existingFileUrl ? existingFileUrl.split('/').pop() : 'Archivo existente');
  const fileSize = file ? file.size : null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    validateAndSetFile(selectedFile || null);
    
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    validateAndSetFile(droppedFile || null);
  };
  
  const validateAndSetFile = (selected: File | null) => {
    if (!selected) {
      onFileChange(null);
      return;
    }
    
    if (selected.type !== "application/pdf") {
        alert("Formato no permitido. Solo se aceptan archivos PDF.");
        onFileChange(null);
        return;
    }
    
    const maxSizeMB = 10;
    if (selected.size > maxSizeMB * 1024 * 1024) {
      alert(`El archivo supera el tamaño máximo de ${maxSizeMB}MB.`);
      onFileChange(null);
      return;
    }
    onFileChange(selected);
  };

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onFileChange(null);
  };
  
  return (
    <div className="flex flex-col">
      <InputGroup label={label} For="pdfFile" labelClass=" text-gray-700 text-lg  text-start">
        <Input
          ref={fileInputRef}
          className="hidden"
          id="pdfFile"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        
        {displayUrl ? (
          <div className={`
            relative space-y-1 flex flex-col items-center justify-between w-full h-auto p-4 rounded-lg border-2 
            ${file ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}
          `}>
            <div className="flex w-full justify-between items-center px-2">
              <div className='text-left overflow-hidden flex flex-wrap items-center gap-x-5 gap-y-1'>
                <p className='font-bold text-gray-800 truncate '>{fileName}</p>
                
                {fileSize && (
                  <p className='text-sm text-gray-600'>
                    {(fileSize / (1024 * 1024)) > 1 ? 
                      (fileSize / (1024 * 1024)).toFixed(2) + ' MB' :
                      (fileSize / 1024).toFixed(2) + ' KB'
                    }
                  </p>
                )}
                {!file && fullExistingUrl && (
                  <a href={fullExistingUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-700 hover:underline">
                    (Ver archivo actual)
                  </a>
                )}
              </div>
              
              {file ? (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="bg-red-100 text-red-700 rounded-full px-2.5 py-1 hover:bg-red-200 transition-colors flex-shrink-0"
                  aria-label="Eliminar archivo"
                >
                  &#10005; 
                </button>
              ) : (
                <label htmlFor="pdfFile" className="text-sm text-unimar font-bold cursor-pointer hover:underline flex-shrink-0">
                  Reemplazar
                </label>
              )}
            </div>

            <div className="w-full h-80 border border-gray-300 rounded-md overflow-hidden">
              <iframe
                src={displayUrl} 
                className="w-full h-full border-0"
                title="Vista previa del PDF"
              >
                <p>Tu navegador no soporta la previsualización de PDF.</p>
              </iframe>
            </div>
          </div>

        ) : (
          
          <label
            htmlFor="pdfFile"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              flex flex-col h-full rounded-lg border-2 border-dashed 
              border-gray-400 text-center cursor-pointer
              p-6 place-items-center justify-center 
              transition-colors
              ${isDragging ? 'border-blue-800 bg-blue-50' : 'hover:border-blue-800 grayscale hover:grayscale-0'}
              ${error ? 'border-red-600 bg-red-50' : ''}
            `}
          >
            <div className="relative size-[58px] rounded-2xl mb-4">
              <Image
                className="absolute inset-0 object-contain scale-135 bg-unimar/15 rounded-full"
                src={'/subir.png'}
                alt="Subir archivo"
                fill
              />
            </div>
            <p> 
              <span className="text-unimar font-bold">Seleccionar PDF</span> o arrastrar el archivo aquí
            </p>
            <p className="text-[12px] text-gray-500">
              Solo archivos PDF. Máx 10MB.
            </p>
          </label>
        )}

        {error && !file && ( 
          <p className="text-red-600 text-sm mt-1">{error}</p>
        )}
      </InputGroup>
    </div>
  );
}