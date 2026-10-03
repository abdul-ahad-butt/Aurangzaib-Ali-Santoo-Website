import { motion } from 'framer-motion'
import { Mail, MessageCircle, Youtube, Instagram, Facebook } from 'lucide-react'
import { contact, socials, artist } from '../config/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="footer" className="bg-charcoal border-t border-white/10" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-light text-ivory mb-2">
            {artist.name}
          </h2>
          <p className="text-muted text-sm tracking-wider">{artist.tagline}</p>
          <div className="gold-divider mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-ivory font-medium mb-4 text-sm tracking-wider uppercase">Contact</h3>
            <div className="space-y-3">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 text-muted hover:text-ivory transition-colors text-sm group"
                aria-label={`Email ${contact.email}`}
              >
                <Mail size={16} className="text-gold group-hover:scale-110 transition-transform" aria-hidden="true" />
                {contact.email}
              </a>
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-ivory transition-colors text-sm group"
                aria-label={`WhatsApp ${contact.whatsapp}`}
              >
                <MessageCircle size={16} className="text-gold group-hover:scale-110 transition-transform" aria-hidden="true" />
                {contact.whatsapp}
              </a>
            </div>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-ivory font-medium mb-4 text-sm tracking-wider uppercase">Follow</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg glass flex items-center justify-center text-muted hover:text-gold hover:border-gold/40 active:scale-95 transition-all"
                aria-label="Instagram profile"
                title="Instagram @aurangzaibalisantoo"
              >
                <Instagram size={18} aria-hidden="true" />
              </a>
              <a
                href={socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg glass flex items-center justify-center text-muted hover:text-gold hover:border-gold/40 active:scale-95 transition-all"
                aria-label="TikTok profile"
                title="TikTok @aurangzaibalisantoo"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.46V11.1a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.53z" />
                </svg>
              </a>
              <a
                href={socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg glass flex items-center justify-center text-muted hover:text-gold hover:border-gold/40 active:scale-95 transition-all"
                aria-label="YouTube channel"
                title="YouTube @aurangzaibsantoo"
              >
                <Youtube size={18} aria-hidden="true" />
              </a>
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg glass flex items-center justify-center text-muted hover:text-gold hover:border-gold/40 active:scale-95 transition-all"
                aria-label="Facebook page"
                title="Facebook"
              >
                <Facebook size={18} aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-muted text-xs">
            &copy; {year} {artist.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
