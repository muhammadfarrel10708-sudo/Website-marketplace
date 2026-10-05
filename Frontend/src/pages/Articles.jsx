import { useEffect, useState } from 'react'
import PageTitle from '../components/PageTitle'
import ArticleCard from '../components/ArticleCard'
import { getPublicArticles } from '../api/articles'
import { articles as fallbackArticles } from '../data/content'

export default function Articles() {
  const [articles, setArticles] = useState(fallbackArticles)
  useEffect(() => {
    const controller = new AbortController()
    getPublicArticles('menu', controller.signal).then(setArticles).catch(() => {})
    return () => controller.abort()
  }, [])
  return (
    <>
      <PageTitle>Artikel</PageTitle>
      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 md:grid-cols-3">
        {articles.map((a, i) => (
          <ArticleCard
            key={a.id ?? a.slug}
            article={a}
            seed={i + 1}
            excerptLimit={160}
            showReadMore
          />
        ))}
      </section>
    </>
  )
}
