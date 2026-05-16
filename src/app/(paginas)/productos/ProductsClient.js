"use client"

import { useState } from "react"
import { SlidersHorizontal, ChevronDown } from 'lucide-react'
import { ProductGrid } from "@/components/ui/ProductGrid"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ProductsClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortOrder, setSortOrder] = useState("default");

  const product_type = ["Todos", ...new Set(initialProducts.map(p => p.product_type))];

  const handleFilterAndSort = (category, sort) => {
    let filtered = [...initialProducts];

    // Filter by Category
    if (category !== "Todos") {
      filtered = filtered.filter(p => p.product_type === category);
    }

    // Sort by Price
    if (sort === "low-to-high") {
      filtered.sort((a, b) => a.precio - b.precio);
    } else if (sort === "high-to-low") {
      filtered.sort((a, b) => b.precio - a.precio);
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
      <Navbar />

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
                {product_type.map(cat => (
                  <option key={cat} value={cat}>{cat === "Todos" ? "Todas las Categorías" : cat}</option>
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
                <option value="default">Destacados</option>
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
            No hay productos por ahora.
          </div>
        ) : (
          <ProductGrid productos={products} />
        )}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
