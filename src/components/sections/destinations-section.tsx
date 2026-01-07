import { popularDestinations } from "@/lib/flight-data"

export function DestinationsSection() {
  // Agrupar destinos por país
  const destinationsByCountry: Record<string, typeof popularDestinations> = {}

  popularDestinations.forEach((destination) => {
    const country = destination.country || "Otros"
    if (!destinationsByCountry[country]) {
      destinationsByCountry[country] = []
    }
    destinationsByCountry[country].push(destination)
  })

  // Obtener los países más populares (con más destinos)
  const topCountries = Object.keys(destinationsByCountry)
    .sort((a, b) => destinationsByCountry[b].length - destinationsByCountry[a].length)
    .slice(0, 6)

  return (
    <section id="destinations" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Destinos populares</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explora nuestros destinos más visitados y encuentra inspiración para tu próximo viaje
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {topCountries.map((country) => (
            <div key={country} className="mb-10">
              <h3 className="text-xl font-bold mb-4 border-b pb-2">{country}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {destinationsByCountry[country].map((destination) => (
                  <div key={destination.code} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition">
                    <div className="font-medium">{destination.name}</div>
                    <div className="text-sm text-gray-500">{destination.code}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="#" className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700">
            Ver todos los destinos
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
