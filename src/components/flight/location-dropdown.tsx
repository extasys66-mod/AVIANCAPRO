"use client"

import { useState, useEffect, useRef } from "react"
import type { Location } from "@/types/flight"
import Image from "next/image"

interface LocationDropdownProps {
  locations: Location[]
  onSelect: (location: Location) => void
  excludeCode?: string
  label: string
  isOpen: boolean
  onClose: () => void
  isMobileModal?: boolean
}

export function LocationDropdown({
  locations,
  onSelect,
  excludeCode,
  label,
  isOpen,
  onClose,
  isMobileModal = false,
}: LocationDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !isMobileModal) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose, isMobileModal])

  const filteredLocations = locations
    .filter((loc) => loc.code !== excludeCode)
    .filter(
      (loc) =>
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (loc.country && loc.country.toLowerCase().includes(searchTerm.toLowerCase())),
    )

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className={`${isMobileModal ? "" : "absolute z-20 mt-1"} w-full bg-white md:border md:border-gray-300 md:rounded-xl md:shadow-lg max-h-full md:max-h-80 overflow-y-auto `}
    >
      <div className="p-4 sticky top-0 bg-white z-10 ">
        <section className="hidden md:flex ">
        <input
          ref={inputRef}
          type="text"
          className="w-full p-2 bg-white border border-gray-100 rounded focus:border-gray-300 outline-none"
          placeholder={`Buscar ciudad o aeropuerto`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </section>

        <section className="md:hidden flex items-center w-full border-b-3 border-b-green-500 border border-gray-300 rounded-xl ">
          <div className="w-[10%] px-2">
            <Image src="/avion.png" width={35} height={35} alt="airplane"  />
          </div>
          <div className="w-[90%] flex flex-col">
          <p className="ml-1">Destino</p>
          <input
            ref={inputRef}
            type="text"
            className="w-full focus:border-gray-300 outline-none px-2 mb-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          </div>
        </section>
       
      
      <section className="sticky top-0 bg-white z-10 ">

        <div className="hidden md:flex mt-2  justify-between space-x-2 bg-white py-2 rounded-xl px-4">

          <section>
            <p>Filtrar por</p>
          </section>
          <section className="flex space-x-2">
            <div className="flex items-center space-x-2">
            <button
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center gap-1 h-6 w-6 ${
            searchTerm === "" 
              ? "bg-green-500 text-white" 
              : "bg-white border border-gray-300"
          }`}
          onClick={() => setSearchTerm("")}
        >
          <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-white"></span>
        </button>
        <p>Destinos avianca</p>
            </div>
          <div className="flex items-center space-x-2">
   <button
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center gap-1 h-6 w-6 ${
            searchTerm === "internacional" 
              ? "bg-green-500 text-white" 
              : "bg-white border border-gray-300"
          }`}
          onClick={() => setSearchTerm("internacional")}
        >
          <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-white"></span>
        </button>
          <p>Destinos con aliados</p>
          </div>
      
          </section>
        
        </div>
        <div className="md:hidden flex mt-2  justify-between space-x-2 bg-gray-50 py-2 rounded-xl">
          <section className="w-full bg-white flex space-x-2 px-3 rounded-xl">
       <div className="flex items-center space-x-2">
            <button
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center gap-1 h-6 w-6 ${
            searchTerm === "" 
              ? "bg-green-500 text-white" 
              : "bg-white border border-gray-300"
          }`}
          onClick={() => setSearchTerm("")}
        >
          <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-white"></span>
        </button>
        <p>Destinos avianca</p>
            </div>
          <div className="flex items-center space-x-2 ">
   <button
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center gap-1 h-6 w-6 ${
            searchTerm === "internacional" 
              ? "bg-green-500 text-white" 
              : "bg-white border border-gray-300"
          }`}
          onClick={() => setSearchTerm("internacional")}
        >
          <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-white"></span>
        </button>
          <p>Destinos con aliados</p>
          </div>
          </section>
        </div>
      </section>

      </div>

      <div className="p-4 md:p-2">
        <div className="text-xs font-medium text-gray-500 mb-2 px-2">
          {filteredLocations.length} destinos encontrados
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((loc) => (
              <div
                key={loc.code}
                className="p-2 hover:bg-gray-100 cursor-pointer rounded flex justify-between items-center border-b border-gray-300"
                onClick={() => {
                  onSelect(loc)
                  if (!isMobileModal) {
                    onClose()
                  }
                }}
              >
                <div>
                  <div className="font-medium">{loc.name}</div>
                  <div className="text-xs text-gray-500">{loc.country}</div>
                </div>
                <div className="text-sm font-bold text-gray-500">{loc.code}</div>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500 text-sm col-span-2 text-center">No se encontraron resultados</div>
          )}
        </div>
      </div>
    </div>
  )
}
