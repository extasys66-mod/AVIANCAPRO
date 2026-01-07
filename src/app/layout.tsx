import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MainNavigation } from "@/components/layout/main-navigation"
import { Footer } from "@/components/layout/footer"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"], })

export const metadata: Metadata = {
  title: "Avianca - Encuentra tiquetes y vuelos baratos ",
  description: "Encuentra los mejores precios en vuelos a cualquier destino",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">

      <body className="font-display">
        <AuthProvider> 
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
