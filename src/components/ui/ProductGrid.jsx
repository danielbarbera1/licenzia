'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { ShoppingBag, X } from 'lucide-react'

export function ProductGrid({ productos }) {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <>
      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {productos.map((producto) => (
          <div 
            key={producto.id} 
            className="group cursor-pointer"
            onClick={() => setSelectedProduct(producto)}
          >
            <Card className="border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0">
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-4 rounded-lg relative">
                  <img 
                    src={producto.imagen_url} 
                    alt={producto.nombre} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay rápido al hacer hover */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      Ver Detalle
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{producto.nombre}</h3>
                    <p className="text-sm text-gray-500 mt-1">{producto.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Modal de Producto (Premium Design) */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white/80 backdrop-blur-xl border-white/20 shadow-2xl">
          {selectedProduct && (
            <div className="flex flex-col md:flex-row h-full">
              {/* Lado Izquierdo: Imagen */}
              <div className="w-full md:w-1/2 bg-gray-50">
                <img 
                  src={selectedProduct.imagen_url} 
                  alt={selectedProduct.nombre}
                  className="w-full h-full object-cover aspect-square md:aspect-auto"
                />
              </div>

              {/* Lado Derecho: Info */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                <DialogHeader>
                  <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">{selectedProduct.product_type}</span>
                  <DialogTitle className="text-3xl font-semibold tracking-tighter mb-4">
                    {selectedProduct.nombre}
                  </DialogTitle>
                </DialogHeader>
                
                <p className="text-2xl font-light text-gray-900 mb-6">
                  ${selectedProduct.precio} USD
                </p>
                
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  {selectedProduct.descripcion}
                </p>

                <div className="space-y-4">
                  <Button className="w-full h-14 rounded-full text-base font-medium transition-all hover:scale-[1.02] active:scale-[0.98]">
                    Añadir al Carrito
                  </Button>
                  <Button variant="outline" className="w-full h-14 rounded-full text-base font-medium">
                    Comprar Ahora
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
