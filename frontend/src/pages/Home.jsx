import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import GalleryLightbox from '../components/GalleryLightbox';
import galleryImages from '../data/galleryImages';

function Home({ rooms, loading }) {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('rating');
  const [isOpen, setIsOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredRooms = useMemo(() => {
    let items = [...rooms];
    
    if (filter === 'available') {
      items = items.filter((room) => room.availability);
    } else if (filter === 'booked') {
      items = items.filter((room) => !room.availability);
    }
    
    if (sort === 'price') {
      return items.sort((a, b) => a.price - b.price);
    }
    return items.sort((a, b) => b.rating - a.rating);
  }, [rooms, filter, sort]);

  return (
    <main className="relative overflow-hidden">
      <section className="relative bg-hero bg-cover bg-center text-white">
        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex rounded-full bg-cyan-400/20 px-4 py-1 text-sm font-semibold text-cyan-200 ring-1 ring-cyan-400/30">Stay with comfort, explore with ease</span>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">Find Your Perfect Stay</h1>
            <p className="text-lg leading-8 text-slate-100/90">Discover curated rooms, premium amenities, and seamless booking across top destinations.</p>
            <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-xl ring-1 ring-white/10">
                <form className="space-y-4 text-slate-900">
                  <div>
                    <label className="block text-sm font-medium text-slate-100">Location</label>
                    <input type="text" placeholder="City, resort, hotel" className="mt-2 w-full rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 text-sm shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-100">Check-in</label>
                      <input type="date" className="mt-2 w-full rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-100">Guests</label>
                      <select className="mt-2 w-full rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40">
                        <option>1 guest</option>
                        <option>2 guests</option>
                        <option>3 guests</option>
                        <option>4+ guests</option>
                      </select>
                    </div>
                  </div>
                  <button type="button" className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:bg-cyan-500">Book Now</button>
                </form>
              </div>
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-xl ring-1 ring-white/10 shadow-soft">
                <h2 className="text-lg font-semibold text-white">Featured Escape</h2>
                <p className="mt-4 text-sm leading-6 text-slate-100/80">Enjoy a curated stay with premium room service, rooftop lounge access, and flexible booking.</p>
                <div className="mt-8 grid gap-3 text-sm text-slate-100/90">
                  <div className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">Free cancellation</div>
                  <div className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">24/7 concierge support</div>
                  <div className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">Complimentary breakfast</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8" id="rooms">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-500">Available Rooms</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Explore top rooms in one place</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 outline-none shadow-sm">
              <option value="all">All rooms</option>
              <option value="available">Available now</option>
              <option value="booked">Booked rooms</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 outline-none shadow-sm">
              <option value="rating">Best rated</option>
              <option value="price">Price low to high</option>
            </select>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-3xl border border-slate-200/80 bg-white p-8 text-center">Loading rooms…</div>
          ) : (
            filteredRooms.map((room) => <RoomCard key={room.id} room={room} />)
          )}
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Gallery</p>
              <h2 className="mt-3 text-3xl font-semibold">Visual highlights from our rooms</h2>
              <p className="mt-4 max-w-xl text-slate-300">Explore a curated gallery of premium interiors, outdoor terraces, and serene lounging spaces.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {galleryImages.slice(0, 4).map((image, index) => (
                <button key={image} type="button" onClick={() => { setLightboxIndex(index); setIsOpen(true); }} className="overflow-hidden rounded-3xl border border-white/10 shadow-soft transition hover:scale-[1.01] hover:shadow-xl">
                  <img src={image} alt={`Gallery ${index + 1}`} className="h-56 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-500">Why Choose Us</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Experience the difference</h2>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-soft">
            <div className="mx-auto h-12 w-12 rounded-full bg-cyan-100 p-3">
              <svg className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Verified Quality</h3>
            <p className="mt-2 text-slate-600">All our rooms are inspected and rated by real guests for authentic experiences.</p>
          </div>
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-soft">
            <div className="mx-auto h-12 w-12 rounded-full bg-cyan-100 p-3">
              <svg className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold">24/7 Support</h3>
            <p className="mt-2 text-slate-600">Round-the-clock concierge service to make your stay seamless and enjoyable.</p>
          </div>
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-soft">
            <div className="mx-auto h-12 w-12 rounded-full bg-cyan-100 p-3">
              <svg className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Flexible Booking</h3>
            <p className="mt-2 text-slate-600">Free cancellation and easy modifications to suit your changing plans.</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-500">Testimonials</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">What our guests say</h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-cyan-600">JD</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">John Doe</h4>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-slate-600">"Amazing experience! The room was spotless and the staff was incredibly helpful. Will definitely book again."</p>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-cyan-600">SM</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Miller</h4>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-slate-600">"Perfect location and beautiful views. The amenities exceeded my expectations. Highly recommended!"</p>
            </div>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-soft">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-cyan-600">RB</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Robert Brown</h4>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(4)}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-slate-600">"Great value for money. Clean, comfortable, and close to all the attractions. Had a wonderful stay."</p>
            </div>
          </div>
        </div>
      </section>

      {isOpen && <GalleryLightbox images={galleryImages} index={lightboxIndex} onClose={() => setIsOpen(false)} />}
    </main>
  );
}

export default Home;
