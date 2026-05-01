import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ShoppingBag } from 'lucide-react'

// Mock Data for the store
const FEATURED_PRODUCTS = [
  { id: 1, name: 'The Essential Tee', price: '$35', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'Everyday Denim', price: '$120', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'Minimalist Jacket', price: '$195', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop' },
  { id: 4, name: 'Signature Tote', price: '$85', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop' },
]

export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  // Optional: const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 bg-[#fafafa]/80 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tighter uppercase">
            Licenzia
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <Link href="/productos" className="hover:text-black transition-colors">Shop</Link>
            <Link href="/about" className="hover:text-black transition-colors">About</Link>
            <Link href="/journal" className="hover:text-black transition-colors">Journal</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Subtle background image or gradient, sticking to minimal solid for now */}
          <div className="absolute inset-0 bg-[#e0deda] opacity-40"></div>
        </div>
        
        <span className="text-sm font-medium tracking-widest uppercase mb-4 text-gray-500">New Collection</span>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter max-w-3xl mb-8 leading-[1.1]">
          Designed for the <br /> modern minimalist.
        </h1>
        <p className="text-lg text-gray-600 max-w-md mb-10">
          Elevate your everyday with our new collection of intentionally crafted essentials.
        </p>
        <Link href="/productos">
          <Button size="lg" className="rounded-full px-8 h-14 text-base group">
            Shop the Collection
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-8 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-2">Featured Essentials</h2>
            <p className="text-gray-500 text-sm">Curated pieces for your wardrobe.</p>
          </div>
          <Link href="/productos" className="hidden md:flex items-center text-sm font-medium hover:underline underline-offset-4">
            View all products <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURED_PRODUCTS.map((product) => (
            <Link href={`/productos/${product.id}`} key={product.id} className="group">
              <Card className="border-0 shadow-none bg-transparent rounded-none">
                <CardContent className="p-0">
                  <div className="aspect-[4/5] overflow-hidden bg-gray-100 mb-4 rounded-lg">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{product.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Value Section */}
      <section className="py-24 bg-white px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">Quality over quantity.</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            We believe in creating products that last. By partnering with ethical factories and using premium materials, we ensure that every piece you buy is an investment in your future wardrobe.
          </p>
          <Button variant="outline" className="rounded-full">
            Read our story
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 py-12 px-8 text-sm">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500">© 2026 Licenzia. All rights reserved.</p>
          <div className="flex gap-6 font-medium">
            <Link href="#" className="hover:text-black text-gray-500 transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-black text-gray-500 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-black text-gray-500 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
