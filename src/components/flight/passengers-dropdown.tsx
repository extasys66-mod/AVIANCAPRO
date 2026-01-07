"use client"

interface PassengersDropdownProps {
  value: number
  onChange: (value: number) => void
  onClose: () => void
}

export function PassengersDropdown({ value, onChange, onClose }: PassengersDropdownProps) {
  return (
    <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg">
      <div className="p-4">
        <div className="flex flex-col items-center justify-between mb-4">
          <span className="font-medium">Pasajeros</span>
          <div className="flex items-center space-x-3">
            <button
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
              onClick={() => onChange(Math.max(1, value - 1))}
            >
              -
            </button>
            <span className="font-medium">{value}</span>
            <button
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
              onClick={() => onChange(Math.min(9, value + 1))}
            >
              +
            </button>
          </div>
        </div>
        <button className="w-full py-2 bg-black text-white rounded-lg" onClick={onClose}>
          Aplicar
        </button>
      </div>
    </div>
  )
}
