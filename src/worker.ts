/// <reference types="@cloudflare/workers-types" />
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { bookingSchema } from './lib/validation'

type Env = {
  DB?: D1Database
}

const app = new Hono<{ Bindings: Env }>()

app.use('/api/*', cors())

// ── Health ──────────────────────────────────────────────────────────────────
app.get('/api/health', (c) => c.json({ ok: true }))

// ── POST /api/inquiries ──────────────────────────────────────────────────────
app.post('/api/inquiries', async (c) => {
  // Reject oversized bodies (> 10 KB)
  const contentLength = c.req.header('content-length')
  if (contentLength && parseInt(contentLength, 10) > 10_240) {
    return c.json({ error: 'Request body too large' }, 413)
  }

  let raw: Record<string, unknown>
  try {
    raw = await c.req.json<Record<string, unknown>>()
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }

  // Honeypot: if the hidden website field is non-empty, silently return 201
  if (typeof raw.website === 'string' && raw.website.length > 0) {
    return c.json({ id: crypto.randomUUID() }, 201)
  }

  // Validate
  const result = bookingSchema.safeParse(raw)
  if (!result.success) {
    const errors: Record<string, string[]> = {}
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? 'unknown')
      if (!errors[key]) errors[key] = []
      errors[key].push(issue.message)
    }
    return c.json({ errors }, 400)
  }

  const data = result.data
  const id = crypto.randomUUID()

  if (!c.env.DB) {
    console.warn('[D1 warning] DB binding not configured. Inquiry acknowledged:', id)
    return c.json({ id, message: 'Inquiry received' }, 201)
  }

  try {
    await c.env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS booking_inquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        event_type TEXT NOT NULL,
        event_date TEXT NOT NULL,
        alt_date TEXT,
        city TEXT NOT NULL,
        country TEXT NOT NULL,
        venue_type TEXT,
        guest_count TEXT NOT NULL,
        notes TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );`
    ).run()

    await c.env.DB.prepare(
      `INSERT INTO booking_inquiries
        (id, name, email, phone, event_type, event_date, alt_date, city, country, venue_type, guest_count, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        data.name,
        data.email,
        data.phone,
        data.eventType,
        data.eventDate,
        data.altDate ?? null,
        data.city,
        data.country,
        data.venueType ?? null,
        data.guestCount,
        data.notes ?? null
      )
      .run()
  } catch (err) {
    console.error('[D1 insert error]', err)
    return c.json({ error: 'Failed to save inquiry. Please try again.' }, 500)
  }

  return c.json({ id }, 201)
})

export default app
