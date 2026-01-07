"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { formatPrice } from "@/lib/format-utils"

// Definir tipos para las ofertas
type OfferDestination = {
  city: string
  code: string
  price: number
  imageUrl: string
}

type OriginOffers = {
  origin: string
  originCode: string
  destinations: OfferDestination[]
}

// Datos de ofertas por ciudad de origen
const offersData: OriginOffers[] = [
  {
    origin: "Bogotá",
    originCode: "BOG",
    destinations: [
      {
        city: "Medellín",
        code: "MDE",
        price: 198000,
        imageUrl: "/medellin.jpg",
      },
      {
        city: "Cartagena",
        code: "CTG",
        price: 245000,
        imageUrl: "/cartagena.jpg",
      },
      {
        city: "San Andrés",
        code: "ADZ",
        price: 320000,
        imageUrl: "/sanAndres.jpg",
      },
    ],
  },
  {
    origin: "Medellín",
    originCode: "MDE",
    destinations: [
      {
        city: "Bogotá",
        code: "BOG",
        price: 195000,
        imageUrl: "https://es.investinbogota.org/wp-content/uploads/2022/09/bogota-recibio-60-proyectos-de-inversion-scaled.jpg",
      },
      {
        city: "Cali",
        code: "CLO",
        price: 210000,
        imageUrl: "https://i0.wp.com/passporterapp.com/es/blog/wp-content/uploads/2021/10/ciudad-de-cali-colombia-1024x691.jpg?resize=1024%2C691&ssl=1",
      },
      {
        city: "Barranquilla",
        code: "BAQ",
        price: 280000,
        imageUrl: "https://probarranquilla.org/wp-content/uploads/2022/10/Banner-barranquilla5.jpg",
      },
    ],
  },
  {
    origin: "Armenia",
    originCode: "AXM",
    destinations: [
      {
        city: "Bogotá",
        code: "BOG",
        price: 211100,
        imageUrl: "https://es.investinbogota.org/wp-content/uploads/2022/09/bogota-recibio-60-proyectos-de-inversion-scaled.jpg",
      },
      {
        city: "Medellín",
        code: "MDE",
        price: 218700,
        imageUrl: "/medellin.jpg",
      },
      {
        city: "Montería",
        code: "MTR",
        price: 243000,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/Ronda_del_Sin%C3%BA.jpg",
      },
    ],
  },
  {
    origin: "Cali",
    originCode: "CLO",
    destinations: [
      {
        city: "Bogotá",
        code: "BOG",
        price: 205000,
        imageUrl: "https://i0.wp.com/passporterapp.com/es/blog/wp-content/uploads/2021/10/ciudad-de-cali-colombia-1024x691.jpg?resize=1024%2C691&ssl=1",
      },
      {
        city: "Medellín",
        code: "MDE",
        price: 215000,
        imageUrl: "/medellin.jpg",
      },
      {
        city: "San Andrés",
        code: "ADZ",
        price: 350000,
        imageUrl: "/sanAndres.jpg",
      },
    ],
  },
]

export function OffersSection() {
  const router = useRouter()
  const [selectedOrigin, setSelectedOrigin] = useState("Armenia")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Encontrar las ofertas para el origen seleccionado
  const currentOffers = offersData.find((offer) => offer.origin === selectedOrigin) || offersData[2] // Default to Armenia

  // Manejar el cambio de origen
  const handleOriginChange = (origin: string) => {
    setSelectedOrigin(origin)
    setIsDropdownOpen(false)
  }

  // Manejar clic en un destino
  const handleDestinationClick = (destination: OfferDestination) => {
    // Obtener la fecha actual para la salida (formato YYYY-MM-DD)
    const today = new Date()
    const departureDate = today.toISOString().split("T")[0]

    // Calcular fecha de regreso (7 días después)
    const returnDate = new Date(today)
    returnDate.setDate(today.getDate() + 7)
    const returnDateStr = returnDate.toISOString().split("T")[0]

    // Construir los parámetros de búsqueda
    const searchParams = new URLSearchParams()
    searchParams.append("origin", `${currentOffers.origin} (${currentOffers.originCode})`)
    searchParams.append("destination", `${destination.city} (${destination.code})`)
    searchParams.append("departureDate", departureDate)
    searchParams.append("returnDate", returnDateStr)
    searchParams.append("passengers", "1")
    searchParams.append("tripType", "roundTrip")

    // Redirigir a la página de resultados
    router.push(`/resultados?${searchParams.toString()}`)
  }

  return (
    <section className="py-16 bg-[#F9FAFB]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-10">
          <h2 className="text-3xl font-bold">Ofertas desde</h2>
          <div className="relative ml-2">
            <button
              className="text-3xl font-bold text-cyan-600 flex items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedOrigin}
              <ChevronDown className={`ml-1 w-6 h-6 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                {offersData.map((offer) => (
                  <button
                    key={offer.origin}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${offer.origin === selectedOrigin ? "text-cyan-600 font-medium" : "text-gray-700"}`}
                    onClick={() => handleOriginChange(offer.origin)}
                  >
                    {offer.origin}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {currentOffers.destinations.map((destination) => (
    <div
      key={destination.code}
      className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer h-60 group"
      onClick={() => handleDestinationClick(destination)}
    >
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={destination.imageUrl}
          alt={destination.city}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Overlay oscuro semi-transparente */}
     
      
      {/* Contenido con fondo difuminado */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-white/30 backdrop-blur-xs ">
        <div className="bg-white text-black py-2 px-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold ">{destination.city}</h3>
              <p className="text-xs ">Por tranyecto desde</p>
            </div>
            <p className="text-xl font-bold ">COP {formatPrice(destination.price)}</p>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

        <div className="flex justify-end mt-8">
          <button className="flex items-center text-cyan-600 font-medium hover:text-cyan-700 transition unde">
            Descubrir más ofertas
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
