"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, MapPin, Phone, Mail, Clock } from 'lucide-react'
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111]">
      <Navbar />

      {/* Header */}
      <div className="pt-24 pb-12 px-8 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4">Contacto</h1>
        <p className="text-gray-500">¿Tienes alguna pregunta? Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.</p>
      </div>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight mb-6">Envíanos un mensaje</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    className="w-full px-4 py-3 bg-[#fafafa] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-[#fafafa] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="asunto" className="text-sm font-medium text-gray-700">Asunto</label>
                <input
                  type="text"
                  id="asunto"
                  className="w-full px-4 py-3 bg-[#fafafa] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mensaje" className="text-sm font-medium text-gray-700">Mensaje</label>
                <textarea
                  id="mensaje"
                  rows="5"
                  className="w-full px-4 py-3 bg-[#fafafa] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-colors resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>
              <Button type="submit" className="w-full py-6 text-base font-medium rounded-lg">
                Enviar Mensaje
              </Button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8 flex flex-col">

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="border border-black/5 shadow-sm bg-white">
                <CardContent className="p-6 flex flex-col items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Mail className="w-5 h-5 text-gray-700" />
                  </div>
                  <h3 className="font-medium text-[#111] mb-1">Email</h3>
                  <p className="text-sm text-gray-500">Soporte y ventas</p>
                  <a href="mailto:hola@licenzia.com" className="text-sm font-medium mt-3 hover:underline">hola@licenzia.com</a>
                </CardContent>
              </Card>

              <Card className="border border-black/5 shadow-sm bg-white">
                <CardContent className="p-6 flex flex-col items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Phone className="w-5 h-5 text-gray-700" />
                  </div>
                  <h3 className="font-medium text-[#111] mb-1">Teléfono</h3>
                  <p className="text-sm text-gray-500">Lunes a Viernes, 9am - 6pm</p>
                  <a href="tel:+34900123456" className="text-sm font-medium mt-3 hover:underline">+34 900 123 456</a>
                </CardContent>
              </Card>

              <Card className="border border-black/5 shadow-sm bg-white">
                <CardContent className="p-6 flex flex-col items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <MapPin className="w-5 h-5 text-gray-700" />
                  </div>
                  <h3 className="font-medium text-[#111] mb-1">Oficina</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Calle Principal 123<br />
                    28001 Madrid, España
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-black/5 shadow-sm bg-white">
                <CardContent className="p-6 flex flex-col items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Clock className="w-5 h-5 text-gray-700" />
                  </div>
                  <h3 className="font-medium text-[#111] mb-1">Horario</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Lun - Vie: 9:00 - 18:00<br />
                    Sáb - Dom: Cerrado
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Google Map Embedded */}
            <div className="flex-1 min-h-[300px] w-full bg-gray-100 rounded-2xl overflow-hidden border border-black/5 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.6698993202496!2d-3.7061763846042454!3d40.41620956359567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb4ab4cd68e7b9%3A0x62952db580b08041!2sPuerta%20del%20Sol!5e0!3m2!1ses!2ses!4v1684345239247!5m2!1ses!2ses"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
              ></iframe>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
