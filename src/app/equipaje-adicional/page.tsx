import { Luggage, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SiteLogo } from "@/components/ui/site-logo"
import { MainNavigation } from "@/components/layout/main-navigation"

export default function EquipajeAdicionalPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <MainNavigation />
     

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-red-100 rounded-full p-4">
              <Luggage className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-8">Equipaje adicional</h1>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Viaja con todo lo que necesitas añadiendo maletas extra a tu reserva
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-4">Equipaje de mano</h3>
              <p className="text-gray-600 mb-4">
                Lleva contigo un artículo personal que quepa debajo del asiento delantero.
              </p>
              <div className="text-red-600 font-bold text-2xl mb-2">Incluido</div>
              <div className="text-gray-500">en todas las tarifas</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-4">Equipaje de bodega</h3>
              <p className="text-gray-600 mb-4">
                Incluye una maleta de hasta 23 kg para guardar en la bodega del avión.
              </p>
              <div className="text-red-600 font-bold text-2xl mb-2">Desde $50.000</div>
              <div className="text-gray-500">por trayecto</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-4">Equipaje extra</h3>
              <p className="text-gray-600 mb-4">
                Añade maletas adicionales para llevar todo lo que necesitas en tu viaje.
              </p>
              <div className="text-red-600 font-bold text-2xl mb-2">Desde $80.000</div>
              <div className="text-gray-500">por maleta adicional</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Información importante</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg mb-2">Dimensiones permitidas</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Equipaje de mano: 40 x 35 x 20 cm</li>
                  <li>Equipaje de bodega: suma de largo, ancho y alto no debe exceder 158 cm</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Artículos prohibidos</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Líquidos en envases mayores a 100 ml en equipaje de mano</li>
                  <li>Objetos punzantes o cortantes en equipaje de mano</li>
                  <li>Materiales peligrosos o inflamables</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition inline-block"
            >
              Añadir a mi reserva
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
