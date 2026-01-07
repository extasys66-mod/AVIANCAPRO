export function formatPrice(price: number) {
    return new Intl.NumberFormat("es-CO", {
      
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(price)
  }
  