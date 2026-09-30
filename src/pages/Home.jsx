import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import {
  Search, MapPin, BedDouble, Bath, Square, ArrowUpRight,
  Menu, X, Phone, ChevronLeft, ChevronRight, Star,
  Building2, Crown, KeyRound, ShieldCheck, Quote, ArrowRight, Mail, Share2, Globe, Sparkles, LogOut, LayoutDashboard
} from 'lucide-react'
import { api } from '../utils/api'
import { useAuth } from '../context/AuthContext'

// --- Fallback Data (used while loading / if API offline) ---
const fallbackProperties = [
  { _id: 1, price: "$139,000,000", address: "1021 N Beverly Drive, Beverly Hills", beds: 8, baths: 12, sqft: "18,500", tag: "TROUSDALE", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop", images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop"], status: "New Listing" },
  { _id: 2, price: "$79,500,000", address: "950 Bel Air Road, Bel Air", beds: 7, baths: 10, sqft: "14,200", tag: "BEL AIR", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop", images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"], status: "Private Listing" },
  { _id: 3, price: "$45,000,000", address: "1470 Carla Ridge, Beverly Hills", beds: 6, baths: 9, sqft: "11,800", tag: "BIRDNEST", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop", images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop"], status: "Just Sold" },
  { _id: 4, price: "$62,800,000", address: "864 Stradella Road, Bel Air", beds: 7, baths: 11, sqft: "13,400", tag: "STRADALLA", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop", images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"], status: "New Listing" },
  { _id: 5, price: "$28,900,000", address: "755 Sarbonne Road, Bel Air", beds: 5, baths: 7, sqft: "8,950", tag: "SARBONNE", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop", images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop"], status: "Price Reduced" },
  { _id: 6, price: "$88,000,000", address: "1181 N Doheny Drive, Hollywood Hills", beds: 9, baths: 14, sqft: "21,000", tag: "DOHENY ESTATE", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop", images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop"], status: "Iconic" },
]

const agents = [
  { name: "Sebastian Vance", role: "Founding Partner", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop", sales: "$1.8B Sold" },
  { name: "Isabella Noir", role: "Founding Partner", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop", sales: "$1.4B Sold" },
  { name: "Julian Cross", role: "Senior Estate Director", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop", sales: "$890M Sold" },
]

// --- Motion Variants ---
const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }
const cardStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }

// --- Navbar ---
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user, logout, isAgent } = useAuth()
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 border-b transition-all duration-500 ${scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-white/10 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.35)]' : 'bg-gradient-to-b from-black/40 to-transparent border-transparent py-6'}`}
      >
        <div className="max-w-[1420px] mx-auto px-5 lg:px-8 flex items-center justify-between">
          <motion.a href="#" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex flex-col leading-none group">
            <span className="font-serif text-[26px] lg:text-[30px] tracking-[0.18em] text-white font-light">ELARA<span className="font-semibold text-gold-400 group-hover:text-gold-300 transition">.</span></span>
            <span className="text-[9px] tracking-[0.44em] text-white/70 -mt-1 font-sans font-medium">ESTATES</span>
          </motion.a>

          <div className="hidden lg:flex items-center gap-9 text-[11px] tracking-[0.22em] font-medium text-white/75">
            {['PROPERTIES', 'ESTATES', 'PHILOSOPHY', 'AGENTS'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative py-1 hover:text-white transition"
                whileHover="hover"
              >
                {item}
                <motion.span className="absolute left-0 -bottom-1 h-[1px] bg-gold-400 w-0" variants={{ hover: { width: '100%', transition: { duration: 0.3 } } }} />
              </motion.a>
            ))}
            <a href="#contact" className="hover:text-white transition">PRESS</a>
          </div>

          <div className="hidden lg:flex items-center gap-5">
            <a href="tel:3108883527" className="hidden xl:flex items-center gap-2 text-white/80 text-[12px] tracking-[0.15em] hover:text-white transition">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Phone size={13} className="text-gold-400" /></span> 310.888.ELARA
            </a>
            {user ? (
              <div className="flex items-center gap-3">
                {isAgent && <Link to="/admin" className="flex items-center gap-1.5 bg-white text-black px-5 py-3 text-[11px] tracking-[0.12em] font-semibold hover:bg-zinc-100"><LayoutDashboard size={14} /> DASHBOARD</Link>}
                <span className="text-white text-xs hidden xl:inline">{user.name}</span>
                <button onClick={logout} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/15 hover:bg-white hover:text-black transition"><LogOut size={14} /></button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-white text-[11px] tracking-[0.18em] hover:text-gold-300">LOGIN</Link>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.03, backgroundColor: "#c9981a", color: "#fff" }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white text-black px-7 py-3 text-[11px] tracking-[0.18em] font-semibold shadow-lg"
                >
                  INQUIRE
                </motion.a>
              </>
            )}
          </div>

          <button onClick={() => setOpen(!open)} aria-label="Menu" className="lg:hidden w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white border border-white/15">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={open ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                {open ? <X size={18} /> : <Menu size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-xl lg:hidden"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="pt-24 px-6 h-full flex flex-col"
            >
              <div className="flex flex-col gap-1 text-white">
                {['PROPERTIES', 'ESTATES', 'PHILOSOPHY', 'AGENTS', 'CONTACT'].map((l, i) => (
                  <motion.a
                    key={l}
                    initial={{ x: -12, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.08 + i * 0.06 }}
                    onClick={() => setOpen(false)}
                    href={`#${l.toLowerCase()}`}
                    className="text-[28px] font-serif font-light tracking-wide py-4 border-b border-white/10 flex items-center justify-between group"
                  >
                    {l} <ArrowUpRight size={18} className="opacity-30 group-hover:opacity-100 group-hover:text-gold-400 transition" />
                  </motion.a>
                ))}
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setOpen(false)} className="text-[28px] font-serif font-light tracking-wide py-4 border-b border-white/10">LOGIN</Link>
                    <Link to="/register" onClick={() => setOpen(false)} className="text-[28px] font-serif font-light tracking-wide py-4 border-b border-white/10">REGISTER</Link>
                  </>
                ) : (
                  <>
                    {isAgent && <Link to="/admin" onClick={() => setOpen(false)} className="text-[28px] font-serif font-light tracking-wide py-4 border-b border-white/10">DASHBOARD</Link>}
                    <button onClick={() => { logout(); setOpen(false); }} className="text-left text-[28px] font-serif font-light tracking-wide py-4 border-b border-white/10">LOGOUT</button>
                  </>
                )}
              </div>
              <div className="mt-auto pb-8">
                <a href="tel:3108883527" className="w-full bg-gold-500 text-white text-center py-4 tracking-[0.2em] text-sm font-semibold flex items-center justify-center gap-2"><Phone size={16} /> 310.888.ELARA</a>
                <p className="text-white/40 text-[11px] tracking-widest text-center mt-3">468 N BEDFORD DR • BEVERLY HILLS</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// --- Hero ---
