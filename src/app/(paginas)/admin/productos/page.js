"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  Package,
  AlertTriangle,
  CheckCircle2,
  X
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminProductosPage() {
  const router = useRouter();
  const supabase = createClient();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Filter State
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: "all",
    type: "all",
    stockStatus: "all"
  });

  // Form State
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    imagen_url: "",
    categorias: "",
    product_type: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, typeRes] = await Promise.all([
        supabase.from("productos").select("*, product_type(id, nombre), categorias(id, nombre)").order("creado", { ascending: false }),
        supabase.from("categorias").select("*"),
        supabase.from("product_type").select("*")
      ]);

      if (prodRes.error) throw prodRes.error;
      setProductos(prodRes.data || []);
      setCategories(catRes.data || []);
      setProductTypes(typeRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion || "",
        precio: product.precio || "",
        stock: product.stock || "",
        imagen_url: product.imagen_url || "",
        categorias: product.categorias?.id || product.categorias || "",
        product_type: product.product_type?.id || product.product_type || ""
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagen_url: "",
        categorias: "",
        product_type: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      categorias: formData.categorias || null,
      product_type: formData.product_type || null
    };

    try {
      let error;
      if (editingProduct) {
        ({ error } = await supabase.from("productos").update(payload).eq("id", editingProduct.id));
      } else {
        ({ error } = await supabase.from("productos").insert([payload]));
      }

      if (error) throw error;
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Error al guardar el producto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploadingImage(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Asegúrate de que el bucket 'productos' exista y sea público en Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('productos')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, imagen_url: urlData.publicUrl }));
    } catch (error) {
      alert("Error al subir la imagen: " + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    
    try {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  };

  const filteredProducts = productos.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (p.product_type?.nombre && p.product_type.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeFilters.category === "all" || p.categorias?.id === activeFilters.category;
    const matchesType = activeFilters.type === "all" || p.product_type?.id === activeFilters.type;
    
    let matchesStock = true;
    if (activeFilters.stockStatus === "in-stock") matchesStock = p.stock > 20;
    if (activeFilters.stockStatus === "low-stock") matchesStock = p.stock > 0 && p.stock <= 20;
    if (activeFilters.stockStatus === "out-of-stock") matchesStock = p.stock === 0;

    return matchesSearch && matchesCategory && matchesType && matchesStock;
  });

  const clearFilters = () => {
    setActiveFilters({
      category: "all",
      type: "all",
      stockStatus: "all"
    });
    setSearchTerm("");
  };

  const hasActiveFilters = activeFilters.category !== "all" || 
                          activeFilters.type !== "all" || 
                          activeFilters.stockStatus !== "all" || 
                          searchTerm !== "";

  return (
    <div className="space-y-6 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Gestión de Productos
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Administra tu inventario, precios y categorías.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`transition-all ${
                  hasActiveFilters 
                    ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20" 
                    : showFilters 
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700" 
                      : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
                )}
              </Button>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  onClick={clearFilters}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Expanded Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Categoría</label>
                <select
                  value={activeFilters.category}
                  onChange={(e) => setActiveFilters({...activeFilters, category: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Tipo de Producto</label>
                <select
                  value={activeFilters.type}
                  onChange={(e) => setActiveFilters({...activeFilters, type: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="all">Todos los tipos</option>
                  {productTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Estado de Stock</label>
                <select
                  value={activeFilters.stockStatus}
                  onChange={(e) => setActiveFilters({...activeFilters, stockStatus: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                >
                  <option value="all">Todos los niveles</option>
                  <option value="in-stock">En Stock (&gt;20)</option>
                  <option value="low-stock">Bajo Stock (1-20)</option>
                  <option value="out-of-stock">Sin Stock (0)</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo/Cat</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading && productos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <span className="text-slate-500 text-sm">Cargando productos...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-200 dark:border-slate-700">
                          {p.imagen_url ? (
                            <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Package className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{p.nombre}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{p.descripcion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 uppercase tracking-tight">
                          {p.product_type?.nombre || "General"}
                        </span>
                        {p.categorias?.nombre && (
                          <p className="text-[10px] text-slate-400 pl-1">{p.categorias.nombre}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                      ${parseFloat(p.precio).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          p.stock > 20 ? "bg-emerald-500" : p.stock > 0 ? "bg-amber-500" : "bg-red-500"
                        }`}></span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {p.stock} unid.
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => router.push(`/admin/productos/editar?id=${p.id}`)}
                          className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(p.id)}
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {editingProduct ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Nombre del Producto</label>
              <input
                required
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Ej. Windows 11 Pro Retail"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Precio ($)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({...formData, precio: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="29.99"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Stock Inicial</label>
                <input
                  required
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Tipo</label>
                <select
                  value={formData.product_type}
                  onChange={(e) => setFormData({...formData, product_type: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Seleccionar...</option>
                  {productTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Categoría</label>
                <select
                  value={formData.categorias}
                  onChange={(e) => setFormData({...formData, categorias: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Seleccionar...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Imagen del Producto</label>
              
              <div className="flex flex-col gap-3">
                {formData.imagen_url && (
                  <div className="w-full max-w-[200px] h-32 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 relative group">
                    <img src={formData.imagen_url} alt="Vista previa" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, imagen_url: ""})}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 disabled:opacity-50 cursor-pointer"
                  />
                  {uploadingImage && <span className="text-xs text-primary animate-pulse whitespace-nowrap">Subiendo...</span>}
                </div>
                
                <input
                  value={formData.imagen_url}
                  onChange={(e) => setFormData({...formData, imagen_url: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs focus:ring-2 focus:ring-primary/20 outline-none text-slate-400"
                  placeholder="O ingresa una URL directamente (opcional)"
                />
              </div>
            </div>


            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Descripción</label>
              <textarea
                rows="3"
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                placeholder="Describe el producto..."
              />
            </div>
          </form>

          <DialogFooter className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 gap-3">
            <DialogClose asChild>
              <Button variant="ghost" className="rounded-xl font-semibold">Cancelar</Button>
            </DialogClose>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-primary text-white hover:bg-primary/90 px-8 rounded-xl font-bold shadow-lg shadow-primary/20"
            >
              {loading ? "Guardando..." : "Guardar Producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
