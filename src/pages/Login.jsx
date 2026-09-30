import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
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
          <p className="text-[11px] tracking-[0.32em] text-zinc-400 mt-1">PRIVATE CLIENT ACCESS</p>
          <h1 className="font-serif text-2xl mt-6">Welcome back</h1>
          <p className="text-zinc-500 text-sm mt-2">Sign in to access private listings</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[11px] tracking-[0.18em] font-semibold text-zinc-700">EMAIL</label>
            <div className="relative mt-2">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="agent@elaraestates.com"
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
            {loading ? 'SIGNING IN...' : 'SIGN IN'} <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-500">
          No account? <Link to="/register" className="text-black font-semibold border-b border-black hover:text-gold-600 hover:border-gold-600">Create one</Link>
        </div>

        <div className="mt-8 p-4 bg-gold-50 border border-gold-200">
          <div className="flex items-center gap-2 text-gold-700 text-xs font-semibold tracking-widest"><Sparkles size={12} /> DEMO CREDENTIALS</div>
          <div className="text-xs text-zinc-600 mt-2 space-y-1">
            <div>Admin: <b>admin@elaraestates.com</b> / <b>admin123</b></div>
            <div>Agent: <b>agent@elaraestates.com</b> / <b>agent123</b></div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs tracking-[0.16em] text-zinc-400 hover:text-black">← BACK TO HOME</Link>
        </div>
      </motion.div>
    </div>
  );
}
