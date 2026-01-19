"use client"

import { useEffect } from "react"

export default function ConfirmacionPage() {
  useEffect(() => {
    // 🔥 META PIXEL - PURCHASE (solo aquí)
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Purchase", {
        value: 49900, // ajusta si usas otro monto
        currency: "COP",
      })

      console.log("✅ Purchase enviado desde /confirmacion")
    }
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f4f7f6] p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center border border-gray-200">
        
        <div className="text-green-600 text-5xl mb-4">✓</div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Pago confirmado
        </h1>

        <p className="text-gray-600 mb-6">
          Tu transacción fue procesada correctamente.  
          En breve recibirás la confirmación en tu correo.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-[#E8114B] hover:bg-[#D40E43] text-white font-bold py-3 rounded-md transition"
        >
          Volver al inicio
        </button>

      </div>
    </main>
  )
}
