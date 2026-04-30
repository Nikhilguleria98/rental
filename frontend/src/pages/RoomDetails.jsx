import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import GalleryLightbox from '../components/GalleryLightbox';

function RoomDetails() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:4000/api/rooms/${roomId}`).then((response) => setRoom(response.data));
  }, [roomId]);

  const totalNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return diff;
  }, [checkIn, checkOut]);

  const handleBooking = async (event) => {
    event.preventDefault();
    if (!room?.availability) {
      setMessage('This room is currently unavailable and cannot be booked.');
      return;
    }

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/api/bookings',
        { roomId, checkIn, checkOut, guests },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed');
    }
  };

  if (!room) {
    return <div className="py-20 text-center text-slate-600">Loading room details…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="overflow-hidden rounded-[2rem] shadow-soft">
            <img src={room.images[0]} alt={room.name} className="h-96 w-full object-cover" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {room.images.slice(1).map((image, index) => (
              <button key={image} type="button" onClick={() => { setLightboxIndex(index + 1); setIsOpen(true); }} className="overflow-hidden rounded-[1.75rem] shadow-soft transition hover:-translate-y-1">
                <img src={image} alt={`${room.name} ${index + 2}`} className="h-48 w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="mt-10 rounded-[2rem] bg-white p-8 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-4xl font-semibold text-slate-900">{room.name}</h1>
                <p className="mt-2 text-sm text-slate-500">{room.type} · {room.rating}⭐ · {room.reviews} reviews</p>
              </div>
              <p className="rounded-3xl bg-slate-50 px-5 py-3 text-lg font-semibold text-slate-900">${room.price} <span className="text-sm font-medium text-slate-500">/ night</span></p>
            </div>
            <p className="mt-6 text-slate-600 leading-7">{room.description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">{amenity}</div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-white p-8 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-500">Reserve</p>
                <p className="mt-2 text-sm text-slate-500">Book your stay with ease.</p>
              </div>
              <p className="text-3xl font-semibold text-slate-900">${room.price}</p>
            </div>
            <form onSubmit={handleBooking} className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Check-in</label>
                <input value={checkIn} onChange={(e) => setCheckIn(e.target.value)} type="date" required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Check-out</label>
                <input value={checkOut} onChange={(e) => setCheckOut(e.target.value)} type="date" required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Guests</label>
                <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40">
                  {[1, 2, 3, 4].map((count) => (
                    <option key={count} value={count}>{count} guest{count > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={!room.availability}
                className={`inline-flex w-full justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${room.availability ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-slate-300 cursor-not-allowed'}`}
              >
                {room.availability ? 'Confirm booking' : 'Room unavailable'}
              </button>
            </form>
            {message && <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">{message}</p>}
            <div className="mt-8 rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Availability</p>
              <p className={room.availability ? 'mt-2 text-green-600' : 'mt-2 text-red-600'}>{room.availability ? 'Available to book' : 'Fully booked'}</p>
              <p className="mt-4">A flexible cancellation policy helps you book with confidence.</p>
            </div>
          </div>
        </aside>
      </div>
      {isOpen && <GalleryLightbox images={room.images} index={lightboxIndex} onClose={() => setIsOpen(false)} />}
    </div>
  );
}

export default RoomDetails;
