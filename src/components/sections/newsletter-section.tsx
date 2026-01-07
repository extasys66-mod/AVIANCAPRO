"use client"

import type React from "react"

import { useState } from "react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el email a un servicio
    setSubmitted(true)
  }

  return (
    <section className="py-16 bg-red-500 text-white mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Mantente informado</h2>
          <p className="text-emerald-100 mb-8">
            Suscríbete a nuestro boletín y recibe ofertas exclusivas, consejos de viaje y novedades
          </p>

          {submitted ? (
            <div className="text-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-2">¡Gracias por suscribirte!</h3>
              <p>Pronto recibirás nuestras mejores ofertas en tu correo electrónico.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none bg-white focus:ring-2 focus:ring-emerald-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                Suscribirme
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
