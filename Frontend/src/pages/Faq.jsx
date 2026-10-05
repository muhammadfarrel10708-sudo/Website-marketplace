import PageTitle from '../components/PageTitle'
import Accordion from '../components/Accordion'
import { faqs } from '../data/content'

export default function Faq() {
  return (
    <>
      <PageTitle>FAQ</PageTitle>
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <Accordion items={faqs} />
      </section>
    </>
  )
}
