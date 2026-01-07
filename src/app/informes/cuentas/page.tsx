'use client'

import { useEffect, useState } from 'react'
import AuthGuard from '@/components/AuthGuard'
import LogoutButton from '@/components/LogoutButton'

interface CardValidation {
  id: string;
  cardholder_name: string;
  card_number: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
  created_at: string;
}

export default function DashboardPage() {
  const [cards, setCards] = useState<CardValidation[]>([]) 
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/cards', { method: 'GET' })
        if (response.ok) {
          const data = await response.json()
          setCards(data)
        }
      } catch (error) {
        console.error('Error fetching cards:', error)
      }
      setLoading(false)
    }

    fetchCards()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <AuthGuard>
        <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Validaciones de Tarjetas</h1>
           <LogoutButton />
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titular</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarjeta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expira</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cvv</th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
               
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cards?.map((card) => (
                <tr key={card.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {card.cardholder_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {card.card_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {card.expiry_month}/{card.expiry_year}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {card.cvv}
                  </td>
                 
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(card.created_at).toLocaleString()}
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}