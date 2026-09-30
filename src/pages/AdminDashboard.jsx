import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Eye, Building2, Users, Mail, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, isAgent } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('properties');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    price: '',
    address: '',
    neighborhood: 'Beverly Hills',
    beds: 3,
    baths: 3,
    sqft: '',
    tag: '',
    status: 'Available',
    description: '',
    images: '',
    type: 'Buy',
    featured: false,
  });

  useEffect(() => {
    if (!isAgent) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAgent]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [propRes, inqRes] = await Promise.all([
        api.getProperties({ limit: 100 }),
        api.getInquiries().catch(() => ({ data: [] })),
      ]);
      setProperties(propRes.data || []);
      setInquiries(inqRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this property?')) return;
    try {
      await api.deleteProperty(id);
      setProperties((p) => p.filter((x) => x._id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      beds: Number(form.beds),
      baths: Number(form.baths),
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      priceValue: Number(form.price.replace(/[^0-9]/g, '')),
    };
    try {
      if (editing) {
        const res = await api.updateProperty(editing, payload);
        setProperties((p) => p.map((x) => (x._id === editing ? res.data : x)));
      } else {
        const res = await api.createProperty(payload);
        setProperties((p) => [res.data, ...p]);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', price: '', address: '', neighborhood: 'Beverly Hills', beds: 3, baths: 3, sqft: '', tag: '', status: 'Available', description: '', images: '', type: 'Buy', featured: false });
    } catch (err) {
      alert(err.message);
    }
  };

  const startEdit = (prop) => {
    setEditing(prop._id);
    setForm({
      title: prop.title || '',
      price: prop.price || '',
      address: prop.address || '',
      neighborhood: prop.neighborhood || 'Beverly Hills',
      beds: prop.beds || 3,
      baths: prop.baths || 3,
      sqft: prop.sqft || '',
      tag: prop.tag || '',
      status: prop.status || 'Available',
      description: prop.description || '',
      images: (prop.images || [prop.image]).join(', '),
      type: prop.type || 'Buy',
      featured: prop.featured || false,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="bg-[#0a0a0a] text-white">
        <div className="max-w-[1420px] mx-auto px-5 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <div className="font-serif text-xl tracking-[0.15em]">ELARA<span className="text-gold-400">.</span> DASHBOARD</div>
            <div className="text-xs tracking-[0.18em] text-white/50">WELCOME, {user?.name?.toUpperCase()}</div>
          </div>
          <Link to="/" className="flex items-center gap-2 text-xs tracking-[0.16em] border border-white/20 px-5 py-2.5 hover:bg-white hover:text-black transition">
            <ArrowLeft size={14} /> HOME
          </Link>
        </div>
      </div>

      <div className="max-w-[1420px] mx-auto px-5 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Properties', value: properties.length, icon: Building2 },
            { label: 'Inquiries', value: inquiries.length, icon: Mail },
            { label: 'Featured', value: properties.filter((p) => p.featured).length, icon: Eye },
            { label: 'Role', value: user?.role?.toUpperCase(), icon: Users },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-black/5 p-5 flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center"><s.icon size={16} className="text-zinc-600" /></span>
              <div><div className="font-serif text-xl">{s.value}</div><div className="text-[11px] tracking-[0.14em] text-zinc-500">{s.label.toUpperCase()}</div></div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {['properties', 'inquiries'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 text-xs tracking-[0.16em] font-semibold border ${tab === t ? 'bg-black text-white border-black' : 'bg-white text-zinc-600 border-zinc-200 hover:border-black hover:text-black'}`}
            >
              {t.toUpperCase()}
            </button>
          ))}
          {tab === 'properties' && (
            <button
              onClick={() => { setShowForm(!showForm); setEditing(null); }}
              className="ml-auto bg-gold-500 text-white px-6 py-2.5 text-xs tracking-[0.16em] font-semibold flex items-center gap-2 hover:bg-gold-600"
            >
              <Plus size={14} /> {showForm ? 'CANCEL' : 'ADD PROPERTY'}
            </button>
          )}
        </div>

        {showForm && tab === 'properties' && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white border border-black/5 p-6 lg:p-8 mb-8 grid lg:grid-cols-2 gap-4"
          >
            <input placeholder="Title*" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-gold-500 lg:col-span-2" />
            <input placeholder="Price e.g. $139,000,000*" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-gold-500" />
            <input placeholder="Address*" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required className="bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-gold-500" />
            <select value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} className="bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none">
              <option>Beverly Hills</option><option>Bel Air</option><option>Hollywood Hills</option><option>Malibu</option><option>Trousdale</option><option>Other</option>
            </select>
            <input placeholder="Tag e.g. TROUSDALE*" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} required className="bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-gold-500" />
            <input type="number" placeholder="Beds" value={form.beds} onChange={(e) => setForm({ ...form, beds: e.target.value })} className="bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none" />
            <input type="number" placeholder="Baths" value={form.baths} onChange={(e) => setForm({ ...form, baths: e.target.value })} className="bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none" />
            <input placeholder="Sqft e.g. 18,500" value={form.sqft} onChange={(e) => setForm({ ...form, sqft: e.target.value })} className="bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none">
              <option>New Listing</option><option>Private Listing</option><option>Just Sold</option><option>Price Reduced</option><option>Iconic</option><option>Available</option>
            </select>
            <input placeholder="Images (comma separated URLs)*" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} required className="bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-gold-500 lg:col-span-2" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-gold-500 lg:col-span-2" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            <button type="submit" className="bg-black text-white py-3 text-xs tracking-[0.16em] font-semibold hover:bg-gold-600 lg:col-span-2">{editing ? 'UPDATE PROPERTY' : 'CREATE PROPERTY'}</button>
          </motion.form>
        )}

        {tab === 'properties' && (
          <div className="bg-white border border-black/5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b text-[11px] tracking-[0.14em] text-zinc-500">
                <tr><th className="text-left px-4 py-3">Property</th><th className="text-left px-4 py-3">Price</th><th className="text-left px-4 py-3">Status</th><th className="text-left px-4 py-3">Views</th><th className="text-right px-4 py-3">Actions</th></tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p._id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                    <td className="px-4 py-3 flex items-center gap-3"><img src={p.image || p.images?.[0]} alt="" className="w-12 h-12 object-cover" /><div><div className="font-medium">{p.title || p.address}</div><div className="text-xs text-zinc-500">{p.address}</div></div></td>
                    <td className="px-4 py-3 font-medium">{p.price}</td>
                    <td className="px-4 py-3"><span className="bg-zinc-900 text-white text-[10px] tracking-[0.12em] px-2 py-1">{p.status}</span></td>
                    <td className="px-4 py-3">{p.views}</td>
                    <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(p)} className="w-8 h-8 border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(p._id)} className="w-8 h-8 border border-red-200 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
                {properties.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-zinc-400">No properties found. Add one!</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'inquiries' && (
          <div className="bg-white border border-black/5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b text-[11px] tracking-[0.14em] text-zinc-500">
                <tr><th className="text-left px-4 py-3">From</th><th className="text-left px-4 py-3">Message</th><th className="text-left px-4 py-3">Type</th><th className="text-left px-4 py-3">Date</th></tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq._id} className="border-b border-zinc-100">
                    <td className="px-4 py-3"><div className="font-medium">{inq.name}</div><div className="text-xs text-zinc-500">{inq.email} {inq.phone && `• ${inq.phone}`}</div></td>
                    <td className="px-4 py-3 max-w-[400px] truncate">{inq.message}</td>
                    <td className="px-4 py-3"><span className="text-[10px] tracking-[0.12em] bg-zinc-100 px-2 py-1">{inq.type?.toUpperCase()}</span></td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{new Date(inq.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {inquiries.length === 0 && <tr><td colSpan={4} className="text-center py-12 text-zinc-400">No inquiries yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
