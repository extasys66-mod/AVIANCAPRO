"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, MapPin, Plane, Users, Calendar, ArrowLeft, X } from "lucide-react"
import { RadioSelector } from "@/components/ui/radio-selector"
import { LocationDropdown } from "@/components/flight/location-dropdown"
import { PassengersDropdown } from "@/components/flight/passengers-dropdown"
import type { TripType, Location } from "@/types/flight"
import { popularDestinations } from "@/lib/flight-data"
import { DatePicker } from "@/components/ui/date-picker"

export default function SearchForm() {
  const router = useRouter()
  const [tripType, setTripType] = useState<TripType>("roundTrip")
  const [origin, setOrigin] = useState<Location | null>({ name: "Bogotá", code: "BOG", country: "Colombia" })
  const [destination, setDestination] = useState<Location | null>(null)
  const [passengers, setPassengers] = useState<number>(1)
  const [showOriginDropdown, setShowOriginDropdown] = useState(false)
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false)
  const [showPassengersDropdown, setShowPassengersDropdown] = useState(false)

  // Función para obtener la fecha actual y una futura en formato YYYY-MM-DD
  const getInitialDates = () => {
    const today = new Date();
    const departure = new Date(today);
    const comeback = new Date(today);
    comeback.setDate(today.getDate() + 7); // 7 días después
    return {
      departure: departure.toISOString().split('T')[0],
      comeback: comeback.toISOString().split('T')[0]
    };
  };

  const [departureDate, setDepartureDate] = useState<string>(getInitialDates().departure)
  const [returnDate, setReturnDate] = useState<string>(getInitialDates().comeback)
  const [isLoading, setIsLoading] = useState(false)
  const [styleError, setStyleError] = useState(false)
  const [showRadioSelector, setShowRadioSelector] = useState(true)
  const [isSticky, setIsSticky] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Estados para el flujo móvil
  const [mobileStep, setMobileStep] = useState<
    "initial" | "origin" | "destination" | "dates" | "passengers" | "summary"
  >("initial")
  const [showMobileModal, setShowMobileModal] = useState(false)
  const [mobileModalTitle, setMobileModalTitle] = useState("")
  const [showSummaryModal, setShowSummaryModal] = useState(false)

  // Obtener la fecha actual en formato YYYY-MM-DD sin ajustes de zona horaria
  const getTodayFormatted = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1 // getMonth() devuelve 0-11
    const day = today.getDate()

    return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
  }

  // Usar esta función para establecer la fecha mínima
  const today = getTodayFormatted()

  const handleSearch = () => {
    if (!origin || !destination || !departureDate) {
      setStyleError(true)
      return
    }

    const searchParams = new URLSearchParams()
    searchParams.append("origin", `${origin.name} (${origin.code})`)
    searchParams.append("destination", `${destination.name} (${destination.code})`)
    searchParams.append("departureDate", departureDate)
    if (tripType === "roundTrip") {
      searchParams.append("returnDate", returnDate)
      setIsLoading(true)
    }
    searchParams.append("passengers", passengers.toString())
    searchParams.append("tripType", tripType)
    setIsLoading(false)

    router.push(`/resultados?${searchParams.toString()}`)
  }

  // Función para abrir el modal móvil con el paso correspondiente
  const openMobileModal = (step: "origin" | "destination" | "dates" | "passengers") => {
    // Guardar el paso anterior si estamos en la modal de resumen
    if (showSummaryModal) {
      setShowSummaryModal(false)
    }

    setMobileStep(step)
    setShowMobileModal(true)

    // Establecer el título del modal según el paso
    switch (step) {
      case "origin":
        setMobileModalTitle("Origen")
        break
      case "destination":
        setMobileModalTitle("Destino")
        break
      case "dates":
        setMobileModalTitle("Fechas")
        break
      case "passengers":
        setMobileModalTitle("Pasajeros")
        break
    }
  }

  // Función para cerrar el modal móvil
  const closeMobileModal = () => {
    setShowMobileModal(false)

    // Si ya se han completado los campos principales, mostrar el modal de resumen
    if (origin && destination && !showSummaryModal) {
      setMobileStep("initial")
    }
  }

  // Función para manejar la selección de origen en móvil
  const handleMobileOriginSelect = (location: Location) => {
    setOrigin(location)
    setShowMobileModal(false)

    // Si aún no hay destino, pasar al paso de destino
    if (!destination) {
      setTimeout(() => {
        openMobileModal("destination")
      }, 300)
    } else {
      // Si venimos de la modal de resumen, volver a ella
      if (mobileStep === "summary") {
        setTimeout(() => {
          setShowSummaryModal(true)
        }, 300)
      } else {
        checkIfAllFieldsCompleted()
      }
    }
  }

  // Función para manejar la selección de destino en móvil
  const handleMobileDestinationSelect = (location: Location) => {
    setDestination(location)
    setStyleError(false)
    setShowMobileModal(false)

    // Si venimos de la modal de resumen, volver a ella
    if (mobileStep === "summary") {
      setTimeout(() => {
        setShowSummaryModal(true)
      }, 300)
    } else if (departureDate === today) {
      // Si aún no se han seleccionado fechas, pasar al paso de fechas
      setTimeout(() => {
        openMobileModal("dates")
      }, 300)
    } else {
      checkIfAllFieldsCompleted()
    }
  }

  // Función para manejar la selección de fechas en móvil
  const handleMobileDatesConfirm = () => {
    setShowMobileModal(false)

    // Si venimos de la modal de resumen, volver a ella
    if (mobileStep === "summary") {
      setTimeout(() => {
        setShowSummaryModal(true)
      }, 300)
    } else {
      // Pasar al paso de pasajeros
      setTimeout(() => {
        openMobileModal("passengers")
      }, 300)
    }
  }

  // Función para manejar la selección de pasajeros en móvil
  const handleMobilePassengersConfirm = () => {
    setShowMobileModal(false)

    // Siempre volver a la modal de resumen después de confirmar pasajeros
    setTimeout(() => {
      setShowSummaryModal(true)
      setMobileStep("summary")
    }, 300)
  }

  // Verificar si todos los campos están completos y mostrar el modal de resumen
  const checkIfAllFieldsCompleted = () => {
    if (origin && destination && departureDate) {
      setShowSummaryModal(true)
      setMobileStep("summary")
    }
  }

  useEffect(() => {
    // Detectar si es móvil
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px es el breakpoint md de Tailwind
    }

    // Verificar al montar y al cambiar tamaño
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Solo ocultar el RadioSelector si NO es móvil
      if (!isMobile) {
        setShowRadioSelector(currentScrollY <= 10)
      }

      // Activar sticky después de cierto scroll
      setIsSticky(currentScrollY > 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("resize", checkIfMobile)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isMobile])

  useEffect(() => {
    if (destination) {
      setStyleError(false)
    }
  }, [destination])

  // Renderizar el modal móvil
  const renderMobileModal = () => {
    if (!showMobileModal) return null

    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Encabezado del modal */}
        <div className="flex items-center justify-between p-6 bg-black text-white ">
          <button onClick={closeMobileModal} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold">{mobileModalTitle}</h2>
          <button onClick={closeMobileModal} className="p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del modal según el paso */}
        <div className="flex-1 overflow-auto">
          {mobileStep === "origin" && (
            <div className="">
              <LocationDropdown
                locations={popularDestinations}
                onSelect={handleMobileOriginSelect}
                excludeCode={destination?.code}
                label="Origen"
                isOpen={true}
                onClose={() => {}}
                isMobileModal={true}
              />
            </div>
          )}

          {mobileStep === "destination" && (
            <div className="p-4">
              <LocationDropdown
                locations={popularDestinations}
                onSelect={handleMobileDestinationSelect}
                excludeCode={origin?.code}
                label="Destino"
                isOpen={true}
                onClose={() => {}}
                isMobileModal={true}
              />
            </div>
          )}

          {mobileStep === "dates" && (
            <div className="p-4 space-y-6">
              <div className="mb-6">
                <RadioSelector
                  options={[
                    { value: "roundTrip", label: "Ida y vuelta" },
                    { value: "oneWay", label: "Solo ida" },
                  ]}
                  value={tripType}
                  onChange={(value) => setTripType(value as TripType)}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Fecha de ida</h3>
                  <DatePicker
                    label="Ida"
                    value={departureDate}
                    onChange={setDepartureDate}
                    minDate={today}
                    isMobileView={true}
                  />
                </div>

                {tripType === "roundTrip" && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Fecha de vuelta</h3>
                    <DatePicker
                      label="Vuelta"
                      value={returnDate}
                      onChange={setReturnDate}
                      minDate={departureDate}
                   
                      isMobileView={true}
                    />
                  </div>
                )}
              </div>

              <button
                className="w-full bg-black text-white rounded-full py-3 font-medium mt-6"
                onClick={handleMobileDatesConfirm}
              >
                Continuar
              </button>
            </div>
          )}

          {mobileStep === "passengers" && (
            <div className="p-4">
              <h3 className="text-sm font-medium mb-4">Número de pasajeros</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Pasajeros</span>
                  <div className="flex items-center space-x-3">
                    <button
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                      onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    >
                      -
                    </button>
                    <span className="font-medium">{passengers}</span>
                    <button
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                      onClick={() => setPassengers(Math.min(9, passengers + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-black text-white rounded-full py-3 font-medium mt-6"
                onClick={handleMobilePassengersConfirm}
              >
                Confirmar
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Renderizar el modal de resumen
  const renderSummaryModal = () => {
    if (!showSummaryModal) return null

    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        {/* Encabezado del modal */}
        <div className="flex items-center justify-between p-6  bg-black text-white">
          <button onClick={() => setShowSummaryModal(false)} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold">Reserva tu vuelo</h2>
          <button onClick={() => setShowSummaryModal(false)} className="p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del modal de resumen */}
        <div className="flex-1 overflow-auto p-2">
          <div className="bg-white rounded-lg p-2 mb-4">
           
            {/* Origen y Destino */}
            <section className="w-full flex-1 flex items-center  rounded-xl gap-x-2 mt-5">
            <div
              className="w-[50%] flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-3"
              onClick={() => openMobileModal("origin")}
            >
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Origen</div>
                  <div className="font-medium">{origin?.code}</div>
                  <div className="text-xs">{origin?.name}</div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            <div
              className="w-[50%] flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-3"
              onClick={() => openMobileModal("destination")}
            >
              <div className="flex items-center">
                <Plane className="w-4 h-4 mr-2 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Destino</div>
                  <div className="font-medium">{destination?.code}</div>
                  <div className="text-xs">{destination?.name}</div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            </section>
           

            {/* Fechas */}
            <div
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-3"
              onClick={() => openMobileModal("dates")}
            >
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Ida</div>
                  <div className="font-medium">
                    {new Date(departureDate).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            {tripType === "roundTrip" && (
              <div
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-3"
                onClick={() => openMobileModal("dates")}
              >
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Vuelta</div>
                    <div className="font-medium">
                      {new Date(returnDate).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            )}

            {/* Pasajeros */}
            <div
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-3"
              onClick={() => openMobileModal("passengers")}
            >
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Pasajeros</div>
                  <div className="font-medium">{passengers}</div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Botón de búsqueda */}
          <button className="w-full bg-black text-white rounded-full py-3 font-medium" onClick={handleSearch}>
            {isLoading ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>
    )
  }

  // Renderizar la vista móvil inicial (solo origen y destino)
  const renderMobileInitialView = () => {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 ">
        <div className="flex flex-col space-y-4">
          {/* Selector de tipo de viaje */}

          {/* Origen y Destino */}
          <section className="w-full border border-gray-300 rounded-lg flex flex-row">
            {/* Origen */}
            <div className="w-[50%] relative hover:border-b-2 hover:border-green-500">
              <div className="rounded-lg p-2 cursor-pointer" onClick={() => openMobileModal("origin")}>
                <div className="text-xs text-gray-500 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Origen
                </div>
                <div className="font-medium">{origin ? `${origin.name} (${origin.code})` : "Seleccionar origen"}</div>
              </div>
            </div>

            <div className="flex justify-center items-center">
           <div className="border-l border-gray-300 h-10"></div>
           </div>

            {/* Destino */}
            <div className="w-[50%] relative hover:border-b-2 hover:border-green-500">
              <div
                className={`rounded-lg p-2 cursor-pointer ${styleError ? "border-red-500" : ""}`}
                onClick={() => openMobileModal("destination")}
              >
                <div className="text-xs text-gray-500 flex items-center">
                  <Plane className="w-4 h-4 mr-1" />
                  Destino
                </div>
                <div className="font-medium">
                  {destination ? `${destination.name} (${destination.code})` : "Seleccionar destino"}
                </div>
              </div>
            </div>

          </section>

          {/* Botón de búsqueda */}
          {origin && destination ? (
            <button
              className="bg-black text-white rounded-full py-3 font-medium hover:bg-black/80 transition w-full"
              onClick={checkIfAllFieldsCompleted}
            >
              Continuar
            </button>
          ):(
            <button
              className="bg-black text-white rounded-full py-3 font-medium hover:bg-black/80 transition w-full"
             onClick={() => openMobileModal("destination")}
            >
              Buscar
            </button>
          )}
       
        </div>
      </div>
    )
  }

  // Vista para escritorio
  const renderDesktopView = () => {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="bg-white flex flex-col md:flex-row items-center gap-2">
          {/* Origen y Destino pegados */}
          <div className="flex flex-col md:flex-row w-full md:w-auto">
            <section className="border border-gray-300 rounded-lg flex">
              {/* Origen */}
              <div className="md:w-[250px] relative hover:border-b-2 hover:border-green-500">
                <div className="rounded-lg p-2 cursor-pointer" onClick={() => setShowOriginDropdown(true)}>
                  <div className="text-xs text-gray-500 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Origen
                  </div>
                  <div className="font-medium">{origin ? `${origin.name} (${origin.code})` : "Seleccionar origen"}</div>
                </div>
                <section className="absolute w-[100%] md:w-[700px] z-10 mt-8">
                  <LocationDropdown
                    locations={popularDestinations}
                    onSelect={setOrigin}
                    excludeCode={destination?.code}
                    label="Origen"
                    isOpen={showOriginDropdown}
                    onClose={() => setShowOriginDropdown(false)}
                  />
                </section>
              </div>

              <div className="flex justify-center items-center">
                <div className="border-l border-gray-300 h-10"></div>
              </div>

              {/* Destino */}
              <div className="md:w-[250px] hover:border-b-2 hover:border-green-500 relative mt-2 md:mt-0 md:ml-2">
                <div
                  className={`p-2 cursor-pointer ${styleError ? "border-red-500" : ""}`}
                  onClick={() => setShowDestinationDropdown(true)}
                >
                  <div className="text-xs text-gray-500 flex items-center">
                    <Plane className="w-4 h-4 mr-1" />
                    Destino
                  </div>
                  <div className="font-medium">
                    {destination ? `${destination.name} (${destination.code})` : "Seleccionar destino"}
                  </div>
                </div>
                <section className="absolute w-[100%] md:w-[700px] z-10">
                  <LocationDropdown
                    locations={popularDestinations}
                    onSelect={setDestination}
                    excludeCode={origin?.code}
                    label="Destino"
                    isOpen={showDestinationDropdown}
                    onClose={() => setShowDestinationDropdown(false)}
                  />
                </section>
              </div>
            </section>
          </div>

          <section className="border border-gray-300 rounded-lg  hover:border-b-2 hover:border-b-green-500 hidden md:flex">
            {/* Fecha Ida */}
            <div className="w-full md:w-[180px]">
              <DatePicker label="Ida" value={departureDate} onChange={setDepartureDate} minDate={today} />
            </div>

            <div className="flex justify-center items-center px-3">
              <div className="border-l border-gray-300 h-10"></div>
            </div>

            {/* Fecha Vuelta */}
            <div className="w-full md:w-[180px]">
              <DatePicker
                label="Vuelta"
                value={returnDate}
                onChange={setReturnDate}
                minDate={departureDate}
                disabled={tripType === "oneWay"}
              />
            </div>
          </section>

          {/* Pasajeros */}
          <div className="w-full md:w-[160px] relative hidden md:block">
            <div
              className="border border-gray-300 rounded-lg p-2 cursor-pointer"
              onClick={() => setShowPassengersDropdown(!showPassengersDropdown)}
            >
              <div className="text-xs text-gray-500 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Pasajeros
              </div>
              <div className="font-medium flex items-center justify-between">
                <span>{passengers}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {showPassengersDropdown && (
              <PassengersDropdown
                value={passengers}
                onChange={setPassengers}
                onClose={() => setShowPassengersDropdown(false)}
              />
            )}
          </div>

          {/* Botón de búsqueda */}
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <button
              className="bg-black text-white rounded-full px-12 py-3 font-medium hover:bg-black/80 transition w-full md:w-auto"
              onClick={handleSearch}
            >
              {isLoading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section
      className={`bg-white/40 rounded-2xl sticky top-0 z-50 transition-all ${isSticky ? "shadow-lg bg-white" : ""}`}
    >
      <div
        className={`transition-all duration-300 overflow-hidden ${
          (showRadioSelector || isMobile) && mobileStep !== "summary" ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="h-4"></p>
        <div className="w-[300px] bg-white flex mb-4 py-2 justify-center items-center rounded-2xl ml-4 md:block  ">
          <RadioSelector
            options={[
              { value: "roundTrip", label: "Ida y vuelta" },
              { value: "oneWay", label: "Solo ida" },
            ]}
            value={tripType}
            onChange={(value) => setTripType(value as TripType)}
          />
        </div>
      </div>

      {/* Vista para móvil */}
      {isMobile ? renderMobileInitialView() : renderDesktopView()}

      {/* Modal móvil para selección de campos */}
      {renderMobileModal()}

      {/* Modal de resumen con todos los datos */}
      {renderSummaryModal()}
    </section>
  )
}