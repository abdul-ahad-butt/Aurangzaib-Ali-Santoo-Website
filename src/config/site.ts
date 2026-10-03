// ============================================================
// SITE CONFIGURATION — edit all content here
// ============================================================

export const artist = {
  name: 'Aurangzaib Ali Santoo',
  tagline: 'Soulful Qawwali & Divine Sufi Traditions',
  bio: [
    'Aurangzaib Ali Santoo carries forward a centuries-old legacy of Qawwali and Sufi devotional music, born into a lineage of master musicians whose art has moved hearts across continents.',
    'Trained from childhood in the classical traditions of the Subcontinent, Santoo brings an electrifying spiritual intensity to every mehfil, weaving together ancient poetry, soaring vocals, and the rhythmic thunder of the tabla.',
    'From intimate private gatherings to grand international stages, his performances transform spaces into sanctuaries — inviting audiences into a realm where music becomes a path to the divine.',
  ],
  stats: [
    { label: 'Generations of Heritage', value: '' },
    { label: 'Live Mehfils Performed', value: '' },
    { label: 'Global Stages', value: '' },
  ],
} as const

import {
  FEATURED_TRACKS,
  GALLERY_ITEMS,
  type Track,
  type GalleryItem,
} from '../data/mediaData'

export type { Track, GalleryItem }
export const tracks: Track[] = FEATURED_TRACKS
export const galleryItems: GalleryItem[] = GALLERY_ITEMS

export const contact = {
  email: 'bookings@santoo.example.com',
  whatsapp: '+92300XXXXXXX',
  whatsappUrl: 'https://wa.me/92300XXXXXXX',
} as const

export const socials = {
  youtube: 'https://www.youtube.com/@aurangzaibsantoo',
  instagram: 'https://www.instagram.com/aurangzaibalisantoo',
  tiktok: 'https://www.tiktok.com/@aurangzaibalisantoo',
  facebook: 'https://facebook.com/aurangzaibalisantoo',
} as const

export interface Testimonial {
  id?: string
  quote: string
  author: string
  name?: string
  role: string
  location: string
  rating?: number
  eventType?: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      "Aurangzaib Ali Santoo transformed our family's Qawwali night into a profoundly spiritual and unforgettable celebration. His rendition of 'Un K Andaz-e-Karam' had three generations in the marquee completely mesmerized. He carries forward the legendary Santoo lineage with unmatched dignity and grace.",
    author: 'Chaudhry Tariq Mahmood',
    name: 'Chaudhry Tariq Mahmood',
    role: 'Private Wedding Host',
    location: 'Royal Palm, Lahore',
    rating: 5,
    eventType: 'Wedding Qawwali Night',
  },
  {
    id: 't2',
    quote:
      "An extraordinary talent who commands the stage with deep spiritual reverence and classical vocal mastery. When his ensemble recited 'Man Kunto Maula', the entire auditorium rose in pure reverence. One of the finest young torchbearers of authentic Sufi heritage.",
    author: 'Syeda Huma Bukhari',
    name: 'Syeda Huma Bukhari',
    role: 'Cultural Festival Curator',
    location: 'Heritage Arts Gala, Islamabad',
    rating: 5,
    eventType: 'Cultural Sufi Festival',
  },
  {
    id: 't3',
    quote:
      "We invited Aurangzaib Ali Santoo for an exclusive executive mehfil in Dubai. The vocal range, rhythmic call-and-response, and sheer passion created an electric atmosphere. Both our local and international guests were thoroughly enchanted.",
    author: 'Farhan S. Al-Hashemi',
    name: 'Farhan S. Al-Hashemi',
    role: 'Corporate Patron & Private Host',
    location: 'Downtown, Dubai',
    rating: 5,
    eventType: 'Private Corporate Mehfil',
  },
]

export const testimonials: Testimonial[] = TESTIMONIALS
