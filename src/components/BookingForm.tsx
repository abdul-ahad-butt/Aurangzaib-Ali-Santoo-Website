import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Loader2, AlertCircle } from 'lucide-react'
import { bookingSchema, type BookingFormData } from '../lib/validation'
import ConfirmationModal from './ConfirmationModal'

type StepKey = 1 | 2 | 3

const EMPTY: BookingFormData = {
  name: '',
  email: '',
  phone: '',
  eventType: 'Wedding / Reception',
  eventDate: '',
  altDate: '',
  city: '',
  country: '',
  venueType: '',
  guestCount: 'Under 100',
  notes: '',
  website: '',
}

const EVENT_TYPES: BookingFormData['eventType'][] = [
  'Wedding / Reception',
  'Sufi Night / Cultural Gala',
  'Private Mehfil',
  'Corporate Event',
  'International Festival',
]

const GUEST_COUNTS: BookingFormData['guestCount'][] = [
  'Under 100',
  '100-300',
  '300-1000',
  '1000+',
]

// Today formatted as YYYY-MM-DD for date input min attribute
const todayStr = new Date().toISOString().split('T')[0]

interface FieldErrorProps {
  message?: string
}
function FieldError({ message }: FieldErrorProps) {
  if (!message) return null
  return (
    <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1" role="alert">
      <AlertCircle size={12} aria-hidden="true" />
      {message}
    </p>
  )
}

interface LabelProps {
  htmlFor: string
  children: React.ReactNode
  optional?: boolean
}
function Label({ htmlFor, children, optional }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-sm text-ivory/80 mb-1.5 font-medium">
      {children}
      {optional && <span className="text-muted ml-1 font-normal text-xs">(optional)</span>}
    </label>
  )
}

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 min-h-[48px] text-ivory text-base sm:text-sm placeholder-muted/50 focus:outline-none focus:border-gold/60 focus:bg-white/[0.08] transition-all duration-200'
const selectClass = inputClass + ' appearance-none cursor-pointer'

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 20, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -20, opacity: 0 }),
}

