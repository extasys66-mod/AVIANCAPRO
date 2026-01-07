import Image from "next/image"
import Link from "next/link"

export function LifemilesSection() {

    const itemsLifemiles = [
        {
            title: "Suscríbete a lifemiles+",
            description: "Y recibe un descuento exclusivo al redimir tiquetes con avianca.",
            icon: "/bannerav_lmplus.png",
            link: "https://www.lifemiles.com/landing/clublm?utm_source=avianca&utm_medium=referral&utm_campaign=banner_secundario",
            titleLink:"Suscribirse ya",
         
        },
        {
            title: "Hasta 20,000 millas",
            description: "De bienvenida con tu tarjeta de crédito.",
            icon: "/thumbnail_cob_generica.png",
            link: "https://www.lifemiles.com/credit-card/get-credit-card?utm_source=avianca&utm_medium=referral&utm_campaign=banner_secundario",
            titleLink:"Aplica ya",
        },
        {
            title: "¡Suscríbete y gana el doble!",
            description: "2x1 en millas en rutas seleccionadas.",
            icon: "/background-banner-secundario-home-2x1.png",
            link: "https://www.lifemiles.com/bonus-subscription2x1/es/wr/MILLAS2X?&utm_source=avianca&utm_medium=referral&utm_campaign=GL_Monday0505_2Xmillas_home",
            titleLink:"Suscribirse",
        },
    ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Conoce las novedades de lifemiles</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {itemsLifemiles.map((item, index) => (
         <div
            key={item.title}
            className="relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer h-48 group"
            >

         {/* Imagen de fondo */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={item.icon}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

               <div className="absolute  z-10 p-4  ">
                      <div className={`py-2 px-4 rounded-lg ${index === 1 ? "text-black: " : "text-white "}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <h3 className="text-2xl font-bold ">{item.title}</h3>
                            {index === 0 && (
                            <p className="text-normal ">{item.description.slice(0, 31)}</p>
                            )}
                             {index === 0 && (
                            <p className="text-normal font-black">{item.description.slice(31, item.description.length)}</p>
                            )}
                            
                          
                            {index === 1 && (
                            <p className="text-normal ">{item.description.slice(0, 20)}</p>
                            )}
                              {index === 1 && (
                            <p className="font-black text-xl ">{item.description.slice(20, item.description.length)}</p>
                            )}

                            {index === 2 && (
                            <p className="text-normal ">{item.description.slice(0, 22)}</p>
                            )}
                               { index === 2 && (
                            <p className="font-black text-xl ">{item.description.slice(22, item.description.length)}</p>
                            )}
                          </div>
                        </div>
                         <div className="relative top-10">
                            <Link href={item.link} className={`px-3 py-2 rounded-xl font-black ${index === 1 ? "bg-black text-white" : "bg-white text-black"}`}>
                              {item.titleLink}
                             </Link>
                        </div>
                      </div>
             </div>

        </div>
           ))}
            </div>
        

      </div>
    </section>
  )
}
