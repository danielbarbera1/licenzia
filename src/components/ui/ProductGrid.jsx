'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { ShoppingBag, Check, Minus, Plus } from 'lucide-react'
import { useCart } from "@/context/CartContext"

export function ProductGrid({ productos }) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [addedToCart, setAddedToCart] = useState(null)
  const [modalQuantity, setModalQuantity] = useState(1)
  const { addItem } = useCart()

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation()
    addItem(product, 1)
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  const handleAddToCartFromModal = (product) => {
    addItem(product, modalQuantity)
    setAddedToCart(product.id)
    setModalQuantity(1)
    setTimeout(() => {
      setAddedToCart(null)
      setSelectedProduct(null)
    }, 1200)
  }

  const handleOpenModal = (product) => {
    setSelectedProduct(product)
    setModalQuantity(1)
    setAddedToCart(null)
  }

  return (
    <>
      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {productos.map((producto) => (
          <div 
            key={producto.id} 
            className="group cursor-pointer"
            onClick={() => handleOpenModal(producto)}
          >
            <Card className="border-0 shadow-none bg-transparent rounded-none">
              <CardContent className="p-0">
                <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-4 rounded-lg relative">
                  <img 
                    src={producto.imagen_url} 
                    alt={producto.nombre} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Hover overlay with actions */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4 gap-2">
                    <span className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Ver Detalle
                    </span>
                  </div>

                  {/* Quick Add to Cart button */}
                  <button
                    onClick={(e) => handleAddToCart(producto, e)}
                    className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10 ${
                      addedToCart === producto.id
                        ? 'bg-green-500 text-white scale-110'
                        : 'bg-white text-black opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white translate-y-2 group-hover:translate-y-0'
                    }`}
                  >
                    {addedToCart === producto.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <ShoppingBag className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{producto.nombre}</h3>
                    <p className="text-sm text-gray-500 mt-1">${producto.precio}</p>
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

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-gray-600">Cantidad:</span>
                  <div className="flex items-center border border-gray-200 rounded-full bg-gray-50">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors disabled:opacity-50"
                      disabled={modalQuantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{modalQuantity}</span>
                    <button
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button 
                    onClick={() => handleAddToCartFromModal(selectedProduct)}
                    className={`w-full h-14 rounded-full text-base font-medium transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      addedToCart === selectedProduct.id
                        ? 'bg-green-500 hover:bg-green-600'
                        : ''
                    }`}
                  >
                    {addedToCart === selectedProduct.id ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        ¡Añadido al Carrito!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        Añadir al Carrito
                      </>
                    )}
                  </Button>
                  
                  <Link href="/carrito">
                    <Button variant="outline" className="w-full h-14 rounded-full text-base font-medium">
                      Ver Carrito
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
