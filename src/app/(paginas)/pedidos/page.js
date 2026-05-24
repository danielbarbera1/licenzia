"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Package, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ArrowRight,
  Loader2
} from "lucide-react";

export default function PedidosPage() {
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPedidos();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      // Intentamos buscar pedidos. Si la tabla no existe aún, capturamos el error silenciosamente.
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Tabla de pedidos no encontrada o error en la consulta:", error);
        setPedidos([]);
      } else {
        setPedidos(data || []);
      }
    } catch (error) {
      console.error(error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (estado) => {
    switch(estado?.toLowerCase()) {
      case 'entregado': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'en camino': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'procesando': 
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  const getStatusColor = (estado) => {
    switch(estado?.toLowerCase()) {
      case 'entregado': return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case 'en camino': return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case 'procesando': 
      default: return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-slate-500 font-medium">Cargando tus pedidos...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Inicia sesión para ver tus pedidos</h2>
          <p className="text-slate-500 mb-8 max-w-md">
            Debes acceder a tu cuenta para poder consultar el historial de tus compras y el estado de tus envíos.
          </p>
          <Link href="/login">
            <Button className="px-8 py-6 rounded-xl text-base font-semibold shadow-lg">
              Iniciar Sesión
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-[1000px] w-full mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Mis Pedidos
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Revisa el estado y el historial de tus compras.
          </p>
        </div>

        {pedidos.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Aún no tienes pedidos</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Cuando realices tu primera compra en nuestra tienda, aparecerá aquí con todos sus detalles.
            </p>
            <Link href="/productos">
              <Button className="px-8 py-6 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                Explorar Productos
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido, index) => (
              <Card 
                key={pedido.id || index} 
                className="border-none shadow-md shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                        {getStatusIcon(pedido.estado || 'procesando')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Pedido #{pedido.id ? pedido.id.toString().slice(0, 8) : '000000'}
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {new Date(pedido.created_at || new Date()).toLocaleDateString('es-ES', { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(pedido.estado || 'procesando')}`}>
                        {pedido.estado || 'Procesando'}
                      </span>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total</p>
                        <p className="font-bold text-lg text-slate-900 dark:text-white">
                          ${pedido.total ? Number(pedido.total).toFixed(2) : '0.00'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <Package className="w-4 h-4 mr-2" />
                        {pedido.items?.length || 1} {pedido.items?.length === 1 ? 'artículo' : 'artículos'}
                      </div>
                      <Button variant="ghost" className="text-primary hover:text-primary/80 font-semibold group-hover:translate-x-1 transition-transform">
                        Ver detalles
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
