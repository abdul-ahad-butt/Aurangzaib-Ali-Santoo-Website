import { motion } from 'framer-motion'
import { artist } from '../config/site'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12 },
  }),
}

export default function Heritage() {
  return (
    <section id="heritage" className="py-24 md:py-32 bg-obsidian" aria-label="Heritage and biography">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
        >
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">The Lineage</p>
          <h2 className="section-heading text-ivory">A Legacy in Song</h2>
          <div className="gold-divider" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Bio text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="space-y-5"
          >
            {artist.bio.map((para, i) => (
              <p key={i} className="text-muted leading-relaxed text-base md:text-lg">
                {para}
              </p>
            ))}
          </motion.div>

          {/* Stat blocks */}
          <div className="space-y-4">
            {artist.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="glass rounded-2xl p-6 flex items-center gap-5"
              >
                {/* Decorative gold dot */}
                <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-ivory font-heading text-xl font-light leading-snug">
                    {stat.label}
                  </p>
                  {stat.value && (
                    <p className="text-gold text-3xl font-heading mt-1">{stat.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
