import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, BedDouble, Bath, Square, ArrowLeft, ArrowUpRight, Search } from 'lucide-react';
import { api } from '../utils/api';

// Offline fallback — mirrors backend mockStore so cards still render if API is down.
// (When the API is reachable these are replaced by live data.)
const fallbackProperties = [
  { _id: 'mock1', title: 'Trousdale Modern Masterpiece', price: '$139,000,000', address: '1021 N Beverly Drive, Beverly Hills', neighborhood: 'Trousdale', beds: 8, baths: 12, sqft: '18,500', tag: 'TROUSDALE', status: 'New Listing', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop'] },
  { _id: 'mock2', title: 'Bel Air Crest Estate', price: '$79,500,000', address: '950 Bel Air Road, Bel Air', neighborhood: 'Bel Air', beds: 7, baths: 10, sqft: '14,200', tag: 'BEL AIR', status: 'Private Listing', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'] },
  { _id: 'mock3', title: 'Bird Streets Architectural Gem', price: '$45,000,000', address: '1470 Carla Ridge, Beverly Hills', neighborhood: 'Beverly Hills', beds: 6, baths: 9, sqft: '11,800', tag: 'BIRDNEST', status: 'Just Sold', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop'] },
  { _id: 'mock4', title: 'Stradella Vineyard Estate', price: '$62,800,000', address: '864 Stradella Road, Bel Air', neighborhood: 'Bel Air', beds: 7, baths: 11, sqft: '13,400', tag: 'STRADALLA', status: 'New Listing', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop'] },
  { _id: 'mock5', title: 'Sarbonne Modern Retreat', price: '$28,900,000', address: '755 Sarbonne Road, Bel Air', neighborhood: 'Bel Air', beds: 5, baths: 7, sqft: '8,950', tag: 'SARBONNE', status: 'Price Reduced', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop'] },
  { _id: 'mock6', title: 'Doheny Grand Estate', price: '$88,000,000', address: '1181 N Doheny Drive, Hollywood Hills', neighborhood: 'Hollywood Hills', beds: 9, baths: 14, sqft: '21,000', tag: 'DOHENY ESTATE', status: 'Iconic', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop'] },
  { _id: 'mock7', title: 'Carbon Beach Sanctuary', price: '$52,000,000', address: '31202 Carbon Beach Terrace, Malibu', neighborhood: 'Malibu', beds: 6, baths: 8, sqft: '9,800', tag: 'CARBON BEACH', status: 'New Listing', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop'] },
  { _id: 'mock8', title: 'Trousdale Palazzo', price: '$95,000,000', address: '1040 Laurel Way, Trousdale Estates', neighborhood: 'Trousdale', beds: 8, baths: 13, sqft: '19,200', tag: 'TROUSDALE', status: 'Private Listing', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop'] },
  { _id: 'mock9', title: 'Beverly Hills Garden Estate', price: '$34,500,000', address: '623 N Palm Drive, Beverly Hills', neighborhood: 'Beverly Hills', beds: 6, baths: 8, sqft: '10,400', tag: 'BEVERLY HILLS', status: 'Price Reduced', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop', images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1200&auto=format&fit=crop'] },
];

const neighborhoods = ['All', 'Beverly Hills', 'Bel Air', 'Hollywood Hills', 'Malibu', 'Trousdale', 'Other'];

function applyLocalFilters(list, { keyword, neighborhood, beds }) {
  let out = [...list];
  if (keyword) {
    const kw = keyword.toLowerCase();
    out = out.filter((p) =>
      (p.address || '').toLowerCase().includes(kw) ||
      (p.title || '').toLowerCase().includes(kw) ||
      (p.tag || '').toLowerCase().includes(kw) ||
      (p.neighborhood || '').toLowerCase().includes(kw)
    );
  }
  if (neighborhood && neighborhood !== 'All') out = out.filter((p) => p.neighborhood === neighborhood);
  if (beds) out = out.filter((p) => Number(p.beds) >= Number(beds));
  return out;
}

export default function Properties() {
  const [properties, setProperties] = useState(fallbackProperties);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [neighborhood, setNeighborhood] = useState('All');
  const [beds, setBeds] = useState('');

  // Debounce keyword typing so we don't hammer the API
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword.trim()), 400);
    return () => clearTimeout(t);
  }, [keyword]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = { limit: 100 };
    if (debouncedKeyword) params.search = debouncedKeyword;
    if (neighborhood !== 'All') params.neighborhood = neighborhood;
    if (beds) params.beds = beds;
    api.getProperties(params)
      .then((res) => {
        if (cancelled) return;
        if (res.data && res.data.length > 0) setProperties(res.data);
        else if (debouncedKeyword || neighborhood !== 'All' || beds) setProperties([]);
        else setProperties(fallbackProperties);
      })
      .catch(() => {
        // API offline — filter the local fallback instead
        if (!cancelled) {
          setProperties(applyLocalFilters(fallbackProperties, { keyword: debouncedKeyword, neighborhood, beds }));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [debouncedKeyword, neighborhood, beds]);

  const clearFilters = () => {
    setKeyword('');
    setDebouncedKeyword('');
    setNeighborhood('All');
    setBeds('');
  };

  const isFiltered = debouncedKeyword || neighborhood !== 'All' || beds;

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Top bar */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-[1420px] mx-auto px-5 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xs tracking-[0.16em] font-semibold hover:text-gold-600"><ArrowLeft size={14} /> HOME</Link>
          <div className="font-serif text-lg tracking-[0.15em]">ELARA<span className="text-gold-500">.</span></div>
          <div className="w-16 text-right text-[11px] tracking-[0.14em] text-zinc-400">{properties.length} LISTINGS</div>
        </div>
      </div>

      <div className="max-w-[1420px] mx-auto px-5 lg:px-8 py-8 lg:py-12">
        {/* Heading */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 text-[10px] tracking-[0.32em] text-gold-700 font-semibold">
            <span className="w-6 h-[1px] bg-gold-500" /> PRIVATE COLLECTION
          </div>
          <h1 className="font-serif text-[36px] lg:text-[54px] leading-[0.9] font-light text-[#0a0a0a] mt-3">All <span className="italic font-normal">Listings</span></h1>
          <p className="text-zinc-500 mt-4 text-[14.5px] leading-relaxed">Every Elara estate in one place — browse the full collection and open any listing for photos, details and private inquiry.</p>
        </div>

        {/* Filters */}
        <div className="mt-8 bg-white border border-black/5 p-3 flex flex-col lg:flex-row gap-2 lg:items-center shadow-sm">
          <div className="flex-1 flex items-center gap-3 px-4 py-2">
            <span className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center shrink-0"><Search size={16} className="text-zinc-500" /></span>
            <input
              placeholder="Search by city, neighborhood, address..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full outline-none text-[14px] placeholder:text-zinc-400 bg-transparent"
            />
          </div>
          <div className="flex gap-2 px-1 pb-1 lg:pb-0">
            <select value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} className="bg-zinc-50 border border-zinc-200 outline-none py-3 px-3 text-[12px] tracking-[0.1em] cursor-pointer">
              {neighborhoods.map((n) => <option key={n} value={n}>{n === 'All' ? 'ALL AREAS' : n.toUpperCase()}</option>)}
            </select>
            <select value={beds} onChange={(e) => setBeds(e.target.value)} className="bg-zinc-50 border border-zinc-200 outline-none py-3 px-3 text-[12px] tracking-[0.1em] cursor-pointer">
              <option value="">BEDS: ANY</option>
              <option value="5">5+ BEDS</option>
              <option value="7">7+ BEDS</option>
              <option value="9">9+ BEDS</option>
            </select>
            {isFiltered && (
              <button onClick={clearFilters} className="border border-black px-5 text-[11px] tracking-[0.16em] font-semibold hover:bg-black hover:text-white transition">CLEAR</button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-[380px] bg-zinc-200 animate-pulse" />)}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-16 bg-white border border-black/5">
              <p className="text-zinc-500">No estates match your filters.</p>
              <button onClick={clearFilters} className="mt-4 border border-black px-6 py-2 text-xs tracking-widest hover:bg-black hover:text-white transition">CLEAR FILTERS</button>
            </div>
          ) : (
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              <AnimatePresence mode="popLayout">
                {properties.map((p, idx) => (
                  <motion.article
                    key={p._id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 12 }}
                    transition={{ duration: 0.5, delay: Math.min(idx, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6 }}
                    className="group bg-white border border-black/5 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 overflow-hidden"
                  >
                    <Link to={`/property/${p._id}`} className="block">
                      <div className="relative h-[300px] lg:h-[320px] overflow-hidden bg-zinc-100">
                        <motion.img
                          whileHover={{ scale: 1.07 }}
                          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                          src={p.image || p.images?.[0]}
                          alt={p.title || p.address}
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
        </div>
      </div>
    </div>
  );
}
