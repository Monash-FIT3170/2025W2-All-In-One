"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "./Button"
import { Calendar } from "./Calendar"
import { Input } from "./Input"
import { Label } from "./Label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./Popover"

type DateTimeProps = {
  value?: Date
  onChange?: (date: Date) => void
  dateLabel?: string
  timeLabel?: string
}

export function DateTime({ value, onChange, dateLabel = "Date" , timeLabel = "Time"}: DateTimeProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(value)

  React.useEffect(() => {
    setDate(value)
  }, [value])

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          {dateLabel}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="white"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(picked) => {
                if (!picked) return
                // Retain time component when picking a new date
                const base = date ?? new Date()
                const updated = new Date(picked)
                updated.setHours(base.getHours(), base.getMinutes(), base.getSeconds(), 0)
                setDate(updated)
                onChange?.(updated)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          {timeLabel}
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="60"
          value={date ? `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}` : ""}
          onChange={(e) => {
            const val = e.target.value
            if (!val) return
            const [hh, mm] = val.split(":")
            const base = date ?? new Date()
            const updated = new Date(base)
            updated.setHours(parseInt(hh || "0", 10), parseInt(mm || "0", 10), 0, 0)
            setDate(updated)
            onChange?.(updated)
          }}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