export default function BookingForm() {
  const [step, setStep] = useState<StepKey>(1)
  const [dir, setDir] = useState(1)
  const [data, setData] = useState<BookingFormData>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [confirmedId, setConfirmedId] = useState<string | null>(null)

  const update = (field: keyof BookingFormData, value: string) => {
    setData((d) => ({ ...d, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  // Validate only the fields for the current step
  const validateStep = (s: StepKey): boolean => {
    const step1Fields: (keyof BookingFormData)[] = ['name', 'email', 'phone']
    const step2Fields: (keyof BookingFormData)[] = [
      'eventType', 'eventDate', 'city', 'country', 'guestCount',
    ]
    const fields = s === 1 ? step1Fields : s === 2 ? step2Fields : []

    const result = bookingSchema.safeParse(data)
    if (result.success) {
      setErrors({})
      return true
    }

    const allErrors: Partial<Record<keyof BookingFormData, string>> = {}
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof BookingFormData
      allErrors[key] = issue.message
    }

    // Only surface errors for this step's fields
    const relevant: Partial<Record<keyof BookingFormData, string>> = {}
    let hasError = false
    for (const f of fields) {
      if (allErrors[f]) {
        relevant[f] = allErrors[f]
        hasError = true
      }
    }
    setErrors(relevant)
    return !hasError
  }

  const goNext = () => {
    if (!validateStep(step)) return
    setDir(1)
    setStep((s) => Math.min(s + 1, 3) as StepKey)
  }

  const goPrev = () => {
    setDir(-1)
    setStep((s) => Math.max(s - 1, 1) as StepKey)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = bookingSchema.safeParse(data)
    if (!result.success) {
      const allErrors: Partial<Record<keyof BookingFormData, string>> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof BookingFormData
        allErrors[key] = issue.message
      }
      setErrors(allErrors)
      return
    }

    setSubmitting(true)
    setServerError(null)

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.status === 201) {
        const json = (await res.json()) as { id: string }
        setConfirmedId(json.id)
        setData(EMPTY)
        setStep(1)
      } else if (res.status === 400) {
        const json = (await res.json()) as { errors?: Record<string, string[]> }
        const msg =
          json.errors
            ? Object.values(json.errors).flat().join('. ')
            : 'Invalid submission. Please check your details.'
        setServerError(msg)
      } else {
        setServerError('Something went wrong. Please try again in a moment.')
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const closeModal = () => setConfirmedId(null)

  const steps: { label: string; num: StepKey }[] = [
    { label: 'Contact', num: 1 },
    { label: 'Event', num: 2 },
    { label: 'Details', num: 3 },
  ]

  return (
    <section id="bookings" className="py-24 md:py-32 bg-charcoal" aria-label="Booking inquiry form">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Book an Event</p>
          <h2 className="section-heading text-ivory">Inquire for Your Occasion</h2>
          <div className="gold-divider" />
          <p className="text-muted text-sm mt-4">
            Tell us about your event and we&apos;ll be in touch within 48 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-2xl p-6 md:p-8"
        >
          {/* Step indicator */}
          <div className="flex items-center mb-8" role="list" aria-label="Form steps">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1" role="listitem">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 ${
                      step >= s.num
                        ? 'bg-gold text-obsidian shadow-md shadow-gold/20'
                        : 'bg-white/10 text-muted'
                    }`}
                    aria-current={step === s.num ? 'step' : undefined}
                  >
                    {s.num}
                  </div>
                  <span className="text-[11px] sm:text-xs mt-1 text-muted hidden sm:block whitespace-nowrap">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-1.5 sm:mx-2 transition-all duration-300 ${
                      step > s.num ? 'bg-gold/60' : 'bg-white/10'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              id="website"
              value={data.website}
              onChange={(e) => update('website', e.target.value)}
              className="sr-only"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={dir}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => update('name', e.target.value)}
                        className={inputClass}
                        placeholder="Your full name"
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      <FieldError message={errors.name} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => update('email', e.target.value)}
                        className={inputClass}
                        placeholder="you@example.com"
                        aria-required="true"
                        aria-invalid={!!errors.email}
                      />
                      <FieldError message={errors.email} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone / WhatsApp</Label>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        value={data.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className={inputClass}
                        placeholder="+1 555 000 0000"
                        aria-required="true"
                        aria-invalid={!!errors.phone}
                      />
                      <FieldError message={errors.phone} />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div>
                      <Label htmlFor="eventType">Event Type</Label>
                      <select
                        id="eventType"
                        value={data.eventType}
                        onChange={(e) => update('eventType', e.target.value)}
                        className={selectClass}
                        aria-required="true"
                      >
                        {EVENT_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <FieldError message={errors.eventType} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="eventDate">Event Date</Label>
                        <input
                          id="eventDate"
                          type="date"
                          min={todayStr}
                          value={data.eventDate}
                          onChange={(e) => update('eventDate', e.target.value)}
                          className={inputClass}
                          aria-required="true"
                          aria-invalid={!!errors.eventDate}
                        />
                        <FieldError message={errors.eventDate} />
                      </div>
                      <div>
                        <Label htmlFor="altDate" optional>Alternative Date</Label>
                        <input
                          id="altDate"
                          type="date"
                          min={todayStr}
                          value={data.altDate}
                          onChange={(e) => update('altDate', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <input
                          id="city"
                          type="text"
                          value={data.city}
                          onChange={(e) => update('city', e.target.value)}
                          className={inputClass}
                          placeholder="Lahore"
                          aria-required="true"
                          aria-invalid={!!errors.city}
                        />
                        <FieldError message={errors.city} />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <input
                          id="country"
                          type="text"
                          value={data.country}
                          onChange={(e) => update('country', e.target.value)}
                          className={inputClass}
                          placeholder="Pakistan"
                          aria-required="true"
                          aria-invalid={!!errors.country}
                        />
                        <FieldError message={errors.country} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="venueType" optional>Venue Type</Label>
                      <input
                        id="venueType"
                        type="text"
                        value={data.venueType}
                        onChange={(e) => update('venueType', e.target.value)}
                        className={inputClass}
                        placeholder="Indoor hall, outdoor marquee, rooftop…"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guestCount">Estimated Guests</Label>
                      <select
                        id="guestCount"
                        value={data.guestCount}
                        onChange={(e) => update('guestCount', e.target.value)}
                        className={selectClass}
                        aria-required="true"
                      >
                        {GUEST_COUNTS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      <FieldError message={errors.guestCount} />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    {/* Review summary */}
                    <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm border border-white/10">
                      <p className="text-gold text-xs tracking-wider uppercase mb-3">Review</p>
                      {[
                        ['Name', data.name],
                        ['Email', data.email],
                        ['Phone', data.phone],
                        ['Event Type', data.eventType],
                        ['Event Date', data.eventDate],
                        ['Alt Date', data.altDate || '—'],
                        ['City', data.city],
                        ['Country', data.country],
                        ['Venue Type', data.venueType || '—'],
                        ['Guest Count', data.guestCount],
                      ].map(([label, val]) => (
                        <div key={label} className="flex justify-between gap-4">
                          <span className="text-muted">{label}</span>
                          <span className="text-ivory text-right">{val}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <Label htmlFor="notes" optional>Additional Notes</Label>
                      <textarea
                        id="notes"
                        rows={4}
                        value={data.notes}
                        onChange={(e) => update('notes', e.target.value)}
                        className={inputClass + ' resize-none'}
                        placeholder="Special requests, preferred set length, sound system availability…"
                        maxLength={1000}
                        aria-describedby="notes-count"
                      />
                      <div className="flex justify-between items-center mt-1">
                        <FieldError message={errors.notes} />
                        <p id="notes-count" className="text-muted text-xs ml-auto">
                          {data.notes?.length ?? 0}/1000
                        </p>
                      </div>
                    </div>

                    {serverError && (
                      <div
                        className="flex items-start gap-2 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-sm"
                        role="alert"
                      >
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <p className="font-medium mb-0.5">Submission failed</p>
                          <p>{serverError}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-8 gap-3 sm:gap-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex items-center justify-center gap-2 text-muted hover:text-ivory active:text-gold transition-colors text-sm py-3 px-4 rounded-lg bg-white/5 sm:bg-transparent min-h-[48px] order-2 sm:order-1"
                  disabled={submitting}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
              ) : (
                <div className="hidden sm:block" />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="btn-gold flex items-center justify-center gap-2 sm:ml-auto w-full sm:w-auto min-h-[48px] order-1 sm:order-2"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-gold flex items-center justify-center gap-2 sm:ml-auto w-full sm:w-auto min-w-[140px] min-h-[48px] order-1 sm:order-2"
                  disabled={submitting}
                  aria-disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    'Send Inquiry'
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>

      {confirmedId && (
        <ConfirmationModal referenceId={confirmedId} onClose={closeModal} />
      )}
    </section>
  )
}
