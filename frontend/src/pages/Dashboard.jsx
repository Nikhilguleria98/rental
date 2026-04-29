import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }

    axios
      .get('http://localhost:4000/api/bookings', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => setBookings(response.data))
      .catch(() => setError('Failed to load your bookings'));
  }, [token, user, navigate]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
      <div className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Welcome back, {user?.name || 'traveler'}</h1>
          <p className="mt-2 text-sm text-slate-600">View your confirmed stays and booking details.</p>
        </div>
        <button onClick={logout} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">Log out</button>
      </div>

      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}

      <div className="mt-10 space-y-6">
        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">No bookings yet. Explore rooms and book your next stay.</div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-cyan-500">Booking ID #{booking.id}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{booking.roomName}</h2>
                </div>
                <p className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700">${booking.price} / night</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Check-in</p>
                  <p className="mt-2 font-semibold text-slate-900">{booking.checkIn}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Check-out</p>
                  <p className="mt-2 font-semibold text-slate-900">{booking.checkOut}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Guests</p>
                  <p className="mt-2 font-semibold text-slate-900">{booking.guests}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
