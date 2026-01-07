import type React from "react"
import { Armchair, Car, Luggage, Shield } from "lucide-react"
import { services } from "@/lib/flight-data"
import Link from "next/link"

export function ServicesSection() {
  // Map de iconos para renderizar el correcto según el nombre
  const iconMap: Record<string, React.ReactNode> = {
    Luggage: <Luggage className="w-10 h-10" />,
    Armchair: <Armchair className="w-10 h-10" />,
    Shield: <Shield className="w-10 h-10" />,
    Car: <Car className="w-10 h-10" />,
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Servicios adicionales</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Personaliza tu viaje con nuestros servicios adicionales y disfruta de una experiencia completa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <div key={service.id} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
                {iconMap[service.icon]}
              </div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Link
                href={service.link}
                className="text-black inline-flex items-center font-bold"
              >
                Saber más
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
