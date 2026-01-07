"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronDown, Plane, ChevronRight, ChevronUp, ChevronLeft, PlaneTakeoff, Check } from "lucide-react"
import { SiteLogo } from "@/components/ui/site-logo"
import { generateRandomFlights } from "@/lib/flight-utils"
import type { Flight } from "@/types/flight"
import Image from "next/image";
import Link from "next/link";


export default function ResultadosPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [outboundFlights, setOutboundFlights] = useState<Flight[]>([])
  const [returnFlights, setReturnFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedFlight, setExpandedFlight] = useState<string | null>(null)
  const [expandedFaresFlight, setExpandedFaresFlight] = useState<string | null>(null)
  const [showFareConditions, setShowFareConditions] = useState(false)


  // Estado para los vuelos seleccionados (ida y vuelta)
  const [selectedOutbound, setSelectedOutbound] = useState<{ flightId: string; fareType: string } | null>(null)
  const [selectedReturn, setSelectedReturn] = useState<{ flightId: string; fareType: string } | null>(null)

  // Estado para controlar qué tipo de vuelos se están mostrando
  const [activeTab, setActiveTab] = useState<"outbound" | "return" >("outbound")

  // Estados para controlar la visualización de todos los vuelos (para edición)
  const [showOutboundFlights, setShowOutboundFlights] = useState(true)
  const [showReturnFlights, setShowReturnFlights] = useState(false)

  const origin = searchParams.get("origin") || ""
  const destination = searchParams.get("destination") || ""
  const departureDate = searchParams.get("departureDate") || ""
  const returnDate = searchParams.get("returnDate") || ""
  const passengers = Number.parseInt(searchParams.get("passengers") || "1")
  const tripType = searchParams.get("tripType") || "roundTrip"

  // Extraer códigos de aeropuerto
  const originCode = origin.match(/$$([^)]+)$$/)?.[1] || "BOG"
  const destinationCode = destination.match(/$$([^)]+)$$/)?.[1] || "MDE"

  // Extraer nombres de ciudades
  const originCity = origin.split(" (")[0] || "Bogotá"
  const destinationCity = destination.split(" (")[0] || "Medellín"

  useEffect(() => {
    if (!origin || !destination || typeof window === "undefined") {
      router.push("/")
      return
    }

    // Generar vuelos aleatorios
    setLoading(true)

    // Usar un ID determinista para la misma búsqueda
    const outboundSearchId = `${origin}-${destination}-${departureDate}-${passengers}`
    const outboundSeed = hashCode(outboundSearchId)

    // Solo generar vuelos de vuelta si es un viaje de ida y vuelta
    const isRoundTrip = tripType === "roundTrip" && returnDate

    setTimeout(() => {
      // Generar vuelos de ida
      const generatedOutboundFlights = generateRandomFlights(
        origin,
        destination,
        departureDate,
        passengers,
        5,
        outboundSeed,
      ).map(flight => ({
        ...flight,
        price: Math.floor(Math.random() * (150000 - 49900 + 1)) + 49900,
      }))
      setOutboundFlights(generatedOutboundFlights)

      // Generar vuelos de vuelta si es necesario
      if (isRoundTrip) {
        const returnSearchId = `${destination}-${origin}-${returnDate}-${passengers}`
        const returnSeed = hashCode(returnSearchId)

        const generatedReturnFlights = generateRandomFlights(
          destination,
          origin,
          returnDate || "",
          passengers,
          5,
          returnSeed,
        ).map(flight => ({
          ...flight,
          price: Math.floor(Math.random() * (150000 - 49900 + 1)) + 49900,
        }))
        setReturnFlights(generatedReturnFlights)
      }

      setLoading(false)
    }, 2500)
  }, [origin, destination, departureDate, returnDate, passengers, router, tripType])

  // Función para generar un hash determinista
  function hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""

    // Extraer año, mes y día directamente del string para evitar problemas de zona horaria
    const [year, month, day] = dateString.split("-").map((num) => Number.parseInt(num, 10))

    // Crear una fecha con la hora establecida a mediodía para evitar problemas de zona horaria
    const date = new Date(year, month - 1, day, 12, 0, 0)

    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  const formatShortDate = (dateString: string) => {
    if (!dateString) return ""
    const [year, month, day] = dateString.split("-").map((num) => Number.parseInt(num, 10))
    const date = new Date(year, month - 1, day, 12, 0, 0)
    return date.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleSelectFlight = (flight: Flight) => {
    if (expandedFaresFlight === flight.id) {
      setExpandedFaresFlight(null)
    } else {
      setExpandedFaresFlight(flight.id)
      // Cerrar cualquier otro vuelo expandido
      if (expandedFaresFlight && expandedFaresFlight !== flight.id) {
        setExpandedFaresFlight(null)
      }
    }
  }

  const handleSelectFare = (flightId: string, fareType: string) => {
    // Determinar si estamos seleccionando un vuelo de ida o de vuelta
    window.scrollTo(0, 0)
    if (activeTab === "outbound") {
      setSelectedOutbound({ flightId, fareType })

      // Ocultar los vuelos de ida después de seleccionar
      setTimeout(() => {
        setShowOutboundFlights(false)

        // Si es ida y vuelta y aún no se ha seleccionado el vuelo de vuelta, cambiar a la pestaña de vuelta
        if (tripType === "roundTrip" && returnDate && !selectedReturn) {
          setActiveTab("return")
          setShowReturnFlights(true)
        } else if (tripType !== "roundTrip" || !returnDate) {
          // Si es solo ida, continuar directamente
          handleContinue()
        }
      }, 500)
    } else {
      setSelectedReturn({ flightId, fareType })

      // Ocultar los vuelos de vuelta después de seleccionar
      setTimeout(() => {
        setShowReturnFlights(false)
      }, 500)
    }
  }

  const handleContinue = () => {
    // Para vuelos de ida y vuelta, verificar que ambos vuelos estén seleccionados
    if (tripType === "roundTrip" && returnDate) {
      if (!selectedOutbound || !selectedReturn) return
    } else {
      // Para vuelos solo de ida, verificar que el vuelo de ida esté seleccionado
      if (!selectedOutbound) return
    }

    // Obtener los objetos de vuelo seleccionados
    const outboundFlightObj = outboundFlights.find((f) => f.id === selectedOutbound?.flightId)
    if (!outboundFlightObj) return

    // Crear parámetros para la página de servicios
    const flightParams = new URLSearchParams({
      outboundFlightId: outboundFlightObj.id,
      outboundOrigin: origin,
      outboundDestination: destination,
      outboundDepartureTime: outboundFlightObj.departureTime,
      outboundArrivalTime: outboundFlightObj.arrivalTime,
      outboundDuration: outboundFlightObj.duration,
      outboundDepartureDate: departureDate,
      outboundReturn: returnDate,
      outboundPrice: outboundFlightObj.price.toString(),
      outboundFareType: selectedOutbound?.fareType || "",
      passengers: passengers.toString(),
      tripType: tripType,
    })

    // Añadir información del vuelo de vuelta si es necesario
    if (tripType === "roundTrip" && returnDate && selectedReturn) {
      const returnFlightObj = returnFlights.find((f) => f.id === selectedReturn?.flightId)
      if (returnFlightObj) {
        flightParams.append("returnFlightId", returnFlightObj.id)
        flightParams.append("returnOrigin", returnFlightObj.origin)
        flightParams.append("returnDestination", returnFlightObj.destination)
        flightParams.append("returnDepartureTime", returnFlightObj.departureTime)
        flightParams.append("returnArrivalTime", returnFlightObj.arrivalTime)
        flightParams.append("returnDuration", returnFlightObj.duration)
        flightParams.append("returndepartureDate", departureDate)
        flightParams.append("returnreturnDate",returnDate )
        flightParams.append("returnPrice", returnFlightObj.price.toString())
        flightParams.append("returnFareType", selectedReturn?.fareType || "")
      }
    }

    // Redirigir a la página de pasajeros
    router.push(`/pasajeros?${flightParams.toString()}`)
  }

  const toggleFlightDetails = (flightId: string) => {
    if (expandedFlight === flightId) {
      setExpandedFlight(null)
    } else {
      setExpandedFlight(flightId)
    }
  }

  // Generar fechas para el selector de fechas
  const generateDateOptions = (baseDate: string) => {
    if (!baseDate) return []

    const [year, month, day] = baseDate.split("-").map(Number)
    const currentDate = new Date(year, month - 1, day)

    const dates = []

    // Añadir 2 días antes y 4 después
    for (let i = -2; i <= 4; i++) {
      const date = new Date(currentDate)
      date.setDate(currentDate.getDate() + i)

      const dateString = date.toISOString().split("T")[0]
      const dayName = date.toLocaleDateString("es-ES", { weekday: "short" }).slice(0, 3)
      const dayNumber = date.getDate()
      const monthName = date.toLocaleDateString("es-ES", { month: "short" }).slice(0, 3)

      dates.push({
        date: dateString,
        dayName,
        dayNumber,
        monthName,
        price: Math.floor(Math.random() * (150000 - 49900 + 1)) + 49900,
        isSelected: dateString === baseDate,
      })
    }

    return dates
  }

  const handleDateChange = (newDate: string, isReturn = false) => {
    // Actualizar la URL con la nueva fecha
    const params = new URLSearchParams(searchParams.toString())

    if (isReturn) {
      params.set("returnDate", newDate)
    } else {
      params.set("departureDate", newDate)
    }

    // Redirigir a la misma página con la nueva fecha
    router.push(`/resultados?${params.toString()}`)
  }

  const outboundDateOptions = generateDateOptions(departureDate)
  const returnDateOptions = generateDateOptions(returnDate || "")

  // Calcular el precio total de los vuelos seleccionados
  const calculateTotalPrice = () => {
    let total = 0

    if (selectedOutbound) {
      const outboundFlight = outboundFlights.find((f) => f.id === selectedOutbound.flightId)
      if (outboundFlight) {
        let price = outboundFlight.price
        // Aplicar multiplicador según la tarifa
        if (selectedOutbound.fareType === "classic") {
          price = Math.round(price * 1.25)
        } else if (selectedOutbound.fareType === "flex") {
          price = Math.round(price * 1.45)
        }
        total += price
      }
    }

    if (selectedReturn) {
      const returnFlight = returnFlights.find((f) => f.id === selectedReturn.flightId)
      if (returnFlight) {
        let price = returnFlight.price
        // Aplicar multiplicador según la tarifa
        if (selectedReturn.fareType === "classic") {
          price = Math.round(price * 1.25)
        } else if (selectedReturn.fareType === "flex") {
          price = Math.round(price * 1.45)
        }
        total += price
      }
    }

    return total
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <img src="/loading.gif" alt="Cargando..." className="w-32 h-32 mx-auto" />
        </div>
      </div>
    )
  }

  // Determinar qué vuelos mostrar según la pestaña activa
  const currentFlights = activeTab === "outbound" ? outboundFlights : returnFlights
  const currentSelectedFare = activeTab === "outbound" ? selectedOutbound : selectedReturn

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm hidden md:block">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <button className="mr-4 text-gray-600" onClick={() => router.push("/")}>
                <SiteLogo />
              </button>

              <div className="hidden md:block">
                <div className="text-center flex flex-col">
                  <div className="flex">
                    <h1 className="text-lg font-bold">
                      {originCity} a {destinationCity}
                    </h1>
                  </div>
                  <div className="flex">
                    <section className="flex items-center gap-x-2 mt-2">
                      <p className="flex items-center gap-x-2">
                        <PlaneTakeoff width={20} color="black" /> {formatShortDate(departureDate)}
                      </p>
                      {tripType === "roundTrip" && returnDate && (
                        <p className="flex items-center gap-x-2">
                          <PlaneTakeoff width={20} color="black" className="scale-x-[-1]" />
                          {formatShortDate(returnDate)}
                        </p>
                      )}
                      <p> {` • ${passengers} ${passengers === 1 ? "adulto" : "adultos"}`}</p>
                    </section>

                    <button
                      className="ml-2 text-[#104A50] text-sm hover:text-[#104A50]/20 flex items-center font-black"
                      onClick={() => {
                        // Redirigir a la página principal con los parámetros actuales
                        const params = new URLSearchParams()
                        params.set("origin", origin)
                        params.set("destination", destination)
                        params.set("departureDate", departureDate)
                        if (tripType === "roundTrip" && returnDate) {
                          params.set("returnDate", returnDate)
                        }
                        params.set("passengers", passengers.toString())
                        params.set("tripType", tripType)
                        router.push(`/?${params.toString()}`)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button className="bg-white border-2 border-black rounded-full px-16 py-2 text-sm font-medium flex items-center">
                COP {calculateTotalPrice().toLocaleString("es-CO")}
              </button>
            </div>
          </div>
        </div>
      </header>

      <header className="bg-zinc-900 shadow-sm flex items-center justify-start  md:hidden  ">
        <Link href="/" className="p-2">
        <Image src='/logomovil.svg' alt="logo" width={80} height={20} className="w-auto h-auto" />
        </Link>
     
      </header>

      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center text-sm mb-4 overflow-x-auto whitespace-nowrap ">
          <div className="flex items-center text-black font-medium">
            <span className="mr-2">Vuelos</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-gray-400">
            <span className="mx-2">Pasajeros</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-gray-400">
            <span className="mx-2">Servicios</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-gray-400">
            <span className="mx-2">Asientos</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-gray-400">
            <span className="mx-2">Pago</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-gray-400">
            <span className="mx-2">Confirmación</span>
          </div>
        </div>

        <section className="w-full bg-white flex md:hidden mb-5  px-3 py-2 rounded-lg ">
            <div className="w-full text-center flex flex-col ">
                  <div className=" flex justify-between">
                    <h1 className="text-lg font-bold">
                      {originCity} a {destinationCity}
                    </h1>
                    <article className="flex items-center bg-[#104A50] p-2 rounded-full ">
                      <button
                      className="ml-2  text-white rounded-full text-sm flex items-center font-black"
                      onClick={() => {
                        // Redirigir a la página principal con los parámetros actuales
                        const params = new URLSearchParams()
                        params.set("origin", origin)
                        params.set("destination", destination)
                        params.set("departureDate", departureDate)
                        if (tripType === "roundTrip" && returnDate) {
                          params.set("returnDate", returnDate)
                        }
                        params.set("passengers", passengers.toString())
                        params.set("tripType", tripType)
                        router.push(`/?${params.toString()}`)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      
                    </button>
                    </article>
                    
                  </div>
                  <div className="flex justify-between ">
                    <section className="flex flex-col md:flex-row  gap-x-2 mt-2">
                      <div className="flex items-center gap-x-2">
                    <p className="text-xs md:text-normal flex items-center gap-x-2">
                        <PlaneTakeoff width={20} color="black" /> {formatShortDate(departureDate)}
                      </p>
                      {tripType === "roundTrip" && returnDate && (
                        <p className="flex items-center gap-x-2 text-xs md:text-normal">
                          <PlaneTakeoff width={20} color="black" className="scale-x-[-1]" />
                          {formatShortDate(returnDate)}
                        </p>
                      )}
                      </div>

                      <div className="flex justify-start">
                      <p> {` • ${passengers} ${passengers === 1 ? "adulto" : "adultos"}`}</p>
                      </div>
                     
                    </section>
                      <section className="flex-1 md:flex justify-end hidden ">
                        <button
                      className="ml-2 text-[#104A50] text-sm hover:text-[#104A50]/20 flex items-center font-black"
                      onClick={() => {
                        // Redirigir a la página principal con los parámetros actuales
                        const params = new URLSearchParams()
                        params.set("origin", origin)
                        params.set("destination", destination)
                        params.set("departureDate", departureDate)
                        if (tripType === "roundTrip" && returnDate) {
                          params.set("returnDate", returnDate)
                        }
                        params.set("passengers", passengers.toString())
                        params.set("tripType", tripType)
                        router.push(`/?${params.toString()}`)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      Editar
                    </button>
                      </section>
                  
                  </div>
                </div>
        </section>

        {/* Pestañas para seleccionar ida o vuelta - siempre visibles para ida y vuelta */}
      
        {tripType === "roundTrip" && returnDate && (
          <div className=" mb-6 border-b hidden">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "outbound"
                  ? "border-b-2 border-cyan-600 text-cyan-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("outbound")
                if (selectedOutbound) {
                  setShowOutboundFlights(false)
                } else {
                  setShowOutboundFlights(true)
                }
                setShowReturnFlights(false)
              }}
            >
              <div className="flex items-center">
                <Plane className="w-4 h-4 mr-2 transform -rotate-45" />
                Ida: {originCity} a {destinationCity}
                {selectedOutbound && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    Seleccionado
                  </span>
                )}
              </div>
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "return"
                  ? "border-b-2 border-cyan-600 text-cyan-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => {
                setActiveTab("return")
                setShowOutboundFlights(false)
                if (selectedReturn) {
                  setShowReturnFlights(false)
                } else {
                  setShowReturnFlights(true)
                }
              }}
            >
              <div className="flex items-center">
                <Plane className="w-4 h-4 mr-2 transform rotate-135" />
                Vuelta: {destinationCity} a {originCity}
                {selectedReturn && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    Seleccionado
                  </span>
                )}
              </div>
            </button>
          </div>
        )}

        {/* Vista de vuelos seleccionados y/o todos los vuelos */}
        <div className="space-y-6 mb-6">
          {/* Vuelo de ida */}
          {selectedOutbound && !showOutboundFlights ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <h2 className="text-lg font-mediumn flex flex-col">
                  <span>Ida:</span>
                  <span className="flex items-center gap-x-2 font-black"><PlaneTakeoff width={20} color="black" />   {originCity} a {destinationCity}</span>
                 
                  </h2>
                </div>
                
              </div>

              <div className="w-full flex flex-col bg-white rounded-3xl border border-green-500 overflow-hidden">
                   
                   <section className="w-full flex justify-end ">
                    <button className="w-[50%] md:w-[30%] bg-green-500 rounded-bl-3xl px-3 py-1 text-white text-sm font-medium transition">
                      <p className="flex items-center gap-x-2 text-xs md:text-base">
                        <Check />
                        Vuelo seleccionado</p>
                    </button>
                   </section>
                     <section className="py-2 px-4 flex justify-between">  
                      <div className="text-sm text-black mb-1">{formatShortDate(departureDate)}</div>
                      <button
                  className="text-cyan-600 text-sm hover:text-cyan-800 flex items-center"
                  onClick={() => {
                    setActiveTab("outbound")
                    setExpandedFaresFlight(null)
                    setShowOutboundFlights(true)
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Editar selección
                </button>
                      </section>
                    <article className="w-full flex">
                    <div className="w-[20%] md:w-[10%] flex flex-col justify-center items-center py-4">
                     
                      <div className="text-xl md:text-3xl font-bold">
                        {outboundFlights.find((f) => f.id === selectedOutbound.flightId)?.departureTime}
                      </div>
                      <div className="font-bold">
                        {outboundFlights.find((f) => f.id === selectedOutbound.flightId)?.origin}
                      </div>
                    </div>

                    <div className="w-[60%] md:w-[70%]  flex flex-col justify-center items-center py-4">
                      <div className="text-xs flex gap-x-2 text-blue-600 font-medium mb-1">
                        <p className="text-cyan-600 underline cursor-pointer">Directo</p>
                        <p className="text-black">|</p>
                        <p className="text-gray-500">
                          {outboundFlights.find((f) => f.id === selectedOutbound.flightId)?.duration}
                        </p>
                      </div>
                      <div className="relative w-full flex items-center">
                        <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full z-10"></div>
                        <div className="flex-1 border-t border-dotted border-black"></div>
                        <div className="mx-2 text-black rotate-45">
                          <Plane />
                        </div>
                        <div className="flex-1 border-t border-dotted border-black"></div>
                        <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full z-10"></div>
                      </div>
                      <div className="text-sm bg-gray-50 text-gray-800 mt-1 px-3 py-1 rounded-lg">
                        Operado por Avianca
                      </div>
                    </div>

                    <div className="w-[20%] md:w-[10%] flex justify-center items-center py-4">
                      <section className="flex flex-col items-center gap-x-2 mt-2">
                    <div className="text-xl md:text-3xl font-bold">
                        {outboundFlights.find((f) => f.id === selectedOutbound.flightId)?.arrivalTime}
                      </div>
                      <div className="font-bold">
                        {outboundFlights.find((f) => f.id === selectedOutbound.flightId)?.destination}
                      </div>
                      </section>
                    </div>

                  
                  <div className="w-[10%] hidden md:flex  flex-col justify-center items-center py-4 ">
                      <section className="flex items-center gap-x-2 mt-2">
                           <div className="text-sm">COP</div>
                      <div className="text-xl font-bold">
                        {(() => {
                          const flight = outboundFlights.find((f) => f.id === selectedOutbound.flightId)
                          if (!flight) return 0
                          let price = flight.price
                          if (selectedOutbound.fareType === "classic") price *= 1.25
                          if (selectedOutbound.fareType === "flex") price *= 1.45
                          return Math.round(price).toLocaleString("es-CO")
                        })()}
                      </div>

                      </section>
                       <div className="inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                        {selectedOutbound.fareType}
                      </div>
                  </div>
              </article>

               <div className=" flex md:hidden  flex-row justify-center items-center py-4  gap-x-2">
                      <section className="flex items-center gap-x-2 ">
                           <div className="text-sm">COP</div>
                      <div className="text-xl font-bold">
                        {(() => {
                          const flight = outboundFlights.find((f) => f.id === selectedOutbound.flightId)
                          if (!flight) return 0
                          let price = flight.price
                          if (selectedOutbound.fareType === "classic") price *= 1.25
                          if (selectedOutbound.fareType === "flex") price *= 1.45
                          return Math.round(price).toLocaleString("es-CO")
                        })()}
                      </div>

                      </section>
                       <div className="inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                        {selectedOutbound.fareType}
                      </div>
                </div>
              </div>
            </div>
          ) : (
            activeTab === "outbound" && (
              <>
                {/* Título para vuelos de ida */}
                <div className="flex items-center mb-4">
                 
                  <h2 className="text-lg font-mediumn flex flex-col">
                    <span>Ida:</span>
                     <span className="flex items-center gap-x-2 font-black"><PlaneTakeoff width={20} color="black" /> {originCity} a {destinationCity}</span>
                  </h2>
                </div>

                {/* Date selector */}
                <div className="relative mb-6 overflow-hidden">
                  <div className="flex overflow-x-auto pb-2 -mx-2 px-4">
                    {(activeTab === "outbound" ? outboundDateOptions : returnDateOptions).map((dateOption, index) => (
                      <div key={index} className={`flex-shrink-0 md:px-2 w-1/3 sm:w-1/5 md:w-1/7`}>
                        <div
                          className={`rounded-2xl p-3 text-center cursor-pointer ${
                            dateOption.isSelected ? "border border-green-500 bg-white" : ""
                          }`}
                          onClick={() => handleDateChange(dateOption.date,  activeTab as "outbound" | "return" === "return")}
                        >
                          <div className="text-black">
                            {dateOption.dayName}. {dateOption.dayNumber} {dateOption.monthName}.
                          </div>
                          <div className={`${dateOption.isSelected ? "font-black" : "text-sm font-medium"}`}>
                            COP <span className="text-lg">{dateOption.price.toLocaleString("es-CO")}</span>{" "}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-1 z-10 " >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-1 z-10">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Flight cards */}
                <div className="space-y-4 mb-6">
                  {currentFlights.map((flight) => (
                    <div key={flight.id} className="bg-white rounded-3xl shadow-sm overflow-hidden">
                      {/* Flight info */}
                      <div className="">
                        <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
                          {/* Flight times and route */}
                          <div className="w-full md:w-[80%] flex items-center justify-between md:mb-0 px-7 py-6">
                            
                            <div className="w-[10%]  text-center ">
                              <div className="text-xl md:text-3xl font-bold">{flight.departureTime}</div>
                              <div className="text-lg font-bold">{flight.origin}</div>
                            </div>

                            <div className="w-[80%]  flex-1 flex flex-col items-center mx-4 px-5 md:px-10 ">
                              <div className="text-xs flex gap-x-2 text-blue-600 font-medium mb-1">
                                <p className="text-cyan-600 underline cursor-pointer">Directo</p>
                                <p className="text-black">|</p>
                                <p className="text-gray-500">{flight.duration}</p>
                              </div>
                              <div className="relative w-full flex items-center">
                                <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full z-10"></div>
                                <div className="flex-1 border-t border-dotted border-black"></div>
                                <div className="mx-2 text-black rotate-45">
                                  <Plane />
                                </div>
                                <div className="flex-1 border-t border-dotted border-black"></div>
                                <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full z-10"></div>
                              </div>

                              <div className="text-sm bg-gray-50 text-gray-800 mt-1 px-3 py-2 rounded-lg">
                                Operado por avianca
                              </div>
                            </div>

                            <div className="w-[10%] text-center ">
                              <div className="text-xl md:text-3xl font-bold">{flight.arrivalTime}</div>
                              <div className="font-bold">{flight.destination}</div>
                            </div>
                          </div>

                          {/* Operator and price */}
                          <div className="md:w-[20%] bg-gray-50 flex flex-col md:flex-row md:items-center justify-between py-6">
                            <div className="text-center md:text-start px-5 ">
                              <div className="text-xs text-gray-500 text-center">Desde</div>
                              <section className="flex items-center gap-x-2 py-4 justify-center">
                                <div className="text-3xl md:text-2xl font-bold">
                                  <span className="text-sm ">COP</span> {flight.price.toLocaleString("es-CO")}
                                </div>
                                <button
                                  className="mt-2 text-white rounded-full py-2 text-sm font-medium transition"
                                  onClick={() => handleSelectFlight(flight)}
                                >
                                  {expandedFaresFlight === flight.id ? (
                                    <ChevronUp className="w-6 h-6 text-black font-bold" />
                                  ) : (
                                    <ChevronDown className="w-6 h-6 text-black font-bold" />
                                  )}
                                </button>
                              </section>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded fares */}
                      {expandedFaresFlight === flight.id && (
                        <div className="p-4 hidden md:block">
                          <h3 className="text-2xl mb-4 text-center font-black ">Elige cómo quieres volar</h3>

                          {/* Fare options */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {/* Basic fare */}
                            <div
                              className={`shadow-2xl rounded-2xl overflow-hidden ${
                                currentSelectedFare?.flightId === flight.id && currentSelectedFare?.fareType === "basic"
                                  ? "border-2 border-red-600"
                                  : ""
                              }`}
                            >
                              <div className="bg-white p-4">
                                <div className="text-center mb-4">
                                  <h4 className="text-red-600 font-bold">basic</h4>
                                  <p className="text-xs text-gray-500">Tarifa ligera</p>
                                  <div className="text-xl font-bold text-red-600 mt-2">
                                    COP {flight.price.toLocaleString("es-CO")}
                                  </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                  <div className="flex items-start">
                                    <div className="text-red-600 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 artículo personal (bolso)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Acumula 2 Millas por cada USD</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Equipaje de mano (10 kg)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Equipaje de bodega (23 kg)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Check-in en aeropuerto</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Selección de asiento</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Menú a bordo</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Cambios (antes del vuelo)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Reembolsos</div>
                                  </div>
                                </div>

                                <button
                                  className="w-full bg-red-600 text-white rounded-lg py-3 font-medium hover:bg-red-700 transition"
                                  onClick={() => handleSelectFare(flight.id, "basic")}
                                >
                                  Seleccionar
                                </button>
                                <div className="text-xs text-center text-gray-500 mt-2">*Precio por pasajero</div>
                              </div>
                            </div>

                            {/* Classic fare */}
                            <div
                              className={`border-2 border-purple-600 rounded-lg overflow-hidden relative ${
                                currentSelectedFare?.flightId === flight.id &&
                                currentSelectedFare?.fareType === "classic"
                                  ? "border-2 border-purple-600"
                                  : ""
                              }`}
                            >
                              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                                RECOMENDADO
                              </div>
                              <div className="bg-white p-4">
                                <div className="text-center mb-4">
                                  <h4 className="text-purple-600 font-bold">classic</h4>
                                  <p className="text-xs text-gray-500">Más completo</p>
                                  <div className="text-xl font-bold text-purple-600 mt-2">
                                    COP {Math.round(flight.price * 1.25).toLocaleString("es-CO")}
                                  </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                  <div className="flex items-start">
                                    <div className="text-purple-600 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 artículo personal (bolso)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-purple-600 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 equipaje de mano (10 kg)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-purple-600 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 equipaje de bodega (23 kg)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-purple-600 mr-2 mt-1">•</div>
                                    <div className="text-sm">Check-in en aeropuerto</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-purple-600 mr-2 mt-1">•</div>
                                    <div className="text-sm">Asiento Economy incluido</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Acumula 6 Millas por cada USD</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Menú a bordo</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Cambios (antes del vuelo)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Reembolsos</div>
                                  </div>
                                </div>

                                <button
                                  className="w-full bg-purple-600 text-white rounded-lg py-3 font-medium hover:bg-purple-700 transition"
                                  onClick={() => handleSelectFare(flight.id, "classic")}
                                >
                                  Seleccionar
                                </button>
                                <div className="text-xs text-center text-gray-500 mt-2">*Precio por pasajero</div>
                              </div>
                            </div>

                            {/* Flex fare */}
                            <div
                              className={`shadow-2xl rounded-lg overflow-hidden ${
                                currentSelectedFare?.flightId === flight.id && currentSelectedFare?.fareType === "flex"
                                  ? "border-2 border-orange-500"
                                  : ""
                              }`}
                            >
                              <div className="bg-white p-4">
                                <div className="text-center mb-4">
                                  <h4 className="text-orange-500 font-bold">flex</h4>
                                  <p className="text-xs text-gray-500">Más personalizable</p>
                                  <div className="text-xl font-bold text-orange-500 mt-2">
                                    COP {Math.round(flight.price * 1.45).toLocaleString("es-CO")}
                                  </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 artículo personal (bolso)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 equipaje de mano (10 kg)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 equipaje de bodega (23 kg)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">Check-in en aeropuerto</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">Asiento Plus (sujeto a disponibilidad)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">Acumula 8 Millas por cada USD</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">Cambios (antes del vuelo)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">Reembolsos (sujetos del vuelo)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">Menú a bordo</div>
                                  </div>
                                </div>

                                <button
                                  className="w-full bg-orange-500 text-white rounded-lg py-3 font-medium hover:bg-orange-600 transition"
                                  onClick={() => handleSelectFare(flight.id, "flex")}
                                >
                                  Seleccionar
                                </button>
                                <div className="text-xs text-center text-gray-500 mt-2">*Precio por pasajero</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {expandedFaresFlight === flight.id && (
                        <div className="p-4 block md:hidden">
                          <h3 className="text-2xl mb-4 text-center font-black ">Elige cómo quieres volar</h3>

                          {/* Fare options */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {/* Basic fare */}
                            <div
                              className={`shadow-2xl rounded-2xl overflow-hidden ${
                                currentSelectedFare?.flightId === flight.id && currentSelectedFare?.fareType === "basic"
                                  ? "border-2 border-red-600"
                                  : ""
                              }`}
                            >
                              <div className="bg-white p-4">
                                <div className="text-center mb-4">
                                  <h4 className="text-red-600 font-bold">basic</h4>
                                  <p className="text-xs text-gray-500">Tarifa ligera</p>
                                  <div className="text-xl font-bold text-red-600 mt-2">
                                    COP {flight.price.toLocaleString("es-CO")}
                                  </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                  <div className="flex items-start">
                                    <div className="text-red-600 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 artículo personal (bolso)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Acumula 2 Millas por cada USD</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Equipaje de mano (10 kg)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Equipaje de bodega (23 kg)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Check-in en aeropuerto</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Selección de asiento</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Menú a bordo</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Cambios (antes del vuelo)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Reembolsos</div>
                                  </div>
                                </div>

                                <button
                                  className="w-full bg-red-600 text-white rounded-lg py-3 font-medium hover:bg-red-700 transition"
                                  onClick={() => handleSelectFare(flight.id, "basic")}
                                >
                                  Seleccionar
                                </button>
                                <div className="text-xs text-center text-gray-500 mt-2">*Precio por pasajero</div>
                              </div>
                            </div>

                            {/* Classic fare */}
                            <div
                              className={`border-2 border-purple-600 rounded-lg overflow-hidden relative ${
                                currentSelectedFare?.flightId === flight.id &&
                                currentSelectedFare?.fareType === "classic"
                                  ? "border-2 border-purple-600"
                                  : ""
                              }`}
                            >
                              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                                RECOMENDADO
                              </div>
                              <div className="bg-white p-4">
                                <div className="text-center mb-4">
                                  <h4 className="text-purple-600 font-bold">classic</h4>
                                  <p className="text-xs text-gray-500">Más completo</p>
                                  <div className="text-xl font-bold text-purple-600 mt-2">
                                    COP {Math.round(flight.price * 1.25).toLocaleString("es-CO")}
                                  </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                  <div className="flex items-start">
                                    <div className="text-purple-600 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 artículo personal (bolso)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-purple-600 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 equipaje de mano (10 kg)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-purple-600 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 equipaje de bodega (23 kg)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-purple-600 mr-2 mt-1">•</div>
                                    <div className="text-sm">Check-in en aeropuerto</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-purple-600 mr-2 mt-1">•</div>
                                    <div className="text-sm">Asiento Economy incluido</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Acumula 6 Millas por cada USD</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Menú a bordo</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Cambios (antes del vuelo)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-gray-400 mr-2 mt-1">•</div>
                                    <div className="text-sm text-gray-500">Reembolsos</div>
                                  </div>
                                </div>

                                <button
                                  className="w-full bg-purple-600 text-white rounded-lg py-3 font-medium hover:bg-purple-700 transition"
                                  onClick={() => handleSelectFare(flight.id, "classic")}
                                >
                                  Seleccionar
                                </button>
                                <div className="text-xs text-center text-gray-500 mt-2">*Precio por pasajero</div>
                              </div>
                            </div>

                            {/* Flex fare */}
                            <div
                              className={`shadow-2xl rounded-lg overflow-hidden ${
                                currentSelectedFare?.flightId === flight.id && currentSelectedFare?.fareType === "flex"
                                  ? "border-2 border-orange-500"
                                  : ""
                              }`}
                            >
                              <div className="bg-white p-4">
                                <div className="text-center mb-4">
                                  <h4 className="text-orange-500 font-bold">flex</h4>
                                  <p className="text-xs text-gray-500">Más personalizable</p>
                                  <div className="text-xl font-bold text-orange-500 mt-2">
                                    COP {Math.round(flight.price * 1.45).toLocaleString("es-CO")}
                                  </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 artículo personal (bolso)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 equipaje de mano (10 kg)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">1 equipaje de bodega (23 kg)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">Check-in en aeropuerto</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">Asiento Plus (sujeto a disponibilidad)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">Acumula 8 Millas por cada USD</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">Cambios (antes del vuelo)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">Reembolsos (sujetos del vuelo)</div>
                                  </div>
                                  <div className="flex items-start">
                                    <div className="text-orange-500 mr-2 mt-1">•</div>
                                    <div className="text-sm">Menú a bordo</div>
                                  </div>
                                </div>

                                <button
                                  className="w-full bg-orange-500 text-white rounded-lg py-3 font-medium hover:bg-orange-600 transition"
                                  onClick={() => handleSelectFare(flight.id, "flex")}
                                >
                                  Seleccionar
                                </button>
                                <div className="text-xs text-center text-gray-500 mt-2">*Precio por pasajero</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </>
            )
          )}

          {/* Vuelo de vuelta - solo mostrar si es ida y vuelta */}
          {tripType === "roundTrip" &&
            returnDate &&
            (selectedReturn && !showReturnFlights ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                      <h2 className="text-lg font-mediumn flex flex-col">
                      <span>Vuelta:</span>
                     <span className="flex items-center gap-x-2 font-black"><PlaneTakeoff width={20} color="black" />   {destinationCity} a {originCity}</span>
                    </h2>
                  </div>
                 
                </div>

                <div className="w-full flex flex-col bg-white rounded-3xl border border-green-500 overflow-hidden">
                  <section className="w-full flex justify-end ">
                    <button className="w-[50%] md:w-[30%] bg-green-500 rounded-bl-3xl px-3 py-1 text-white text-sm font-medium transition">
                      <p className="flex items-center gap-x-2 text-xs md:text-base">
                        <Check />
                        Vuelo seleccionado</p>
                        </button>
        
                  </section>
                  <section className="py-2 px-4 flex justify-between">  
                    
                     <div className="text-sm text-gray-500 mb-1">{formatShortDate(returnDate)}</div>
                     <button
                    className="text-cyan-600 text-sm hover:text-cyan-800 flex items-center"
                    onClick={() => {
                      setActiveTab("return")
                      setExpandedFaresFlight(null)
                      setShowReturnFlights(true)
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    Editar selección
                  </button>
                  </section>
                      <article className="w-full flex">

                      <div className="w-[20%] md:w-[10%] text-center py-6">
                         
                        <div className="text-xl md:text-3xl font-bold">
                          {returnFlights.find((f) => f.id === selectedReturn.flightId)?.departureTime}
                        </div>
                        <div className="font-bold">
                          {returnFlights.find((f) => f.id === selectedReturn.flightId)?.origin}
                        </div>
                      </div>

                      <div className="w-[60%] md:w-[70%] flex flex-col items-center py-6">
                        <div className="text-xs flex gap-x-2 text-blue-600 font-medium mb-1">
                          <p className="text-cyan-600 underline cursor-pointer">Directo</p>
                          <p className="text-black">|</p>
                          <p className="text-gray-500">
                            {returnFlights.find((f) => f.id === selectedReturn.flightId)?.duration}
                          </p>
                        </div>
                        <div className="relative w-full flex items-center">
                          <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full z-10"></div>
                          <div className="flex-1 border-t border-dotted border-black"></div>
                          <div className="mx-2 text-black rotate-45">
                            <Plane />
                          </div>
                          <div className="flex-1 border-t border-dotted border-black"></div>
                          <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full z-10"></div>
                        </div>
                        <div className="text-sm bg-gray-50 text-gray-800 mt-1 px-3 py-1 rounded-lg">
                          Operado por Avianca
                        </div>
                      </div>

                      <div className="w-[20%] md:w-[10%] text-center py-6">
                        <div className="text-xl md:text-3xl font-bold">
                          {returnFlights.find((f) => f.id === selectedReturn.flightId)?.arrivalTime}
                        </div>
                        <div className="font-bold">
                          {returnFlights.find((f) => f.id === selectedReturn.flightId)?.destination}
                        </div>
                      </div>
                      
                      <div className="md:w-[10%] py-6 hidden md:flex flex-col justify-center items-center">
                        <section className="flex items-center gap-x-2 mt-2">
                        <div className="text-sm">COP</div>
                        <div className="text-xl font-bold">
                          {(() => {
                            const flight = returnFlights.find((f) => f.id === selectedReturn.flightId)
                            if (!flight) return 0
                            let price = flight.price
                            if (selectedReturn.fareType === "classic") price *= 1.25
                            if (selectedReturn.fareType === "flex") price *= 1.45
                            return Math.round(price).toLocaleString("es-CO")
                          })()}
                        </div>
                        </section>
                       
                        <div className="inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded ">
                          {selectedReturn.fareType}
                        </div>

                      </div>
              </article>
                   <div className=" py-6 flex md:hidden justify-center items-center gap-x-2">
                        <section className="flex items-center gap-x-2 mt-2">
                        <div className="text-sm">COP</div>
                        <div className="text-xl font-bold">
                          {(() => {
                            const flight = returnFlights.find((f) => f.id === selectedReturn.flightId)
                            if (!flight) return 0
                            let price = flight.price
                            if (selectedReturn.fareType === "classic") price *= 1.25
                            if (selectedReturn.fareType === "flex") price *= 1.45
                            return Math.round(price).toLocaleString("es-CO")
                          })()}
                        </div>
                        </section>
                       
                        <div className="inline-block bg-red-600 text-white text-xs px-2 py-0.5 rounded ">
                          {selectedReturn.fareType}
                        </div>

                      </div>

                </div>
              </div>
            ) : (
              activeTab === "return" && (
                <>
                  {/* Título para vuelos de vuelta */}
                  <div className="flex items-center mb-4">
                    <h2 className="text-lg font-mediumn flex flex-col">
                     <span>Vuelta:</span>
                     <span className="flex items-center gap-x-2 font-black"><PlaneTakeoff width={20} color="black" />   {destinationCity} a {originCity}</span>
                    </h2>
                  </div>

                  {/* Selector de fechas para vuelos de vuelta */}
                  <div className="relative mb-6 overflow-hidden">
                    <div className="flex overflow-x-auto pb-2 -mx-2">
                      {(activeTab as "outbound" | "return" === "outbound" ? outboundDateOptions : returnDateOptions).map((dateOption, index) => (
                        <div key={index} className={`flex-shrink-0 px-2 w-1/3 sm:w-1/5 md:w-1/7`}>
                          <div
                            className={`rounded-xl p-3 text-center cursor-pointer ${
                              dateOption.isSelected ? "border border-green-500 bg-white" : ""
                            }`}
                            onClick={() => handleDateChange(dateOption.date, activeTab === "return")}
                          >
                            <div className="text-black">
                              {dateOption.dayName}. {dateOption.dayNumber} {dateOption.monthName}.
                            </div>
                            <div className={`${dateOption.isSelected ? "font-black" : "text-sm font-medium"}`}>
                              COP <span className="text-lg">{dateOption.price.toLocaleString("es-CO")}</span>{" "}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-1 z-10">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md p-1 z-10">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Flight cards */}
                  <div className="space-y-4 mb-6">
                    {currentFlights.map((flight) => (
                      <div key={flight.id} className="bg-white rounded-3xl shadow-sm overflow-hidden">
                        {/* Flight info */}
                        <div className="">
                          <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
                            {/* Flight times and route */}
                            <div className="w-full md:w-[80%] flex items-center justify-between md:mb-0 px-7 py-6">
                             
                              <div className="w-[10%] text-center">
                                <div className="text-xl md:text-3xl font-bold">{flight.departureTime}</div>
                                <div className="text-lg font-bold">{flight.origin}</div>
                              </div>

                              <div className="w-[80%] flex-1 flex flex-col items-center mx-4 px-5 md:px-10">
                                <div className="text-xs flex gap-x-2 text-blue-600 font-medium mb-1">
                                  <p className="text-cyan-600 underline cursor-pointer">Directo</p>
                                  <p className="text-black">|</p>
                                  <p className="text-gray-500">{flight.duration}</p>
                                </div>
                                <div className="relative w-full flex items-center">
                                  <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full z-10"></div>
                                  <div className="flex-1 border-t border-dotted border-black"></div>
                                  <div className="mx-2 text-black rotate-45">
                                    <Plane />
                                  </div>
                                  <div className="flex-1 border-t border-dotted border-black"></div>
                                  <div className="w-2.5 h-2.5 bg-cyan-600 rounded-full z-10"></div>
                                </div>

                                <div className="text-sm bg-gray-50 text-gray-800 mt-1 px-3 py-2 rounded-lg">
                                  Operado por avianca
                                </div>
                              </div>

                              <div className="w-[10%] text-center">
                                <div className="text-xl md:text-3xl font-bold">{flight.arrivalTime}</div>
                                <div className="font-bold">{flight.destination}</div>
                              </div>
                            </div>

                            {/* Operator and price */}
                            <div className="md:w-[20%] bg-gray-50 flex flex-col md:flex-row md:items-center justify-between py-6">
                              <div className="text-center md:text-start px-5">
                                <div className="text-xs text-gray-500">Desde</div>
                                <section className="flex items-center gap-x-2 py-4 justify-center">
                                  <div className="text-2xl font-bold">
                                    <span className="text-sm">COP</span> {flight.price.toLocaleString("es-CO")}
                                  </div>
                                  <button
                                    className="mt-2 text-white rounded-full py-2 text-sm font-medium transition"
                                    onClick={() => handleSelectFlight(flight)}
                                  >
                                    {expandedFaresFlight === flight.id ? (
                                      <ChevronUp className="w-6 h-6 text-black font-bold" />
                                    ) : (
                                      <ChevronDown className="w-6 h-6 text-black font-bold" />
                                    )}
                                  </button>
                                </section>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded fares */}
                        {expandedFaresFlight === flight.id && (
                          <div className="p-4">
                            <h3 className="text-2xl mb-4 text-center font-black">Elige cómo quieres volar</h3>

                            {/* Fare options */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              {/* Basic fare */}
                              <div
                                className={`shadow-2xl rounded-2xl overflow-hidden ${
                                  currentSelectedFare?.flightId === flight.id &&
                                  currentSelectedFare?.fareType === "basic"
                                    ? "border-2 border-red-600"
                                    : ""
                                }`}
                              >
                                <div className="bg-white p-4">
                                  <div className="text-center mb-4">
                                    <h4 className="text-red-600 font-bold">basic</h4>
                                    <p className="text-xs text-gray-500">Tarifa ligera</p>
                                    <div className="text-xl font-bold text-red-600 mt-2">
                                      COP {flight.price.toLocaleString("es-CO")}
                                    </div>
                                  </div>

                                  <div className="space-y-2 mb-4">
                                    <div className="flex items-start">
                                      <div className="text-red-600 mr-2 mt-1">•</div>
                                      <div className="text-sm">1 artículo personal (bolso)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-gray-400 mr-2 mt-1">•</div>
                                      <div className="text-sm text-gray-500">Acumula 2 Millas por cada USD</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-gray-400 mr-2 mt-1">•</div>
                                      <div className="text-sm text-gray-500">Equipaje de mano (10 kg)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-gray-400 mr-2 mt-1">•</div>
                                      <div className="text-sm text-gray-500">Equipaje de bodega (23 kg)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-gray-400 mr-2 mt-1">•</div>
                                      <div className="text-sm text-gray-500">Check-in en aeropuerto</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-gray-400 mr-2 mt-1">•</div>
                                      <div className="text-sm text-gray-500">Selección de asiento</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-gray-400 mr-2 mt-1">•</div>
                                      <div className="text-sm text-gray-500">Menú a bordo</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-gray-400 mr-2 mt-1">•</div>
                                      <div className="text-sm text-gray-500">Cambios (antes del vuelo)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-gray-400 mr-2 mt-1">•</div>
                                      <div className="text-sm text-gray-500">Reembolsos</div>
                                    </div>
                                  </div>

                                  <button
                                    className="w-full bg-red-600 text-white rounded-lg py-3 font-medium hover:bg-red-700 transition"
                                    onClick={() => handleSelectFare(flight.id, "basic")}
                                  >
                                    Seleccionar
                                  </button>
                                  <div className="text-xs text-center text-gray-500 mt-2">*Precio por pasajero</div>
                                </div>
                              </div>

                              {/* Classic fare */}
                              <div
                                className={`border-2 border-purple-600 rounded-lg overflow-hidden relative ${
                                  currentSelectedFare?.flightId === flight.id &&
                                  currentSelectedFare?.fareType === "classic"
                                    ? "border-2 border-purple-600"
                                    : ""
                                }`}
                              >
                                <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                                  RECOMENDADO
                                </div>
                                <div className="bg-white p-4">
                                  <div className="text-center mb-4">
                                    <h4 className="text-purple-600 font-bold">classic</h4>
                                    <p className="text-xs text-gray-500">Más completo</p>
                                    <div className="text-xl font-bold text-purple-600 mt-2">
                                      COP {Math.round(flight.price * 1.25).toLocaleString("es-CO")}
                                    </div>
                                  </div>

                                  <div className="space-y-2 mb-4">
                                    <div className="flex items-start">
                                      <div className="text-purple-600 mr-2 mt-1">•</div>
                                      <div className="text-sm">1 artículo personal (bolso)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-purple-600 mr-2 mt-1">•</div>
                                      <div className="text-sm">1 equipaje de mano (10 kg)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-purple-600 mr-2 mt-1">•</div>
                                      <div className="text-sm">1 equipaje de bodega (23 kg)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-purple-600 mr-2 mt-1">•</div>
                                      <div className="text-sm">Check-in en aeropuerto</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-purple-600 mr-2 mt-1">•</div>
                                      <div className="text-sm">Asiento Economy incluida</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-gray-400 mr-2 mt-1">•</div>
                                      <div className="text-sm text-gray-500">Acumula 6 Millas por cada USD</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-gray-400 mr-2 mt-1">•</div>
                                      <div className="text-sm text-gray-500">Menú a bordo</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-gray-400 mr-2 mt-1">•</div>
                                      <div className="text-sm text-gray-500">Cambios (antes del vuelo)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-gray-400 mr-2 mt-1">•</div>
                                      <div className="text-sm text-gray-500">Reembolsos</div>
                                    </div>
                                  </div>

                                  <button
                                    className="w-full bg-purple-600 text-white rounded-lg py-3 font-medium hover:bg-purple-700 transition"
                                    onClick={() => handleSelectFare(flight.id, "classic")}
                                  >
                                    Seleccionar
                                  </button>
                                  <div className="text-xs text-center text-gray-500 mt-2">*Precio por pasajero</div>
                                </div>
                              </div>

                              {/* Flex fare */}
                              <div
                                className={`shadow-2xl rounded-lg overflow-hidden ${
                                  currentSelectedFare?.flightId === flight.id &&
                                  currentSelectedFare?.fareType === "flex"
                                    ? "border-2 border-orange-500"
                                    : ""
                                }`}
                              >
                                <div className="bg-white p-4">
                                  <div className="text-center mb-4">
                                    <h4 className="text-orange-500 font-bold">flex</h4>
                                    <p className="text-xs text-gray-500">Más personalizable</p>
                                    <div className="text-xl font-bold text-orange-500 mt-2">
                                      COP {Math.round(flight.price * 1.45).toLocaleString("es-CO")}
                                    </div>
                                  </div>

                                  <div className="space-y-2 mb-4">
                                    <div className="flex items-start">
                                      <div className="text-orange-500 mr-2 mt-1">•</div>
                                      <div className="text-sm">1 artículo personal (bolso)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-orange-500 mr-2 mt-1">•</div>
                                      <div className="text-sm">1 equipaje de mano (10 kg)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-orange-500 mr-2 mt-1">•</div>
                                      <div className="text-sm">1 equipaje de bodega (23 kg)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-orange-500 mr-2 mt-1">•</div>
                                      <div className="text-sm">Check-in en aeropuerto</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-orange-500 mr-2 mt-1">•</div>
                                      <div className="text-sm">Asiento Plus (sujeto a disponibilidad)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-orange-500 mr-2 mt-1">•</div>
                                      <div className="text-sm">Acumula 8 Millas por cada USD</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-orange-500 mr-2 mt-1">•</div>
                                      <div className="text-sm">Cambios (antes del vuelo)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-orange-500 mr-2 mt-1">•</div>
                                      <div className="text-sm">Reembolsos (sujetos del vuelo)</div>
                                    </div>
                                    <div className="flex items-start">
                                      <div className="text-orange-500 mr-2 mt-1">•</div>
                                      <div className="text-sm">Menú a bordo</div>
                                    </div>
                                  </div>

                                  <button
                                    className="w-full bg-orange-500 text-white rounded-lg py-3 font-medium hover:bg-orange-600 transition"
                                    onClick={() => handleSelectFare(flight.id, "flex")}
                                  >
                                    Seleccionar
                                  </button>
                                  <div className="text-xs text-center text-gray-500 mt-2">*Precio por pasajero</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )
            ))}
        </div>

        {/* Fare conditions - Siempre visible */}
        <div className="bg-gray-100 rounded-lg shadow-sm p-4 mb-20">
          <button
            className="w-full flex items-center justify-between font-medium"
            onClick={() => setShowFareConditions(!showFareConditions)}
          >
            <span className="md:px-20 font-black text-gray-900">Condiciones tarifarias</span>
            {showFareConditions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showFareConditions && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              
            <section className="container md:px-20 ">
              <p className="text-sm font-black text-gray-900">Cambios de vuelo</p>
              <article className="flex gap-x-2 items-center mt-5">
                <div className="h-2 w-2 bg-[#2AB6CA] rounded-full"></div>
                <p className="text-sm  text-gray-900">
                Diferencia de tarifa: es la diferencia en dinero entre la tarifa que compraste y la nueva que estás eligiendo (aplica para todas las tarifas).
                </p>
              </article>
              <article className="flex gap-x-2 items-center mt-5">
                <div className="h-2 w-2 bg-[#2AB6CA] rounded-full"></div>
                <p className="text-sm  text-gray-900">
               Diferencias generadas por impuestos: aplican según las normativas vigentes de cada país.
                </p>
              </article>
              <article className="flex gap-x-2 items-center mt-5">
                <div className="h-2 w-2 bg-[#2AB6CA] rounded-full"></div>
                <p className="text-sm  text-gray-900">
              Cargo por cambio: son los cargos adicionales que se generan al cambiar tu vuelo de manera voluntaria (aplica únicamente para las tarifas basic, light y classic). 

                </p>
              </article>


            <section className="md:w-[60%]   mx-auto mt-5 rounded-lg p-4 ">
              <article className="grid grid-cols-5 gap-x-2 mt-5 gap-y-2 ">
              <div className="font-bold col-span-4 flex flex-col gap-y-3">
                <p>Región	</p>
                <p>Vuelos nacionales en Colombia</p>
                <p>Vuelos nacionales en Ecuador	</p>
                <p>Vuelos internacionales al interior de Suramérica	</p>
                <p>Otros vuelos internacionales en las Américas y vuelos hacia Europa	</p>
                <p>Desde Reino Unido	</p>
                <p>Desde el resto de Europa	</p>
              </div>
              <div className="flex flex-col gap-y-3">
                  <p  className="font-bold">Cargo	</p>
                  <p> 120.000 COP</p>
                  <p> 30 USD</p>
                  <p> 185 USD</p>
                  <p> USD/CAD 210</p>
                  <p> GBP 150</p>
                  <p>  EUR 180</p>
              </div>
                </article>
            </section>
          <article className="flex gap-x-2 items-center mt-5">
                <div className="h-2 w-2 bg-[#2AB6CA] rounded-full"></div>
                <p className="text-sm  text-gray-900">
             Para las tarifas flex y business se permiten cambios antes de salida del vuelo sin cargo por cambio, pero podrán aplicar cargos por diferencia de tarifa e impuestos.


                </p>
              </article>


             <p className="text-sm font-black text-gray-900 mt-5">Reembolsos</p>
               <article className="flex gap-x-2 items-center mt-5">
                <div className="h-2 w-2 bg-[#2AB6CA] rounded-full"></div>
                <p className="text-sm  text-gray-900">
           Aplica para las tarifas flex y business, antes del vuelo.

                </p>
              </article>
                <article className="flex gap-x-2 items-center mt-5">
                <div className="h-2 w-2 bg-[#2AB6CA] rounded-full"></div>
                <p className="text-sm  text-gray-900">
           Los reembolsos después del vuelo no se permiten en ninguna tarifa, excepto ante eventos operacionales.

                </p>
              </article>
                <article className="flex gap-x-2 items-center mt-5">
                <div className="h-2 w-2 bg-[#2AB6CA] rounded-full"></div>
                <p className="text-sm  text-gray-900">
         La condición de reembolso aplica sobre el valor pagado por la tarifa. Los impuestos serán reembolsados de acuerdo con las disposiciones legales aplicables.

                </p>
              </article>
                <article className="flex gap-x-2 items-center mt-5">
                <div className="h-2 w-2 bg-[#2AB6CA] rounded-full"></div>
                <p className="text-sm  text-gray-900">
      Los servicios adicionales que compres para tu reserva y decidas no utilizar, serán reembolsables únicamente si tu tarifa es flex o business. Si los servicios no fueron prestados por causa imputable a la aerolínea, serán reembolsables para todas las tarifas.

                </p>
              </article>
                <article className="flex gap-x-2 items-center mt-5">
                <div className="h-2 w-2 bg-[#2AB6CA] rounded-full"></div>
                <p className="text-sm  text-gray-900">
       Consulta más información sobre el derecho de retracto, desistimiento y otras leyes según el país en nuestro Centro de ayuda.

                </p>
              </article>
                <article className="flex gap-x-2 items-center mt-5">
                <div className="h-2 w-2 bg-[#2AB6CA] rounded-full"></div>
                <p className="text-sm  text-gray-900">
           Estás obligado a utilizar todos los segmentos de tu itinerario según el plan de vuelo que contrataste. No puedes quedarte en la ciudad de conexión sin continuar hacia tu destino final. Si decides no completar tu itinerario, consideraremos que has completado el viaje desde el origen hasta el destino final programado, y no tendrás derecho a reembolso por los segmentos no volados, excepto por los impuestos y tasas no causadas correspondientes a esos segmentos.

                </p>
              </article>

                  <p className="text-sm font-black text-gray-900 mt-5">Experiencia a bordo</p>

                <article className="flex gap-x-2 items-center mt-5">
                <div className="h-2 w-2 bg-[#2AB6CA] rounded-full"></div>
                <p className="text-sm  text-gray-900">
         La experiencia INSIGNIA by avianca en Business Class aplica únicamente para vuelos entre El Salvador o Colombia y Europa.

                </p>
              </article>
              <article className="flex gap-x-2 items-center mt-5">
                <div className="h-2 w-2 bg-[#2AB6CA] rounded-full"></div>
                <p className="text-sm  text-gray-900">
     La reclinación máxima de los asientos en Business Class puede variar según el tipo de avión.


                </p>
              </article>
              <article className="flex gap-x-2 items-center mt-5">
                <div className="h-2 w-2 bg-[#2AB6CA] rounded-full"></div>
                <p className="text-sm  text-gray-900">
        Asiento Business Class, Business Class (Flatbed) o Premium (de acuerdo al tipo de avión que opera la ruta) están incluidos para la tarifa business con todos sus beneficios.

                </p>
              </article>
            
              
            </section>
            </div>
          )}
        </div>

        {/* Botón de continuar - Solo mostrar cuando ambos vuelos estén seleccionados para ida y vuelta */}
        {tripType === "oneWay" || !returnDate
          ? // Para vuelos solo de ida
            selectedOutbound && (
              <div className="fixed bottom-0 left-0 right-0 bg-gray-50 p-4 shadow-lg  z-20">
                <div className="container mx-auto flex justify-between items-center">
                  <div>
                 
                    <p className="text-xl font-bold">COP {calculateTotalPrice().toLocaleString("es-CO")}</p>
                  </div>
                  <button
                    className="bg-black text-white rounded-full px-8 py-3 font-medium hover:bg-black/80 transition"
                    onClick={handleContinue}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )
          : // Para vuelos de ida y vuelta
            selectedOutbound &&
            selectedReturn && (
              <div className="w-full bg-gray-50  fixed bottom-0  p-4 shadow-lg  z-20">
                <div className="container mx-auto flex justify-between items-center px-6">
                   <div>
                    <p className="text-xl font-bold">COP {calculateTotalPrice().toLocaleString("es-CO")}</p>
                  </div>
                  <button
                    className="bg-black text-white rounded-full px-8 py-3 font-medium hover:bg-black/40 transition"
                    onClick={handleContinue}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}
      </div>
    </main>
  )
}
 