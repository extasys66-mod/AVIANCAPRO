import { ArrowRight } from "lucide-react"

export function PreparateViajar() {
    const itemsCards = [
        {
            title: "Check-in online",
            description: "Obtén tu pase de abordar y ahorra tiempo en el aeropuerto.",
            icon: "/3.svg",
            link: "https://www.avianca.com/es/tu-reserva/check-in-online/",
        },
        {
            title: "Centro de ayuda",
            description: "Busca y encuentra información útil para resolver tus preguntas.",
            icon: "/2.svg",
            link: "https://ayuda.avianca.com/hc/es",
        },
        {
            title: "Requisitos para viajar",
            description: "Infórmate acerca de visas, vacunas y demás documentos.",
            icon: "1.svg",
            link: "https://ayuda.avianca.com/hc/es/sections/12994143912603",
        },
    ]

    return (
        <section className="w-full py-8 px-4 bg-[#F9FAFB]">
            <p className="text-center text-3xl font-black mb-8">Prepárate para viajar</p>
            
            <div className="md:px-6">
                {/* Contenedor para móvil (scroll horizontal) y desktop (grid) */}
                <div className="md:grid md:grid-cols-3 md:gap-6 flex overflow-x-auto pb-4 gap-4 scroll-smooth snap-x snap-mandatory">
                    {itemsCards.map((item, index) => (
                        <a
                            href={item.link}
                            key={index}
                            className="flex flex-row  bg-white items-start hover:bg-gray-50 rounded-lg transition-colors shadow-lg hover:shadow-xl w-[calc(95vw-2rem)] sm:w-[calc(50vw-2rem)]  md:w-full flex-shrink-0 snap-start"
                        >
                            <div className="flex items-center justify-center p-4 h-full">
                                <img 
                                    src={item.icon} 
                                    alt="icon" 
                                    className="w-20 h-20 md:w-full object-contain rounded-lg " 
                                />
                            </div>
                            <div className="flex-1 p-4 md:p-4 w-full">
                                <p className="text-xl font-bold mb-2 md:text-center">{item.title}</p>
                                <p className="text-gray-800 md:text-center">{item.description}</p>
                            </div>
                            <div className="md:hidden flex justify-center items-center h-full mr-4">
                                <ArrowRight />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}