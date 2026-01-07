import { ArrowRight } from "lucide-react"

export function Experiencia() {
  
  const itemsCards = [
    {
        title: "Reserva de hoteles",
        description: "Cientos de alojamientos con hasta 15% DCTO te esperan en",
        icon: "/icon-hoteles.svg",
        link: "https://sp.booking.com/dealspage.html?aid=2434507&label=hotels_banner_experiencia",
        titleLink:"Booking.com.",
    },
    {
      title: "Alquiler de autos",
      description: "Movilízate a tu ritmo con hasta 15% DCTO en tu próximo destino con",
      icon: "/icon-alquiler-autos.svg",
      link: "https://www.rentalcars.com/?affiliateCode=avianca695&adplat=cardlandingpage",
      titleLink:"Rentalcars.com..",
    },
    {
       title: "Tours y excursiones",
      description: "Descubre actividades en los principales destinos turísticos del mundo con",
      icon: "/icon-civitatis.svg",
      link: "https://avianca.civitatis.com/es/",
      titleLink:"Civitatis.",
    },
    {
      title: "Todo en una sola reserva",
      description: "Muy pronto podrás comprar tus tiquetes aéreos + alojamiento, auto y más en un solo lugar.",
      icon: "/paquetes.svg",
      link: "",
      titleLink:"Avianca.com.",
    },
  ]

  return (
    <section className="w-full py-8 px-4 bg-[#F9FAFB]">
      <p className="text-center text-3xl font-black mb-8">Complementa tu experiencia</p>
      
      <div className="md:px-6">
        {/* Contenedor para móvil (scroll horizontal) y desktop (grid) */}
        <div className="md:grid md:grid-cols-4 md:gap-6 flex overflow-x-auto pb-4 gap-4 scroll-smooth snap-x snap-mandatory">
          {itemsCards.map((item, index) => (
            <a
              href={item.link}
              key={index}
              className="flex flex-row md:flex-col bg-white items-start justify-center hover:bg-gray-50 rounded-lg transition-colors shadow-lg hover:shadow-xl w-[calc(95vw-2rem)] sm:w-[calc(50vw-2rem)] md:w-full flex-shrink-0 snap-start"
            >
              <div className="md:w-full h-full md:h-auto ">
                <img 
                  src={item.icon} 
                  alt="icon" 
                  className="w-40 h-full md:w-full md:h-20 object-contain rounded-lg " 
                />

              </div>
              <div className="md:flex-1 h-full mt-10 md:mt-0 md:p-4 w-full   justify-center items-center">
                <p className="text-xl font-bold mb-2 md:text-center">{item.title}</p>
                <p className="text-gray-800  md:text-center">{item.description} <span className="text-cyan-600 font-medium hover:text-cyan-700 transition underline">{item.titleLink}</span></p> 
              </div>
              
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}