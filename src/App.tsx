import { PlayerProvider } from './context/PlayerContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Music from './components/Music'
import MiniPlayer from './components/MiniPlayer'
import Heritage from './components/Heritage'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import BookingForm from './components/BookingForm'
import Footer from './components/Footer'

export default function App() {
  return (
    <PlayerProvider>
      {/* Skip-to-content for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-gold focus:text-obsidian focus:font-semibold focus:text-sm"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <Heritage />
        <Music />
        <Gallery />
        <Testimonials />
        <BookingForm />
      </main>

      <Footer />

      {/* Fixed bottom mini player — slides in when a track is started */}
      <MiniPlayer />
    </PlayerProvider>
  )
}
