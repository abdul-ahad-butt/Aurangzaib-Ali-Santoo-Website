import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, ExternalLink, Music2, Youtube } from 'lucide-react'
import { FEATURED_TRACKS, ARTIST_SOCIALS } from '../../data/mediaData'
import { usePlayer } from '../../context/PlayerContext'

function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function Equalizer({ active }: { active: boolean }) {
  return (
    <div
      className="flex items-end gap-[3px] h-4"
      aria-label={active ? 'Playing' : 'Paused'}
      role="img"
    >
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`w-1 bg-gold rounded-full transition-all duration-300 ${
            active ? 'animate-pulse' : 'opacity-40'
          }`}
          style={{
            height: active ? `${[65, 100, 80, 50][i - 1]}%` : '30%',
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </div>
  )
}

export default function FeaturedTracks() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    play,
    toggle,
    seek,
    setVolume,
    audioError,
  } = usePlayer()

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, trackId: string) => {
      if (currentTrack?.id !== trackId || !duration) return
      const rect = e.currentTarget.getBoundingClientRect()
      const pct = (e.clientX - rect.left) / rect.width
      seek(pct * duration)
    },
    [currentTrack, duration, seek]
  )

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="music" className="py-24 md:py-32 bg-charcoal" aria-label="Music section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">Listen</p>
          <h2 className="section-heading text-ivory">Featured Tracks</h2>
          <div className="gold-divider" />
          <p className="text-muted text-sm max-w-xl mx-auto mt-4">
            Authentic live vocal and harmonium recordings performed by Aurangzaib Ali Santoo. Click play to listen.
          </p>
        </motion.div>

        <div className="space-y-4">
          {FEATURED_TRACKS.map((track, i) => {
            const isActive = currentTrack?.id === track.id
            const isThisPlaying = isActive && isPlaying
            const trackDurationSeconds = duration || 270
            const progress =
              isActive && trackDurationSeconds ? (currentTime / trackDurationSeconds) * 100 : 0

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`glass rounded-2xl p-5 md:p-6 transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'border-gold/60 shadow-[0_0_35px_rgba(212,175,55,0.18)] bg-white/[0.08]'
                    : 'hover:border-white/20'
                }`}
              >
                {/* Active golden glow line */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
                )}

                <div className="flex items-center gap-4">
                  {/* Play/Pause Button */}
                  <button
                    onClick={() => (isActive ? toggle() : play(track.id))}
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 group ${
                      isActive
                        ? 'bg-gold text-obsidian shadow-lg shadow-gold/30 scale-105'
                        : 'bg-white/10 text-ivory hover:bg-gold hover:text-obsidian'
                    }`}
                    aria-label={isThisPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                  >
                    {isThisPlaying ? (
                      <Pause size={18} className="fill-current animate-pulse" />
                    ) : (
                      <Play
                        size={18}
                        className="fill-current ml-0.5 group-hover:scale-110 transition-transform"
                      />
                    )}
                  </button>

                  {/* Track Thumbnail Preview */}
                  <div className="hidden sm:block relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                    <img
                      src={track.thumbnailUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {isThisPlaying && (
                      <div className="absolute inset-0 bg-gold/20 flex items-center justify-center">
                        <Equalizer active={true} />
                      </div>
                    )}
                  </div>

                  {/* Track metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                      <p className="text-ivory font-medium text-base md:text-lg truncate">
                        {track.title}
                      </p>
                      {isActive && <Equalizer active={isThisPlaying} />}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <p className="text-muted text-xs md:text-sm truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">
                        {track.collection}
                      </p>
                      <span className="text-white/20 text-xs">•</span>
                      <span className="text-muted text-xs tabular-nums">{track.duration}</span>

                      {/* YouTube Watch Link */}
                      <a
                        href={track.socialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/60 border border-red-500/30 transition-all duration-150 ml-auto sm:ml-0 min-h-[32px]"
                        title="Watch full performance on YouTube"
                      >
                        <Youtube size={12} className="text-red-400" />
                        <span>YouTube</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>

                    {/* Error display */}
                    {isActive && audioError && (
                      <p className="text-amber-400 text-xs mt-2" role="alert">
                        {audioError}
                      </p>
                    )}

                    {/* Progress + scrubber for active track */}
                    {isActive && (
                      <div className="mt-4 space-y-2 pt-2 border-t border-white/5">
                        <div
                          className="relative h-2 bg-white/15 rounded-full cursor-pointer group flex items-center py-2 -my-1"
                          onClick={(e) => handleSeek(e, track.id)}
                          role="slider"
                          aria-label={`Playback position for ${track.title}`}
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
                            className="h-1.5 bg-gold rounded-full transition-all duration-100 group-hover:bg-amber"
                            style={{ width: `${progress}%` }}
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gold shadow-lg shadow-gold/50 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity"
                            style={{ left: `calc(${progress}% - 8px)` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted tabular-nums">
                          <span>{formatTime(currentTime)}</span>
                          <div className="hidden sm:flex items-center gap-2">
                            <Volume2 size={13} className="text-muted" aria-hidden="true" />
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step={0.01}
                              value={volume}
                              onChange={(e) => setVolume(Number(e.target.value))}
                              className="w-20 accent-gold h-1 cursor-pointer"
                              aria-label="Volume"
                            />
                          </div>
                          <span>{formatTime(duration || 270)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stylized Track number */}
                  <span className="hidden sm:block text-3xl font-heading text-white/10 font-light flex-shrink-0 select-none">
                    {track.number}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Footer info note & artist social links */}
        <div className="mt-8 text-center flex flex-wrap items-center justify-center gap-3 text-xs text-muted">
          <div className="flex items-center gap-1.5">
            <Music2 size={14} className="text-gold/60" />
            <span>Authentic audio streamed via YouTube Audio bridge.</span>
          </div>
          <span className="hidden sm:inline text-white/20">•</span>
          <div className="flex items-center gap-3">
            <span>Official artist channels:</span>
            <a
              href={ARTIST_SOCIALS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 inline-flex items-center gap-1"
            >
              YouTube <ExternalLink size={10} />
            </a>
            <a
              href={ARTIST_SOCIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline inline-flex items-center gap-1"
            >
              Instagram <ExternalLink size={10} />
            </a>
            <a
              href={ARTIST_SOCIALS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline inline-flex items-center gap-1"
            >
              TikTok <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
