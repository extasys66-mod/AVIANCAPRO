"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronRight, Luggage, Bike, Shield, PlaneTakeoff, ShoppingCart } from "lucide-react"
import { SiteLogo } from "@/components/ui/site-logo"
import Image from "next/image";
import Link  from "next/link";

export default function ServiciosPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  

  // Obtener parámetros del vuelo seleccionado
  const origin = searchParams.get("outboundOrigin") || ""
  const destination = searchParams.get("outboundDestination") || ""
  const departureDate = searchParams.get("outboundDepartureDate") || searchParams.get("outbaundDepartureDate") || searchParams.get("returndepartureDate") || ""
  const returnDate = searchParams.get("returnReturn") || searchParams.get("outboundReturn") || searchParams.get("outbaundReturn") || searchParams.get("returnreturnDate") || ""
  const tripType = searchParams.get("tripType") || "oneWay"
  const passengers = Number(searchParams.get("passengers") || "1")
  const outboundPrice = Number.parseInt(searchParams.get("outboundPrice") || "0")
  const returnPrice = Number.parseInt(searchParams.get("returnPrice") || "0")
    // Calcular precio total
  const basePrice = outboundPrice + (tripType === "roundTrip" ? returnPrice : 0)
  const [priceEnd, setPriceEnd] = useState(basePrice)
  


  // Extraer nombres de ciudades
  const originCity = origin.split(" (")[0] || "Bogotá"
  const destinationCity = destination.split(" (")[0] || "Cali"

  // Datos del pasajero
  const passengerGender = searchParams.get("passengerGender") || ""
  const passengerFirstName = searchParams.get("passengerFirstName") || ""
  const passengerLastName = searchParams.get("passengerLastName") || ""

  // Servicios adicionales seleccionados
  const [selectedServices, setSelectedServices] = useState({
    handLuggage: false,
    sportsEquipment: false,
    lounge: false,
    specialAssistance: false,
    travelAssistance: false,
  })

  // Precios de los servicios
  const servicePrices = {
    handLuggage: 65000,
    sportsEquipment: 100000,
    lounge: 99000,
    specialAssistance: 0,
    travelAssistance: 34000,
  }

  useEffect(() => {
    // Verificar si tenemos los datos necesarios
    if (!origin || !destination || !departureDate) {
      console.log("Missing services data", { origin, destination, departureDate })
      // router.push("/")
     
      // return
    }

    // Simular carga
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [origin, destination, departureDate, router])


  const handleServiceChange = (service: keyof typeof selectedServices) => {
  // Primero actualizamos el estado de los servicios
  setSelectedServices((prev) => {
    const newServices = {
      ...prev,
      [service]: !prev[service],
    };
    
    // Calculamos el nuevo precio total
    let newPrice = basePrice;
    Object.entries(newServices).forEach(([key, value]) => {
      if (value) {
        newPrice += servicePrices[key as keyof typeof servicePrices];
      }
    });
    
    setPriceEnd(newPrice);
    return newServices;
  });
};

  const handleContinue = () => {
    // Crear parámetros para la siguiente página
    const nextParams = new URLSearchParams(searchParams.toString())

    // Añadir servicios seleccionados
    Object.entries(selectedServices).forEach(([key, value]) => {
      nextParams.set(key, value.toString())
    })

    // Calcular precio total de servicios
    let servicesTotal = 0
    Object.entries(selectedServices).forEach(([key, value]) => {
      if (value) {
        servicesTotal += servicePrices[key as keyof typeof servicePrices]
      }
    })
    nextParams.set("servicesTotal", servicesTotal.toString())

    // Redirigir a la página de asientos
    router.push(`/asientos?${nextParams.toString()}`)
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

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <img src="/loading.gif" alt="Cargando..." className="w-32 h-32 mx-auto" />
        </div>
      </div>
    )
  }

  // Calcular precio total base (sin servicios)


  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm hidden md:block">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-x-4 ">
              <Link href="/" >
              <SiteLogo className="h-8" />
              </Link>
              <div className="mb-5">
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
            </div>
          </div>
             </div>
            </div>

            <div>
              <button className="bg-white border-2 border-black rounded-full px-4 py-2 text-sm font-medium flex items-center">
                <span className="mr-1">COP</span>
                <span className="font-bold">{priceEnd.toLocaleString("es-CO")}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </header>

      <header className="bg-black shadow-sm block md:hidden">

        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
             <Link href="/">
        <Image src='/logomovil.svg' alt="logo" width={80} height={20} />
        </Link>
            <div className="flex items-center"></div>
            <div>
              <button className="font-medium flex gap-x-2 items-center text-white">
                  <div className="flex">
                  <ShoppingCart />
                <div className="relative h-3 w-3 bg-green-500 rounded-full -top-1 -left-1 "></div>
                  </div>
                <span>COP</span>
                <span className="font-black">
                 
                  {priceEnd.toLocaleString("es-CO")}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center text-sm mb-6 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center text-gray-400">
            <span className="mr-2">Vuelos</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-gray-400">
            <span className="mx-2">Pasajeros</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-black font-bold">
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

        <div className="block md:hidden mb-5">
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
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-6">Personaliza tu viaje</h1>

        {/* Equipaje */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Equipaje de mano y bodega */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-24 h-24 flex items-center justify-center">
                  <Luggage className="w-16 h-16 text-red-600" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-1">Equipaje de mano y bodega</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Revisa el equipaje incluido en tu tarifa y añade el que necesites.
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Desde</p>
                    <p className="text-lg font-bold">COP {servicePrices.handLuggage.toLocaleString("es-CO")}</p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium ${
                      selectedServices.handLuggage ? "bg-red-600 text-white" : "bg-black text-white"
                    }`}
                    onClick={() => handleServiceChange("handLuggage")}
                  >
                    {selectedServices.handLuggage ? "Añadido" : "Añadir"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Equipaje deportivo */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="w-24 h-24 flex items-center justify-center">
                  <Bike className="w-16 h-16 text-red-600" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-1">Equipaje deportivo</h3>
                <p className="text-gray-600 text-sm mb-4">Vuela con tu pasión a todas partes.</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Desde</p>
                    <p className="text-lg font-bold">COP {servicePrices.sportsEquipment.toLocaleString("es-CO")}</p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium ${
                      selectedServices.sportsEquipment ? "bg-red-600 text-white" : "bg-black text-white"
                    }`}
                    onClick={() => handleServiceChange("sportsEquipment")}
                  >
                    {selectedServices.sportsEquipment ? "Añadido" : "Añadir"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6">Complementa tu viaje con las opciones que tenemos para ti</h2>

        {/* Servicios adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Avianca lounges */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col h-full">
              <div className="flex-shrink-0 mb-4 flex justify-center">
                <div className="w-16 h-16 flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19 9V7C19 5.93913 18.5786 4.92172 17.8284 4.17157C17.0783 3.42143 16.0609 3 15 3H9C7.93913 3 6.92172 3.42143 6.17157 4.17157C5.42143 4.92172 5 5.93913 5 7V9"
                      stroke="#E30613"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5 15V17C5 18.0609 5.42143 19.0783 6.17157 19.8284C6.92172 20.5786 7.93913 21 9 21H15C16.0609 21 17.0783 20.5786 17.8284 19.8284C18.5786 19.0783 19 18.0609 19 17V15"
                      stroke="#E30613"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 9H21V15H3V9Z"
                      stroke="#E30613"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M12 9V15" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-1 text-center">avianca lounges</h3>
                <p className="text-gray-600 text-sm mb-4 text-center">Espera tu vuelo con todas las comodidades.</p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Desde</p>
                      <p className="text-lg font-bold">COP {servicePrices.lounge.toLocaleString("es-CO")}</p>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium ${
                        selectedServices.lounge ? "bg-red-600 text-white" : "bg-black text-white"
                      }`}
                      onClick={() => handleServiceChange("lounge")}
                    >
                      {selectedServices.lounge ? "Añadido" : "Añadir"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Asistencia especial */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col h-full">
              <div className="flex-shrink-0 mb-4 flex justify-center">
                <div className="w-16 h-16 flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="#E30613"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M12 8V16" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 12H16" stroke="#E30613" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-1 text-center">Asistencia especial</h3>
                <p className="text-gray-600 text-sm mb-4 text-center">Conoce las opciones según tus necesidades.</p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold">Servicio gratuito</p>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium ${
                        selectedServices.specialAssistance ? "bg-red-600 text-white" : "bg-black text-white"
                      }`}
                      onClick={() => handleServiceChange("specialAssistance")}
                    >
                      {selectedServices.specialAssistance ? "Añadido" : "Añadir"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Asistencia en viaje */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col h-full">
              <div className="flex-shrink-0 mb-4 flex justify-center">
                <div className="w-16 h-16 flex items-center justify-center">
                  <Shield className="w-12 h-12 text-red-600" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-1 text-center">Asistencia en viaje</h3>
                <p className="text-gray-600 text-sm mb-4 text-center">Cobertura médica, legal y más en tu destino.</p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Desde</p>
                      <p className="text-lg font-bold">COP {servicePrices.travelAssistance.toLocaleString("es-CO")}</p>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium ${
                        selectedServices.travelAssistance ? "bg-red-600 text-white" : "bg-black text-white"
                      }`}
                      onClick={() => handleServiceChange("travelAssistance")}
                    >
                      {selectedServices.travelAssistance ? "Añadido" : "Añadir"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de continuar */}
        <div className="fixed bottom-0 left-0 right-0  p-4 shadow-lg  z-20">
          <div className="container mx-auto flex justify-end items-center">
            <button
              className="bg-black text-white rounded-full px-8 py-3 font-medium hover:bg-black/80 transition"
              onClick={handleContinue}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
