import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { testimonials } from '../config/site'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-obsidian" aria-label="Testimonials section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">What People Say</p>
          <h2 className="section-heading text-ivory">Voices from the Mehfil</h2>
          <div className="gold-divider" />
          <p className="text-zinc-400 text-base max-w-2xl mx-auto text-center mt-3">
            Reflections and praise from event hosts, festival curators, and patrons across sacred celebrations and cultural galas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass rounded-2xl p-6 md:p-8 flex flex-col justify-between h-full border border-white/10 hover:border-gold/40 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.12)] relative"
              aria-label={`Testimonial from ${t.author || t.name}`}
            >
              <div>
                <Quote size={28} className="text-[#D4AF37] mb-4 opacity-90" aria-hidden="true" />
                <blockquote className="text-zinc-200 text-sm sm:text-base leading-relaxed italic">
                  "{t.quote}"
                </blockquote>
              </div>

              <footer className="border-t border-white/10 pt-5 mt-6">
                <div className="flex items-center gap-1 mb-2 text-[#D4AF37]">
                  {[...Array(t.rating || 5)].map((_, idx) => (
                    <Star key={idx} size={14} className="fill-[#D4AF37] text-[#D4AF37]" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-white font-medium text-base">{t.author || t.name}</p>
                <p className="text-xs sm:text-sm text-[#D4AF37]/90 mt-0.5">
                  {t.role} • {t.location}
                </p>
                {t.eventType && (
                  <span className="inline-block mt-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gold/10 text-gold border border-gold/20">
                    {t.eventType}
                  </span>
                )}
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
