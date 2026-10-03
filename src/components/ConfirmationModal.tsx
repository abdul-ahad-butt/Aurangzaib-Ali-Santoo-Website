import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle } from 'lucide-react'

interface ConfirmationModalProps {
  referenceId: string
  onClose: () => void
}

export default function ConfirmationModal({ referenceId, onClose }: ConfirmationModalProps) {
  const topCloseRef = useRef<HTMLButtonElement>(null)
  const bottomCloseRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    topCloseRef.current?.focus()
    document.body.style.overflow = 'hidden'

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      // Focus trap: cycle Tab/Shift+Tab between the two buttons
      if (e.key === 'Tab') {
        const topEl = topCloseRef.current
        const bottomEl = bottomCloseRef.current
        if (!topEl || !bottomEl) return
        if (e.shiftKey) {
          if (document.activeElement === topEl) {
            e.preventDefault()
            bottomEl.focus()
          }
        } else {
          if (document.activeElement === bottomEl) {
            e.preventDefault()
            topEl.focus()
          }
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        aria-describedby="confirmation-desc"
        onClick={onClose}
      >
        <motion.div
          className="glass rounded-2xl p-8 max-w-md w-full text-center"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top close button (first focusable) */}
          <div className="flex justify-end mb-2">
            <button
              ref={topCloseRef}
              onClick={onClose}
              className="p-2 rounded-lg text-muted hover:text-ivory hover:bg-white/10 transition-colors"
              aria-label="Close confirmation"
            >
              <X size={18} />
            </button>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
            className="flex justify-center mb-6"
          >
            <CheckCircle size={56} className="text-gold" aria-hidden="true" />
          </motion.div>

          <h2
            id="confirmation-title"
            className="font-heading text-3xl text-ivory font-light mb-3"
          >
            Inquiry Received
          </h2>
          <p id="confirmation-desc" className="text-muted leading-relaxed mb-6">
            Thank you for your interest in booking Aurangzaib Ali Santoo. We will review your
            inquiry and be in touch within 48&nbsp;hours.
          </p>

          <div className="glass rounded-xl px-4 py-3 mb-6">
            <p className="text-xs text-muted mb-1">Your reference number</p>
            <p className="text-gold font-mono text-sm font-medium break-all">{referenceId}</p>
          </div>

          {/* Bottom close button (second focusable — Tab cycles back to top) */}
          <button
            ref={bottomCloseRef}
            className="btn-gold w-full"
            onClick={onClose}
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
