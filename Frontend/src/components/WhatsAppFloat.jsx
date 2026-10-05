import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'
import { getWhatsAppLink } from '../data/whatsapp'

export default function WhatsAppFloat() {
  const link = getWhatsAppLink()
  if (!link) return null

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-colors"
    >
      <ChatBubbleLeftRightIcon className="h-7 w-7" aria-hidden="true" />
    </a>
  )
}
