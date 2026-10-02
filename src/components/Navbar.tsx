import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Instagram } from 'lucide-react'
import { artist, socials } from '../config/site'

const navLinks = [
  { label: 'Artistry', href: '#artistry' },
  { label: 'Music', href: '#music' },
  { label: 'Performances', href: '#performances' },
  { label: 'Bookings', href: '#bookings' },
]

function scrollTo(id: string) {
  const el = document.querySelector(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Auto-close drawer if window resized to desktop (>= 1024px)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Close drawer on outside click
  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  // Trap focus & lock body scroll in drawer
  useEffect(() => {
    if (open) {
      drawerRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleNavClick = (href: string) => {
    setOpen(false)
    setTimeout(() => scrollTo(href), 150)
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/10 shadow-lg' : 'bg-[#0B0B0E]/85 backdrop-blur-md border-b border-white/10'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20 gap-4">
        {/* Brand Logo / Name with shrink-0 protection */}
        <a
          href="#hero"
          className="shrink-0 flex items-center gap-2 group focus-visible:outline-gold"
          onClick={(e) => { e.preventDefault(); scrollTo('#hero') }}
          aria-label={`${artist.name} – home`}
        >
          <span className="font-heading text-lg sm:text-xl lg:text-2xl font-light text-gradient-gold tracking-wide whitespace-nowrap">
            {artist.name}
          </span>
        </a>

        {/* Desktop Navigation Links (Hidden below 1024px to prevent overlapping on tablets/mid-screens) */}
        <nav
          className="hidden lg:flex items-center gap-8 text-sm uppercase tracking-wider text-muted font-medium"
          aria-label="Desktop navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
              className="text-muted hover:text-gold transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: Socials + Gold CTA Button with shrink-0 */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gold hover:text-obsidian flex items-center justify-center text-muted transition-all duration-200"
              aria-label="Instagram profile"
              title="Instagram @aurangzaibalisantoo"
            >
              <Instagram size={16} />
            </a>
            <a
              href={socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gold hover:text-obsidian flex items-center justify-center text-muted transition-all duration-200"
              aria-label="TikTok profile"
              title="TikTok @aurangzaibalisantoo"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.46V11.1a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.53z" />
              </svg>
            </a>
          </div>

          <button
            className="btn-gold text-sm px-5 py-2.5 min-h-[44px] shrink-0 font-medium"
            onClick={() => scrollTo('#bookings')}
            aria-label="Open event inquiry form"
          >
            Inquire for Event
          </button>
        </div>

        {/* Mobile / Tablet Hamburger Toggle (Visible below 1024px) */}
        <button
          className="lg:hidden text-ivory p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile / Tablet Drawer (Visible below 1024px) */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={drawerRef}
            tabIndex={-1}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#0B0B0E]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="px-5 py-6 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href) }}
                  className="flex items-center text-base text-muted hover:text-ivory tracking-wider uppercase transition-colors py-3 min-h-[44px] font-medium"
                >
                  {link.label}
                </a>
              ))}
              
              <div className="flex items-center gap-3 pt-3 pb-2 border-t border-white/10">
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-3 rounded-lg glass text-xs text-ivory flex items-center justify-center gap-2 hover:text-gold min-h-[44px]"
                >
                  <Instagram size={16} />
                  <span>Instagram</span>
                </a>
                <a
                  href={socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-3 rounded-lg glass text-xs text-ivory flex items-center justify-center gap-2 hover:text-gold min-h-[44px]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.46V11.1a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.53z" />
                  </svg>
                  <span>TikTok</span>
                </a>
              </div>

              <button
                className="btn-gold w-full mt-2 min-h-[48px] flex items-center justify-center text-sm font-semibold"
                onClick={() => handleNavClick('#bookings')}
              >
                Inquire for Event
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
