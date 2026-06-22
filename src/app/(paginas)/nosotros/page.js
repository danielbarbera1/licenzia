import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from 'lucide-react'
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 text-center max-w-4xl mx-auto">
        <span className="text-sm font-medium tracking-widest uppercase mb-4 text-gray-500 block">Nuestra Historia</span>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 leading-[1.1]">
          Licencias <br /> para cada momento de tu vida
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          En Licenzia, creemos que cada momento empieza con una credencial que te identifique. Nos dedicamos a crear tarjetas, gafetes y identificaciones con diseños modernos y materiales de calidad, pensados para acompañarte en cada paso de tu vida de forma cómoda y segura.
        </p>
      </section>

      {/* Main Image */}
      <section className="px-4 md:px-8 max-w-[1400px] mx-auto mb-24">
        <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl bg-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop" 
            alt="Escritorio con productos de Licenzia" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* Values / Mission Section */}
      <section className="py-24 bg-white px-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight mb-6">Misión</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              En Licenzia, nuestra misión es ofrecer soluciones de identificación seguras, modernas y confiables que acompañen a las personas en todos los momentos importantes de su vida. Creamos productos de alta calidad, diseñados con atención al detalle y pensados para brindar comodidad, estilo y tranquilidad en cada uso.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Creemos que una buena identificación es mucho más que un simple accesorio: es una herramienta que facilita el día a día, aporta seguridad y refleja la identidad de cada persona. Por eso, nos esforzamos en ofrecer productos duraderos, funcionales y con diseños que se adaptan a cualquier estilo y necesidad.
            </p>
          </div>
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
             <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop" 
              alt="Detalles de manufactura" 
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="py-24 px-8 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-semibold tracking-tight mb-6">Visión</h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Ser la marca líder en soluciones de identificación en Venezuela, reconocida por su calidad, diseño y compromiso con la satisfacción del cliente. Queremos que Licenzia sea sinónimo de confianza, estilo y funcionalidad, acompañando a las personas en cada etapa de su vida con productos innovadores y confiables.
        </p>
        <Link href="/productos">
          <Button size="lg" className="rounded-full px-8 h-14 text-base group">
            Explorar Productos
          </Button>
        </Link>
      </section>
      <Footer />

    </div>
  )
}
