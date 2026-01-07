"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronRight, X, ChevronDown, PlaneTakeoff, Users } from "lucide-react"
import { SiteLogo } from "@/components/ui/site-logo"
import Link from "next/link"

export default function AsientosPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(false)

  // Estado para los asientos seleccionados
  const [selectedSeats, setSelectedSeats] = useState<{
    outbound: string | null
    return: string | null
  }>({
    outbound: null,
    return: null,
  })

  // Estado para el vuelo activo (ida o vuelta)
  const [activeDirection, setActiveDirection] = useState<"outbound" | "return">("outbound")

  // Datos del pasajero
  const [passengerName, setPassengerName] = useState("Carlos Rodriguez")

  // Obtener parámetros de los vuelos
  const origin = searchParams.get("returnOrigin") || ""
  const destination = searchParams.get("destination") || ""
  const departureDate = searchParams.get("outbaundDepartureDate") || ""
  const outbaundReturn = searchParams.get("outbaundReturn") || ""
  const tripType = searchParams.get("tripType") || "oneWay"
  const passengers = Number.parseInt(searchParams.get("passengers") || "1")

  // Datos del vuelo de ida
  const outboundFlightId = searchParams.get("outboundFlightId") || ""
  const outboundOrigin = searchParams.get("outboundOrigin") || ""
  const outboundDestination = searchParams.get("outboundDestination") || ""
  
  // Datos del vuelo de vuelta (si aplica)
  const returnFlightId = searchParams.get("returnFlightId") || ""
  const returnOrigin = searchParams.get("returnOrigin") || ""
  const returnDestination = searchParams.get("returnDestination") || ""

  // datos del precio 
  const servicesTotal = Number.parseInt(searchParams.get("servicesTotal") || "0")

  // Datos de los servicios seleccionados
  const selectedServices = searchParams.get("selectedServices")?.split(",") || []

  // Datos del pasajero
  const passengerFirstName = searchParams.get("passengerFirstName") || ""
  const passengerLastName = searchParams.get("passengerLastName") || ""

  // Precio base y total
  const basePrice =
    Number.parseInt(searchParams.get("outboundPrice") || "0") +
    (tripType === "roundTrip" ? Number.parseInt(searchParams.get("returnPrice") || "0") : 0) + servicesTotal
  
  const [seatPrices, setSeatPrices] = useState({
    outbound: 0,
    return: 0
  })
  
  const [totalPrice, setTotalPrice] = useState(basePrice)

  // Generar asientos disponibles
  const generateSeats = () => {
    const occupiedSeats = new Set<string>()
    const rows = 20
    const columns = ["A", "B", "C", "D", "E", "K"]

    for (let i = 0; i < 30; i++) {
      const row = Math.floor(Math.random() * rows) + 1
      const col = columns[Math.floor(Math.random() * columns.length)]
      occupiedSeats.add(`${row}${col}`)
    }

    occupiedSeats.add("2B")
    occupiedSeats.add("3K")

    return { occupiedSeats }
  }

  const { occupiedSeats } = generateSeats()

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!outboundFlightId || !outboundOrigin || !outboundDestination) {
      router.push("/")
      return
    }

    if (tripType === "roundTrip" && (!returnFlightId || !returnOrigin || !returnDestination)) {
      router.push("/")
      return
    }

    if (passengerFirstName && passengerLastName) {
      setPassengerName(`${passengerFirstName} ${passengerLastName}`)
    }

    setLoading(false)
  }, [
    outboundFlightId,
    outboundOrigin,
    outboundDestination,
    returnFlightId,
    returnOrigin,
    returnDestination,
    router,
    tripType,
    passengerFirstName,
    passengerLastName,
  ])

  // Manejar selección de asiento
  const handleSeatSelection = (seat: string) => {
    if (occupiedSeats.has(seat)) return

    setSelectedSeats((prev) => ({
      ...prev,
      [activeDirection]: seat,
    }))

    const isPremium = Number.parseInt(seat[0]) <= 3
    const newSeatPrice = isPremium ? 72000 : 30000
    
    setSeatPrices((prev) => ({
      ...prev,
      [activeDirection]: newSeatPrice
    }))
    
    setTotalPrice(basePrice + 
      (activeDirection === "outbound" 
        ? newSeatPrice + seatPrices.return 
        : newSeatPrice + seatPrices.outbound)
    )
  }

  // Eliminar selección de asiento
  const handleRemoveSeat = () => {
    setSelectedSeats((prev) => ({
      ...prev,
      [activeDirection]: null,
    }))
    
    setSeatPrices((prev) => ({
      ...prev,
      [activeDirection]: 0
    }))
    
    setTotalPrice(basePrice + 
      (activeDirection === "outbound" ? seatPrices.return : seatPrices.outbound)
    )
  }

  // Saltar a selección de vuelta
  const handleJumpToReturn = () => {
    setActiveDirection("return")
    if (!isDesktop) {
      document.getElementById("seat-selection")?.scrollIntoView({
        behavior: "smooth"
      })
    }
  }

  // Continuar al siguiente paso
  const handleContinue = () => {
    if (!selectedSeats.outbound) {
      alert("Por favor selecciona un asiento para el vuelo de ida")
      return
    }

    if (tripType === "roundTrip" && !selectedSeats.return) {
      if (activeDirection === "outbound") {
        setActiveDirection("return")
        return
      }
      alert("Por favor selecciona un asiento para el vuelo de vuelta")
      return
    }

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.set("outboundSeat", selectedSeats.outbound || "")
    if (tripType === "roundTrip" && selectedSeats.return) {
      nextParams.set("returnSeat", selectedSeats.return)
    }
    nextParams.set("totalPrice", totalPrice.toString())
    router.push(`/pago?${nextParams.toString()}`)
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

  const originCode = activeDirection === "outbound" ? outboundOrigin : returnOrigin
  const destinationCode = activeDirection === "outbound" ? outboundDestination : returnDestination

  return (
    <main className="w-full min-h-screen bg-gray-50 pb-20">
      {/* Header desktop */}
      <header className="bg-white shadow-sm hidden md:block">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <Link href="/">
                  <SiteLogo className="h-8" />
              </Link>
          
              <div className="mb-5">
                <div className="text-center flex flex-col">
                  <div className="flex">
                    <h1 className="text-lg font-bold">
                      {outboundOrigin.slice(0, outboundOrigin.length - 5)} a {outboundDestination.slice(0, outboundDestination.length - 5)}
                    </h1>
                  </div>
                  <div className="flex">
                    <section className="flex items-center gap-x-2 mt-2">
                      <p className="flex items-center gap-x-2">
                        <PlaneTakeoff width={20} color="black" /> {formatShortDate(departureDate)}
                      </p>
                      {tripType === "roundTrip" && outbaundReturn && (
                        <p className="flex items-center gap-x-2">
                          <PlaneTakeoff width={20} color="black" className="scale-x-[-1]" />
                          {formatShortDate(outbaundReturn)}
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
                <span className="mr-1">COP {totalPrice.toLocaleString("es-CO")}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Header mobile */}
      <header className="bg-black shadow-sm block md:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center"></div>
            <div>
                {/* Header mobile
                 <button className="font-medium flex gap-x-2 items-center text-white">
                <span>COP</span>
                <span className="font-black">
                  {totalPrice.toLocaleString("es-CO")}</span>
              </button>
                */}
             <p className="text-white">Seleccion de asientos</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto md:px-4 py-4">
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center text-sm mb-6 overflow-x-auto whitespace-nowrap gap-x-4 z-10">
          <div className="flex items-center text-gray-400">
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
          <div className="flex items-center text-black font-bold">
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
        
        <div className="w-full flex flex-col md:flex-row md:gap-x-4">
          {/* Sección izquierda - Información */}
          <section className="w-full md:w-[40%] hidden md:block">
            <h1 className="text-2xl font-bold mb-4">Selecciona tus asientos</h1>
            <p className="text-gray-600 mb-6">Elige como quieres volar, ventana, pasillo o centro</p>

            {/* Pasajero con asiento seleccionado */}
            <div className="mb-6">
              <div
                className={`border rounded-lg p-4 flex items-center justify-between ${
                  selectedSeats[activeDirection] ? "border-green-500" : "border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <div className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs mr-3">
                    CR
                  </div>
                  <span className="font-medium">{passengerName}</span>
                </div>
                {selectedSeats[activeDirection] ? (
                  <div className="flex items-center">
                    <span className="font-medium mr-3">{selectedSeats[activeDirection]}</span>
                    <button onClick={handleRemoveSeat} className="bg-gray-100 rounded-full p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500">Selecciona un asiento</span>
                )}
              </div>
            </div>

            {/* Leyenda de asientos */}
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center ">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-bold ">Asiento seleccionado</span>
                </div>
                <div className="h-1 border-b border-gray-300"></div>
                <div className="flex items-center">
                  <div className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center mr-2">
                    <X className="w-3 h-3 text-gray-400" />
                  </div>
                  <span className="font-bold">Asiento no disponible</span>
                </div>
              </div>
            </div>
          </section>
       
          {/* Sección derecha - Mapa de asientos */}
          <section id="seat-selection" className="w-full md:w-[60%] z-1 flex justify-center">
            <article className="w-full md:w-[80%]">
               
              <div className="bg-white md:p-6 mb-6 md:relative md:-top-20 rounded-4xl shadow-2xl">
               {tripType === "roundTrip" && (
                  <div className="flex mb-6 px-4">
                    <section className="w-full flex justify-center items-center mx-auto">
                      <button
                        className={`py-2 px-4 flex items-center ${
                          activeDirection === "outbound" ? "bg-black text-white font-medium rounded-2xl" : "text-gray-500 "
                        }`}
                        onClick={() => setActiveDirection("outbound")}
                      >
                        <span className="rounded-full px-2 py-1 text-xs mr-2">    
                          {originCode} - {destinationCode}
                        </span>
                      </button>
                      <button
                        className={`py-2 px-4 flex items-center ${
                          activeDirection === "return" ? "bg-black text-white font-medium rounded-2xl" : "text-gray-500"
                        }`}
                        onClick={() => setActiveDirection("return")}
                      >
                        <span className="rounded-full px-2 py-1 text-xs mr-2">
                          {destinationCode} - {originCode}
                        </span>
                       
                      </button>
                    </section>
                  </div>
                )}
                  <div className="mb-6 block md:hidden">
              <div
                className={`border-b-4 rounded-lg p-4 flex items-center justify-between ${
                  selectedSeats[activeDirection] ? "border-green-500" : "border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <div className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs mr-3">
                    CR
                  </div>
                  <span className="font-medium text-sm md:text-base">{passengerName}</span>
                </div>
                {selectedSeats[activeDirection] ? (
                  <div className="flex items-center">
                    <span className="font-medium mr-3">{selectedSeats[activeDirection]}</span>
                    <button onClick={handleRemoveSeat} className="bg-gray-100 rounded-full p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500">Selecciona un asiento</span>
                )}
              </div>
              <div className=" rounded-lg mb-6">
              <div className="flex flex-row items-center justify-center py-3 bg-white shadow-2xl rounded-b-2xl gap-x-2 ">

                <div className="flex items-center ">
                
                   <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-bold text-sm md:text-base ">Asiento seleccionado</span>
                </div>
              
                <div className="flex items-center">
                  <div className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center mr-2">
                    <X className="w-3 h-3 text-gray-400" />
                  </div>
                  <span className="font-bold text-sm md:text-base">Asiento no disponible</span>
                </div>

              </div>
               </div>
                </div> 
              

                <div className="w-full flex justify-center mb-6">
                  <div className="w-full flex justify-between px-10 md:px-20">
                    <section className="flex items-center gap-x-8 mt-2">
                      <p>A</p>
                      <p>B</p>
                      <p>C</p>
                    </section>
                    <section className="flex items-center gap-x-8 mt-2">
                      <p>D</p>
                      <p>E</p>
                      <p>K</p>
                    </section>
                  </div>
                </div>

                {/* Icono de baños */}
                <div className="flex justify-start mb-8 px-6">
                  <div className="bg-gray-50 text-gray-800 px-3 py-2 rounded-full">
                    <Users />
                  </div>
                </div>

                {/* Sección Premium */}
                <div className="mb-8 px-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-purple-900">Premium</h3>
                    <span className="h-1 border-b border-gray-300"></span>
                    <span className="text-sm">
                      Desde <span className="font-bold">COP 72.000</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-4">
                    Siéntate en las primeras filas del avión y disfruta de más espacio y mayor reclinación.
                  </p>

                  {/* Filas Premium */}
                  <div className="space-y-3">
                    {[1, 2, 3].map((row) => (
                      <div key={row} className="grid grid-cols-6 gap-2">
                        {["A", "B", "C", "D", "E", "K"].map((col) => {
                          const seat = `${row}${col}`
                          const isOccupied = occupiedSeats.has(seat)
                          const isSelected = selectedSeats[activeDirection] === seat

                          return (
                            <button
                              key={seat}
                              onClick={() => !isOccupied && handleSeatSelection(seat)}
                              disabled={isOccupied}
                              className={`
                                w-10 h-10 rounded-full flex items-center justify-center text-sm
                                ${
                                  isSelected
                                    ? "bg-green-500 text-white"
                                    : isOccupied
                                      ? "bg-white border border-gray-300 text-gray-300 cursor-not-allowed"
                                      : "bg-purple-900 text-white hover:bg-purple-800"
                                }
                              `}
                            >
                              {isOccupied ? <X className="w-4 h-4" /> : `${row}${col}`}
                            </button>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sección Economy */}
                <div className="px-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">Economy</h3>
                    <span className="text-sm">
                      Desde <span className="font-bold">COP 30.000</span>
                    </span>
                  </div>

                  {/* Filas Economy */}
                  <div className="space-y-3">
                    {[4, 5, 6, 7, 8, 9, 10].map((row) => (
                      <div key={row} className="grid grid-cols-6 gap-2">
                        {["A", "B", "C", "D", "E", "K"].map((col) => {
                          const seat = `${row}${col}`
                          const isOccupied = occupiedSeats.has(seat)
                          const isSelected = selectedSeats[activeDirection] === seat

                          return (
                            <button
                              key={seat}
                              onClick={() => !isOccupied && handleSeatSelection(seat)}
                              disabled={isOccupied}
                              className={`
                                w-10 h-10 rounded-full flex items-center justify-center text-sm
                                ${
                                  isSelected
                                    ? "bg-green-500 text-white"
                                    : isOccupied
                                      ? "bg-white border border-gray-300 text-gray-300 cursor-not-allowed"
                                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }
                              `}
                            >
                              {isOccupied ? <X className="w-4 h-4" /> : `${row}${col}`}
                            </button>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </section>
        </div>

       
        {/* Botones de navegación */}
        <div className="w-full fixed bottom-0 z-50   bg-white px-6">
            <div className="text-lg text-black flex md:hidden justify-center items-center gap-x-2 mb-1 py-2">
              <span >
                Precio total asientos: 
                </span>
                <p className="font-black text-2xl"> COP {(seatPrices.outbound + seatPrices.return).toLocaleString("es-CO")}</p>
               
            </div>
          <section className="w-full flex justify-between items-center md:px-20 md:py-5">

          {!isDesktop && tripType === "roundTrip" && activeDirection === "outbound" && selectedSeats.outbound && (
          <div className=" w-full  py-3 px-4 shadow-md md:hidden">
            <button 
              onClick={handleJumpToReturn}
              className="w-full text-black rounded-3xl p-2  border font-black "
            >
             Siguiente vuelo
            </button>
          </div>
        )}


          <div className="hidden md:flex ">
             <button
            onClick={() => router.push("/servicios")}
            className="border border-gray-300 rounded-full px-6 py-2 text-gray-700 font-medium hover:bg-gray-100"
          >
            Atrás
          </button>
          </div>
        
       
          
            
   
          <div className="w-full text-right flex justify-end md:gap-x-4">
             <div className="text-sm text-black mb-1 hidden md:block">
              <p>Precio total asientos:</p>
              <span className="text-2xl font-black"> COP {(seatPrices.outbound + seatPrices.return).toLocaleString("es-CO")}</span>
              
            </div>
            <button
              onClick={handleContinue}
              className="bg-black text-white rounded-full px-8 py-3 font-black hover:bg-black/80"
            >
              Continuar
            </button>
          </div>
  </section>

        </div>
      </div>
    </main>
  )
}