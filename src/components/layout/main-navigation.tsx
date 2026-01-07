"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { SiteLogo } from "@/components/ui/site-logo"
import { Menu, X, User, Globe, Phone, LogOut, CircleDollarSign, TriangleAlert } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function MainNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const [alert, setAlert] = useState(true)
  const [isSticky, setIsSticky] = useState(false)

  // Efecto para manejar el scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const Reservar = true
  const Hoteles = true
  const CheckIn = true
  const EstadoVuelo = true
  const MisViajes = true

  const handleAlert = () => {
    setAlert(!alert)
  }

  return (
    <header className="bg-white shadow-sm">
      {/* Top alert - no sticky */}
      {alert && (
        <div className="bg-[#E7F7F1]">
          <section className="flex justify-between items-center w-full h-full px-4 py-2 text-sm text-gray-700">
            <TriangleAlert className="text-[#0190A0] w-6 h-6 mr-2" />
            <p className="text-[#0190A0] text-xs md:font-black md:text-lg">
              Consulta las nuevas exigencias de Certificado Internacional de Vacunación contra la Fiebre Amarilla para personas viajando hacia Ecuador y Costa Rica.
            </p>
            <button className="text-[#0190A0] font-display-bold" onClick={handleAlert}>
              <X className="w-6 h-6" />
            </button>
          </section>
        </div>
      )}
     
      {/* Top Bar - no sticky */}
      <div className="bg-[#1B1B1B] py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center">
            <div className="flex items-end space-x-4 text-sm text-white font-display">
              <a href="#" className="flex items-center hover:text-gray-900">
                <Globe className="w-4 h-4 mr-1" />
                <span>Español</span>
              </a>
              <span>|</span>
              <a href="#" className="flex items-center hover:text-gray-900">
                <CircleDollarSign className="w-4 h-4 mr-1" />
                <span>Colombia (COP)</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Sticky */}
      <div  className={`w-full bg-white z-50 transition-all duration-300 ${
        isSticky ? 'md:fixed top-0 left-0 right-0 shadow-lg' : 'relative'
      }`}>
        <div className="container mx-auto px-6 flex items-center h-[70px]">
          <div className="w-[20%]">
            <Link href="/" className="flex items-center">
              <SiteLogo className="h-8" />
            </Link>
          </div>
          
          <div className="flex-1 flex h-full w-[70%] justify-end md:justify-normal">
            {/* Desktop Navigation */}
            <section className="hidden md:flex flex-1 h-full w-[70%]">
              <div className={Reservar ? "group flex-1 flex h-full justify-center items-center hover:border-b-4 border-green-500 transition-colors duration-200 cursor-pointer" : ""}>
                <a href="/" className="">Reservar</a>
              </div>
              
              <div className={Hoteles ? "flex-1 flex h-full justify-center items-center hover:border-b-4 border-red-500 transition-colors duration-200 cursor-pointer" : ""}>
                <a href="/">Ofertas y destinos</a>
              </div>
              
              <div className={CheckIn ? "flex-1 flex h-full justify-center items-center hover:border-b-4 border-blue-500 transition-colors duration-200 cursor-pointer" : ""}>
                <a href="/">Tu reserva <span className="text-white bg-blue-500 px-2 rounded-lg">Check-in</span></a>
              </div>
              
              <div className={EstadoVuelo ? "flex-1 flex h-full justify-center items-center hover:border-b-4 border-rose-500 transition-colors duration-200 cursor-pointer" : ""}>
                <a href="/">Estado del vuelo</a>
              </div>
              
              <div className={MisViajes ? "flex-1 flex h-full justify-center items-center hover:border-b-4 border-orange-500 transition-colors duration-200 cursor-pointer" : ""}>
                <a href="/">Mis viajes</a>  
              </div>
            </section>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Espacio para compensar cuando el header se hace sticky */}


      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <MobileNavItem href="/" label="Vuelos" />
              <MobileNavItem href="#" label="Hoteles" />
              <MobileNavItem href="#" label="Paquetes" />
              <MobileNavItem href="/check-in" label="Check-in" />
              <MobileNavItem href="/estado-vuelo" label="Estado del vuelo" />
              <MobileNavItem href="/mis-viajes" label="Mis viajes" />
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

function MobileNavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-gray-600 hover:text-gray-900 font-medium py-2 border-b border-gray-100">
      {label}
    </Link>
  )
}