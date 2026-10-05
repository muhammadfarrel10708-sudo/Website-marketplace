import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

// items: [[judul, isi], ...]
export default function Accordion({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="space-y-2">
      {items.map(([q, a], i) => {
        const isOpen = open === i
        return (
          <div key={q} className="rounded-md bg-gray-100">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-gray-900 hover:text-brand"
            >
              {q}
              <ChevronDownIcon className={`h-4 w-4 flex-none transition-transform ${isOpen ? 'rotate-180 text-brand' : ''}`} aria-hidden="true" />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm leading-6 text-gray-600">{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
