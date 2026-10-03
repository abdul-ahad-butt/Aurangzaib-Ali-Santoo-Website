export interface Track {
  id: string
  number: string
  title: string
  collection: string
  subtitle?: string
  duration: string
  youtubeId: string
  thumbnailUrl: string
  socialLink: string
  src?: string
}

export interface GalleryItem {
  id: string
  type: 'image' | 'video'
  title: string
  category: string
  thumbnailUrl: string
  youtubeId?: string
  socialUrl?: string
}

export const ARTIST_SOCIALS = {
  instagram: 'https://www.instagram.com/aurangzaibalisantoo',
  tiktok: 'https://www.tiktok.com/@aurangzaibalisantoo',
  youtube: 'https://www.youtube.com/@aurangzaibsantoo',
}

// 3 EXCLUSIVE FEATURED TRACKS (AUDIO SECTION)
export const FEATURED_TRACKS: Track[] = [
  {
    id: 'track-1',
    number: '01',
    title: 'Yaa Allah Yaa Rehman',
    collection: 'Live Qawwali Tradition',
    subtitle: 'Live Qawwali Tradition',
    duration: '04:33',
    youtubeId: 'BHcaSvht2f0',
    thumbnailUrl: 'https://img.youtube.com/vi/BHcaSvht2f0/hqdefault.jpg',
    socialLink: 'https://www.youtube.com/watch?v=BHcaSvht2f0',
  },
  {
    id: 'track-2',
    number: '02',
    title: 'Un K Andaz-e-Karam',
    collection: 'Live Mehfil Recordings',
    subtitle: 'Live Mehfil Recordings',
    duration: '06:03',
    youtubeId: 'r3goFxn5g3Q',
    thumbnailUrl: 'https://img.youtube.com/vi/r3goFxn5g3Q/hqdefault.jpg',
    socialLink: 'https://www.youtube.com/watch?v=r3goFxn5g3Q',
  },
  {
    id: 'track-3',
    number: '03',
    title: 'Man Kunto Maula',
    collection: 'Classical Sufi Qaul',
    subtitle: 'Classical Sufi Qaul',
    duration: '03:59',
    youtubeId: 'v0X7SWI8lqA',
    thumbnailUrl: 'https://img.youtube.com/vi/v0X7SWI8lqA/hqdefault.jpg',
    socialLink: 'https://www.youtube.com/watch?v=v0X7SWI8lqA',
  },
]

// COMPLETELY DISTINCT PERFORMANCES (GALLERY SECTION)
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    type: 'image',
    title: 'Saadgi (Live Mehfil)',
    category: 'Harmonium & Vocal Solo',
    thumbnailUrl: 'https://img.youtube.com/vi/JgmBIJ_7DvQ/hqdefault.jpg',
    socialUrl: 'https://www.youtube.com/watch?v=JgmBIJ_7DvQ',
  },
  {
    id: 'gal-2',
    type: 'image',
    title: 'Sufi Heritage Session',
    category: 'Traditional Ensemble Session',
    thumbnailUrl: 'https://img.youtube.com/vi/VkMFeHWhzN8/hqdefault.jpg',
    socialUrl: 'https://www.instagram.com/aurangzaibalisantoo',
  },
  {
    id: 'gal-3',
    type: 'video',
    title: 'Tere Darwaze Peh Chilman (Live Concert)',
    category: 'Live Performance Video',
    thumbnailUrl: 'https://img.youtube.com/vi/VkMFeHWhzN8/hqdefault.jpg',
    youtubeId: 'VkMFeHWhzN8',
    socialUrl: 'https://www.youtube.com/watch?v=VkMFeHWhzN8',
  },
]
