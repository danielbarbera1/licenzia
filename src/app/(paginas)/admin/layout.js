"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Contact,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard", roles: ['admin', 'vendedor'] },
  { icon: Package, label: "Productos", href: "/admin/productos", roles: ['admin', 'vendedor'] },
  { icon: ShoppingCart, label: "Pedidos", href: "/admin/pedidos", roles: ['admin', 'vendedor'] },
  { icon: Contact, label: "Clientes", href: "/admin/clientes", roles: ['admin', 'vendedor'] },
  { icon: Users, label: "Usuarios", href: "/admin/usuarios", roles: ['admin'] },
  { icon: Settings, label: "Ajustes", href: "/admin/ajustes", roles: ['admin'] },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, role, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (role !== 'admin' && role !== 'vendedor') {
        router.push('/');
      }
    }
  }, [user, role, loading, router]);

  if (loading || !user || (role !== 'admin' && role !== 'vendedor')) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50/50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-slate-500 font-medium">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-slate-950 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-center">
            <span className="text-5xl font-bold tracking-tight text-slate-900 text-center dark:text-white">
              Licenzia
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {menuItems.filter(item => item.roles.includes(role)).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-primary transition-colors"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto opacity-70" />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Profile / Logout */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            <Link 
              href="/" 
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Volver a página principal
            </Link>
            
            <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                <Users className="h-6 w-6 text-slate-500" />
              </div>
              <div className="ml-3 overflow-hidden text-ellipsis">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user?.user_metadata?.full_name || 'Administrador'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full justify-start text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
