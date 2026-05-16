"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { createClient } from "@/utils/supabase/client"

function LoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const mode = searchParams.get('mode');
    
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // Estados del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');

    const supabase = createClient();

    // Sincronizar el estado con el parámetro de la URL
    useEffect(() => {
        if (mode === 'register') {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }, [mode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (isLogin) {
                // Lógica de Login
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;
                
                setMessage({ type: 'success', text: '¡Sesión iniciada con éxito! Redirigiendo...' });
                setTimeout(() => {
                    router.refresh();
                    router.push('/');
                }, 1500);
            } else {
                // Lógica de Registro
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: nombre,
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (error) throw error;
                
                setMessage({ type: 'success', text: '¡Registro exitoso! Revisa tu email para confirmar tu cuenta.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Ocurrió un error inesperado.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] text-[#111] flex flex-col">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-8 py-20">
                <div className="w-full max-w-md">
                    <Card className="border border-black/5 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden rounded-2xl">
                        <div className="flex border-b border-black/5">
                            <button
                                onClick={() => { setIsLogin(true); setMessage({ type: '', text: '' }); }}
                                className={`flex-1 py-4 text-sm font-medium transition-colors ${isLogin ? 'bg-white text-black' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                            >
                                Acceder
                            </button>
                            <button
                                onClick={() => { setIsLogin(false); setMessage({ type: '', text: '' }); }}
                                className={`flex-1 py-4 text-sm font-medium transition-colors ${!isLogin ? 'bg-white text-black' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                            >
                                Crear cuenta
                            </button>
                        </div>

                        <CardHeader className="pt-10 pb-6 text-center">
                            <CardTitle className="text-3xl font-bold tracking-tighter">
                                {isLogin ? 'Bienvenido de nuevo' : 'Únete a Licenzia'}
                            </CardTitle>
                            <p className="text-sm text-gray-500 mt-2">
                                {isLogin ? 'Introduce tus credenciales para acceder.' : 'Completa el formulario para crear tu cuenta.'}
                            </p>
                        </CardHeader>

                        <CardContent className="px-8 pb-10">
                            {message.text && (
                                <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                                    message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">Nombre Completo</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                placeholder="Juan Pérez"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="tu@email.com"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Contraseña</label>
                                        {isLogin && (
                                            <Link href="#" className="text-[10px] font-bold text-gray-400 hover:text-black uppercase tracking-widest transition-colors">
                                                ¿Olvidaste tu contraseña?
                                            </Link>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                        />
                                    </div>
                                </div>

                                <Button 
                                    disabled={loading}
                                    className="w-full py-6 rounded-xl font-semibold text-base group mt-4 relative"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {isLogin ? 'Entrar' : 'Registrarme'}
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-black/5"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-4 text-gray-400 font-medium">O continuar con</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Al continuar, aceptas nuestros{' '}
                        <Link href="#" className="text-black font-semibold hover:underline">Términos de Servicio</Link> y{' '}
                        <Link href="#" className="text-black font-semibold hover:underline">Política de Privacidad</Link>.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#fafafa] flex items-center justify-center">Cargando...</div>}>
            <LoginContent />
        </Suspense>
    )
}


