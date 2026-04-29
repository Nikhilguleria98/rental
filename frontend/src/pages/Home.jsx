import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import GalleryLightbox from '../components/GalleryLightbox';
import attractions from '../data/attractions';
import galleryImages from '../data/galleryImages';

function Home({ rooms, loading }) {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('rating');
  const [isOpen, setIsOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredRooms = useMemo(() => {
    const items = [...rooms];
    const available = filter === 'available' ? items.filter((room) => room.availability) : items;
    if (sort === 'price') {
      return available.sort((a, b) => a.price - b.price);
    }
    return available.sort((a, b) => b.rating - a.rating);
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

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8" id="nearby">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-500">Nearby Attractions</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Discover famous places around you</h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {attractions.map((place) => (
            <div key={place.name} className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
              <img src={place.image} alt={place.name} className="h-56 w-full object-cover" />
              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{place.distance}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{place.type}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{place.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{place.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-slate-100" id="contact">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Contact</p>
              <h2 className="mt-3 text-3xl font-semibold">Get in touch</h2>
              <p className="mt-4 max-w-xl text-slate-300">Questions about a room or need booking help? We’re here to answer within minutes.</p>
              <div className="mt-10 space-y-4 text-sm text-slate-300">
                <p><strong>Phone:</strong> +1 555 840 1290</p>
                <p><strong>Email:</strong> hello@rentalstay.com</p>
                <p><strong>Address:</strong> 312 Harbor View Avenue, Miami, FL</p>
              </div>
            </div>
            <form className="space-y-4 rounded-3xl bg-slate-800/90 p-8 ring-1 ring-white/10 shadow-soft">
              <div>
                <label className="block text-sm font-medium text-slate-200">Name</label>
                <input type="text" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200">Email</label>
                <input type="email" className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200">Message</label>
                <textarea rows="4" className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/30" />
              </div>
              <button type="button" className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-500">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {isOpen && <GalleryLightbox images={galleryImages} index={lightboxIndex} onClose={() => setIsOpen(false)} />}
    </main>
  );
}

export default Home;
