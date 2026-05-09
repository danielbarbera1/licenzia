import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import ProductsClient from './ProductsClient'

export default async function ProductosPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: productosDB, error } = await supabase
    .from('productos')
    .select('*, product_type(nombre)')

  if (error) {
    console.error('Error fetching products:', error)
  }

  const productos = productosDB?.map(producto => ({
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.precio,
    descripcion: producto.descripcion,
    product_type: producto.product_type?.nombre || "Sin Categoría",
    imagen_url: producto.imagen_url
  })) || []

  return <ProductsClient initialProducts={productos} />
}
