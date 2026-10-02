import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, Square, ArrowLeft, Heart, Phone, Mail, Crown, Building2, Calendar, Eye, Tag, Home, Sparkles } from 'lucide-react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { findFallbackProperty } from '../data/fallbackProperties';

const isDbId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id || ''));

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [favBusy, setFavBusy] = useState(false);
  const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    api.getProperty(id)
      .then((res) => {
        setProperty(res.data)
        setActiveImg(0)
      })
      .catch(() => {
        // API unreachable — serve the curated local copy so every card stays clickable
        const local = findFallbackProperty(id);
        if (local) {
          setProperty(local)
          setActiveImg(0)
        } else {
          setError('Property not found')
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || !property || !isDbId(property._id)) {
      setIsFav(false);
      return;
    }
    api.checkFavorite(property._id).then((r) => setIsFav(!!r.isFavorite)).catch(() => {});
  }, [user, property]);

  const toggleFavorite = async () => {
    if (!user) {
      alert('Please login to save favorites');
      return;
    }
    if (favBusy || !property) return;
    setFavBusy(true);
    try {
      if (isFav) {
        await api.removeFavorite(property._id);
        setIsFav(false);
      } else {
        await api.addFavorite(property._id);
        setIsFav(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setFavBusy(false);
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    try {
      await api.createInquiry({ ...inquiry, property: id, type: 'property' });
      setSent(true);
      setInquiry({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">Loading property...</div>;
  if (error || !property) return <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] flex-col gap-4"><p>{error || 'Property not found'}</p><Link to="/" className="border border-black px-6 py-2 text-xs tracking-widest">BACK HOME</Link></div>;

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-[1420px] mx-auto px-5 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xs tracking-[0.16em] font-semibold hover:text-gold-600"><ArrowLeft size={14} /> BACK</Link>
          <div className="font-serif text-lg tracking-[0.15em]">ELARA<span className="text-gold-500">.</span></div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-[1420px] mx-auto px-5 lg:px-8 py-6 lg:py-8 grid lg:grid-cols-[1.7fr_0.9fr] gap-8">
        <div>
          {/* Gallery */}
          <div className="relative h-[420px] lg:h-[560px] overflow-hidden bg-zinc-100 group">
            <img src={property.images?.[activeImg] || property.image || property.images?.[0]} alt={property.title || property.address} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-white/95 backdrop-blur px-3 py-1.5 text-[10px] tracking-[0.16em] font-bold shadow">{property.tag}</span>
              <span className="bg-[#0a0a0a] text-white px-3 py-1.5 text-[10px] tracking-[0.12em] font-bold shadow">{property.status?.toUpperCase()}</span>
              {property.featured && <span className="bg-gold-500 text-white px-3 py-1.5 text-[10px] tracking-[0.12em] font-bold flex items-center gap-1"><Sparkles size={10}/> FEATURED</span>}
            </div>
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-[11px] tracking-[0.14em] px-3 py-1.5 flex items-center gap-2"><Eye size={12}/> {property.views || 0} VIEWS</div>
            {isDbId(property._id) && (
              <button
                onClick={toggleFavorite}
                disabled={favBusy}
                aria-label="Save to favorites"
                title={user ? (isFav ? 'Remove from favorites' : 'Save to favorites') : 'Login to save favorites'}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur flex items-center justify-center shadow transition disabled:opacity-60 ${isFav ? 'bg-gold-500 text-white' : 'bg-white/95 text-zinc-700 hover:text-gold-600'}`}
              >
                <Heart size={17} fill={isFav ? 'currentColor' : 'none'} />
              </button>
            )}
            {property.images?.length > 1 && (
              <>
                <button onClick={() => setActiveImg(p => (p - 1 + property.images.length) % property.images.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow hidden lg:flex">‹</button>
                <button onClick={() => setActiveImg(p => (p + 1) % property.images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow hidden lg:flex">›</button>
              </>
            )}
          </div>

          {property.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {property.images.slice(0, 8).map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`h-24 overflow-hidden border-2 ${activeImg===i ? 'border-gold-500' : 'border-transparent hover:border-zinc-300'}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-3 text-[11px] tracking-[0.16em] text-zinc-500">
              <span className="flex items-center gap-1.5"><Home size={12}/> {property.type || 'Buy'}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300"/>
              <span className="flex items-center gap-1.5"><Building2 size={12}/> {property.neighborhood}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300"/>
              <span className="flex items-center gap-1.5"><Tag size={12}/> {property.city}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300"/>
              <span className="flex items-center gap-1.5"><Calendar size={12}/> {new Date(property.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl mt-3">{property.title || property.address}</h1>
            <div className="font-serif text-2xl lg:text-3xl mt-2 text-gold-700">{property.price}</div>
            <div className="flex items-center gap-2 text-zinc-500 text-sm mt-2"><MapPin size={14} /> {property.address}</div>
            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: BedDouble, label: 'Beds', value: property.beds },
                { icon: Bath, label: 'Baths', value: property.baths },
                { icon: Square, label: 'Sq Ft', value: property.sqft },
              ].map(s => (
                <div key={s.label} className="bg-white border border-zinc-200 p-4 text-center">
                  <s.icon size={18} className="mx-auto text-zinc-400"/>
                  <div className="font-serif text-xl mt-1">{s.value}</div>
                  <div className="text-[10px] tracking-[0.16em] text-zinc-500">{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-zinc-700 border-y border-zinc-200 py-4">
              <span className="flex items-center gap-1.5"><BedDouble size={16} /> {property.beds} Beds</span>
              <span className="w-1 h-1 rounded-full bg-zinc-200 self-center"/>
              <span className="flex items-center gap-1.5"><Bath size={16} /> {property.baths} Baths</span>
              <span className="w-1 h-1 rounded-full bg-zinc-200 self-center"/>
              <span className="flex items-center gap-1.5"><Square size={16} /> {property.sqft} sqft</span>
              <span className="w-1 h-1 rounded-full bg-zinc-200 self-center"/>
              <span className="flex items-center gap-1.5"><Crown size={16} className="text-gold-500"/> {property.tag}</span>
            </div>
            <div className="mt-6">
              <div className="text-[11px] tracking-[0.2em] font-bold flex items-center gap-2"><span className="w-6 h-[1px] bg-gold-500"/> ESTATE STORY</div>
              <p className="text-zinc-600 leading-relaxed mt-3">{property.description || 'No description provided. Contact our private client service for a discreet briefing and private showing.'}</p>
            </div>

            {property.features?.length > 0 && (
              <div className="mt-8">
                <div className="text-[11px] tracking-[0.2em] font-bold mb-3">FEATURES & AMENITIES</div>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((f) => (
                    <span key={f} className="bg-white border border-zinc-200 px-3 py-2 text-xs tracking-wide hover:border-gold-400 hover:text-gold-700 transition">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Agent card - every detail */}
            {property.agent && typeof property.agent === 'object' && (
              <div className="mt-8 bg-white border border-black/5 p-5 flex gap-4 items-center">
                <img src={property.agent.avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop`} alt="" className="w-16 h-16 rounded-full object-cover"/>
                <div className="flex-1">
                  <div className="text-[11px] tracking-[0.16em] text-gold-600 font-semibold">LISTING AGENT</div>
                  <div className="font-serif text-lg">{property.agent.name}</div>
                  <div className="text-xs text-zinc-500">{property.agent.email} {property.agent.phone && `• ${property.agent.phone}`}</div>
                </div>
                <a href={`mailto:${property.agent.email}`} className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:bg-gold-600"><Mail size={14}/></a>
              </div>
            )}

            {/* Additional details table */}
            <div className="mt-8 bg-zinc-50 border border-zinc-200 grid grid-cols-2 text-sm">
              {[
                ['Property ID', property._id],
                ['Neighborhood', property.neighborhood],
                ['City', property.city],
                ['Status', property.status],
                ['Type', property.type],
                ['Price Value', property.priceValue ? `$${property.priceValue.toLocaleString()}` : property.price],
                ['Sq Ft Value', property.sqftValue || property.sqft],
                ['Featured', property.featured ? 'Yes' : 'No'],
                ['Published', property.isPublished ? 'Yes' : 'No'],
                ['Views', property.views],
              ].map(([k,v])=>(
                <div key={k} className="flex justify-between border-b border-zinc-200 px-4 py-3 odd:border-r">
                  <span className="text-zinc-500 text-xs tracking-[0.1em]">{k.toUpperCase()}</span>
                  <span className="font-medium truncate ml-4">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-[72px] h-fit">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-black/5 p-6 shadow-sm">
            <div className="text-[11px] tracking-[0.2em] font-bold">PRIVATE INQUIRY</div>
            <p className="text-xs text-zinc-500 mt-1">Discreet showing by appointment only</p>

            <form onSubmit={handleInquiry} className="mt-5 space-y-3">
              <input required placeholder="Full Name" value={inquiry.name} onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })} className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-gold-500" />
              <input required type="email" placeholder="Email" value={inquiry.email} onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })} className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-gold-500" />
              <input placeholder="Phone" value={inquiry.phone} onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })} className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-gold-500" />
              <textarea required placeholder="Message — tell us about your acquisition goals" value={inquiry.message} onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })} rows={4} className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-gold-500" />
              <button type="submit" className="w-full bg-[#0a0a0a] text-white py-3.5 text-xs tracking-[0.18em] font-semibold hover:bg-gold-600 transition">SEND INQUIRY</button>
              {sent && <p className="text-gold-600 text-xs text-center">✓ Inquiry sent — our private client team will contact you within hours.</p>}
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-100 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-zinc-600"><span className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center"><Phone size={14} /></span> 310.888.ELARA</div>
              <div className="flex items-center gap-3 text-zinc-600"><span className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center"><Mail size={14} /></span> private@elaraestates.com</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
