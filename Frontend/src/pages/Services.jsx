import PageTitle from '../components/PageTitle'
import ServiceGrid from '../components/ServiceGrid'
import CtaBanner from '../components/CtaBanner'
import { site } from '../data/site'

export default function Services() {
  return (
    <>
      <PageTitle sub={site.brand}>Layanan Kami</PageTitle>
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <ServiceGrid />
      </section>
      <CtaBanner />
    </>
  )
}
