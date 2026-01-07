import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { SiteLogo } from "@/components/ui/site-logo"

export default function SeguroViajePage() {
  return (
    <main className="min-h-screen bg-gray-50">
     
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-red-100 rounded-full p-4">
              <Shield className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-8">Seguro de viaje</h1>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Protege tu viaje contra imprevistos y emergencias médicas
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-4">Cobertura básica</h3>
              <p className="text-gray-600 mb-4">
                Asistencia médica por enfermedad o accidente, pérdida de equipaje y retrasos.
              </p>
              <div className="text-red-600 font-bold text-2xl mb-2">$35.000</div>
              <div className="text-gray-500">por persona</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center border-2 border-red-500 relative">
              <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                RECOMENDADO
              </div>
              <h3 className="text-xl font-bold mb-4">Cobertura estándar</h3>
              <p className="text-gray-600 mb-4">
                Todo lo de la cobertura básica más cancelación de viaje y asistencia 24/7.
              </p>
              <div className="text-red-600 font-bold text-2xl mb-2">$65.000</div>
              <div className="text-gray-500">por persona</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold mb-4">Cobertura premium</h3>
              <p className="text-gray-600 mb-4">
                Cobertura completa con mayores límites y protección para deportes extremos.
              </p>
              <div className="text-red-600 font-bold text-2xl mb-2">$95.000</div>
              <div className="text-gray-500">por persona</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">¿Qué cubre nuestro seguro?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg mb-2">Asistencia médica</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Gastos médicos por enfermedad o accidente</li>
                  <li>Medicamentos recetados</li>
                  <li>Hospitalización</li>
                  <li>Atención dental de emergencia</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Equipaje y documentos</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Compensación por pérdida de equipaje</li>
                  <li>Demora en la entrega de equipaje</li>
                  <li>Asistencia en caso de pérdida de documentos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Cancelaciones e interrupciones</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Cancelación de viaje por causas justificadas</li>
                  <li>Interrupción de viaje</li>
                  <li>Reembolso por retrasos o cancelaciones de vuelos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Asistencia personal</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  <li>Asistencia legal</li>
                  <li>Traslado sanitario</li>
                  <li>Repatriación</li>
                  <li>Línea de consulta 24/7</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-6 mb-12">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
                <h3 className="text-xl font-bold mb-2">¿Por qué contratar un seguro de viaje?</h3>
                <p className="text-gray-600">
                  Los gastos médicos en el extranjero pueden ser muy elevados. Un seguro de viaje te protege contra
                  imprevistos y te brinda asistencia en momentos difíciles, permitiéndote disfrutar de tu viaje con
                  total tranquilidad.
                </p>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="bg-white rounded-full p-6 shadow-md">
                  <Shield className="w-16 h-16 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition inline-block"
            >
              Contratar seguro
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
