'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingBag, Check, Minus, Plus } from 'lucide-react';
import { useCart } from "@/context/CartContext";
import { createClient } from "@/utils/supabase/client";

export default function UsuarioPage() {
  const supabase = createClient();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [userData, setUserData] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setUserData(data);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleAddToCart = (product, e) => {
    if (e) e.stopPropagation();
    addItem(product, 1);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const handleAddToCartFromModal = (product) => {
    addItem(product, modalQuantity);
    setAddedToCart(product.id);
    setModalQuantity(1);
    setTimeout(() => {
      setAddedToCart(null);
      setSelectedProduct(null);
    }, 1200);
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
    setAddedToCart(null);
  };

  // Mock products data - Replace with actual product fetching
  const productos = [
    {
      id: '1',
      nombre: 'Playera Blanca premium',
      precio: 25,
      descripcion: 'Camiseta de alta calidad, 100% algodón orgánico, ajuste perfecto.',
      imagen_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzE2Mjl8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIgdHNoaXJ0fGVufDB8fHx8MTc1OTk1MzU3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      product_type: 'Ropa'
    },
    {
      id: '2',
      nombre: 'Termo Acero Inoxidable',
      precio: 45,
      descripcion: 'Termo de 24 horas con aislamiento al vacío, ideal para café o té.',
      imagen_url: 'https://images.unsplash.com/photo-1505843913145-02f7c783b581?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzE2Mjl8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwdGVybW98ZW58MHx8fHwxNzU5OTUzNTc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      product_type: 'Accesorios'
    },
    {
      id: '3',
      nombre: 'Audífonos Bluetooth Premium',
      precio: 120,
      descripcion: 'Sonido envolvente 3D, cancelación de ruido activa y 20 horas de batería.',
      imagen_url: 'https://images.unsplash.com/photo-1604674864456-f8283479ee33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzE2Mjl8MHwxfHNlYXJjaHwzfHxwcmVtaXVtJTIwaGVhZH Bob25lc3xlbnwwfHx8fDE3NTk5NTM1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      product_type: 'Electrónica'
    },
    {
      id: '4',
      nombre: 'Mochila Urbana Premium',
      precio: 75,
      descripcion: 'Diseño ergonómico, compartimento para laptop, resistente al agua.',
      imagen_url: 'https://images.unsplash.com/photo-1609173836403-a4986f7022cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzE2Mjl8MHwxfHNlYXJjaHwzfHx1cmJhbiUyIGJhY2twYWNrfGVufDB8fHx8MTc1OTk1Mzk1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      product_type: 'Accesorios'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 z-10" />
        <img
          src="https://images.unsplash.com/photo-1487412720507-3d3728a14ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzE2Mjl8MHwxfHNlYXJjaHwzfHxldmVudCUyMHNpbXBsZXxlbnwwfHx8fDE3NTk5NTQyNzR8MA&ixlib=rb-4.1.0&q=80&w=1200"
          alt="Modern Workspace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Bienvenido <span className="text-primary">{userData?.nombre || 'Usuario'}</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Descubre lo último en tecnología y estilo con nuestra colección exclusiva.
          </p>
        </div>
      </section>

      {/* User Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-0 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Nombre Completo</div>
              <div className="text-lg font-semibold mt-1">{userData?.nombre || '...'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Email</div>
              <div className="text-lg font-semibold mt-1">{userData?.email || '...'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Rol</div>
              <div className="text-lg font-semibold mt-1 capitalize">{userData?.rol || 'Usuario'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Miembro desde</div>
              <div className="text-lg font-semibold mt-1">
                {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : '...'}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
