import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TRIP_COLORS, COUNTRIES } from '@/lib/constants'
import type { Trip, TripStatus } from '@/types'

interface TripFormProps {
  initialData?: Partial<Trip>
  onSubmit: (data: Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void
  onCancel: () => void
  submitting?: boolean
}

export default function TripForm({ initialData, onSubmit, onCancel, submitting }: TripFormProps) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [startDate, setStartDate] = useState(initialData?.start_date ?? '')
  const [endDate, setEndDate] = useState(initialData?.end_date ?? '')
  const [city, setCity] = useState(initialData?.destination_city ?? '')
  const [countryCode, setCountryCode] = useState(initialData?.country_code ?? '')
  const [color, setColor] = useState(initialData?.color ?? TRIP_COLORS[0])
  const [status, setStatus] = useState<TripStatus>(initialData?.status ?? 'upcoming')
  const [notes, setNotes] = useState(initialData?.notes ?? '')

  const country = COUNTRIES.find((c) => c.code === countryCode)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      start_date: startDate,
      end_date: endDate,
      destination_city: city || null,
      destination_country: country?.name ?? null,
      country_code: countryCode || null,
      color,
      status,
      notes: notes || null,
      source: 'manual',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="trip-name">Trip Name *</Label>
        <Input
          id="trip-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Summer in Italy"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date *</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">End Date *</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Rome"
          />
        </div>
        <div className="space-y-2">
          <Label>Country</Label>
          <Select value={countryCode} onValueChange={setCountryCode}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={(v) => setStatus(v as TripStatus)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {TRIP_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className="h-6 w-6 rounded-full ring-offset-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: c,
                boxShadow: color === c ? `0 0 0 2px var(--background), 0 0 0 4px ${c}` : undefined,
              }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Trip notes..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : initialData?.id ? 'Update Trip' : 'Create Trip'}
        </Button>
      </div>
    </form>
  )
}
