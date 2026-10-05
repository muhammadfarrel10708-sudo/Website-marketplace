import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { siteConfig } from '../data/siteConfig'

export default function FAQ() {
  const [openId, setOpenId] = useState(null)

  return (
    <section id="faq" className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600">Ada Pertanyaan?</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Pertanyaan yang Sering Diajukan
          </p>
        </div>

        <dl className="mt-12 divide-y divide-gray-200 rounded-2xl bg-white border border-gray-100 shadow-sm">
          {siteConfig.faq.map((item) => {
            const isOpen = openId === item.id
            return (
              <div key={item.id} className="px-6">
                <dt>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-5 text-left text-base font-semibold text-gray-900"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    {item.question}
                    <ChevronDownIcon
                      className={`ml-4 h-5 w-5 flex-none text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </dt>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.dd
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-base leading-7 text-gray-600">{item.answer}</p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
