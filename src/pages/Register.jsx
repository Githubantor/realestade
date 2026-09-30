import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-black/5 shadow-[0_20px_64px_rgba(0,0,0,0.12)] p-8 lg:p-10"
      >
        <div className="text-center mb-8">
          <div className="font-serif text-3xl tracking-[0.15em] font-light">ELARA<span className="text-gold-500">.</span></div>
          <p className="text-[11px] tracking-[0.32em] text-zinc-400 mt-1">JOIN PRIVATE COLLECTORS</p>
          <h1 className="font-serif text-2xl mt-6">Create account</h1>
          <p className="text-zinc-500 text-sm mt-2">Access off-market previews & estate stories</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] tracking-[0.18em] font-semibold text-zinc-700">FULL NAME</label>
            <div className="relative mt-2">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Morgan"
                className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 outline-none focus:border-gold-500 focus:bg-white transition text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] tracking-[0.18em] font-semibold text-zinc-700">EMAIL</label>
            <div className="relative mt-2">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="alex@email.com"
                className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 outline-none focus:border-gold-500 focus:bg-white transition text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] tracking-[0.18em] font-semibold text-zinc-700">PHONE (OPTIONAL)</label>
            <div className="relative mt-2">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="310 555 0123"
                className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 outline-none focus:border-gold-500 focus:bg-white transition text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] tracking-[0.18em] font-semibold text-zinc-700">PASSWORD</label>
            <div className="relative mt-2">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 outline-none focus:border-gold-500 focus:bg-white transition text-sm"
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#0a0a0a] text-white py-4 text-[12px] tracking-[0.18em] font-semibold hover:bg-gold-600 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'} <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-500">
          Already have an account? <Link to="/login" className="text-black font-semibold border-b border-black hover:text-gold-600 hover:border-gold-600">Sign in</Link>
        </div>
        <div className="mt-6 text-center">
          <Link to="/" className="text-xs tracking-[0.16em] text-zinc-400 hover:text-black">← BACK TO HOME</Link>
        </div>
      </motion.div>
    </div>
  );
}
