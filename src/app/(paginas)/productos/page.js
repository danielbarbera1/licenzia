"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, SlidersHorizontal, ChevronDown } from 'lucide-react'

// Mock Data for the store
const initialProducts = [
  {
    id: '1',
    nombre: 'Minimalist T-Shirt',
    price: 35.00,
    category: 'T-Shirts',
    imagen_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    nombre: 'Everyday Tote',
    price: 85.00,
    category: 'Bags',
    imagen_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    nombre: 'Classic Cap',
    price: 28.00,
    category: 'Accessories',
    imagen_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '4',
    nombre: 'Essential Mug',
    price: 18.00,
    category: 'Drinkware',
    imagen_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '5',
    nombre: 'Heavyweight Hoodie',
    price: 75.00,
    category: 'T-Shirts',
    imagen_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '6',
    nombre: 'Leather Backpack',
    price: 150.00,
    category: 'Bags',
    imagen_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '7',
    nombre: 'Stainless Steel Water Bottle',
    price: 32.00,
    category: 'Drinkware',
    imagen_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '8',
    nombre: 'Beanie',
    price: 24.00,
    category: 'Accessories',
    imagen_url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop',
  }
];

export default function ProductosPage() {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  const categories = ["All", ...new Set(initialProducts.map(p => p.category))];

  const handleFilterAndSort = (category, sort) => {
    let filtered = [...initialProducts];

    // Filter by Category
    if (category !== "All") {
      filtered = filtered.filter(p => p.category === category);
    }

    // Sort by Price
    if (sort === "low-to-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "high-to-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setProducts(filtered);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    handleFilterAndSort(newCategory, sortOrder);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortOrder(newSort);
    handleFilterAndSort(selectedCategory, newSort);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 bg-[#fafafa]/80 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tighter uppercase">
            Licenzia
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <Link href="/productos" className="text-black font-semibold transition-colors">TIENDA</Link>
            <Link href="/nosotros" className="hover:text-black transition-colors">Sobre Nosotros</Link>
            <Link href="/contacto" className="hover:text-black transition-colors">Contacto</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-24 pb-12 px-8 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4">Productos</h1>
        <p className="text-gray-500">Explora nuestra colección completa de productos.</p>
      </div>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-8 pb-24">
        
        {/* Filters and Sorting Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-y border-black/5 mb-10 gap-4">
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center text-sm font-medium text-gray-700">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filtros
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select 
                value={selectedCategory} 
                onChange={handleCategoryChange}
                className="appearance-none bg-white border border-gray-200 text-sm rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === "All" ? "Todas las Categorias" : cat}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm text-gray-500">Ordenar por:</span>
            <div className="relative">
              <select 
                value={sortOrder} 
                onChange={handleSortChange}
                className="appearance-none bg-white border border-gray-200 text-sm rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black cursor-pointer"
              >
                <option value="default">Featured</option>
                <option value="low-to-high">Precio: Menor a Mayor</option>
                <option value="high-to-low">Precio: Mayor a Menor</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No producto por ahora.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((producto) => (
              <Link href={`/paginas/productos/${producto.id}`} key={producto.id} className="group">
                <Card className="border-0 shadow-none bg-transparent rounded-none h-full flex flex-col">
                  <CardContent className="p-0 flex-1 flex flex-col">
                    <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-4 rounded-lg relative">
                      <img 
                        src={producto.imagen_url} 
                        alt={producto.nombre} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-sm shadow-sm">
                        {producto.category}
                      </div>
                    </div>
                    <div className="flex justify-between items-start flex-1">
                      <div>
                        <h3 className="font-medium text-sm text-[#111]">{producto.nombre}</h3>
                        <p className="text-sm text-gray-500 mt-1">${producto.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-black/5 py-12 px-8 text-sm mt-auto">
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