function Hero() {
  const [current, setCurrent] = useState(0)
  const [search, setSearch] = useState({ keyword: '', type: 'Buy', beds: '' })
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  const heroImages = [
    "https://images.unsplash.com/photo-1613977257592-527036693d4e?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop",
  ]

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % heroImages.length), 4800)
    return () => clearInterval(t)
  }, [heroImages.length])

  const handleSearch = () => {
    const el = document.getElementById('properties')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      // dispatch custom event for filtering
      window.dispatchEvent(new CustomEvent('elara-search', { detail: search }))
    }
  }

  return (
    <section ref={ref} className="relative w-full bg-black overflow-hidden">
      <div className="relative h-[100svh] min-h-[620px] lg:min-h-[760px] overflow-hidden">
        <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img src={heroImages[current]} alt="Luxury Estate" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/75" />
              <div className="absolute inset-0 bg-black/15" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        <div className="absolute bottom-[108px] lg:bottom-10 right-5 lg:right-8 z-20 flex items-center gap-2.5">
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setCurrent(c => (c - 1 + heroImages.length) % heroImages.length)} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition"><ChevronLeft size={18} /></motion.button>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setCurrent(c => (c + 1) % heroImages.length)} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition"><ChevronRight size={18} /></motion.button>
        </div>
        <div className="absolute bottom-[118px] lg:bottom-12 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0 z-20 flex gap-2">
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className="group relative h-[2px] w-8 overflow-hidden bg-white/25">
              <motion.span layout className={`absolute inset-0 ${i === current ? 'bg-gold-400' : 'bg-transparent group-hover:bg-white/40'}`} animate={{ scaleX: i === current ? 1 : 0 }} transition={{ duration: 0.5 }} style={{ originX: 0 }} />
              {i === current && <motion.span className="absolute inset-0 bg-gold-400" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 4.8, ease: "linear" }} style={{ originX: 0 }} />}
            </button>
          ))}
        </div>

        <motion.div style={{ opacity }} className="relative z-10 h-full max-w-[1420px] mx-auto px-5 lg:px-8 flex flex-col justify-center pt-20">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-[860px]">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 bg-white/10 backdrop-blur border border-white/15 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-white/90 tracking-[0.28em] text-[10px] font-medium">BEVERLY HILLS • BEL AIR • HOLLYWOOD HILLS</span>
              <Sparkles size={12} className="text-gold-300" />
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-serif text-white text-[42px] sm:text-[54px] lg:text-[86px] leading-[0.88] font-light tracking-[-0.02em] text-balance">
              Where <span className="italic font-normal text-gold-200">Icons</span> <br />
              <motion.span initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }} className="font-medium inline-block">Make Home.</motion.span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-white/70 text-[14.5px] lg:text-[16.5px] leading-relaxed max-w-[560px] mt-6 font-light">
              Elara Estates is the defining luxury brokerage of Los Angeles — curating the world’s most exceptional estates for those who shape culture.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-9">
              <motion.a
                href="#properties"
                whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.25)" }}
                whileTap={{ y: 0, scale: 0.98 }}
                className="group bg-white text-black px-8 py-4 text-[11px] tracking-[0.2em] font-semibold flex items-center gap-2.5 hover:bg-gold-500 hover:text-white transition-colors duration-300"
              >
                VIEW PRIVATE LISTINGS <motion.span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"><ArrowUpRight size={14} /></motion.span>
              </motion.a>
              <motion.a
                href="#philosophy"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="backdrop-blur bg-white/10 border border-white/25 text-white px-8 py-4 text-[11px] tracking-[0.2em] font-semibold hover:bg-white hover:text-black transition duration-300"
              >
                OUR PHILOSOPHY
              </motion.a>
            </motion.div>

            <motion.div variants={fadeUp} className="hidden lg:flex items-center gap-6 mt-10 text-white/60 text-[11px] tracking-[0.18em]">
              <span className="flex items-center gap-2"><span className="w-6 h-[1px] bg-white/30" /> $4.2B+ SOLD</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>350+ ESTATES</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>BY REFERRAL ONLY</span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:grid absolute bottom-0 inset-x-0 mx-8 bg-white/95 backdrop-blur-xl grid-cols-4 divide-x divide-black/10 shadow-[0_-12px_40px_rgba(0,0,0,0.18)]"
        >
          {[
            { k: "$4.2B+", v: "TOTAL SALES VOLUME" },
            { k: "#1", v: "BEVERLY HILLS BROKERAGE" },
            { k: "350+", v: "ICONIC ESTATES SOLD" },
            { k: "24/7", v: "PRIVATE CLIENT SERVICE" },
          ].map((s, i) => (
            <motion.div key={s.k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 + i * 0.08 }} className="py-6 px-8 group hover:bg-zinc-50 transition">
              <div className="font-serif text-[26px] font-light group-hover:text-gold-700 transition">{s.k}</div>
              <div className="text-[10px] tracking-[0.2em] text-zinc-500 mt-1">{s.v}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-30 max-w-[1420px] mx-auto px-4 lg:px-8 -mt-8 lg:-mt-10">
        <motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white shadow-[0_20px_64px_rgba(0,0,0,0.18)] border border-black/5 p-2 flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-0 lg:ml-auto lg:max-w-[680px]"
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-3 lg:py-2">
            <span className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center shrink-0"><Search size={16} className="text-zinc-500" /></span>
            <input
              placeholder="City, Neighborhood, Address or MLS#"
              value={search.keyword}
              onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full outline-none text-[14px] placeholder:text-zinc-400 bg-transparent"
            />
          </div>
          <div className="grid grid-cols-3 lg:flex items-center gap-2 text-[11px] tracking-[0.14em] text-zinc-700 lg:border-l lg:pl-3 lg:ml-2 px-2 lg:px-0 pb-2 lg:pb-0">
            <select value={search.type} onChange={(e) => setSearch({ ...search, type: e.target.value })} className="bg-zinc-50 lg:bg-transparent border border-zinc-200 lg:border-0 rounded lg:rounded-none outline-none py-3 px-3 lg:pr-6 cursor-pointer hover:bg-zinc-100 transition"><option>Buy</option><option>Rent</option></select>
            <select value={search.beds} onChange={(e) => setSearch({ ...search, beds: e.target.value })} className="bg-zinc-50 lg:bg-transparent border border-zinc-200 lg:border-0 rounded lg:rounded-none outline-none py-3 px-3 lg:pr-6 cursor-pointer hover:bg-zinc-100 transition"><option value="">BEDS</option><option value="3">3+</option><option value="5">5+</option></select>
            <select className="bg-zinc-50 lg:bg-transparent border border-zinc-200 lg:border-0 rounded lg:rounded-none outline-none py-3 px-3 lg:pr-6 cursor-pointer hover:bg-zinc-100 transition"><option>PRICE</option><option>$5M+</option><option>$10M+</option></select>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSearch} className="bg-[#0a0a0a] text-white px-8 py-4 text-xs tracking-[0.18em] font-semibold hover:bg-gold-600 transition w-full lg:w-auto">SEARCH</motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-3 mt-4 lg:hidden">
          {[
            { k: "$4.2B+", v: "SALES VOLUME" },
            { k: "#1", v: "IN BEVERLY HILLS" },
            { k: "350+", v: "ESTATES SOLD" },
            { k: "24/7", v: "PRIVATE SERVICE" },
          ].map(s => (
            <div key={s.k} className="bg-white border border-black/5 p-4 shadow-sm">
              <div className="font-serif text-xl">{s.k}</div>
              <div className="text-[10px] tracking-[0.16em] text-zinc-500">{s.v}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Featured() {
  const [filter, setFilter] = useState('All')
  const [properties, setProperties] = useState(fallbackProperties)
  const [loading, setLoading] = useState(true)
  const cats = ['All', 'Beverly Hills', 'Bel Air', 'Hollywood Hills']

  const fetchProperties = async (neighborhood = 'All', searchParams = {}) => {
    setLoading(true)
    try {
      const params = {}
      if (neighborhood !== 'All') params.neighborhood = neighborhood
      if (searchParams.keyword) params.search = searchParams.keyword
      if (searchParams.type) params.type = searchParams.type
      if (searchParams.beds) params.beds = searchParams.beds
      params.limit = 12
      const res = await api.getProperties(params)
      if (res.data && res.data.length > 0) {
        setProperties(res.data)
      } else if (Object.keys(params).length > 0) {
        // if search yields 0, show empty state
        setProperties([])
      }
    } catch (e) {
      console.log('API offline, using fallback', e.message)
      // keep fallback filtered
      if (neighborhood === 'All') setProperties(fallbackProperties)
      else setProperties(fallbackProperties.filter(p => p.tag.toLowerCase().includes(neighborhood.split(' ')[0].toLowerCase()) || (neighborhood === 'Beverly Hills' && p.address.includes('Beverly')) || (neighborhood === 'Hollywood Hills' && p.address.includes('Hollywood'))))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties(filter)
    const handler = (e) => {
      const search = e.detail
      fetchProperties('All', search)
      setFilter('All')
    }
    window.addEventListener('elara-search', handler)
    return () => window.removeEventListener('elara-search', handler)
  }, [filter])

  const handleFilter = (c) => {
    setFilter(c)
    fetchProperties(c)
  }

  return (
    <section id="properties" className="pt-12 lg:pt-20 pb-16 bg-[#faf9f7]">
      <div className="max-w-[1420px] mx-auto px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="max-w-xl"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[10px] tracking-[0.32em] text-gold-700 font-semibold">
              <span className="w-6 h-[1px] bg-gold-500" /> CURATED COLLECTION
            </motion.div>
            <motion.h2 variants={fadeUp} className="font-serif text-[36px] lg:text-[54px] leading-[0.9] font-light text-[#0a0a0a] mt-3">Featured <span className="italic font-normal">Estates</span></motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-500 mt-4 text-[14.5px] leading-relaxed">A selection of our most exceptional off-market and private listings — each a world unto itself.</motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex gap-2 flex-wrap p-1 bg-zinc-100 rounded-full w-fit">
            {cats.map(c => (
              <button
                key={c}
                onClick={() => handleFilter(c)}
                className={`relative px-5 py-2.5 text-[11px] tracking-[0.15em] font-semibold rounded-full transition-colors ${filter === c ? 'text-white' : 'text-zinc-600 hover:text-black'}`}
              >
                {filter === c && <motion.span layoutId="activeFilter" className="absolute inset-0 bg-[#0a0a0a] rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                <span className="relative">{c.toUpperCase()}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-[380px] bg-zinc-200 animate-pulse" />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-white border border-black/5">
            <p className="text-zinc-500">No estates found for this filter.</p>
            <button onClick={() => handleFilter('All')} className="mt-4 border border-black px-6 py-2 text-xs tracking-widest">CLEAR FILTERS</button>
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            <AnimatePresence mode="popLayout">
              {properties.map((p, idx) => (
                <motion.article
                  key={p._id || p.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ duration: 0.5, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -6 }}
                  className="group bg-white border border-black/5 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden"
                >
                  <Link to={p._id?.toString().length > 10 ? `/property/${p._id}` : '#'} className="block">
                    <div className="relative h-[300px] lg:h-[320px] overflow-hidden bg-zinc-100">
                      <motion.img
                        whileHover={{ scale: 1.07 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        src={p.image || p.images?.[0]}
                        alt={p.address}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-white/95 backdrop-blur px-3 py-1.5 text-[10px] tracking-[0.16em] font-bold shadow-sm">{p.tag}</span>
                        <span className={`px-3 py-1.5 text-[10px] tracking-[0.12em] font-bold text-white shadow-sm ${p.status === 'Just Sold' ? 'bg-[#0a0a0a]' : p.status === 'New Listing' ? 'bg-gold-500' : 'bg-zinc-800'}`}>{p.status?.toUpperCase()}</span>
                      </div>
                      <motion.div initial={{ opacity: 0, y: 8 }} whileHover={{ opacity: 1, y: 0 }} className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition duration-300">
                        <span className="text-white text-[11px] tracking-[0.18em] flex items-center gap-1.5"><MapPin size={12} /> VIEW DETAILS</span>
                        <span className="bg-white text-black w-8 h-8 flex items-center justify-center rounded-full shadow"><ArrowUpRight size={16} /></span>
                      </motion.div>
                    </div>
                    <div className="p-6">
                      <div className="font-serif text-[22px] font-medium tracking-tight">{p.price}</div>
                      <div className="text-[11.5px] tracking-[0.12em] text-zinc-500 mt-1 flex items-center gap-1.5"><MapPin size={11} className="text-zinc-400" /> {p.address}</div>
                      <div className="flex items-center gap-3.5 mt-4 pt-4 border-t border-zinc-100 text-[11.5px] text-zinc-600">
                        <span className="flex items-center gap-1.5"><BedDouble size={14} className="text-zinc-400" /> {p.beds} BEDS</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-200" />
                        <span className="flex items-center gap-1.5"><Bath size={14} className="text-zinc-400" /> {p.baths} BATHS</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-200" />
                        <span className="flex items-center gap-1.5"><Square size={14} className="text-zinc-400" /> {p.sqft} SQ FT</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
          <Link to="/admin" className="inline-flex items-center gap-2 border border-black px-8 py-4 text-[11px] tracking-[0.2em] font-semibold hover:bg-black hover:text-white transition group">
            VIEW ALL LISTINGS <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function Philosophy() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const yImg = useTransform(scrollYProgress, [0, 1], ["-4%", "6%"])
  const yCard = useTransform(scrollYProgress, [0, 1], ["6%", "-4%"])

  return (
    <section ref={ref} id="philosophy" className="bg-[#0a0a0a] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,152,26,0.10),transparent_60%)]" />
      <div className="relative max-w-[1420px] mx-auto px-5 lg:px-8 py-14 lg:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="order-2 lg:order-1"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-gold-400 tracking-[0.32em] text-[10px] font-semibold">
            <span className="w-6 h-[1px] bg-gold-400" /> THE ELARA STANDARD
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-serif text-[32px] lg:text-[50px] leading-[0.93] font-light mt-3">
            We don’t sell <br /> homes. We <span className="italic text-gold-200">curate legacies.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/60 leading-relaxed mt-6 text-[14.5px] lg:text-[15.5px] max-w-xl">
            For over a decade, ELARA has redefined what it means to be a brokerage in Beverly Hills. Discretion, design literacy, and deep cultural capital — our clients don’t just buy property, they acquire a place in history.
          </motion.p>

          <motion.div variants={cardStagger} className="grid grid-cols-2 gap-3 sm:gap-4 mt-8">
            {[
              { icon: Crown, title: "Private Clientele", desc: "By referral only. 70% off-market." },
              { icon: Building2, title: "Architectural Authority", desc: "From Paul Williams to Pawson." },
              { icon: ShieldCheck, title: "Absolute Discretion", desc: "NDA-level privacy." },
              { icon: KeyRound, title: "Estate Management", desc: "White-glove stewardship." },
            ].map(s => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ y: -3, borderColor: "rgba(201,152,26,0.35)", backgroundColor: "rgba(255,255,255,0.06)" }}
                className="border border-white/10 bg-white/[0.03] backdrop-blur p-5 transition group"
              >
                <motion.div whileHover={{ scale: 1.08, rotate: 4 }} className="w-9 h-9 rounded-full bg-gold-500/15 border border-gold-500/20 flex items-center justify-center mb-3">
                  <s.icon size={16} className="text-gold-400" />
                </motion.div>
                <div className="text-[11px] tracking-[0.16em] font-bold">{s.title.toUpperCase()}</div>
                <div className="text-[12px] text-white/50 mt-1 leading-relaxed">{s.desc}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex gap-6 sm:gap-10 mt-8 pt-8 border-t border-white/10">
            {[
              { k: "12+", v: "YEARS DEFINING LUXURY" },
              { k: "WSJ", v: "TOP 10 USA TEAM" },
              { k: "VOGUE", v: "FEATURED ESTATES" },
            ].map(s => (
              <div key={s.k}><div className="font-serif text-[26px] lg:text-[30px] font-light">{s.k}</div><div className="text-[10px] tracking-[0.2em] text-white/50">{s.v}</div></div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 22 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2 relative"
        >
          <div className="relative aspect-[4/4.8] lg:aspect-[4/5] overflow-hidden bg-zinc-900">
            <motion.div style={{ y: yImg }} className="absolute inset-0 will-change-transform">
              <img src="https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=1200&auto=format&fit=crop" alt="Interior" className="w-full h-[120%] object-cover -mt-[10%]" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <motion.div
              style={{ y: yCard }}
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="absolute bottom-4 left-4 right-4 bg-white text-black p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
            >
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop" className="w-11 h-11 rounded-full object-cover shrink-0" alt="" loading="lazy" />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] tracking-[0.14em] font-bold truncate">“Elara found what no one else could.”</div>
                <div className="text-[11px] text-zinc-500 truncate">— Private Client, Trousdale</div>
              </div>
              <div className="hidden sm:flex text-gold-500 shrink-0"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
            </motion.div>
          </div>
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-3 -right-3 w-20 h-20 border border-gold-400/20 hidden lg:block" />
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-3 -left-3 w-28 h-28 bg-gold-500/10 backdrop-blur hidden lg:block" />
        </motion.div>
      </div>
    </section>
  )
}

function EstatesCarousel() {
  const [collectionProps, setCollectionProps] = useState([])
  const fallbackItems = [
    { name: "The Modernist Canopy", loc: "Trousdale Estates", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" },
    { name: "Villa del Cielo", loc: "Bel Air Crest", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop" },
    { name: "Carbon Beach Sanctuary", loc: "Malibu", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop" },
    { name: "Doheny Grand", loc: "Hollywood Hills", img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop" },
  ]

  useEffect(() => {
    api.getProperties({ limit: 4, sort: '-featured' })
      .then(res => {
        if (res.data && res.data.length >= 4) {
          setCollectionProps(res.data.slice(0, 4).map((p, i) => ({
            _id: p._id,
            name: p.title || fallbackItems[i].name,
            loc: p.neighborhood || fallbackItems[i].loc,
            img: p.image || p.images?.[0] || fallbackItems[i].img,
            price: p.price,
            address: p.address
          })))
        } else if (res.data && res.data.length > 0) {
          // map whatever we have + fallback fill
          const mapped = res.data.map((p, i) => ({
            _id: p._id,
            name: p.title,
            loc: p.neighborhood,
            img: p.image || p.images?.[0],
            price: p.price,
            address: p.address
          }))
          // fill remaining with fallback mock ids that still link to real properties if available
          while (mapped.length < 4) {
            const idx = mapped.length
            mapped.push({ _id: res.data[0]._id, ...fallbackItems[idx] })
          }
          setCollectionProps(mapped)
        }
      })
      .catch(() => {
        // offline fallback links to first featured property if available - will be replaced by fallbackProperties ids
        setCollectionProps([])
      })
  }, [])

  const items = collectionProps.length > 0 ? collectionProps : fallbackItems.map((it, i) => ({ ...it, _id: null }))

  return (
    <section id="estates" className="py-14 lg:py-20 bg-white border-y border-zinc-100 overflow-hidden">
      <div className="max-w-[1420px] mx-auto px-5 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8"
        >
          <div>
            <motion.p variants={fadeUp} className="text-[10px] tracking-[0.32em] text-gold-700 font-semibold inline-flex items-center gap-2"><span className="w-6 h-[1px] bg-gold-500" /> BY ARCHITECTURE</motion.p>
            <motion.h3 variants={fadeUp} className="font-serif text-[30px] lg:text-[42px] font-light mt-2 leading-none">Explore <span className="italic">Collections</span></motion.h3>
          </div>
          <Link to="/property/6aaf9d4a033c0e9626b8f5b7" className="hidden lg:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] font-semibold border-b border-black pb-1 hover:text-gold-700 hover:border-gold-700 transition">ALL COLLECTIONS <ArrowRight size={14} /></Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it, i) => {
            const CardContent = (
              <>
                <motion.img whileHover={{ scale: 1.08 }} transition={{ duration: 0.7 }} src={it.img} alt={it.name} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/10 transition duration-300" />
                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="absolute bottom-0 p-6 text-white w-full"
                >
                  <div className="text-[10px] tracking-[0.2em] text-gold-300 font-semibold">{it.loc.toUpperCase()}</div>
                  <div className="font-serif text-[21px] mt-1 leading-tight">{it.name}</div>
                  {it.price && <div className="text-[12px] tracking-[0.1em] text-white/80 mt-1">{it.price}</div>}
                  <motion.div whileHover={{ scale: 1.03 }} className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.16em] border border-white/35 bg-white/10 backdrop-blur px-4 py-2 group-hover:bg-white group-hover:text-black transition">EXPLORE <ArrowUpRight size={12} /></motion.div>
                </motion.div>
              </>
            )
            return it._id ? (
              <Link
                key={it._id + i}
                to={`/property/${it._id}`}
                className="group relative h-[380px] lg:h-[420px] overflow-hidden cursor-pointer bg-zinc-100 block"
              >
                {CardContent}
              </Link>
            ) : (
              <motion.div
                key={it.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="group relative h-[380px] lg:h-[420px] overflow-hidden cursor-pointer bg-zinc-100"
              >
                {CardContent}
              </motion.div>
            )
          })}
        </div>
        <div className="lg:hidden text-center mt-6">
          <Link to="/property/6aaf9d4a033c0e9626b8f5b7" className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] font-semibold border-b border-black pb-1">ALL COLLECTIONS <ArrowRight size={14} /></Link>
        </div>
      </div>
    </section>
  )
}

function Agents() {
  return (
    <section id="agents" className="py-14 lg:py-20 bg-[#faf9f7] overflow-hidden">
      <div className="max-w-[1420px] mx-auto px-5 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center max-w-2xl mx-auto">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-[10px] tracking-[0.32em] text-gold-700 font-semibold"><span className="w-6 h-[1px] bg-gold-500" /> THE PEOPLE BEHIND THE PLACES</motion.div>
          <motion.h2 variants={fadeUp} className="font-serif text-[34px] lg:text-[52px] leading-none font-light mt-3">Meet <span className="italic">Elara</span></motion.h2>
          <motion.p variants={fadeUp} className="text-zinc-500 mt-4 text-[14.5px] leading-relaxed">A discreet collective of negotiators, historians, and marketers — trusted by founders, artists, and global families.</motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-7 mt-10 lg:mt-12">
          {agents.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group bg-white border border-black/5 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500"
            >
              <div className="relative h-[380px] lg:h-[420px] overflow-hidden bg-zinc-100">
                <motion.img whileHover={{ scale: 1.06 }} transition={{ duration: 0.7 }} src={a.image} alt={a.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <motion.div initial={{ y: 12, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }} className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-black/5 p-3.5 flex items-center justify-between">
                  <span className="text-[11px] tracking-[0.16em] font-bold">{a.sales}</span>
                  <span className="flex gap-1.5">
                    <motion.span whileHover={{ scale: 1.15, y: -2 }} className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center cursor-pointer"><Share2 size={12} /></motion.span>
                    <motion.span whileHover={{ scale: 1.15, y: -2 }} className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center cursor-pointer"><Globe size={12} /></motion.span>
                    <motion.span whileHover={{ scale: 1.15, y: -2 }} className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center cursor-pointer"><Mail size={12} /></motion.span>
                  </span>
                </motion.div>
              </div>
              <div className="p-6 text-center">
                <div className="font-serif text-[20px]">{a.name}</div>
                <div className="text-[11px] tracking-[0.2em] text-gold-600 mt-1 font-semibold">{a.role.toUpperCase()}</div>
                <motion.button whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }} className="mt-4 text-[11px] tracking-[0.18em] font-bold border-b border-black pb-1 hover:text-gold-600 hover:border-gold-600 transition">VIEW PROFILE</motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-10 lg:mt-14 bg-[#0a0a0a] text-white p-6 lg:p-10 flex flex-col lg:flex-row gap-6 lg:gap-10 items-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(201,152,26,0.12),transparent_60%)]" />
          <motion.div animate={{ rotate: [0, 4, 0] }} transition={{ duration: 6, repeat: Infinity }} className="relative w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <Quote size={22} className="text-gold-400" />
          </motion.div>
          <div className="relative flex-1 text-center lg:text-left">
            <p className="font-serif text-[18px] lg:text-[22px] font-light leading-relaxed">“Working with Elara was unlike any brokerage experience. They understood our need for privacy, our eye for design, and negotiated a record price.”</p>
            <div className="mt-3 text-[11px] tracking-[0.18em] text-white/60">— SELLER, 1240 COLLIER CREST • $36.5M • 11 DAYS ON MARKET</div>
          </div>
          <div className="relative flex gap-1 text-gold-400 shrink-0"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div>
        </motion.div>
      </div>
    </section>
  )
}

function Press() {
  const logos = ["THE WALL STREET JOURNAL", "Architectural Digest", "VOGUE", "Forbes", "Variety", "L.A. TIMES"]
  return (
    <section className="py-6 border-y border-zinc-200 bg-white overflow-hidden">
      <div className="max-w-[1420px] mx-auto px-5 lg:px-8 flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
        <div className="text-[11px] tracking-[0.28em] text-zinc-400 font-bold shrink-0">AS SEEN IN</div>
        <div className="relative flex-1 overflow-hidden w-full">
          <motion.div
            className="flex gap-10 lg:gap-14 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {[...logos, ...logos, ...logos].map((logo, i) => (
              <span key={i} className={`font-serif text-sm lg:text-[15px] tracking-wide whitespace-nowrap ${logo === "VOGUE" ? "font-light tracking-[0.2em]" : logo.includes("JOURNAL") || logo.includes("TIMES") ? "font-bold" : logo === "Forbes" ? "font-semibold" : "italic font-light"} opacity-55 hover:opacity-100 transition cursor-default`}>
                {logo}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.createInquiry({ name: 'Newsletter Subscriber', email, message: 'Newsletter subscription', type: 'newsletter' })
      setSent(true)
      setEmail('')
      setTimeout(() => setSent(false), 4000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <footer ref={ref} id="contact" className="bg-[#0a0a0a] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(201,152,26,0.08),transparent_70%)]" />
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={stagger}
        className="relative max-w-[1420px] mx-auto px-5 lg:px-8 py-12 lg:py-16 grid lg:grid-cols-2 gap-10 lg:gap-16"
      >
        <motion.div variants={fadeUp}>
          <motion.div variants={fadeUp} className="font-serif text-3xl tracking-[0.15em] font-light">ELARA<span className="text-gold-400">.</span> <span className="text-xs tracking-[0.4em] align-middle font-sans font-medium text-white/60">ESTATES</span></motion.div>
          <motion.p variants={fadeUp} className="text-white/60 text-[14px] leading-relaxed mt-4 max-w-md">The brokerage for the iconic. Headquartered on Bedford — by appointment only. Private showings 7 days a week.</motion.p>

          <motion.div variants={stagger} className="mt-7 space-y-3.5 text-[13.5px] text-white/80">
            {[
              { icon: MapPin, text: "468 N Bedford Drive, Beverly Hills, CA 90210" },
              { icon: Phone, text: "310.888.ELARA (3527)" },
              { icon: Mail, text: "private@elaraestates.com" },
            ].map(item => (
              <motion.div key={item.text} variants={fadeUp} className="flex items-center gap-3 group">
                <span className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-gold-500 transition"><item.icon size={14} className="text-gold-400 group-hover:text-white" /></span>
                {item.text}
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="flex gap-2.5 mt-7">
            {[
              { icon: Share2 }, { icon: Globe }, { icon: Building2 }
            ].map((s, i) => (
              <motion.a key={i} whileHover={{ y: -3, scale: 1.06 }} whileTap={{ scale: 0.95 }} href="#" className="w-9 h-9 rounded-full border border-white/15 bg-white/5 flex items-center justify-center hover:bg-gold-500 hover:border-gold-500 hover:text-white transition">
                <s.icon size={14} />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:pl-10">
          <motion.h4 variants={fadeUp} className="text-[11px] tracking-[0.28em] font-bold flex items-center gap-2"><span className="w-6 h-[1px] bg-gold-500" /> PRIVATE LISTINGS JOURNAL</motion.h4>
          <motion.p variants={fadeUp} className="text-white/50 text-[13px] mt-2">Join 40,000+ collectors. Off-market previews, price intel, and estate stories.</motion.p>
          <motion.form
            variants={fadeUp}
            onSubmit={handleSubscribe}
            className="mt-5 flex gap-2"
          >
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" required type="email" className="flex-1 bg-white/[0.07] border border-white/15 px-4 py-3.5 text-sm outline-none placeholder:text-white/40 focus:border-gold-500 focus:bg-white/[0.10] transition" />
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" className="bg-gold-500 hover:bg-gold-600 text-white px-7 py-3.5 text-[11px] tracking-[0.18em] font-bold transition shadow-lg">JOIN</motion.button>
          </motion.form>
          <AnimatePresence>
            {sent && <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-gold-300 text-xs mt-3 flex items-center gap-2"><Sparkles size={12} /> Welcome to Elara Private. Check your inbox.</motion.p>}
            {error && <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs mt-3">{error}</motion.p>}
          </AnimatePresence>

          <motion.div variants={stagger} className="grid grid-cols-3 gap-6 mt-9 text-xs">
            {[
              { title: "EXPLORE", links: ["Properties", "Estates", "Agents", "Careers"] },
              { title: "RESOURCES", links: ["Journal", "Press", "Neighborhoods", "Contact"] },
              { title: "LEGAL", links: ["Privacy", "Terms", "DRE #02131234"] },
            ].map(col => (
              <motion.div key={col.title} variants={fadeUp}>
                <div className="tracking-[0.2em] font-bold text-white/90 mb-3">{col.title}</div>
                <div className="space-y-2.5 text-white/50">
                  {col.links.map(l => <a key={l} href="#" className="block hover:text-white hover:translate-x-0.5 transition">{l}</a>)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative border-t border-white/10 py-5">
        <div className="max-w-[1420px] mx-auto px-5 lg:px-8 flex flex-col lg:flex-row justify-between gap-3 text-[10.5px] tracking-[0.14em] text-white/40">
          <span>© 2026 ELARA ESTATES. ALL RIGHTS RESERVED. INDEPENDENTLY OWNED & OPERATED.</span>
          <span>CURATED IN BEVERLY HILLS • DESIGN BY ELARA STUDIO</span>
        </div>
      </motion.div>
    </footer>
  )
}

export default function Home() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div className="min-h-screen bg-[#faf9f7] overflow-x-hidden">
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-gold-700 via-gold-400 to-gold-600 origin-left z-[60]" />
      <Navbar />
      <Hero />
      <Featured />
      <Philosophy />
      <EstatesCarousel />
      <Agents />
      <Press />
      <Footer />
    </div>
  )
}
