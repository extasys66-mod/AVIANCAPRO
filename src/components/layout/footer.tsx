import type React from "react"
import { SiteLogo } from "@/components/ui/site-logo"
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react"
import Image from "next/image"
export function Footer() {

 
  return (
    <footer className="bg-[#1B1B1B] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <section className="flex flex-col md:flex-row md:justify-between items-center mb-5">
        <Image 
        src="/logo-footer.svg" 
        width={100}
        height={100}
        alt="airplane"
        className="w-[150px] h-[150px]" // Tailwind CSS
        // style={{ width: 100, height: 100 }} // Estilos en línea alternativos
      />
          <div className="flex flex-col items-center mb-5">

            <p className="mb-5">¡Siguenos!</p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white h-7 w-7 rounded-full flex items-center justify-center hover:bg-gray-100">
                {<Facebook className="w-5 h-5 text-black" />} 
              </a>
              <a href="#" className="bg-white h-7 w-7 rounded-full flex items-center justify-center hover:bg-gray-100">
                {<Twitter className="w-5 h-5 text-black" />} 
              </a>
              <a href="#" className="bg-white h-7 w-7 rounded-full flex items-center justify-center hover:bg-gray-100">
                {<Instagram className="w-5 h-5 text-black" />} 
              </a>
              <a href="#" className="bg-white h-7 w-7 rounded-full flex items-center justify-center hover:bg-gray-100">
                {<Youtube className="w-5 h-5 text-black" />} 
              </a>
              <a href="#" className="bg-white h-7 w-7 rounded-full flex items-center justify-center hover:bg-gray-100">
                {<Linkedin className="w-5 h-5 text-black" />} 
              </a>
          
           
            </div>
          </div>
        </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
  {/* Columna 1: Descubre y compra */}
  <div className="group">
    <input type="checkbox" id="acordeon-1" className="hidden peer" />
    <label htmlFor="acordeon-1" className="md:hidden flex justify-between items-center cursor-pointer">
      <h3 className="text-lg font-bold">Descubre y compra</h3>
      <svg className="w-5 h-5 transition-transform peer-checked:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </label>
    <h3 className="text-lg font-bold mb-4 hidden md:block">Descubre y compra</h3>
    <ul className="space-y-3 text-white flex-col hidden peer-checked:flex md:flex mt-5 md:mt-0">
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Vuelos baratos</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Reservas de hoteles ☑</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Alquiler de autos ☑</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Tours y excursiones ☑</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Asistencia en viaje</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">avianca connect ☑</a>
    </ul>
  </div>

  {/* Columna 2: Sobre nosotros */}
  <div className="group">
    <input type="checkbox" id="acordeon-2" className="hidden peer" />
    <label htmlFor="acordeon-2" className="md:hidden flex justify-between items-center cursor-pointer">
      <h3 className="text-lg font-bold">Sobre nosotros</h3>
      <svg className="w-5 h-5 transition-transform peer-checked:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </label>
    <h3 className="text-lg font-bold mb-4 hidden md:block">Sobre nosotros</h3>
    <ul className="space-y-3 text-white flex-col hidden peer-checked:flex md:flex mt-5 md:mt-0">
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Somos avianca</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Trabaja con nosotros ☑</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Noticias corporativas</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Alianzas y beneficios</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Sostenibilidad</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Plan de accesibilidad</a>
    </ul>
  </div>

  {/* Columna 3: Nuestros portales */}
  <div className="group">
    <input type="checkbox" id="acordeon-3" className="hidden peer" />
    <label htmlFor="acordeon-3" className="md:hidden flex justify-between items-center cursor-pointer">
      <h3 className="text-lg font-bold">Nuestros portales</h3>
      <svg className="w-5 h-5 transition-transform peer-checked:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </label>
    <h3 className="text-lg font-bold mb-4 hidden md:block">Nuestros portales</h3>
    <ul className="space-y-3 text-white flex-col hidden peer-checked:flex md:flex mt-5 md:mt-0">
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Programa lifemiles ☑</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">avianca empresas ☑</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">aviancadirect</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">avianca trade ☑</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">avianca cargo ☑</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Relación con inversionistas ☑</a>
    </ul>
  </div>

  {/* Columna 4: Enlaces rápidos */}
  <div className="group">
    <input type="checkbox" id="acordeon-4" className="hidden peer" />
    <label htmlFor="acordeon-4" className="md:hidden flex justify-between items-center cursor-pointer">
      <h3 className="text-lg font-bold">Enlaces rápidos</h3>
      <svg className="w-5 h-5 transition-transform peer-checked:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </label>
    <h3 className="text-lg font-bold mb-4 hidden md:block">Enlaces rápidos</h3>
    <ul className="space-y-3 text-white flex-col hidden peer-checked:flex md:flex mt-5 md:mt-0">
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Información legal</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Política de privacidad</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Contrato de transporte</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Artículos restringidos</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Plan de contingencia</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Contáctanos</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Factura electrónica</a>
      <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all">Cambios y reembolsos</a>
    </ul>
  </div>
</div>
        <div className="border-t border-gray-300 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className=" mb-4 md:mb-0 text-xs">© 2025 Aerolínea. Todos los derechos reservados.</div>
            <div className="flex space-x-6">
              <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all"> Términos y condiciones</a>
              <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all"> Política de privacidad</a>
              <a href="#" className="hover:font-black hover:text-lg hover:underline transition-all"> Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a href={href} className="text-gray-400 hover:text-white">
        {label}
      </a>
    </li>
  )
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a
      href="#"
      className="bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition"
    >
      {icon}
    </a>
  )
}
