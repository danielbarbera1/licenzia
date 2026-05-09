"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Minus, Plus, X, ArrowRight } from 'lucide-react'

// Mock Data for the cart
const initialCartItems = [
  {
    id: '1',
    nombre: 'Minimalist T-Shirt',
    price: 35.00,
    category: 'T-Shirts',
    imagen_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
    quantity: 2,
  },
  {
    id: '2',
    nombre: 'Leather Backpack',
    price: 150.00,
    category: 'Bags',
    imagen_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
    quantity: 1,
  }
];

export default function CarritoPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10.00 : 0; // Flat rate shipping for demo
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111] flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 bg-[#fafafa]/80 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tighter uppercase">
            Licenzia
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <Link href="/productos" className="hover:text-black transition-colors">TIENDA</Link>
            <Link href="/nosotros" className="hover:text-black transition-colors">Sobre Nosotros</Link>
            <Link href="/contacto" className="hover:text-black transition-colors">Contacto</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/carrito">
            <Button variant="ghost" size="icon" className="rounded-full relative text-black">
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-10">Tu Carrito</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-black/5 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8">Parece que aún no has añadido nada a tu carrito.</p>
            <Link href="/productos">
              <Button className="px-8 py-6 rounded-lg text-base">
                Explorar Productos
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6 bg-white p-4 rounded-2xl border border-black/5 shadow-sm relative pr-12">
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Product Image */}
                  <Link href={`/paginas/productos/${item.id}`} className="shrink-0">
                    <div className="w-28 h-32 md:w-32 md:h-40 bg-gray-100 rounded-xl overflow-hidden">
                      <img 
                        src={item.imagen_url} 
                        alt={item.nombre} 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex flex-col flex-1 justify-between py-1">
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1">{item.category}</p>
                      <Link href={`/paginas/productos/${item.id}`}>
                        <h3 className="font-medium text-lg text-[#111] hover:underline mb-1">{item.nombre}</h3>
                      </Link>
                      <p className="font-medium text-gray-700">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-[#fafafa]">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="ml-auto font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm sticky top-28">
                <h3 className="text-lg font-semibold mb-6">Resumen del Pedido</h3>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Envío estimado</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t border-black/5 pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-base">Total</span>
                    <span className="font-bold text-xl">${total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Los impuestos se calcularán en el checkout.</p>
                </div>

                <Button className="w-full py-6 text-base font-medium rounded-lg group">
                  Proceder al Pago
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="mt-6 text-center">
                  <Link href="/productos" className="text-sm font-medium text-gray-500 hover:text-black underline-offset-4 hover:underline transition-colors">
                    Seguir comprando
                  </Link>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 py-12 px-8 text-sm mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500">© 2026 Licenzia. Todos los derechos reservados.</p>
          <div className="flex gap-6 font-medium">
            <Link href="#" className="hover:text-black text-gray-500 transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-black text-gray-500 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-black text-gray-500 transition-colors">Términos</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
