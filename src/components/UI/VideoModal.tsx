import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, ExternalLink, Instagram } from 'lucide-react'
import { ARTIST_SOCIALS } from '../../data/mediaData'

interface VideoModalProps {
  youtubeId: string
  title: string
  socialUrl?: string
  onClose: () => void
}

export default function VideoModal({ youtubeId, title, socialUrl, onClose }: VideoModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeBtnRef.current?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Video player: ${title}`}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl mx-3 sm:mx-6 bg-obsidian/95 border border-gold/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse flex-shrink-0" />
            <h3 className="font-heading text-base sm:text-lg md:text-xl text-ivory font-medium truncate">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Direct Social Link */}
            <a
              href={socialUrl || ARTIST_SOCIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gold hover:text-obsidian hover:bg-gold border border-gold/40 transition-all duration-200 min-h-[38px]"
            >
              <Instagram size={14} />
              <span>Follow on Instagram</span>
              <ExternalLink size={12} />
            </a>

            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-2.5 sm:p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-white/10 text-ivory hover:bg-white/20 hover:text-gold active:scale-95 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Close video player"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* 16:9 Video Container */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&enablejsapi=1&origin=${
              typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''
            }&playsinline=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3.5 bg-black/60 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <span>Official Live Performance by Aurangzaib Ali Santoo</span>
          <div className="flex items-center gap-4">
            <a
              href={ARTIST_SOCIALS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors flex items-center gap-1"
            >
              <span>Watch on TikTok</span>
              <ExternalLink size={11} />
            </a>
            <a
              href={ARTIST_SOCIALS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors flex items-center gap-1"
            >
              <span>YouTube Channel</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
