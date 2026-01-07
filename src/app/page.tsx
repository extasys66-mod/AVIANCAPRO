'use client';

import { useState, useEffect } from 'react';
import SearchForm from "@/components/flight/search-form"
import { HeroSection } from "@/components/sections/hero-section"
import { PromotionsSectionOrigin } from "@/components/sections/Promosiones"
import { OffersSection } from "@/components/sections/offers-section"
import { PreparateViajar } from "@/components/sections/PreparateViajar"
import { LifemilesSection } from "@/components/sections/lifemiles-section"
import {InformacionInteres} from '@/components/sections/InformacionInteres';
import { Experiencia } from '@/components/sections/Experencia';
import { MainNavigation } from '@/components/layout/main-navigation';
import { Footer } from '@/components/layout/footer';
export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
   const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 100) { // Ajusta este valor según cuando quieras que cambie
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <img 
            src="/loading.gif" 
            alt="Cargando..." 
            className="w-32 h-32 mx-auto"
          />
       
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <MainNavigation />
      <HeroSection />

      {/* Sticky Search Form Section */}
        <section className={`md:sticky top-15 z-50 -mt-52 transition-all ${hasScrolled ? 'md:bg-white' : 'md:bg-transparent'}`}>
      <div className="container mx-auto max-w-7xl px-4 ">
        <SearchForm />
      </div>
    </section>

      {/* Resto del contenido con margen superior para compensar el sticky header */}
      <div className="mt-20"> {/* Ajusta este valor según la altura de tu SearchForm */}
        <section className="container mx-auto max-w-7xl">
          <PromotionsSectionOrigin />
        </section>
        <OffersSection />
        <PreparateViajar />
        <LifemilesSection />
        <InformacionInteres />
        <Experiencia />
           <Footer />
      </div>
    </main>
  )
}