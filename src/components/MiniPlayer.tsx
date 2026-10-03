import { useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

function formatTime(s: number): string {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function MiniPlayer() {
  const { currentTrack, isPlaying, currentTime, duration, toggle, next, prev, seek, hasStarted } =
    usePlayer()
  const shouldReduceMotion = useReducedMotion()

  const progress = duration ? (currentTime / duration) * 100 : 0

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    seek(pct * duration)
  }

  // Toggle body class so CSS can add bottom padding
  useEffect(() => {
    if (hasStarted && currentTrack) {
      document.body.classList.add('has-player')
    } else {
      document.body.classList.remove('has-player')
    }
    return () => { document.body.classList.remove('has-player') }
  }, [hasStarted, currentTrack])

  const slideVariants = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 100, opacity: 0 },
      }

  return (
    <AnimatePresence>
      {hasStarted && currentTrack && (
        <motion.div
          {...slideVariants}
          transition={
            shouldReduceMotion
              ? { duration: 0.15 }
              : { type: 'spring', stiffness: 300, damping: 30 }
          }
          className="fixed bottom-0 inset-x-0 z-50 glass border-t border-white/10 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
          role="region"
          aria-label="Mini audio player"
        >
          {/* Interactive touch-friendly progress/scrubber bar at top */}
          <div
            className="relative h-2 w-full bg-white/10 cursor-pointer group flex items-center"
            onClick={handleScrub}
            role="slider"
            aria-label={`Playback position for ${currentTrack.title}`}
            aria-valuenow={Math.round(currentTime)}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration || 100)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') seek(Math.min(currentTime + 5, duration))
              if (e.key === 'ArrowLeft') seek(Math.max(currentTime - 5, 0))
            }}
          >
            <div
              className="h-1 bg-gold group-hover:bg-amber transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity -ml-1 shadow"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3 sm:gap-4">
            {/* Track info */}
            <div className="flex-1 min-w-0">
              <p className="text-ivory text-sm font-medium truncate leading-tight">
                {currentTrack.title}
              </p>
              <p className="text-muted text-xs truncate">
                {currentTrack.collection || currentTrack.subtitle}
              </p>
            </div>

            {/* Time */}
            <span className="hidden sm:block text-xs text-muted tabular-nums whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Controls with touch-friendly 44px+ hit targets */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={prev}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-ivory active:text-gold transition-colors rounded-lg hover:bg-white/10"
                aria-label="Previous track"
              >
                <SkipBack size={18} />
              </button>
              <button
                onClick={toggle}
                className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-gold text-obsidian flex items-center justify-center hover:bg-amber active:scale-95 transition-all shadow-md shadow-gold/20"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>
              <button
                onClick={next}
                className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-ivory active:text-gold transition-colors rounded-lg hover:bg-white/10"
                aria-label="Next track"
              >
                <SkipForward size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
