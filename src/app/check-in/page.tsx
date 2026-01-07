"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, CheckCircle, Search } from "lucide-react"
import Link from "next/link"
import { SiteLogo } from "@/components/ui/site-logo"
import { useAuth } from "@/hooks/use-auth"
import { MainNavigation } from "@/components/layout/main-navigation"

export default function CheckInPage() {
  const { isAuthenticated } = useAuth()
  const [reservationCode, setReservationCode] = useState("")
  const [lastName, setLastName] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Simulamos una pequeña demora para dar sensación de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Validación básica
      if (!reservationCode || !lastName) {
        throw new Error("Por favor complete todos los campos")
      }

      if (reservationCode.length < 6) {
        throw new Error("El código de reserva debe tener al menos 6 caracteres")
      }

      // Simulamos que la búsqueda fue exitosa
      setSearchPerformed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar la reserva")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <MainNavigation />
     
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Check-in online</h1>

          {!searchPerformed ? (
            <>
              <p className="text-gray-600 text-center mb-8">
                Realiza tu check-in desde 48 horas hasta 1 hora antes de la salida de tu vuelo
              </p>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSearch} className="max-w-md mx-auto">
                <div className="mb-4">
                  <label htmlFor="reservationCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Código de reserva
                  </label>
                  <input
                    type="text"
                    id="reservationCode"
                    value={reservationCode}
                    onChange={(e) => setReservationCode(e.target.value.toUpperCase())}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Ej: ABC123"
                    maxLength={6}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido del pasajero
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Ingresa tu apellido"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Buscar reserva
                    </>
                  )}
                </button>

                {!isAuthenticated && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">¿Tienes una cuenta?</p>
                    <Link href="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
                      Inicia sesión para ver tus reservas
                    </Link>
                  </div>
                )}
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle className="h-16 w-16 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">¡Reserva encontrada!</h2>
              <p className="text-gray-600 mb-8">
                Hemos encontrado tu reserva. A continuación puedes realizar el check-in para tu vuelo.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-8">
                <h3 className="font-bold text-lg mb-4 text-left">Detalles del vuelo</h3>
                <div className="text-left space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vuelo:</span>
                    <span className="font-medium">AV 123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium">12 de mayo, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ruta:</span>
                    <span className="font-medium">Bogotá (BOG) - Miami (MIA)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hora de salida:</span>
                    <span className="font-medium">10:30 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pasajero:</span>
                    <span className="font-medium">Juan {lastName}</span>
                  </div>
                </div>
              </div>

              <button className="bg-emerald-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-emerald-700 transition">
                Realizar check-in
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Información importante</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Documentos necesarios</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Documento de identidad o pasaporte válido</li>
                <li>Visas o permisos requeridos para tu destino</li>
                <li>Tarjeta de embarque impresa o en formato digital</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Horarios recomendados</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Vuelos nacionales: llegar 2 horas antes</li>
                <li>Vuelos internacionales: llegar 3 horas antes</li>
                <li>El check-in cierra 1 hora antes de la salida</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
