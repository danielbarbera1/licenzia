"use client";

import React from "react";
import { Clock } from "lucide-react";

export default function AdminPedidosPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <Clock className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
        Próximamente
      </h1>
      <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md">
        Estamos trabajando en la gestión de ajustes. ¡Estará disponible muy pronto!
      </p>
    </div>
  );
}