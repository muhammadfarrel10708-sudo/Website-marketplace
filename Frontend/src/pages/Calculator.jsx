import PageTitle from '../components/PageTitle'
import CalculatorForm from '../components/CalculatorForm'

export default function Calculator() {
  return (
    <>
      <PageTitle sub="Hitung estimasi kebutuhan videotron Anda secara cepat.">Kalkulator Videotron</PageTitle>
      <section className="mx-auto max-w-xl px-6 pb-16">
        <CalculatorForm />
      </section>
    </>
  )
}
