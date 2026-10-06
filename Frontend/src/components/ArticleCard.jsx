import { Link } from 'react-router-dom'
import { sitePath } from '../data/site'
import DummyImage from './DummyImage'

export default function ArticleCard({ article, seed = 0, showDate = false, excerptLimit = null, showReadMore = false }) {
  const rawExcerpt = String(article.excerpt ?? '')
  const limitedExcerpt = excerptLimit && rawExcerpt.length > excerptLimit
    ? `${rawExcerpt.slice(0, excerptLimit).trimEnd()}...`
    : rawExcerpt

  return (
    <article className="flex flex-col">
      <Link to={sitePath(`/artikel/${article.slug}`)} aria-hidden="true" tabIndex={-1}>
        {article.image_url ? <img src={article.image_url} alt="" className="aspect-square w-full rounded-lg object-cover" /> : <DummyImage seed={seed} ratio="1 / 1" label="Gambar dummy" className="rounded-lg" />}
      </Link>
      {showDate && <p className="mt-4 text-xs text-gray-500">{article.date}</p>}
      <h3 className={`${showDate ? 'mt-1' : 'mt-4'} text-base font-bold leading-snug text-gray-900`}>
        <Link to={sitePath(`/artikel/${article.slug}`)} className="hover:text-brand">{article.title}</Link>
      </h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">{limitedExcerpt}</p>
      {showReadMore && (
        <Link to={sitePath(`/artikel/${article.slug}`)} className="mt-3 inline-flex w-fit text-sm font-semibold text-brand hover:underline">
          Baca selengkapnya →
        </Link>
      )}
    </article>
  )
}
