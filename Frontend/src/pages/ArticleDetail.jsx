import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { sitePath } from '../data/site'
import DummyImage from '../components/DummyImage'
import CtaBanner from '../components/CtaBanner'
import NotFound from './NotFound'
import { getPublicArticle } from '../api/articles'
import { articles as fallbackArticles } from '../data/content'

export default function ArticleDetail({ placement = 'menu' }) {
  const { slug } = useParams()
  const fallback = fallbackArticles.find((x) => x.slug === slug)
  const [article, setArticle] = useState(fallback ?? null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    getPublicArticle(slug, placement, controller.signal).then(setArticle).catch(() => {}).finally(() => setLoading(false))
    return () => controller.abort()
  }, [slug, placement])

  if (loading && !article) return <div className="mx-auto max-w-3xl px-6 py-20 text-center text-sm text-gray-500">Memuat artikel…</div>
  if (!article) return <NotFound />

  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-14">
        <Link to={sitePath(placement === 'home' ? '/' : '/artikel')} className="text-sm font-semibold text-brand hover:underline">{placement === 'home' ? '&larr; Kembali ke Home' : '&larr; Semua artikel'}</Link>
        <p className="mt-6 text-xs text-gray-500">{article.date}</p>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-gray-900">{article.title}</h1>
        {article.image_url ? <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl"><img src={article.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ transform: `translate(${Number(article.image_position_x ?? 0)}%, ${Number(article.image_position_y ?? 0)}%) scale(${Number(article.image_zoom ?? 1)})`, transformOrigin: 'center center' }} /></div> : <DummyImage seed={fallbackArticles.findIndex((x) => x.slug === article.slug) + 1} ratio="16 / 9" label="Gambar dummy" className="mt-6 rounded-xl" />}
        {article.excerpt && <p className="mt-6 text-sm font-medium leading-7 text-gray-700">{article.excerpt}</p>}
        <div className="mt-6 space-y-4 text-sm leading-7 text-gray-700">
          {(article.body ?? []).map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </article>
      <CtaBanner />
    </>
  )
}
