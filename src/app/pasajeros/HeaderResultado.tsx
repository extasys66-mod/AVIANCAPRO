import { useRouter } from "next/navigation"
import { PlaneTakeoff } from "lucide-react"
import { SiteLogo } from "@/components/ui/site-logo"

interface HeaderResultadoProps {
 origin: string
 destination: string
 originCity: string
 destinationCity: string
 departureDate: string
 returnDate: string | null
 passengers: number
 tripType: string
 formatShortDate: (dateString: string) => string
 calculateTotalPrice: () => number
}


export default function HeaderResultado({origin, destination, originCity, destinationCity, departureDate, returnDate, passengers, tripType, formatShortDate, calculateTotalPrice}: HeaderResultadoProps) {
     const  router = useRouter()
  return (
    <>
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
    
          <header className="bg-zinc-900 shadow-sm block md:hidden h-10">
    
          </header>

          </>
  )}