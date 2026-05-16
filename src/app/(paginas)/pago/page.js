"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ArrowLeft, 
  ShoppingBag,
  Loader2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react'
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useCart } from "@/context/CartContext"

export default function PagoPage() {
    const router = useRouter();
    const { items, subtotal, clearCart, itemCount } = useCart();
    
    const [step, setStep] = useState(1); // 1: Envío, 2: Pago, 3: Confirmación
    const [loading, setLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Estados del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        telefono: '',
        tarjetaNombre: '',
        tarjetaNumero: '',
        tarjetaExp: '',
        tarjetaCvc: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleProcessPayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulación de procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setLoading(false);
        setIsCompleted(true);
        clearCart(); // Vaciamos el carrito tras una compra exitosa
    };

    const shipping = subtotal > 0 ? 10.00 : 0;
    const iva = subtotal * 0.21;
    const total = subtotal + shipping + iva;

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-8">
                    <Card className="max-w-md w-full border-0 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-500">
                        <CardContent className="p-12 text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tighter mb-4">¡Pedido Confirmado!</h1>
                            <p className="text-gray-500 mb-8">
                                Gracias por tu compra. Te hemos enviado un correo con los detalles de tu pedido y el número de seguimiento.
                            </p>
                            <div className="space-y-3">
                                <Button className="w-full h-12 rounded-xl text-base font-medium" onClick={() => router.push('/')}>
                                    Volver al Inicio
                                </Button>
                                <Button variant="ghost" className="w-full text-gray-500" onClick={() => router.push('/productos')}>
                                    Seguir Comprando
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] text-[#111] flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 md:px-8 py-12 md:py-16">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <Link href="/carrito" className="flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors mb-4 group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Volver al carrito
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Finalizar Compra</h1>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-black' : 'text-gray-300'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step >= 1 ? 'border-black bg-black text-white' : 'border-gray-200'}`}>1</div>
                            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:block">Envío</span>
                        </div>
                        <div className="w-8 h-px bg-gray-200"></div>
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-black' : 'text-gray-300'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step >= 2 ? 'border-black bg-black text-white' : 'border-gray-200'}`}>2</div>
                            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:block">Pago</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Forms Section */}
                    <div className="lg:col-span-2">
                        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); nextStep(); } : handleProcessPayment}>
                            
                            {step === 1 ? (
                                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white animate-in slide-in-from-left duration-300">
                                    <CardHeader className="p-8 pb-0">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <Truck className="w-5 h-5 text-gray-400" />
                                            Información de Envío
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 ml-1">Nombre</label>
                                                <input 
                                                    required
                                                    name="nombre"
                                                    value={formData.nombre}
                                                    onChange={handleInputChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                                    placeholder="Ej. Juan"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 ml-1">Apellido</label>
                                                <input 
                                                    required
                                                    name="apellido"
                                                    value={formData.apellido}
                                                    onChange={handleInputChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                                    placeholder="Ej. Pérez"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 ml-1">Dirección Completa</label>
                                            <input 
                                                required
                                                name="direccion"
                                                value={formData.direccion}
                                                onChange={handleInputChange}
                                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                                placeholder="Nombre de calle, número, apto..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 ml-1">Ciudad</label>
                                                <input 
                                                    required
                                                    name="ciudad"
                                                    value={formData.ciudad}
                                                    onChange={handleInputChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                                    placeholder="Ej. Madrid"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 ml-1">Código Postal</label>
                                                <input 
                                                    required
                                                    name="codigoPostal"
                                                    value={formData.codigoPostal}
                                                    onChange={handleInputChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                                    placeholder="28001"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 ml-1">Teléfono de contacto</label>
                                            <input 
                                                required
                                                type="tel"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleInputChange}
                                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                                placeholder="+34 000 000 000"
                                            />
                                        </div>
                                        
                                        <Button type="submit" className="w-full h-14 rounded-2xl text-base font-semibold mt-4 shadow-lg shadow-black/5">
                                            Continuar al Pago
                                            <ChevronRight className="w-5 h-5 ml-1" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-0 shadow-sm rounded-3xl overflow-hidden bg-white animate-in slide-in-from-right duration-300">
                                    <CardHeader className="p-8 pb-0">
                                        <CardTitle className="flex items-center gap-3 text-xl">
                                            <CreditCard className="w-5 h-5 text-gray-400" />
                                            Método de Pago
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="bg-black p-6 rounded-2xl text-white mb-8 relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                                <CreditCard className="w-32 h-32 rotate-12" />
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex justify-between items-start mb-12">
                                                    <div className="w-12 h-8 bg-gray-700/50 rounded-md"></div>
                                                    <span className="text-xs font-bold tracking-widest italic uppercase">PREMIUM</span>
                                                </div>
                                                <p className="text-xl tracking-[0.2em] font-mono mb-6">
                                                    {formData.tarjetaNumero || '•••• •••• •••• ••••'}
                                                </p>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Titular</p>
                                                        <p className="text-sm font-medium uppercase tracking-widest">{formData.tarjetaNombre || 'NOMBRE DEL TITULAR'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Expira</p>
                                                        <p className="text-sm font-medium tracking-widest">{formData.tarjetaExp || 'MM/YY'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 ml-1">Nombre en la tarjeta</label>
                                                <input 
                                                    required
                                                    name="tarjetaNombre"
                                                    value={formData.tarjetaNombre}
                                                    onChange={handleInputChange}
                                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                                    placeholder="Como aparece en el plástico"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 ml-1">Número de tarjeta</label>
                                                <input 
                                                    required
                                                    name="tarjetaNumero"
                                                    value={formData.tarjetaNumero}
                                                    onChange={handleInputChange}
                                                    maxLength="19"
                                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all font-mono"
                                                    placeholder="0000 0000 0000 0000"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 ml-1">Expira (MM/YY)</label>
                                                    <input 
                                                        required
                                                        name="tarjetaExp"
                                                        value={formData.tarjetaExp}
                                                        onChange={handleInputChange}
                                                        maxLength="5"
                                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                                        placeholder="01/28"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 ml-1">CVC</label>
                                                    <input 
                                                        required
                                                        name="tarjetaCvc"
                                                        value={formData.tarjetaCvc}
                                                        onChange={handleInputChange}
                                                        maxLength="4"
                                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                                                        placeholder="•••"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mt-8">
                                            <Button variant="ghost" className="h-14 rounded-2xl flex-1 text-gray-500" onClick={prevStep} disabled={loading}>
                                                Atrás
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                className="h-14 rounded-2xl flex-[2] text-base font-semibold shadow-lg shadow-black/5"
                                                disabled={loading || items.length === 0}
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Procesando...
                                                    </>
                                                ) : (
                                                    'Pagar Ahora'
                                                )}
                                            </Button>
                                        </div>
                                        
                                        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest pt-4">
                                            <ShieldCheck className="w-4 h-4" />
                                            Pago Encriptado y Seguro
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </form>
                    </div>

                    {/* Order Summary Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm sticky top-28">
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Tu Pedido
                            </h3>
                            
                            {/* Summary Items */}
                            <div className="space-y-4 mb-8">
                                {items.length === 0 ? (
                                    <p className="text-sm text-gray-500">Tu carrito está vacío.</p>
                                ) : (
                                    items.map(item => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                                <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 text-sm">
                                                <p className="font-medium line-clamp-1">{item.nombre}</p>
                                                <p className="text-gray-400">Cant: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-semibold">${Number(item.precio * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            
                            <div className="space-y-4 text-sm pt-6 border-t border-gray-100">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})</span>
                                    <span className="font-medium text-black">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Envío</span>
                                    <span className="font-medium text-black">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>IVA (21%)</span>
                                    <span className="font-medium text-black">${iva.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-black/5">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-gray-600">Total a pagar</span>
                                    <span className="font-bold text-2xl tracking-tighter">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </main>

            <Footer />
        </div>
    );
}
