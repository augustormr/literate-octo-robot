import { useState } from 'react'

const EMPTY = {
  destination: '',
  country: '',
  startDate: '',
  endDate: '',
  budget: '',
  currency: 'USD',
  notes: '',
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'BRL', 'MXN', 'INR']

export default function TripForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY)
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const errs = {}
    if (!form.destination.trim()) errs.destination = 'Required'
    if (!form.startDate) errs.startDate = 'Required'
    if (!form.endDate) errs.endDate = 'Required'
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      errs.endDate = 'Must be after start date'
    if (form.budget && isNaN(Number(form.budget))) errs.budget = 'Must be a number'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit({
      ...form,
      budget: form.budget ? Number(form.budget) : null,
    })
  }

  return (
    <form className="trip-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-field">
          <label>Destination *</label>
          <input
            value={form.destination}
            onChange={e => set('destination', e.target.value)}
            placeholder="City or region"
          />
          {errors.destination && <span className="form-error">{errors.destination}</span>}
        </div>
        <div className="form-field">
          <label>Country</label>
          <input
            value={form.country}
            onChange={e => set('country', e.target.value)}
            placeholder="Country"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Start Date *</label>
          <input
            type="date"
            value={form.startDate}
            onChange={e => set('startDate', e.target.value)}
          />
          {errors.startDate && <span className="form-error">{errors.startDate}</span>}
        </div>
        <div className="form-field">
          <label>End Date *</label>
          <input
            type="date"
            value={form.endDate}
            onChange={e => set('endDate', e.target.value)}
          />
          {errors.endDate && <span className="form-error">{errors.endDate}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label>Budget</label>
          <input
            type="number"
            min="0"
            value={form.budget}
            onChange={e => set('budget', e.target.value)}
            placeholder="0"
          />
          {errors.budget && <span className="form-error">{errors.budget}</span>}
        </div>
        <div className="form-field">
          <label>Currency</label>
          <select value={form.currency} onChange={e => set('currency', e.target.value)}>
            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="form-field">
        <label>Notes</label>
        <textarea
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Accommodation, activities, packing list..."
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">
          {initial ? 'Save Changes' : 'Add Trip'}
        </button>
      </div>
    </form>
  )
}
