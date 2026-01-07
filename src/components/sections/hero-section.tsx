import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative h-[250px] bg-gradient-to-r from-sky-800 to-sky-600 overflow-hidden mb-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/banner.png"
          alt="Destino turístico"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
       
      </div>

      {/* Content */}
    
    </section>
  )
}
