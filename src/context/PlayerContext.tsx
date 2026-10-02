import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react'
import type { ReactNode } from 'react'
import { tracks } from '../config/site'
import type { Track } from '../config/site'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

function parseDuration(dur: string): number {
  if (!dur) return 0
  const parts = dur.split(':').map(Number)
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return 0
}

interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  hasStarted: boolean
  audioError: string | null
}

interface PlayerContextValue extends PlayerState {
  play: (trackId: string) => void
  toggle: () => void
  pause: () => void
  next: () => void
  prev: () => void
  seek: (time: number) => void
  setVolume: (vol: number) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return
    if (window.YT && window.YT.Player) {
      resolve()
      return
    }

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    )
    if (!existingScript) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)
    }

    const prevCallback = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback()
      resolve()
    }
  })
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<any>(null)
  const isReadyRef = useRef<boolean>(false)
  const pendingTrackRef = useRef<Track | null>(null)
  const timerRef = useRef<number | null>(null)
  const volumeRef = useRef<number>(0.8)

  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    hasStarted: false,
    audioError: null,
  })

  // Initialize YouTube Audio Player Bridge
  useEffect(() => {
    let isMounted = true

    loadYouTubeAPI().then(() => {
      if (!isMounted) return

      const checkInterval = setInterval(() => {
        const container = document.getElementById('youtube-audio-player')
        if (container && window.YT && window.YT.Player && !playerRef.current) {
          clearInterval(checkInterval)

          try {
            const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''
            playerRef.current = new window.YT.Player('youtube-audio-player', {
              height: '1',
              width: '1',
              videoId: tracks[0]?.youtubeId || 'BHcaSvht2f0',
              host: 'https://www.youtube-nocookie.com',
              playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                rel: 0,
                playsinline: 1,
                enablejsapi: 1,
                // Explicit origin parameter eliminates the DOMWindow postMessage error
                origin: currentOrigin,
                widget_referrer: currentOrigin,
              },
              events: {
                onReady: (event: any) => {
                  isReadyRef.current = true
                  try {
                    event.target.setVolume(Math.round(volumeRef.current * 100))
                  } catch (e) {
                    // Ignore
                  }
                  if (pendingTrackRef.current) {
                    const pt = pendingTrackRef.current
                    pendingTrackRef.current = null
                    try {
                      event.target.loadVideoById(pt.youtubeId)
                    } catch (e) {
                      // Ignore
                    }
                  }
                },
                onStateChange: (event: any) => {
                  // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING
                  if (event.data === 1) {
                    setState((s) => ({ ...s, isPlaying: true, audioError: null }))
                  } else if (event.data === 2) {
                    setState((s) => ({ ...s, isPlaying: false }))
                  } else if (event.data === 0) {
                    // Automatically play next track on completion
                    const currentIdx = tracks.findIndex(
                      (t) => t.id === pendingTrackRef.current?.id || t.id === tracks[0].id
                    )
                    const nextTrack = tracks[(currentIdx + 1) % tracks.length]
                    if (nextTrack && playerRef.current?.loadVideoById) {
                      playerRef.current.loadVideoById(nextTrack.youtubeId)
                      setState((s) => ({
                        ...s,
                        currentTrack: nextTrack,
                        currentTime: 0,
                        duration: parseDuration(nextTrack.duration),
                      }))
                    }
                  }
                },
                onError: (err: any) => {
                  console.warn('YouTube audio bridge event notice:', err)
                },
              },
            })
          } catch (e) {
            console.error('Failed to instantiate YouTube player:', e)
          }
        }
      }, 100)

      return () => clearInterval(checkInterval)
    })

    return () => {
      isMounted = false
    }
  }, [])

  // Poll current time when playing
  useEffect(() => {
    if (state.isPlaying) {
      timerRef.current = window.setInterval(() => {
        const p = playerRef.current
        if (p && typeof p.getCurrentTime === 'function') {
          try {
            const cur = p.getCurrentTime() || 0
            const dur =
              p.getDuration() ||
              (state.currentTrack ? parseDuration(state.currentTrack.duration) : 0)
            setState((s) => ({
              ...s,
              currentTime: cur,
              duration: dur > 0 ? dur : s.duration,
            }))
          } catch (e) {
            // Ignore frame timing
          }
        }
      }, 250)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [state.isPlaying, state.currentTrack])

  const play = useCallback(
    (trackId: string) => {
      const track = tracks.find((t) => t.id === trackId)
      if (!track) return

      const p = playerRef.current
      const targetDuration = parseDuration(track.duration)

      if (!isReadyRef.current || !p || typeof p.loadVideoById !== 'function') {
        pendingTrackRef.current = track
        setState((s) => ({
          ...s,
          currentTrack: track,
          hasStarted: true,
          currentTime: 0,
          duration: targetDuration,
          audioError: null,
        }))
        return
      }

      if (state.currentTrack?.id === track.id) {
        // Toggle play/pause for same track
        if (state.isPlaying) {
          p.pauseVideo()
        } else {
          p.playVideo()
        }
      } else {
        // Load and play new track
        p.loadVideoById(track.youtubeId)
        setState((s) => ({
          ...s,
          currentTrack: track,
          hasStarted: true,
          currentTime: 0,
          duration: targetDuration,
          audioError: null,
        }))
      }
    },
    [state.currentTrack, state.isPlaying]
  )

  const toggle = useCallback(() => {
    const p = playerRef.current
    if (state.isPlaying) {
      if (p && typeof p.pauseVideo === 'function') {
        p.pauseVideo()
      }
    } else {
      if (!state.currentTrack && tracks.length > 0) {
        play(tracks[0].id)
      } else if (p && typeof p.playVideo === 'function') {
        p.playVideo()
      }
    }
  }, [state.isPlaying, state.currentTrack, play])

  const pause = useCallback(() => {
    const p = playerRef.current
    if (p && typeof p.pauseVideo === 'function') {
      p.pauseVideo()
    }
  }, [])

  const next = useCallback(() => {
    const idx = tracks.findIndex((t) => t.id === state.currentTrack?.id)
    const nextTrack = tracks[(idx + 1) % tracks.length]
    play(nextTrack.id)
  }, [state.currentTrack, play])

  const prev = useCallback(() => {
    const p = playerRef.current
    if (state.currentTime > 3 && p && typeof p.seekTo === 'function') {
      p.seekTo(0, true)
      setState((s) => ({ ...s, currentTime: 0 }))
      return
    }
    const idx = tracks.findIndex((t) => t.id === state.currentTrack?.id)
    const prevTrack = tracks[(idx - 1 + tracks.length) % tracks.length]
    play(prevTrack.id)
  }, [state.currentTrack, state.currentTime, play])

  const seek = useCallback((time: number) => {
    const p = playerRef.current
    if (p && typeof p.seekTo === 'function') {
      p.seekTo(time, true)
      setState((s) => ({ ...s, currentTime: time }))
    }
  }, [])

  const setVolume = useCallback((vol: number) => {
    volumeRef.current = vol
    const p = playerRef.current
    if (p && typeof p.setVolume === 'function') {
      p.setVolume(Math.round(vol * 100))
    }
    setState((s) => ({ ...s, volume: vol }))
  }, [])

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        play,
        toggle,
        pause,
        next,
        prev,
        seek,
        setVolume,
      }}
    >
      {children}

      {/* Hidden YouTube Audio Player Bridge */}
      <div
        id="youtube-audio-container"
        className="fixed -bottom-[9999px] -left-[9999px] w-[1px] h-[1px] opacity-0 pointer-events-none"
        aria-hidden="true"
        tabIndex={-1}
      >
        <div id="youtube-audio-player" />
      </div>
    </PlayerContext.Provider>
  )
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
