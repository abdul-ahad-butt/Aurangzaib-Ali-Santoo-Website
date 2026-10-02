import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Camera, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { GALLERY_ITEMS, type GalleryItem, ARTIST_SOCIALS } from '../../data/mediaData'
import { usePlayer } from '../../context/PlayerContext'
import VideoModal from '../UI/VideoModal'

interface ImageLightboxProps {
  item: GalleryItem
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function ImageLightbox({ item, index, total, onClose, onPrev, onNext }: ImageLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onNext, onPrev])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery image: ${item.title}`}
      onClick={onClose}
    >
      <motion.div
        className="relative glass rounded-2xl overflow-hidden max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center border border-white/15 shadow-2xl"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className="w-full max-h-[75vh] object-contain bg-black/40"
        />

        {/* Close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-ivory hover:text-gold hover:bg-black/80 transition-colors z-10"
          aria-label="Close image viewer"
        >
          <X size={20} />
        </button>

        {/* Prev / Next buttons */}
        {total > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPrev()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-black/60 text-ivory hover:text-gold hover:bg-black/80 transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-black/60 text-ivory hover:text-gold hover:bg-black/80 transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Caption bar */}
        <div className="w-full px-6 py-4 bg-obsidian/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-ivory font-medium text-base">{item.title}</h4>
            <p className="text-gold text-xs tracking-wider uppercase">{item.category}</p>
          </div>
          <div className="flex items-center gap-4">
            {item.socialUrl && (
              <a
                href={item.socialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted hover:text-gold transition-colors flex items-center gap-1.5"
              >
                <span>View on Socials</span>
                <ExternalLink size={12} />
              </a>
            )}
            <span className="text-muted text-xs tabular-nums bg-white/5 px-2.5 py-1 rounded-md">
              {index + 1} / {total}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Gallery() {
  const { isPlaying, pause } = usePlayer()
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)
  const [activeVideo, setActiveVideo] = useState<{
    youtubeId: string
    title: string
    socialUrl?: string
  } | null>(null)

  const imageItems = GALLERY_ITEMS.filter((item) => item.type === 'image')

  const closeImageModal = useCallback(() => setActiveImageIndex(null), [])
  const goPrevImage = useCallback(
    () =>
      setActiveImageIndex((i) =>
        i !== null ? (i - 1 + imageItems.length) % imageItems.length : null
      ),
    [imageItems.length]
  )
  const goNextImage = useCallback(
    () =>
      setActiveImageIndex((i) =>
        i !== null ? (i + 1) % imageItems.length : null
      ),
    [imageItems.length]
  )

  // Prevent scroll when modal is open
  useEffect(() => {
    if (activeImageIndex !== null || activeVideo !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeImageIndex, activeVideo])

  const handleCardClick = (item: GalleryItem) => {
    if (item.type === 'video' && item.youtubeId) {
      // Pause background audio bridge so user hears video cleanly
      if (isPlaying) {
        pause()
      }
      setActiveVideo({
        youtubeId: item.youtubeId,
        title: item.title,
        socialUrl: item.socialUrl,
      })
    } else {
      const idx = imageItems.findIndex((img) => img.id === item.id)
      setActiveImageIndex(idx !== -1 ? idx : 0)
    }
  }

  return (
    <section id="performances" className="py-24 md:py-32 bg-obsidian relative" aria-label="Gallery section">
      <div id="gallery" className="absolute -top-24" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Performances</p>
          <h2 className="section-heading text-ivory">Performance Gallery</h2>
          <div className="gold-divider" />
          <p className="text-muted text-sm max-w-xl mx-auto mt-4">
            Live moments, divine mehfils, and classical concert highlights featuring Aurangzaib Ali Santoo.
          </p>
        </motion.div>

        {/* Responsive Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {GALLERY_ITEMS.map((item, i) => {
            const isVideo = item.type === 'video'

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-gold/50 transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] cursor-pointer aspect-[4/3] bg-charcoal"
                onClick={() => handleCardClick(item)}
              >
                {/* Image / Thumbnail with smooth zoom */}
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 group-hover:via-black/20 transition-all duration-300" />

                {/* Top Badge: Type Indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                      isVideo
                        ? 'bg-gold/90 text-obsidian shadow-md shadow-gold/30'
                        : 'bg-black/60 text-ivory border border-white/10'
                    }`}
                  >
                    {isVideo ? (
                      <>
                        <Play size={12} className="fill-current" />
                        <span>Live Video</span>
                      </>
                    ) : (
                      <>
                        <Camera size={12} />
                        <span>Photo</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Center Action Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isVideo
                        ? 'bg-gold text-obsidian shadow-xl shadow-gold/40 group-hover:scale-110'
                        : 'bg-black/50 text-ivory backdrop-blur-sm group-hover:bg-gold group-hover:text-obsidian group-hover:scale-110'
                    }`}
                  >
                    {isVideo ? (
                      <Play size={24} className="fill-current ml-1" />
                    ) : (
                      <Camera size={22} />
                    )}
                  </div>
                </div>

                {/* Bottom Caption & Details */}
                <div className="absolute bottom-0 inset-x-0 p-5 z-10">
                  <p className="text-gold text-xs uppercase tracking-wider font-medium mb-1">
                    {item.category}
                  </p>
                  <h3 className="text-ivory font-medium text-base md:text-lg group-hover:text-gold transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  {item.socialUrl && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-muted group-hover:text-ivory transition-colors">
                      <span>Click to {isVideo ? 'watch live performance' : 'view full photo'}</span>
                      <ExternalLink size={10} className="text-gold" />
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Global Social Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 glass rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 border border-gold/20"
        >
          <div>
            <h4 className="font-heading text-lg text-ivory font-medium">
              Official Channel &amp; Social Profiles
            </h4>
            <p className="text-muted text-xs">
              Subscribe and follow Aurangzaib Ali Santoo for new Qawwali releases, tour dates, and live mehfil broadcasts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={ARTIST_SOCIALS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-900/30 transition-all duration-200"
            >
              <span>YouTube Channel</span>
              <ExternalLink size={12} />
            </a>
            <a
              href={ARTIST_SOCIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-gold hover:text-obsidian text-ivory text-xs font-semibold transition-all duration-200"
            >
              <span>Instagram</span>
              <ExternalLink size={12} />
            </a>
            <a
              href={ARTIST_SOCIALS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-gold hover:text-obsidian text-ivory text-xs font-semibold transition-all duration-200"
            >
              <span>TikTok</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            youtubeId={activeVideo.youtubeId}
            title={activeVideo.title}
            socialUrl={activeVideo.socialUrl}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {activeImageIndex !== null && imageItems[activeImageIndex] && (
          <ImageLightbox
            item={imageItems[activeImageIndex]}
            index={activeImageIndex}
            total={imageItems.length}
            onClose={closeImageModal}
            onPrev={goPrevImage}
            onNext={goNextImage}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
