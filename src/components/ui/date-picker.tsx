"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerProps {
  label: string
  value: string
  onChange: (date: string) => void
  minDate?: string
  disabled?: boolean
  isMobileView?: boolean
}

export function DatePicker({
  label,
  value,
  onChange,
  minDate,
  disabled = false,
  isMobileView = false,
}: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (value) {
      // Usar replace para compatibilidad con Safari/Firefox
      return new Date(value.replace(/-/g, '/'));
    }
    return new Date(); // Devuelve la fecha actual si no hay valor
  })

  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleDateClick = (date: Date) => {
    // Crear una fecha con año, mes y día para evitar problemas de zona horaria
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // getMonth() devuelve 0-11
    const day = date.getDate()

    // Formato YYYY-MM-DD asegurando que tenga dos dígitos para mes y día
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`

    onChange(formattedDate)
    setShowCalendar(false)
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const parseDateToLocal = (dateString: string) => {
    if (!dateString) return null
    // Extraer año, mes y día para crear la fecha en hora local
    const [year, month, day] = dateString.split("-").map((num) => Number.parseInt(num, 10))
    return new Date(year, month - 1, day)
  }

  const renderCalendarDays = () => {
    const days = []
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const valueDate = value ? parseDateToLocal(value) : null
    const minDateObj = minDate ? parseDateToLocal(minDate) : null

    // Primer día del mes
    const firstDay = new Date(year, month, 1)
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0)

    // Obtener el día de la semana del primer día (0 = Domingo, 1 = Lunes, etc.)
    let firstDayOfWeek = firstDay.getDay()
    // Ajustar para que la semana comience en lunes (0 = Lunes, 6 = Domingo)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    // Días del mes anterior para completar la primera semana
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: isSameDay(prevDate, new Date()),
        isSelected: valueDate ? isSameDay(prevDate, valueDate) : false,
        isDisabled: minDateObj ? prevDate < minDateObj : false,
      })
    }

    // Días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, new Date()),
        isSelected: valueDate ? isSameDay(date, valueDate) : false,
        isDisabled: minDateObj ? date < minDateObj : false,
      })
    }

    // Días del mes siguiente para completar la última semana
    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(year, month + 1, i)
        days.push({
          date: nextDate,
          isCurrentMonth: false,
          isToday: isSameDay(nextDate, new Date()),
          isSelected: valueDate ? isSameDay(nextDate, valueDate) : false,
          isDisabled: minDateObj ? nextDate < minDateObj : false,
        })
      }
    }

    return days
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ""

    // Extraer año, mes y día directamente del string para evitar problemas de zona horaria
    const [year, month, day] = dateString.split("-").map((num) => Number.parseInt(num, 10))

    // Crear una fecha con la hora establecida a mediodía para evitar problemas de zona horaria
    const date = new Date(year, month - 1, day, 12, 0, 0)

    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

  // Si es vista móvil, mostrar siempre el calendario
  if (isMobileView) {
    return (
      <div className="bg-white rounded-lg p-3">
        <div className="flex justify-between items-center mb-4">
          <button className="p-1 rounded-full hover:bg-gray-100" onClick={goToPreviousMonth}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="font-medium">
            {currentMonth.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100" onClick={goToNextMonth}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}

          {renderCalendarDays().map((day, index) => (
            <button
              key={index}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm
                ${day.isCurrentMonth ? "" : "text-gray-400"}
                ${day.isToday ? "border border-emerald-500" : ""}
                ${day.isSelected ? "bg-emerald-500 text-white" : "hover:bg-gray-100"}
                ${day.isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              onClick={() => !day.isDisabled && handleDateClick(day.date)}
              disabled={day.isDisabled}
            >
              {day.date.getDate()}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative" ref={calendarRef}>
      <div
        className={` rounded-lg p-2 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => !disabled && setShowCalendar(!showCalendar)}
      >
        <div className="text-xs text-gray-500 flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          {label}
        </div>
        <div className="font-medium">{value ? formatDisplayDate(value) : "Seleccionar fecha"}</div>
      </div>

      {showCalendar && (
        <div className="absolute z-20 mt-1 bg-white border rounded-lg shadow-lg p-3 w-72">
          <div className="flex justify-between items-center mb-4">
            <button className="p-1 rounded-full hover:bg-gray-100" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="font-medium">
              {currentMonth.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
            </div>
            <button className="p-1 rounded-full hover:bg-gray-100" onClick={goToNextMonth}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}

            {renderCalendarDays().map((day, index) => (
              <button
                key={index}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${day.isCurrentMonth ? "" : "text-gray-400"}
                  ${day.isToday ? "border border-emerald-500" : ""}
                  ${day.isSelected ? "bg-emerald-500 text-white" : "hover:bg-gray-100"}
                  ${day.isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                onClick={() => !day.isDisabled && handleDateClick(day.date)}
                disabled={day.isDisabled}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
