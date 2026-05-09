import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from 'lucide-react'

export default function NosotrosPage() {
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
            <Link href="/nosotros" className="text-black font-semibold transition-colors">Sobre Nosotros</Link>
            <Link href="/blog" className="hover:text-black transition-colors">Blog</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 text-center max-w-4xl mx-auto">
        <span className="text-sm font-medium tracking-widest uppercase mb-4 text-gray-500 block">Nuestra Historia</span>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 leading-[1.1]">
          Creando esenciales <br /> que perduran.
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Licenzia nació con un objetivo simple: diseñar productos básicos de alta calidad que se adapten a tu día a día. Creemos firmemente que menos es más y que cada detalle importa.
        </p>
      </section>

      {/* Main Image */}
      <section className="px-4 md:px-8 max-w-[1400px] mx-auto mb-24">
        <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl bg-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop" 
            alt="Interior de nuestra tienda de diseño" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* Values / Mission Section */}
      <section className="py-24 bg-white px-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight mb-6">Diseño Intencional</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Nos enfocamos en el minimalismo moderno. Cada pieza de nuestra colección es el resultado de meses de pruebas, buscando el equilibrio perfecto entre funcionalidad y estética.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              No seguimos modas pasajeras. En su lugar, construimos un guardarropa atemporal en el que puedes confiar temporada tras temporada.
            </p>
          </div>
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
             <img 
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop" 
              alt="Detalles de manufactura" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="py-24 px-8 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-semibold tracking-tight mb-6">Calidad por encima de la cantidad.</h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Al asociarnos con fábricas éticas y utilizar materiales premium, nos aseguramos de que cada pieza que compres sea una inversión para el futuro. Estamos comprometidos con la transparencia y la excelencia.
        </p>
        <Link href="/productos">
          <Button size="lg" className="rounded-full px-8 h-14 text-base group">
            Explora la Colección
          </Button>
        </Link>
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
