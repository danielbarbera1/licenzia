"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Users, 
  Search, 
  ShieldCheck, 
  User, 
  Loader2,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminUsuariosPage() {
  const supabase = createClient();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      // Intentamos buscar en una tabla 'usuarios'. 
      // Esta tabla debe existir en Supabase y tener columnas como 'id', 'email', 'nombre', 'rol'.
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Tabla 'usuarios' no encontrada o sin permisos:", error);
        setUsuarios([]); // Mostramos vacío si no existe
      } else {
        setUsuarios(data || []);
      }
    } catch (error) {
      console.error(error);
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id, nuevoRol) => {
    try {
      const { error } = await supabase
        .from("usuarios")
        .update({ rol: nuevoRol })
        .eq("id", id);
        
      if (error) throw error;
      
      // Actualizamos el estado local para reflejar el cambio
      setUsuarios(usuarios.map(u => u.id === id ? { ...u, rol: nuevoRol } : u));
      // Pequeño feedback visual
      alert(`Rol actualizado a ${nuevoRol.toUpperCase()}`);
    } catch (error) {
      alert("Error al actualizar rol: " + error.message);
    }
  };

  const filteredUsuarios = usuarios.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Gestión de Usuarios y Roles
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Administra los roles y permisos de acceso a la plataforma.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-2xl">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por correo o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rol Actual</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha Registro</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <span className="text-slate-500 text-sm font-medium">Cargando usuarios...</span>
                    </div>
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <Users className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-xl text-slate-900 dark:text-white font-bold mb-2">No se encontraron usuarios</p>
                      <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                        Si aún no has creado la tabla <code>usuarios</code> en Supabase, por favor créala para poder listar y administrar los roles aquí.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsuarios.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    No hay usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredUsuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 font-bold uppercase shrink-0">
                          {u.nombre ? u.nombre.charAt(0) : u.email?.charAt(0) || <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{u.nombre || "Sin nombre"}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {u.rol === 'admin' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wider">
                          <User className="w-3 h-3 mr-1" />
                          Usuario
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                      {new Date(u.created_at || new Date()).toLocaleDateString('es-ES', { 
                        year: 'numeric', month: 'short', day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end">
                        <select
                          value={u.rol || 'usuario'}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-700 appearance-none text-center"
                        >
                          <option value="usuario">👉 Usuario</option>
                          <option value="admin">👉 Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
