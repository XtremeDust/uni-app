'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Auth({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // 1. Buscamos el token y el usuario guardados
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            // Si no hay token, ¡fuera!
            router.push('/login');
            return;
        }

        const user = JSON.parse(userStr);

        // 2. Verificamos si es ADMIN (ajusta 'admin' según tu DB)
        if (user.rol !== 'admin') {
            alert("Acceso no autorizado");
            router.push('/'); // Lo mandamos al home normal
            return;
        }

        // Si todo bien, mostramos la página
        setAuthorized(true);
    }, [router]);

    if (!authorized) {
        // Muestras un spinner o pantalla blanca mientras verifica
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    return <>{children}</>;
}