import { motion, useReducedMotion } from 'framer-motion'
import { usePlayer } from '../context/PlayerContext'
import { tracks } from '../config/site'

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
}

// Animated sine-wave SVG line
function SineWave({ delay, color, opacity }: { delay: number; color: string; opacity: number }) {
  return (
    <motion.svg
      viewBox="0 0 400 80"
      className="absolute w-full"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 2, delay }}
    >
      <motion.path
        d="M0,40 C50,10 100,70 150,40 S250,10 300,40 S350,70 400,40"
        fill="none"
        stroke={color}
        strokeWidth="1"
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 6, delay, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}

export default function Hero() {
  const { play } = usePlayer()
  const shouldReduceMotion = useReducedMotion()

  const handleListenClick = () => {
    scrollTo('#music')
    // Small delay to let scroll happen then start track
    setTimeout(() => play(tracks[0].id), 600)
  }

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-obsidian"
      aria-label="Hero section"
    >
      {/* Background radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)',
        }}
      />

      {/* Slow pulsing secondary glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        animate={shouldReduceMotion ? { opacity: 0.7 } : { opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(ellipse 40% 40% at 60% 40%, rgba(6,78,59,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Floating SVG sine-wave lines — hidden at reduced motion */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 flex flex-col justify-around px-0 pointer-events-none" aria-hidden="true">
          <div className="relative h-20 opacity-30">
            <SineWave delay={0} color="#D4AF37" opacity={0.6} />
          </div>
          <div className="relative h-20 opacity-20">
            <SineWave delay={2} color="#F59E0B" opacity={0.4} />
          </div>
          <div className="relative h-20 opacity-10">
            <SineWave delay={4} color="#D4AF37" opacity={0.3} />
          </div>
        </div>
      )}

      {/* Portrait placeholder */}
      <div
        className="absolute right-0 md:right-8 lg:right-20 bottom-0 w-48 md:w-72 lg:w-96 h-64 md:h-96 lg:h-[500px] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-full h-full rounded-t-full"
          style={{
            background:
              'linear-gradient(180deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.15) 40%, rgba(6,78,59,0.2) 100%)',
            border: '1px solid rgba(212,175,55,0.15)',
            borderBottom: 'none',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 md:pb-40">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-gold text-xs sm:text-sm tracking-[0.3em] uppercase font-medium mb-4 sm:mb-6"
          >
            Master of Qawwali &amp; Sufi Music
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-ivory mb-5 sm:mb-6"
          >
            Soulful Qawwali &amp;{' '}
            <span className="text-gradient-gold italic">Divine Sufi</span>{' '}
            Traditions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-muted text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 max-w-xl"
          >
            Experience the timeless legacy of the Santoo lineage live at your
            weddings, mehfils, and cultural festivals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto"
          >
            <button
              className="btn-gold text-sm md:text-base min-h-[48px] flex items-center justify-center w-full sm:w-auto"
              onClick={() => scrollTo('#bookings')}
              aria-label="Go to event booking form"
            >
              Book for Your Event
            </button>
            <button
              className="btn-outline-gold text-sm md:text-base min-h-[48px] flex items-center justify-center w-full sm:w-auto"
              onClick={handleListenClick}
              aria-label="Scroll to music section and play first track"
            >
              Listen to Music
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator — hidden when reduced motion preferred */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden="true"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent" />
        </motion.div>
      )}
    </section>
  )
}
