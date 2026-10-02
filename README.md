# Aurangzaib Ali Santoo — Official Website

## How to Add Audio Files

Drop exactly **3 MP3 files** into `public/audio/`:

```
public/audio/track-1.mp3
public/audio/track-2.mp3
public/audio/track-3.mp3
```

Then update the track metadata (title, subtitle) in `src/config/site.ts`:

```ts
export const tracks: Track[] = [
  { id: 'track-1', title: 'Your Track Title', subtitle: 'Album Name', src: '/audio/track-1.mp3' },
  // ...
]
```

## How to Edit Site Content

All editable content is in **`src/config/site.ts`**:

- `artist` — name, tagline, biography paragraphs, stat labels
- `tracks` — 3 featured track titles and subtitles
- `contact` — email and WhatsApp number
- `socials` — YouTube, Instagram, Facebook URLs
- `galleryItems` — add real image/video URLs here
- `testimonials` — replace placeholder quotes with real ones

## Deploy Commands

### 1. Create the D1 database

```bash
npx wrangler d1 create santoo-bookings
```

Copy the returned `database_id` and paste it into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "santoo-bookings"
database_id = "PASTE_ID_HERE"
```

### 2. Run the schema migration (remote)

```bash
npx wrangler d1 execute santoo-bookings --remote --file=schema.sql
```

### 3. Deploy
```bash
npm run deploy
```
*(The repository is configured for Cloudflare Workers with Static Assets named `aurangzaib-ali-santoo-website`. It also includes automatic compatibility if deployed via Cloudflare CI).*

## Local Development

```bash
# Run the D1 schema locally first (once)
npx wrangler d1 execute santoo-bookings --local --file=schema.sql

# Start Vite dev server (frontend only)
npm run dev

# OR: start full Cloudflare Pages local environment (with Functions + D1)
npm run build && npm run preview:cf
```
