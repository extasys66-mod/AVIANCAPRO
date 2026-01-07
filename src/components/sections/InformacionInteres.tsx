import { ArrowRight } from "lucide-react"
export function InformacionInteres() {
  
  const itemsCards = [
    {
      title: "Experiencia avianca",
      description: "¡Listo para despegar! Descubre los servicios a bordo que te ofrecemos al volar con nosotros.",
      icon: "https://static.avianca.com/media/o51lgtpq/descubre-servicios-a-bordo-experiencia-avianca-1.jpg",
      link: "https://www.avianca.com/es/informacion-y-ayuda/experiencia-avianca/?type=boton_experiencia",
    },
    {
      title: "Equipaje",
      description: "Entérate de las condiciones que debes tener en cuenta al momento de preparar tu equipaje.",
      icon: "https://static.avianca.com/media/1006/enterate-condiciones-equipaje.webp",
      link: "https://www.avianca.com/es/informacion-y-ayuda/equipaje/?type=boton_equipaje",
    },
    {
      title: "Unidos contra el fraude",
      description: "Protege tu viaje comprando tus tiquetes y servicios adicionales en nuestros canales oficiales.",
      icon: "https://static.avianca.com/media/i2gbq34w/unidos-contra-el-fraude.jpg",
      link: "https://ayuda.avianca.com/hc/es/articles/31084120490523-Protege-tu-viaje-comprando-en-sitios-oficiales",
    },
    {
      title: "Inspírate",
      description: "Explora nuestros destinos y planea tu próxima aventura. Sácale provecho a tu siguiente vuelo.",
      icon: "https://static.avianca.com/media/1244/tu-destino-ideal.png",
      link: "https://www.avianca.com/es/ofertas-destinos/destinos/",
    },
  ]

  return (
    <section className="w-full py-8 px-4 bg-[#F9FAFB]">
      <p className="text-center text-3xl font-black mb-8">Más información de interés</p>
      
      <div className="md:px-6">
        {/* Contenedor para móvil (scroll horizontal) y desktop (grid) */}
        <div className="md:grid sm:grid-cols-2 md:grid-cols-4 md:gap-6 flex overflow-x-auto pb-4 gap-4 scroll-smooth snap-x snap-mandatory">
          {itemsCards.map((item, index) => (
            <a
              href={item.link}
              key={index}
              className="flex flex-row md:flex-col bg-white items-start hover:bg-gray-50 rounded-lg transition-colors shadow-lg hover:shadow-xl w-[calc(95vw-2rem)] sm:w-[calc(50vw-2rem)] md:w-full flex-shrink-0 snap-start"
            >
              <div className="md:w-full h-full md:h-auto ">
                <img 
                  src={item.icon} 
                  alt="icon" 
                  className="w-40 h-full md:w-full md:h-48 object-cover rounded-lg " 
                />

              </div>
              <div className="md:flex-1 p-4 md:p-4 w-full">
                <p className="text-xl font-bold mb-2 md:text-center">{item.title}</p>
                <p className="text-gray-800  md:text-center">{item.description}</p>
              </div>
              <div className="md:hidden flex justify-center items-center h-full mr-2">
                <ArrowRight />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}