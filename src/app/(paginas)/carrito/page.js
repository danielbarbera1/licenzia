"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Minus, Plus, X, ArrowRight, Trash2 } from 'lucide-react'
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

export default function CarritoPage() {
  const { items: cartItems, removeItem, updateQuantity, clearCart, subtotal, itemCount } = useCart()
  const { user } = useAuth()

  const shipping = subtotal > 0 ? 10.00 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111] flex flex-col">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter">Tu Carrito</h1>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Vaciar carrito
            </button>
          )}
        </div>

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
                <div key={item.id} className="flex gap-6 bg-white p-4 rounded-2xl border border-black/5 shadow-sm relative pr-12 group">
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Product Image */}
                  <div className="shrink-0">
                    <div className="w-28 h-32 md:w-32 md:h-40 bg-gray-100 rounded-xl overflow-hidden">
                      <img 
                        src={item.imagen_url} 
                        alt={item.nombre} 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col flex-1 justify-between py-1">
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-1">{item.product_type}</p>
                      <h3 className="font-medium text-lg text-[#111] mb-1">{item.nombre}</h3>
                      <p className="font-medium text-gray-700">${Number(item.precio).toFixed(2)}</p>
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
                        ${(Number(item.precio) * item.quantity).toFixed(2)}
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
                    <span className="text-gray-500">Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})</span>
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

                {user ? (
                  <Link href="/pago">
                    <Button className="w-full py-6 text-base font-medium rounded-lg group">
                      Proceder al Pago
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <div>
                    <Link href="/login">
                      <Button className="w-full py-6 text-base font-medium rounded-lg group">
                        Inicia Sesión para Comprar
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-400 text-center mt-3">
                      Necesitas una cuenta para finalizar tu compra.
                    </p>
                  </div>
                )}

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

      <Footer />
    </div>
  )
}
