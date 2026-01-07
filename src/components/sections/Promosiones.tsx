import Image from "next/image"
export function PromotionsSectionOrigin() {
  return (
    <section className="w-full flex flex-col md:flex-row rounded-l-lg ">
        <div className="w-full md:w-[60%]">
         <div className="relative w-full h-[300px]">
            <Image
                src="/oferta.jpg"
                alt="Promociones"
                fill
                className="object-cover rounded-l-lg"
            />
            </div>

        </div>
        <div className="w-full md:w-[40%] bg-[#FF0000]">
            <article className="text-white mt-5 px-6">
                <p className="text-4xl md:text-5xl font-black">¡Viaja por <br/> <span className="text-5xl md:text-6xl">Colombia!</span> </p>
            </article>
            <article className="text-white px-6 mt-4 mb-4 w-[90%]">
                <p>¡Apresúrate! Compra hasta el 19 de mayo y vuela hasta septiembre 2025</p>
            </article>
            <article className="flex flex-col  text-white px-6 mb-4 md:mb-0  ">
                <p>Por trayecto desde</p>
                <div className="flex justify-between items-center mt-2">
                    <p className="text-3xl md:text-5xl font-black">COP 92.700</p>
                    <button className="bg-white text-black px-3 py-2 rounded-lg">Comprar ya</button>
                </div>
            </article>
        </div>
    </section>
  )}