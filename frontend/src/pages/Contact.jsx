import { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  ConciergeBell,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import Toast from '../components/Toast';

const inputClass =
  'mt-2 w-full rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100';

const contactItems = [
  {
    icon: Phone,
    label: 'Reservations',
    value: '+91 9876543210',
    detail: 'Daily from 7:00 AM to 11:00 PM',
  },
  {
    icon: Mail,
    label: 'Guest Relations',
    value: 'hello@rentalstay.com',
    detail: 'Replies usually arrive within 2 hours',
  },
  {
    icon: MapPin,
    label: 'Hotel Address',
    value: '312 Harbor View Avenue',
    detail: 'Mohali,punjab',
  },
  {
    icon: Clock,
    label: 'Front Desk',
    value: 'Open 24 hours',
    detail: 'Check-in from 3:00 PM, check-out by 11:00 AM',
  },
];

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Reservation question',
    message: '',
  });

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setToast({
        message: 'Message sent successfully. Our reservations team will contact you shortly.',
        type: 'success',
      });

      setFormData({
        name: '',
        email: '',
        subject: 'Reservation question',
        message: '',
      });

      setLoading(false);
    }, 1200);
  };

  return (
    <main className="bg-white text-slate-950">
      <section className="relative min-h-[420px] overflow-hidden bg-slate-950">
        <img
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1800&q=80"
          alt="Hotel lobby lounge"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-end px-6 py-16 lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="inline-flex items-center gap-2 rounded border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100 backdrop-blur">
              <ConciergeBell className="h-4 w-4" />
              Guest Services
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Speak With Our Reservations Team
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-100">
              Planning a stay, changing dates, or arranging a special arrival? Our front desk and
              concierge team are ready to help before you walk through the door.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded bg-white text-cyan-700 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-2 font-semibold text-slate-950">{item.value}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg border border-cyan-100 bg-cyan-50 p-6">
            <div className="flex items-start gap-4">
              <CalendarCheck className="mt-1 h-5 w-5 shrink-0 text-cyan-700" />
              <div>
                <h2 className="text-lg font-semibold">Need a custom stay?</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Tell us your dates, guest count, and any arrival preferences. We can help with
                  adjoining rooms, late check-in, airport pickup, and celebration setups.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8">
          <div className="border-b border-slate-200 pb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">
              Contact the hotel
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Send an inquiry</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Share a few details and our team will follow up with the best options for your stay.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Full Name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Email Address</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className={inputClass}
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Inquiry Type</span>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={inputClass}
              >
                <option>Reservation question</option>
                <option>Modify an existing booking</option>
                <option>Group stay or event</option>
                <option>Concierge request</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Message</span>
              <textarea
                rows="6"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us your dates, room preference, and anything we should prepare."
                required
                className={`${inputClass} resize-none`}
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-3 rounded bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending inquiry
                </>
              ) : (
                <>
                  Send Inquiry
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}

export default Contact;
