import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import MetaPixel from "@/components/MetaPixel"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Avianca - Encuentra tiquetes y vuelos baratos",
  description: "Encuentra los mejores precios en vuelos a cualquier destino",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <MetaPixel />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
