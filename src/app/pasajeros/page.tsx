"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronRight, ShoppingCart } from "lucide-react"
import { SiteLogo } from "@/components/ui/site-logo"
import {PlaneTakeoff} from "lucide-react"
import Image from "next/image";
import Link  from "next/link";


export default function PasajerosPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Datos del formulario
  const [passengerData, setPassengerData] = useState({
    gender: "",
    firstName: "",
    lastName: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    nationality: "",
    frequentFlyer: "",



  })

  // Datos del titular
  const [holderData, setHolderData] = useState({
    passenger: "same", // "same" o "other"
    prefix: "+57",
    phone: "",
    email: "",
    confirmacionEmail : "",
  })

  // Validación
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Obtener parámetros de los vuelos
  const origin = searchParams.get("outboundOrigin") || ""
  const destination = searchParams.get("outboundDestination") || ""
  const departureDate = searchParams.get("departureDate") || ""
  const tripType = searchParams.get("tripType") || "oneWay"
  const passengers = Number.parseInt(searchParams.get("passengers") || "1")



  // Datos del vuelo de ida
  const outboundFlightId = searchParams.get("outboundFlightId") || ""
  const outboundOrigin = searchParams.get("outboundOrigin") || ""
  const outboundDestination = searchParams.get("outboundDestination") || ""
  const outboundDepartureTime = searchParams.get("outboundDepartureTime") || ""
  const outboundArrivalTime = searchParams.get("outboundArrivalTime") || ""
  const outboundPrice = Number.parseInt(searchParams.get("outboundPrice") || "0")
  const outboundFareType = searchParams.get("outboundFareType") || ""
  const outboundDepartureDate = searchParams.get("outboundDepartureDate") || searchParams.get("outbaundDepartureDate") || ""
 

  // Datos del vuelo de vuelta (si aplica)
  const returnFlightId = searchParams.get("returnFlightId") || ""
  const returnOrigin = searchParams.get("returnOrigin") || ""
  const returnDestination = searchParams.get("returnDestination") || ""
  const returnDepartureTime = searchParams.get("returnDepartureTime") || ""
  const returnArrivalTime = searchParams.get("returnArrivalTime") || ""
  const returnPrice = Number.parseInt(searchParams.get("returnPrice") || "0")
  const returnFareType = searchParams.get("returnFareType") || ""
  const returnDate = searchParams.get("returnReturn") || searchParams.get("outboundReturn") || searchParams.get("outbaundReturn") || ""
   


  useEffect(() => {
    // Verificar que tenemos los datos necesarios
    if (!outboundFlightId || !outboundOrigin || !outboundDestination) {
      console.log("Missing outbound data", { outboundFlightId, outboundOrigin, outboundDestination })
      // router.push("/")
      // return
    }

    // Si es un viaje de ida y vuelta, verificar que tenemos los datos del vuelo de vuelta
    if (tripType === "roundTrip" && (!returnFlightId || !returnOrigin || !returnDestination)) {
      console.log("Missing return data for roundTrip", { tripType, returnFlightId, returnOrigin, returnDestination })
      // router.push("/")
      // return
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
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Determinar si el campo pertenece al pasajero o al titular
    if (name.startsWith("holder")) {
      const fieldName = name.replace("holder", "").toLowerCase()
      setHolderData((prev) => ({
        ...prev,
        [fieldName]: value,
      }))
    } else {
      setPassengerData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Limpiar error si existe
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validar datos del pasajero
    if (!passengerData.gender) newErrors.gender = "Seleccione un género"
    if (!passengerData.firstName.trim()) newErrors.firstName = "Ingrese el nombre"
    if (!passengerData.lastName.trim()) newErrors.lastName = "Ingrese el apellido"
    if (!passengerData.birthDay) newErrors.birthDay = "Seleccione el día"
    if (!passengerData.birthMonth) newErrors.birthMonth = "Seleccione el mes"
    if (!passengerData.birthYear) newErrors.birthYear = "Seleccione el año"
    if (!passengerData.nationality) newErrors.nationality = "Seleccione la nacionalidad"


    // Validar datos del titular
    if (holderData.passenger === "other") {
      if (!holderData.phone.trim()) newErrors.holderPhone = "Ingrese un teléfono"
      if (!holderData.email.trim()) newErrors.holderEmail = "Ingrese un email"
      if (holderData.email.trim() && !holderData.email.includes("@")) {
        newErrors.holderEmail = "Ingrese un email válido"
      }
    }

    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    // Aquí iría la lógica para enviar los datos y continuar
    // Por ahora, simplemente redirigimos a la siguiente página

    // Crear parámetros para la siguiente página
    const nextParams = new URLSearchParams(searchParams.toString())

    // Añadir datos del pasajero
    nextParams.set("passengerGender", passengerData.gender)
    nextParams.set("passengerFirstName", passengerData.firstName)
    nextParams.set("passengerLastName", passengerData.lastName)

    // Redirigir a la página de servicios
    router.push(`/servicios?${nextParams.toString()}`)
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

  // Calcular precio total
  const totalPrice = outboundPrice + (tripType === "roundTrip" ? returnPrice : 0)

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm hidden md:block">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <SiteLogo className="h-8" />
               <div className="">
                <div className="text-center flex flex-col">
                  <div className="flex">
                    <h1 className="text-lg font-bold">
                      {origin.slice(0, origin.length - 5)} a {destination.slice(0, destination.length - 5)}
                    </h1>
                  </div>
                  <div className="flex">
                    <section className="flex items-center gap-x-2 mt-2">
                      <p className="flex items-center gap-x-2">
                        <PlaneTakeoff width={20} color="black" /> {formatShortDate(outboundDepartureDate)}
                       
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
              <button className="bg-white border-2 border-black rounded-full px-4 py-2 text-sm font-medium flex items-center gap-x-2">
                <ShoppingCart height={20} width={20} color="black" />
                COP {totalPrice.toLocaleString("es-CO")}
              </button>
            </div>
          </div>
        </div>
      </header>

      <header className="bg-black shadow-sm block md:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
             <Link href="/" >
                    <Image src='/logomovil.svg' alt="logo" width={80} height={20} />
                    </Link>
            <div className="flex items-center">
              <button className="font-medium flex gap-x-2 items-center text-white">
                <div className="flex">
                  <ShoppingCart />
                <div className="relative h-3 w-3 bg-green-500 rounded-full -top-1 -left-1 "></div>
                  </div>
               <span>COP</span> 
               <span className="font-black">
                {totalPrice.toLocaleString("es-CO")}
               </span>
              
              </button>
            </div>
          </div>
        </div>
      </header>

      
      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumbs */}
        <div className=" hidden md:flex items-center text-sm mb-6 overflow-x-auto whitespace-nowrap gap-x-6 ">
          <div className="flex items-center text-gray-400">
            <span className="mr-2">Vuelos</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-black font-bold">
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

          <div className="block md:hidden">
                <div className="text-center flex flex-col">
                  <div className="flex">
                    <h1 className="text-lg font-bold">
                          {origin.slice(0, origin.length - 5)} a {destination.slice(0, destination.length - 5)}
                    </h1>
                  </div>
                  <div className="flex">
                    <section className="flex items-center gap-x-2 mt-2">
                      <p className="flex items-center gap-x-2">
                        <PlaneTakeoff width={20} color="black" /> {formatShortDate(outboundDepartureDate)}
                       
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

        <h1 className="text-2xl font-bold mb-6 mt-5">Pasajeros</h1>
        <p className="text-gray-600 mb-8">
          Ingresa el primer nombre y primer apellido (de cada pasajero) tal y como aparecen en el pasaporte o documento
          de identidad.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Datos del pasajero */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Adulto {passengers}:</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Género */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Género*
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={passengerData.gender}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.gender ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Seleccionar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
              </div>

              {/* Nombre */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={passengerData.firstName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Ingrese su nombre"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              {/* Apellido */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido*
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={passengerData.lastName}
                  onChange={handleInputChange}
                  className={`w-full p-3 border rounded-lg ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Ingrese su apellido"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            {/* Fecha de nacimiento */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento*</label>
              <div className="grid grid-cols-3 gap-4">
                <select
                  name="birthDay"
                  value={passengerData.birthDay}
                  onChange={handleInputChange}
                  className={`p-3 border rounded-lg ${errors.birthDay ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Día</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

                <select
                  name="birthMonth"
                  value={passengerData.birthMonth}
                  onChange={handleInputChange}
                  className={`p-3 border rounded-lg ${errors.birthMonth ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Mes</option>
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>

                <select
                  name="birthYear"
                  value={passengerData.birthYear}
                  onChange={handleInputChange}
                  className={`p-3 border rounded-lg ${errors.birthYear ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Año</option>
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              {(errors.birthDay || errors.birthMonth || errors.birthYear) && (
                <p className="mt-1 text-sm text-red-600">Por favor complete la fecha de nacimiento</p>
              )}
            </div>

            {/* Nacionalidad */}
            <div className="mb-6">
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                Nacionalidad de tu documento de viaje*
              </label>
              <select
                id="nationality"
                name="nationality"
                value={passengerData.nationality}
                onChange={handleInputChange}
                className={`w-full p-3 border rounded-lg ${errors.nationality ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Seleccionar</option>
                <option value="CO">Colombia</option>
                <option value="US">Estados Unidos</option>
                <option value="ES">España</option>
                <option value="MX">México</option>
                <option value="AR">Argentina</option>
                <option value="BR">Brasil</option>
                <option value="CL">Chile</option>
                <option value="PE">Perú</option>
                <option value="EC">Ecuador</option>
                <option value="VE">Venezuela</option>
              </select>
              {errors.nationality && <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>}
            </div>

            {/* Programa de viajero frecuente */}
            <div>
              <label htmlFor="frequentFlyer" className="block text-sm font-medium text-gray-700 mb-1">
                Programa de viajero frecuente (opcional)
              </label>
              <select
                id="frequentFlyer"
                name="frequentFlyer"
                value={passengerData.frequentFlyer}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="">Seleccionar</option>
                <option value="lifemiles">LifeMiles</option>
                <option value="aadvantage">American Airlines AAdvantage</option>
                <option value="skyteam">SkyTeam</option>
                <option value="staralliance">Star Alliance</option>
              </select>
            </div>
          </div>

          {/* Titular de la reserva */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Titular de la reserva</h2>
            <p className="text-gray-600 mb-4">
              Será la persona que recibirá la confirmación de la reserva y la única autorizada para solicitar cambios o
              reembolsos.
            </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="holderPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono*
                  </label>
                  <div className="flex">
                    <select
                      name="holderPrefix"
                      value={holderData.prefix}
                      onChange={handleInputChange}
                      className="w-24 p-3 border border-gray-300 rounded-l-lg"
                    >
                      <option value="+57">+57</option>
                      <option value="+1">+1</option>
                      <option value="+34">+34</option>
                      <option value="+52">+52</option>
                      <option value="+54">+54</option>
                      <option value="+55">+55</option>
                      <option value="+56">+56</option>
                      <option value="+51">+51</option>
                      <option value="+593">+593</option>
                      <option value="+58">+58</option>
                    </select>
                    <input
                      type="tel"
                      id="holderPhone"
                      name="holderPhone"
                      value={holderData.phone}
                      onChange={handleInputChange}
                      className={`flex-1 p-3 border border-gray-300 rounded-r-lg ${errors.holderPhone ? "border-red-500" : ""}`}
                      placeholder="Número de teléfono"
                    />
                  </div>
                  {errors.holderPhone && <p className="mt-1 text-sm text-red-600">{errors.holderPhone}</p>}
                </div>

                <div>
                  <label htmlFor="holderEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="holderEmail"
                    name="holderEmail"
                    value={holderData.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg ${errors.holderEmail ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Correo electrónico"
                  />
                  {errors.holderEmail && <p className="mt-1 text-sm text-red-600">{errors.holderEmail}</p>}
                </div>
              </div>
        
          </div>

          {/* Botón de continuar */}
          <div className="fixed bottom-0 left-0 right-0  p-4 z-20">
            <div className="container mx-auto flex justify-end items-center">
            
              <button
                type="submit"
                className="bg-black text-white rounded-full px-8 py-3 font-medium hover:bg-black/80 transition"
              >
                Continuar
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
