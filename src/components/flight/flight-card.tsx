"use client"

import { ArrowRight } from "lucide-react"
import type { Flight } from "@/types/flight"
import { formatPrice } from "@/lib/format-utils"
import { useRouter } from "next/navigation"

interface FlightCardProps {
  flight: Flight
  passengers: number
}

export default function FlightCard({ flight, passengers }: FlightCardProps) {
  const router = useRouter()

  const handleSelectFlight = () => {
    // Crear un objeto con la información del vuelo para pasarlo como parámetros
    const flightParams = new URLSearchParams({
      flightId: flight.id,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      duration: flight.duration,
      price: flight.price.toString(),
      passengers: passengers.toString(),
      direct: flight.direct ? "true" : "false",
    })

    // Redirigir a la página de pago con los parámetros del vuelo
    router.push(`/pago?${flightParams.toString()}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex-1 flex flex-col md:flex-row md:items-center">
          <div className="flex items-center justify-between md:w-1/3 mb-4 md:mb-0">
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold">{flight.departureTime}</div>
              <div className="text-sm text-gray-500">{flight.origin}</div>
            </div>

            <div className="flex flex-col items-center mx-4">
              <div className="text-xs text-red-600 font-medium mb-1">{flight.direct ? "Directo" : "1 Escala"}</div>
              <div className="relative w-20 md:w-32">
                <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{flight.duration}</div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-2xl font-bold">{flight.arrivalTime}</div>
              <div className="text-sm text-gray-500">{flight.destination}</div>
            </div>
          </div>

          <div className="hidden md:block md:w-1/3 text-center">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">
              {flight.direct ? "Vuelo directo" : "1 escala"}
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 md:w-1/3 flex flex-row justify-between md:justify-center  md:flex-col items-end">
        <section className="flex flex-col">
        <div className="text-sm text-gray-500">Desde</div>
          <div className="text-2xl font-bold">{formatPrice(flight.price)}</div>
          <div className="text-xs text-gray-500">
            {passengers > 1 ? `${formatPrice(flight.price * passengers)} total` : "por persona"}
          </div>
        </section>
     
          <button
            className="mt-3 bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-2 text-sm font-medium transition"
            onClick={handleSelectFlight}
          >
            Seleccionar
          </button>
        </div>
      </div>
    </div>
  )
}
