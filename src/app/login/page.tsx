'use client'
import { Button, Input, InputGroup } from "@/types/ui_components";
import { ActiveLink } from "@/components/ui/Router";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function Login() {
    const router = useRouter();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [isType, setType] = useState('password');
    const handleChance = () => setType(isType === 'password' ? 'text' : 'password');

    // 🟢 FUNCIÓN DE LOGIN
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setError('');
        setLoading(true);

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.rol === 'admin') {
                router.push('/dashboard'); 
            } else {
                router.push('/'); 
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative bg-gradient-to-tl from-unimar via-sky-900 to-cyan-600 color-gradient-animation  p-1 gap-1 sm:p-5 min-h-screen flex flex-col">
            <Image 
                className="absolute inset-0 z-5 size-full"
                src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758905980/flecha-correcta_2_l0zpid.png'}
                alt={'logo'}
                width={100}
                height={100}
            />
            <div className="absolute inset-0 z-10 backdrop-blur-sm bg-black/50"></div>

            <nav className="relative z-20 max-w-7xl sm:px-2.5 ">
                 <ActiveLink href="/">
                    <Button className="flex gap-1 p-2 px-3 rounded-md shadow drop-shadow-2xl place-content-center place-items-center hover:scale-105 hover:opacity-85 transition-all bg-unimar/60 text-white">
                         <Image 
                        className="w-6 rotate-180"
                        src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758905980/flecha-correcta_2_l0zpid.png'}
                        alt={'logo'}
                        width={100}
                        height={100}
                    />
                        Volver 
                    </Button>
                </ActiveLink>
            </nav>

            <main className="relative z-20 flex-grow flex items-center justify-center p-4">
                <div className="w-full space-y-2 max-w-md mx-auto shadow-2xl drop-shadow-lg border-0 bg-white rounded-lg text-black">
                    
                    <div className="text-center pt-8 px-6 m-0 place-items-center">
                         <Image
                            className='size-28 rounded-full ring-8 border-4  mb-3 '
                            src={"https://res.cloudinary.com/dnfvfft3w/image/upload/v1758470505/Copilot_20250921_112653_uvcshl.png"}
                            alt='logo'
                            width={700}
                            height={700}
                        />
                        <h2 className="text-2xl font-bold ">Iniciar Sesión</h2>
                        <p className="text-gray-700">Para impulsar la experiencia institucional.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 p-4 md:p-6">
                        
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <InputGroup For="Email" label="Correo Electrónico" >
                            <div className="relative">
                                 <Image
                                    className="absolute left-3 top-3 h-4 w-4 text-slate-400"
                                    src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758905312/correo-electronico_kqhai5.png'}
                                    alt="correo"
                                    width={50}
                                    height={50}
                                />
                                <Input 
                                    type="email" id="Email" 
                                    className="input w-full pl-10 pr-3 py-2" 
                                    placeholder="correo@unimar.edu.ve" 
                                    required
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </InputGroup>

                        <InputGroup For="Contra" label="Contraseña">
                            <div className="relative">
                                 <Image
                                    className="absolute left-3 top-3 h-4 w-4 text-slate-400"
                                    src={'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758905312/bloquear_msxkkj.png'}
                                    alt="correo"
                                    width={20}
                                    height={20}
                                />
                                <Input 
                                    type={isType} id="Contra" 
                                    className="input w-full pl-10 pr-3 py-2" 
                                    placeholder="••••••••" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                                <Button type="button" className="cursor-pointer absolute right-3 top-0" onClick={handleChance}>
                                    <Image className="h-10 w-10" src={isType==='password'?'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758905672/ocultar_1_mdw2qo.png':'https://res.cloudinary.com/dnfvfft3w/image/upload/v1758905672/ver_1_errsdi.png'} alt="ver" width={100} height={100} />
                                </Button>
                            </div>
                        </InputGroup>

                        <Button 
                            className="btn bg-unimar text-white w-full mt-4 hover:scale-102 hover:opacity-95 cursor-pointer disabled:opacity-50" 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : 'Iniciar Sesión'}
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}