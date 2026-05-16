import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { ProductGrid } from "@/components/ui/ProductGrid"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"



export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: productosDB, error } = await supabase
    .from('productos')
    .select('*, product_type(nombre)')

  if (error) {
    console.error('Error al cargar productos:', error)
  }

  const productos = productosDB?.map(producto => ({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    descripcion: producto.descripcion,
    product_type: producto.product_type?.nombre || "Edición Limitada",
    imagen_url: producto.imagen_url
  })) || []


  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#111]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {/* <img 
            src="https://ldcmyqjtlujddovytdkb.supabase.co/storage/v1/object/public/imagenes%20variadas/bannerHero.png"
            alt="Background"
            className="w-full h-full object-cover object-center"
          /> */}
          {/* Subtle overlay to ensure text readability */}
          <div className="absolute inset-0 bg-white/20"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-sm font-medium tracking-widest uppercase mb-4 text-gray-500">Nueva Colección</span>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter max-w-3xl mb-8 leading-[1.1]">
            Diseño <br /> minimalista moderno.
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
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-8 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2">Artículos esenciales destacados</h2>
            <p className="text-gray-500 text-sm">Piezas seleccionadas para tu guardarropa.</p>
          </div>
          <Link href="/productos" className="hidden md:flex items-center text-sm font-medium hover:underline underline-offset-4">
            Ver Producto <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <ProductGrid productos={productos} />
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
      
      <Footer />

    </div>
  )
}
