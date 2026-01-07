"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Search, Plane } from "lucide-react"
import Link from "next/link"
import { SiteLogo } from "@/components/ui/site-logo"
import { MainNavigation } from "@/components/layout/main-navigation"

export default function EstadoVueloPage() {
  const [flightNumber, setFlightNumber] = useState("")
  const [date, setDate] = useState("")
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
      if (!flightNumber || !date) {
        throw new Error("Por favor complete todos los campos")
      }

      // Simulamos que la búsqueda fue exitosa
      setSearchPerformed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al buscar el vuelo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <MainNavigation />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Estado del vuelo</h1>

          {!searchPerformed ? (
            <>
              <p className="text-gray-600 text-center mb-8">
                Consulta el estado actual de tu vuelo ingresando el número de vuelo y la fecha
              </p>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSearch} className="max-w-md mx-auto">
                <div className="mb-4">
                  <label htmlFor="flightNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Número de vuelo
                  </label>
                  <input
                    type="text"
                    id="flightNumber"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Ej: AV123"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha del vuelo
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
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
                      Buscar vuelo
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div>
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Vuelo {flightNumber}</h2>
                    <p className="text-gray-600">
                      {new Date(date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="bg-emerald-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    En horario
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-4">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <div className="text-sm text-gray-500">Origen</div>
                    <div className="text-xl font-bold">BOG</div>
                    <div className="text-gray-700">Bogotá</div>
                    <div className="text-red-600 font-medium">10:30 AM</div>
                  </div>

                  <div className="flex flex-col items-center mb-4 md:mb-0">
                    <div className="text-sm text-gray-500 mb-1">Duración</div>
                    <div className="relative w-24 md:w-32">
                      <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
                      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                        <Plane className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">3h 45m</div>
                  </div>

                  <div className="text-center md:text-right">
                    <div className="text-sm text-gray-500">Destino</div>
                    <div className="text-xl font-bold">MIA</div>
                    <div className="text-gray-700">Miami</div>
                    <div className="text-red-600 font-medium">2:15 PM</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-bold text-lg mb-4">Información del vuelo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Terminal:</span>
                    <span className="font-medium">Terminal 1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Puerta:</span>
                    <span className="font-medium">B12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Embarque:</span>
                    <span className="font-medium">9:45 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="font-medium text-red-600">En horario</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aeronave:</span>
                    <span className="font-medium">Airbus A320</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Última actualización:</span>
                    <span className="font-medium">Hace 15 minutos</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button className="bg-red-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-red-700 transition">
                  Recibir actualizaciones
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
          <h2 className="text-2xl font-bold mb-6">Información de aeropuertos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Aeropuerto El Dorado (BOG)</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Dirección: Av. El Dorado, Bogotá, Colombia</li>
                <li>Teléfono: +57 1 2662000</li>
                <li>Sitio web: eldorado.aero</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Aeropuerto de Miami (MIA)</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Dirección: 2100 NW 42nd Ave, Miami, FL 33126, EE. UU.</li>
                <li>Teléfono: +1 305-876-7000</li>
                <li>Sitio web: miami-airport.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
