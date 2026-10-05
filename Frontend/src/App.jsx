import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom'
import AuthProvider from './auth/AuthProvider'
import ProtectedRoute from './auth/ProtectedRoute'
import PublicLayout from './components/PublicLayout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Calculator from './pages/Calculator'
import Portfolio from './pages/Portfolio'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import Faq from './pages/Faq'
import Contact from './pages/Contact'
import Order from './pages/Order'
import Marketplace from './pages/Marketplace'
import ProductDetail from './pages/ProductDetail'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import HeroSection from './pages/admin/HeroSection'
import ArticlesAdmin from './pages/admin/Articles'
import ServicesAdmin from './pages/admin/Services'
import AboutPageEditor from './pages/admin/AboutPageEditor'
import PortfolioEditor from './pages/admin/PortfolioEditor'

function AboutPageEditorRoute() {
  const [searchParams] = useSearchParams()
  const requested = searchParams.get('section')
  const section = ['intro', 'testimonials', 'projects', 'brands'].includes(requested) ? requested : 'intro'
  return <AboutPageEditor section={section} />
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Website publik */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tentang-kami" element={<About />} />
          <Route path="/layanan" element={<Services />} />
          <Route path="/kalkulator-videotron" element={<Calculator />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/:id" element={<ProductDetail />} />
          <Route path="/portofolio" element={<Portfolio />} />
          <Route path="/artikel" element={<Articles />} />
          <Route path="/artikel/:slug" element={<ArticleDetail placement="menu" />} />
          <Route path="/artikel/home/:slug" element={<ArticleDetail placement="home" />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/kontak" element={<Contact />} />
          <Route path="/pesan-sekarang" element={<Order />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Login: hanya bisa dibuka lewat URL, tidak ada tautannya di menu */}
        <Route path="/login" element={<Login />} />

        {/* Admin: semua alamat /admin/... wajib login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="landing-page" element={<HeroSection />} />
            <Route path="about-page" element={<AboutPageEditorRoute />} />
            <Route path="articles" element={<ArticlesAdmin placement="menu" />} />
            <Route path="services" element={<ServicesAdmin placement="page" />} />
            <Route path="portfolio" element={<PortfolioEditor />} />
            <Route path="heroes" element={<Navigate to="/admin/landing-page" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}
