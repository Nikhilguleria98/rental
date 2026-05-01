import { useState } from 'react';
import Toast from '../components/Toast';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      setToast({ message: 'Message sent successfully! We will get back to you soon.', type: 'success' });
      setName('');
      setEmail('');
      setMessage('');
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="bg-slate-900 py-16 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Contact</p>
            <h1 className="mt-3 text-3xl font-semibold">Get in touch</h1>
            <p className="mt-4 max-w-xl text-slate-300">Questions about a room or need booking help? We're here to answer within minutes.</p>
            <div className="mt-10 space-y-4 text-sm text-slate-300">
              <p><strong>Phone:</strong> +1 555 840 1290</p>
              <p><strong>Email:</strong> hello@rentalstay.com</p>
              <p><strong>Address:</strong> 312 Harbor View Avenue, Miami, FL</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl bg-slate-800/90 p-8 ring-1 ring-white/10 shadow-soft">
            <div>
              <label className="block text-sm font-medium text-slate-200">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows="4" className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30" />
            </div>
            <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-500 disabled:bg-slate-400 disabled:cursor-not-allowed">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}

export default Contact;