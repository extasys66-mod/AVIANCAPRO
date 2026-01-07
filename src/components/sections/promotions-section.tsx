"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { promotions } from "@/lib/flight-data"
import { formatPrice } from "@/lib/format-utils"
import { useRouter } from "next/navigation"

export function PromotionsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  // Auto-rotate promotions every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + promotions.length) % promotions.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % promotions.length)
  }

  const handleReserveNow = (promo: (typeof promotions)[0]) => {
    // Obtener la fecha actual para la salida (formato YYYY-MM-DD)
    const today = new Date()
    const departureDate = today.toISOString().split("T")[0]

    // Calcular fecha de regreso (7 días después)
    const returnDate = new Date(today)
    returnDate.setDate(today.getDate() + 7)
    const returnDateStr = returnDate.toISOString().split("T")[0]

    // Construir los parámetros de búsqueda
    const searchParams = new URLSearchParams()
    searchParams.append("origin", `${getLocationName(promo.origin)} (${promo.origin})`)
    searchParams.append("destination", `${getLocationName(promo.destination)} (${promo.destination})`)
    searchParams.append("departureDate", departureDate)
    searchParams.append("returnDate", returnDateStr)
    searchParams.append("passengers", "1")
    searchParams.append("tripType", "roundTrip")

    // Redirigir a la página de resultados
    router.push(`/resultados?${searchParams.toString()}`)
  }

  // Función auxiliar para obtener el nombre de la ubicación a partir del código
  const getLocationName = (code: string) => {
    const location = promotions.find((p) => p.origin === code || p.destination === code)
    if (location) {
      if (location.origin === code) return location.title.split(" a ")[0]
      if (location.destination === code) return location.title.split(" a ")[1]
    }
    return code === "BOG" ? "Bogotá" : code
  }

  return (
    <section id="promotions" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Ofertas especiales</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre nuestras promociones exclusivas y planifica tu próximo viaje con los mejores precios
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Carousel Controls */}
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            onClick={goToNext}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {promotions.map((promo) => (
                <div key={promo.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row">
                    <div className="md:w-1/2 relative h-64 md:h-auto">
                      <img
                        src={promo.imageUrl || "/placeholder.svg"}
                        alt={promo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        <div className="text-sm text-red-600 font-medium mb-2">Oferta especial</div>
                        <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                        <p className="text-gray-600 mb-4">{promo.description}</p>
                        <div className="flex items-center mb-4">
                          <div className="text-sm text-gray-500">Desde</div>
                          <div className="text-3xl font-bold ml-2">{formatPrice(promo.price)}</div>
                        </div>
                        <div className="text-sm text-gray-500 mb-6">
                          Válido hasta el {new Date(promo.validUntil).toLocaleDateString("es-ES")}
                        </div>
                      </div>
                      <button
                        className="bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition"
                        onClick={() => handleReserveNow(promo)}
                      >
                        Reservar ahora
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {promotions.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-red-500" : "bg-gray-300"}`}
                onClick={() => setCurrentIndex(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
