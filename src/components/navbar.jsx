import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, LogIn, UserPlus } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 bg-[#fafafa]/80 backdrop-blur-md border-b border-black/5">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold tracking-tighter uppercase">
          Licenzia
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
          <Link href="/productos" className="hover:text-black transition-colors">Productos</Link>
          <Link href="/nosotros" className="hover:text-black transition-colors">Sobre Nosotros</Link>
          <Link href="/contacto" className="hover:text-black transition-colors">Contacto</Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/carrito">
          <Button  variant="ghost" size="icon" className="rounded-full">
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </Link>
        <div className="h-6 w-px bg-black/10 mx-2 hidden sm:block"></div>
        <Link href="/login">
          <Button variant="ghost" className="hidden sm:flex items-center gap-2 text-sm font-medium">
            <LogIn className="w-4 h-4" />
            Iniciar Sesión
          </Button>
        </Link>
        <Link href="/login?mode=register">
          <Button className="hidden sm:flex items-center gap-2 text-sm font-medium rounded-full px-5">
            <UserPlus className="w-4 h-4" />
            Registrarse
          </Button>
        </Link>
      </div>
    </nav>
  )
}