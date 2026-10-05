export default function PageTitle({ children, sub }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-14 pb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{children}</h1>
      {sub && <p className="mt-3 text-sm leading-6 text-gray-600">{sub}</p>}
    </div>
  )
}
