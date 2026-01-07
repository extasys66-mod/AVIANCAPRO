export type TripType = "roundTrip" | "oneWay"

export type Location = {
  name: string
  code: string
  country?: string
}

export type Flight = {
  id: string
  departureTime: string
  arrivalTime: string
  duration: string
  origin: string
  destination: string
  price: number
  direct: boolean
}

export type Promotion = {
  id: string
  title: string
  description: string
  origin: string
  destination: string
  price: number
  imageUrl: string
  validUntil: string
}
