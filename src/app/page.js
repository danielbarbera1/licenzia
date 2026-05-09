import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ShoppingBag } from 'lucide-react'

// Mock Data for the store
const productos = [
  {
    id: '1',
    nombre: 'Minimalist T-Shirt',
    price: '$35.00',
    imagen_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    nombre: 'Everyday Tote',
    price: '$85.00',
    imagen_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    nombre: 'Classic Cap',
    price: '$28.00',
    imagen_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '4',
    nombre: 'Essential Mug',
    price: '$18.00',
    imagen_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop',
  }
];

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  // Optional: const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111]">
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
          <Button variant="ghost" size="icon" className="rounded-full">
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Subtle background image or gradient, sticking to minimal solid for now */}
          <div className="absolute inset-0 bg-[#e0deda] opacity-40"></div>
        </div>
        
        <span className="text-sm font-medium tracking-widest uppercase mb-4 text-gray-500">New Collection</span>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter max-w-3xl mb-8 leading-[1.1]">
          Ver Producto <br /> minimalista moderno.
        </h1>
        <p className="text-lg text-gray-600 max-w-md mb-10">
          Mejora tu día a día con nuestra nueva colección de artículos esenciales elaborados con esmero.
        </p>
        <Link href="/productos">
          <Button size="lg" className="rounded-full px-8 h-14 text-base group">
            Ver Producto
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-8 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2">Featured Essentials</h2>
            <p className="text-gray-500 text-sm">Curated pieces for your wardrobe.</p>
          </div>
          <Link href="/productos" className="hidden md:flex items-center text-sm font-medium hover:underline underline-offset-4">
            Ver Producto <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productos.map((producto) => (
            <Link href={`/productos/${producto.id}`} key={producto.id} className="group">
              <Card className="border-0 shadow-none bg-transparent rounded-none">
                <CardContent className="p-0">
                  <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-4 rounded-lg">
                    <img 
                      src={producto.imagen_url} 
                      alt={producto.nombre} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{producto.nombre}</h3>
                      <p className="text-sm text-gray-500 mt-1">{producto.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Value Section */}
      <section className="py-24 bg-white px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">Calidad sobre cantidad.</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Creemos en la creación de productos que perduren. Al asociarnos con fábricas éticas y utilizar materiales premium, nos aseguramos de que cada pieza que compres sea una inversión para tu guardarropa futuro.
          </p>
          <Button variant="outline" className="rounded-full">
            Leer nuestra historia
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 py-12 px-8 text-sm">
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
