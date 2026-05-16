"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Ingresos Totales",
    value: "$12,845.00",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    title: "Pedidos Nuevos",
    value: "145",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    title: "Clientes Activos",
    value: "1,240",
    change: "-2.4%",
    trend: "down",
    icon: Users,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-500/10",
  },
  {
    title: "Stock Bajo",
    value: "12",
    change: "3 critico",
    trend: "warning",
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
];

const recentOrders = [
  { id: "#ORD-1234", customer: "Juan Perez", date: "Hace 2 horas", amount: "$120.00", status: "Completado" },
  { id: "#ORD-1235", customer: "Maria Garcia", date: "Hace 5 horas", amount: "$85.50", status: "Pendiente" },
  { id: "#ORD-1236", customer: "Carlos Lopez", date: "Ayer", amount: "$340.00", status: "Enviado" },
  { id: "#ORD-1237", customer: "Ana Martinez", date: "Ayer", amount: "$45.00", status: "Completado" },
  { id: "#ORD-1238", customer: "Roberto Sanchez", date: "2 dias", amount: "$210.00", status: "Cancelado" },
];

const topProducts = [
  { name: "Licencia Windows 11 Pro", sales: 450, price: "$29.99", stock: 85 },
  { name: "Microsoft Office 2021", sales: 320, price: "$49.99", stock: 120 },
  { name: "Adobe Creative Cloud", sales: 180, price: "$599.99", stock: 15 },
  { name: "Antivirus Kaspersky 1 Año", sales: 120, price: "$19.99", stock: 50 },
];

export default function DashboardPage() {
  const [range, setRange] = useState("Últimos 30 días");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    
    // Simular preparación de datos
    setTimeout(() => {
      const csvRows = [
        ["Reporte de Dashboard - Licenzia"],
        ["Fecha de exportacion", new Date().toLocaleString()],
        [],
        ["ESTADISTICAS"],
        ["Titulo", "Valor", "Cambio"],
        ...stats.map(s => [s.title, s.value, s.change]),
        [],
        ["PEDIDOS RECIENTES"],
        ["ID", "Cliente", "Fecha", "Monto", "Estado"],
        ...recentOrders.map(o => [o.id, o.customer, o.date, o.amount, o.status]),
        [],
        ["TOP PRODUCTOS"],
        ["Producto", "Ventas", "Precio", "Stock"],
        ...topProducts.map(p => [p.name, p.sales, p.price, p.stock])
      ];

      const csvContent = csvRows.map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `reporte_admin_${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Bienvenido de nuevo, aquí tienes el resumen de hoy.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <Button variant="outline" className="hidden sm:flex items-center space-x-2 border-slate-200 dark:border-slate-800">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>{range}</span>
            </Button>
            {/* Simple Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              {["Hoy", "Últimos 7 días", "Últimos 30 días", "Este Mes", "Este Año"].map((option) => (
                <button
                  key={option}
                  onClick={() => setRange(option)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    range === option ? "text-primary font-bold bg-primary/5" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white min-w-[140px]"
          >
            {isExporting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Exportando...</span>
              </div>
            ) : "Exportar Reporte"}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center text-xs font-medium ${
                  stat.trend === "up" ? "text-emerald-600" : stat.trend === "down" ? "text-red-600" : "text-amber-600"
                }`}>
                  {stat.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : stat.trend === "down" ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales Chart Placeholder */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Resumen de Ventas</CardTitle>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 relative flex items-end justify-between px-2 gap-2">
              {/* Simple CSS-based bar chart for visual appeal without extra libs */}
              {[65, 45, 75, 55, 85, 40, 95, 60, 70, 50, 80, 65].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group relative h-full">
                  <div 
                    className="w-full bg-primary/20 hover:bg-primary transition-all duration-300 rounded-t-lg relative"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                      ${height * 12}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 uppercase">
                    {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Productos Populares</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                    {product.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.sales} ventas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{product.price}</p>
                  <p className={`text-[10px] font-medium ${product.stock < 20 ? "text-amber-500" : "text-emerald-500"}`}>
                    {product.stock} en stock
                  </p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/5 font-semibold">
              Ver todos los productos
            </Button>
          </CardContent>
        </Card>

        {/* Recent Orders Table */}
        <Card className="lg:col-span-3 border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Pedidos Recientes</CardTitle>
            <Button variant="outline" size="sm" className="rounded-full text-xs">
              Ver Historial
            </Button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pedido</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{order.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Completado" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        order.status === "Pendiente" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        order.status === "Enviado" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                        "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {order.status === "Completado" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {order.status === "Pendiente" && <Clock className="w-3 h-3 mr-1" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" className="text-primary font-semibold hover:bg-primary/5">
                        Detalles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
