"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingBag, LogIn, UserPlus, LogOut, User, ChevronDown, LayoutDashboard, Settings, Package } from 'lucide-react'
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { useState, useRef, useEffect } from "react"

export default function Navbar() {
  const { user, role, loading, signOut } = useAuth()
  const { itemCount } = useCart()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setShowMenu(false)
    router.push("/")
    router.refresh()
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario"

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
        {/* Cart Button */}
        <Link href="/carrito">
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in-50 duration-200">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Button>
        </Link>

        <div className="h-6 w-px bg-black/10 mx-2 hidden sm:block"></div>

        {/* Auth Buttons */}
        {loading ? (
          <div className="w-24 h-9 bg-gray-100 rounded-full animate-pulse hidden sm:block" />
        ) : user ? (
          // User is logged in - show user menu
          <div className="relative hidden sm:block" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold uppercase">
                {displayName.charAt(0)}
              </div>
              <span className="max-w-[120px] truncate">{displayName}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-black/5 shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="px-4 py-3 border-b border-black/5">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                </div>
                <Link
                  href="/carrito"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Mi Carrito
                  {itemCount > 0 && (
                    <span className="ml-auto text-xs bg-black text-white px-2 py-0.5 rounded-full">
                      {itemCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/pedidos"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  Mis Pedidos
                </Link>

                {(role === 'admin' || role === 'vendedor') && (
                  <Link
                    href="/admin"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Panel de Control
                  </Link>
                )}

                <Link
                  href="/configuracion"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Configuración de cuenta
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          // User is NOT logged in - show login/register buttons
          <>
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
          </>
        )}
      </div>
    </nav>
  )
}