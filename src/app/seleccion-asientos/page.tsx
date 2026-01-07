import { Armchair, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SiteLogo } from "@/components/ui/site-logo"
import Image from "next/image"

export default function SeleccionAsientosPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-red-100 rounded-full p-4">
              <Armchair className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-8">Selección de asientos</h1>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Elige tu asiento preferido y viaja más cómodo
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-4">Asiento estándar</h3>
              <p className="text-gray-600 mb-4">Asientos en la cabina principal con espacio estándar.</p>
              <div className="text-red-600 font-bold text-2xl mb-2">Desde $25.000</div>
              <div className="text-gray-500">por trayecto</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-4">Asiento con más espacio</h3>
              <p className="text-gray-600 mb-4">Mayor espacio para las piernas en filas específicas.</p>
              <div className="text-red-600 font-bold text-2xl mb-2">Desde $45.000</div>
              <div className="text-gray-500">por trayecto</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-4">Asiento preferencial</h3>
              <p className="text-gray-600 mb-4">Ubicados en la parte delantera para un desembarque más rápido.</p>
              <div className="text-red-600 font-bold text-2xl mb-2">Desde $60.000</div>
              <div className="text-gray-500">por trayecto</div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Mapa de asientos</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="relative w-full h-64 md:h-96 mx-auto max-w-3xl">
                <Image
                  src="/placeholder.svg?height=400&width=800"
                  alt="Mapa de asientos del avión"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="flex justify-center mt-6 space-x-8">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
                  <span className="text-sm">Disponible</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-300 rounded-sm mr-2"></div>
                  <span className="text-sm">Ocupado</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-200 rounded-sm mr-2"></div>
                  <span className="text-sm">Seleccionado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Beneficios de seleccionar tu asiento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Mayor comodidad</h4>
                  <p className="text-gray-600">Elige el asiento que mejor se adapte a tus preferencias.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Viaja junto a tus acompañantes</h4>
                  <p className="text-gray-600">Asegura asientos contiguos para tu grupo o familia.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Embarque prioritario</h4>
                  <p className="text-gray-600">Algunos asientos incluyen embarque prioritario.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Tranquilidad</h4>
                  <p className="text-gray-600">Evita la asignación aleatoria de asientos en el check-in.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition inline-block"
            >
              Seleccionar asiento
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
