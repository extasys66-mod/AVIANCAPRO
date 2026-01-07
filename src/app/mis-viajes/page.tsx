"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plane, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { SiteLogo } from "@/components/ui/site-logo"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

type Trip = {
  id: string
  flightNumber: string
  origin: string
  originCode: string
  destination: string
  destinationCode: string
  departureDate: string
  departureTime: string
  arrivalTime: string
  status: "upcoming" | "completed" | "cancelled"
}

export default function MisViajesPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "all">("upcoming")

  useEffect(() => {
    // Redirigir si no está autenticado
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Simular carga de viajes
    const loadTrips = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Obtener vuelos del localStorage
      const purchasedFlights = JSON.parse(localStorage.getItem("purchasedFlights") || "[]")

      // Filtrar solo los vuelos del usuario actual
      const userFlights = purchasedFlights.filter((flight: any) => flight.userEmail === user?.email)

      // Si hay vuelos del usuario, usarlos; de lo contrario, usar datos de ejemplo

        const userTrips: Trip[] = userFlights.map((flight: any) => ({
          id: flight.id,
          flightNumber: flight.flightId,
          origin: flight.origin,
          originCode: flight.origin,
          destination: flight.destination,
          destinationCode: flight.destination,
          departureDate: flight.departureDate,
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
          status: flight.status || "upcoming",
        }))

        setTrips(userTrips)
     
      setLoading(false)
    }

    loadTrips()
  }, [isAuthenticated, router, user?.email])

  // Añadir función para cancelar un vuelo
  const handleCancelFlight = (tripId: string) => {
    // Obtener vuelos del localStorage
    const purchasedFlights = JSON.parse(localStorage.getItem("purchasedFlights") || "[]")

    // Encontrar y actualizar el estado del vuelo a "cancelled"
    const updatedFlights = purchasedFlights.map((flight: any) => {
      if (flight.id === tripId) {
        return { ...flight, status: "cancelled" }
      }
      return flight
    })

    // Guardar vuelos actualizados en localStorage
    localStorage.setItem("purchasedFlights", JSON.stringify(updatedFlights))

    // Actualizar el estado de los viajes en la interfaz
    setTrips(trips.map((trip) => (trip.id === tripId ? { ...trip, status: "cancelled" } : trip)))
  }

  const filteredTrips = trips.filter((trip) => {
    if (activeTab === "all") return true
    return trip.status === activeTab
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!isAuthenticated) {
    return null // La redirección se maneja en el useEffect
  }

  return (
    <main className="min-h-screen bg-gray-50">
     

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-2">Mis viajes</h1>
          <p className="text-gray-600 mb-8">Bienvenido, {user?.name}. Aquí puedes ver todos tus viajes.</p>

          {/* Tabs */}
          <div className="flex border-b mb-8">
            <button
              className={`pb-2 px-4 font-medium ${activeTab === "upcoming" ? "border-b-2 border-red-500 text-red-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Próximos
            </button>
            <button
              className={`pb-2 px-4 font-medium ${activeTab === "completed" ? "border-b-2 border-red-500 text-red-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("completed")}
            >
              Completados
            </button>
            <button
              className={`pb-2 px-4 font-medium ${activeTab === "all" ? "border-b-2 border-red-500 text-red-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("all")}
            >
              Todos
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <Plane className="w-12 h-12 text-red-500 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ) : filteredTrips.length > 0 ? (
            <div className="space-y-6">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className={`border rounded-lg p-6 ${trip.status === "cancelled" ? "border-red-200 bg-red-50" : "border-gray-200"}`}
                >
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center mb-2">
                        <Plane className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="font-medium">Vuelo {trip.flightNumber}</span>
                        {trip.status === "cancelled" && (
                          <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            Cancelado
                          </span>
                        )}
                        {trip.status === "completed" && (
                          <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            Completado
                          </span>
                        )}
                        {trip.status === "upcoming" && (
                          <span className="ml-2 bg-emerald-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            Próximo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mb-2">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                        <span>{formatDate(trip.departureDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                        <span>
                          {trip.origin} ({trip.originCode}) - {trip.destination} ({trip.destinationCode})
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm text-gray-500 mb-1">Hora de salida</div>
                      <div className="text-xl font-bold">{trip.departureTime}</div>
                      <div className="text-sm text-gray-500 mt-2 mb-1">Hora de llegada</div>
                      <div className="text-xl font-bold">{trip.arrivalTime}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {trip.status === "upcoming" && (
                      <>
                        <Link
                          href="/check-in"
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                        >
                          Check-in
                        </Link>
                        <button
                          className="bg-white border border-red-600 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition"
                          onClick={() => router.push("/seleccion-asientos")}
                        >
                          Cambiar vuelo
                        </button>
                        <button
                          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                          onClick={() => router.push("/seleccion-asientos")}
                        >
                          Seleccionar asiento
                        </button>
                        <button
                          className="bg-white border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition"
                          onClick={() => {
                            if (window.confirm("¿Estás seguro de que deseas cancelar este vuelo?")) {
                              handleCancelFlight(trip.id)
                            }
                          }}
                        >
                          Cancelar vuelo
                        </button>
                      </>
                    )}
                    {trip.status === "completed" && (
                      <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                        Ver detalles
                      </button>
                    )}
                    {trip.status === "cancelled" && (
                      <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                        Ver opciones
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 inline-flex rounded-full p-4 mb-4">
                <Plane className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                No hay viajes {activeTab === "upcoming" ? "próximos" : activeTab === "completed" ? "completados" : ""}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === "upcoming"
                  ? "No tienes viajes programados próximamente."
                  : activeTab === "completed"
                    ? "No tienes viajes completados en tu historial."
                    : "No tienes viajes registrados."}
              </p>
              <Link
                href="/"
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition inline-block"
              >
                Buscar vuelos
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
