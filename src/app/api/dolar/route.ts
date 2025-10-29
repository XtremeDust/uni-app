// src/app/api/dolar/route.ts
import { NextResponse } from "next/server";

interface DolarRate {
  fuente: string;
  nombre: string;
  compra: number | null; 
  venta: number | null;   
  promedio: number;
  fechaActualizacion: string;
}

// Esta es tu API route interna
export async function GET() {
  const url = 'https://ve.dolarapi.com/v1/dolares';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const data: DolarRate[] = await response.json();

    // Puedes filtrar o devolver todo el arreglo
    const oficial = data.find(d => d.nombre === "Oficial");
    const paralelo = data.find(d => d.nombre === "Paralelo");

    return NextResponse.json({
      oficial,
      paralelo,
      fecha: oficial?.fechaActualizacion,
    });

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Error desconocido" }, { status: 500 });
  }
}
