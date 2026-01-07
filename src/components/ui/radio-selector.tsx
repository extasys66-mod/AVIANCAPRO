"use client"

interface RadioOption {
  value: string
  label: string
}

interface RadioSelectorProps {
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
}

export function RadioSelector({ options, value, onChange }: RadioSelectorProps) {
  return (
    <div className="flex space-x-4 pl-3">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${value === option.value ? "border-green-500 bg-green-500" : "border-gray-300"}`}
          >
            {value === option.value && <div className="w-3 h-3 bg-white rounded-full"></div>}
          </div>
          <span className="text-sm font-medium">{option.label}</span>
          <input
            type="radio"
            className="hidden"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
        </label>
      ))}
    </div>
  )
}
