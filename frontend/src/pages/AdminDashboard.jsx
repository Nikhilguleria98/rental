import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CalendarCheck, CheckCircle2, DoorOpen, LogOut, Pencil, Plus, RefreshCw, Trash2, Upload, UsersRound } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

const initialFormState = {
  name: '',
  type: '',
  price: '',
  rating: '',
  reviews: '',
  shortDescription: '',
  description: '',
  amenities: '',
  availability: true,
};

const inputClass = 'mt-2 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100';
const panelClass = 'rounded-lg border border-slate-200 bg-white shadow-sm';
const mutedPanelClass = 'rounded-lg border border-slate-200 bg-slate-50/80';

function RoomGridIcon({ tone = 'cyan' }) {
  const filledTiles = tone === 'rose' ? [0, 1, 3, 4, 6, 7] : [1, 5];
  const colorClass = tone === 'rose' ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-cyan-200 bg-cyan-50 text-cyan-700';
  const tileClass = tone === 'rose' ? 'bg-rose-500' : 'bg-cyan-600';

  return (
    <span className={`inline-grid h-9 w-9 grid-cols-3 gap-0.5 rounded-lg border p-1 ${colorClass}`}>
      {Array.from({ length: 9 }).map((_, index) => (
        <span key={index} className={`rounded-[2px] ${filledTiles.includes(index) ? tileClass : 'bg-white'}`} />
      ))}
    </span>
  );
}

function AdminDashboard({ onRoomsUpdated }) {
  const { user, token, logout, loading } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState(initialFormState);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    try {
      const [usersResponse, roomsResponse, bookingsResponse] = await Promise.all([
        axios.get('http://localhost:4000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:4000/api/admin/rooms', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:4000/api/admin/bookings', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setUsers(usersResponse.data);
      setRooms(roomsResponse.data);
      setBookings(bookingsResponse.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    }
  };

  useEffect(() => {
    if (loading) return; // Wait for auth verification

    if (!token || user?.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchAdminData();
  }, [token, user, navigate, loading]);

  useEffect(() => {
    if (!token || user?.role !== 'admin') return;
    const interval = setInterval(fetchAdminData, 15000);
    return () => clearInterval(interval);
  }, [token, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-slate-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setSelectedRoom(null);
    setFormState(initialFormState);
    setImageFiles([]);
    setMessage('');
  };

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setFormState({
      name: room.name || '',
      type: room.type || '',
      price: room.price || '',
      rating: room.rating || '',
      reviews: room.reviews || '',
      shortDescription: room.shortDescription || '',
      description: room.description || '',
      amenities: room.amenities?.join(', ') || '',
      availability: room.availability ?? true,
    });
    setImageFiles([]);
    setMessage('Editing room: ' + room.name);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    setImageFiles(Array.from(event.target.files));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        if (key === 'availability') {
          formData.append(key, value ? 'true' : 'false');
        } else {
          formData.append(key, value ?? '');
        }
      });
      imageFiles.forEach((file) => formData.append('images', file));

      if (selectedRoom) {
        await axios.put(`http://localhost:4000/api/admin/rooms/${selectedRoom.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Room updated successfully.');
      } else {
        await axios.post('http://localhost:4000/api/admin/rooms', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Room created successfully.');
      }

      await fetchAdminData();
      onRoomsUpdated?.();
      resetForm();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save room');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (roomId) => {
    const shouldDelete = window.confirm('Delete this room? This cannot be undone.');
    if (!shouldDelete) return;

    try {
      await axios.delete(`http://localhost:4000/api/admin/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Room deleted successfully.');
      if (selectedRoom?.id === roomId) resetForm();
      await fetchAdminData();
      onRoomsUpdated?.();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete room');
    }
  };

  const handleToggleAvailability = async (roomId) => {
    try {
      await axios.patch(`http://localhost:4000/api/admin/rooms/${roomId}/availability`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Room availability updated successfully.');
      await fetchAdminData();
      onRoomsUpdated?.();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update room availability');
    }
  };

  const activeUsers = users.filter((item) => item.isLoggedIn).length;
  const availableRooms = rooms.filter((room) => room.availability).length;
  const bookedRooms = rooms.length - availableRooms;
  const bookingValue = bookings.reduce((total, booking) => total + Number(booking.price || 0), 0);
  const stats = [
    { label: 'Total rooms', value: rooms.length, detail: `${availableRooms} available`, icon: DoorOpen },
    { label: 'Bookings', value: bookings.length, detail: `$${bookingValue.toLocaleString()} nightly value`, icon: CalendarCheck },
    { label: 'Active users', value: activeUsers, detail: `${users.length} registered`, icon: UsersRound },
    { label: 'Booked rooms', value: bookedRooms, detail: `${availableRooms} open inventory`, icon: RoomGridIcon, iconTone: 'rose' },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">Rental operations</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Admin Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Create, update, and manage rooms, bookings, and active users.</p>
          </div>
          <button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>

        {(error || message) && (
          <div className="mt-6 grid gap-3">
            {error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
            {message && <p className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800">{message}</p>}
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`${panelClass} p-5`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">{stat.value}</p>
                  </div>
                  <span className="inline-flex rounded-lg bg-cyan-50 p-2 text-cyan-700">
                    {stat.iconTone ? <Icon tone={stat.iconTone} /> : <Icon className="h-5 w-5" />}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500">{stat.detail}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
          <section className={`${panelClass} overflow-hidden`}>
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Room CMS</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">{selectedRoom ? 'Edit room details' : 'Create a room'}</h2>
              </div>
              <button onClick={resetForm} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                {selectedRoom ? <Plus className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
                {selectedRoom ? 'New room' : 'Reset form'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Name</span>
                  <input name="name" value={formState.name} onChange={handleChange} required className={inputClass} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Type</span>
                  <input name="type" value={formState.type} onChange={handleChange} required className={inputClass} />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Price</span>
                  <input name="price" value={formState.price} onChange={handleChange} type="number" min="0" required className={inputClass} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Rating</span>
                  <input name="rating" value={formState.rating} onChange={handleChange} type="number" step="0.1" min="0" max="5" required className={inputClass} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Reviews</span>
                  <input name="reviews" value={formState.reviews} onChange={handleChange} type="number" min="0" required className={inputClass} />
                </label>
                <label className={`${mutedPanelClass} flex items-center justify-between gap-3 px-4 py-3 md:mt-7`}>
                  <span className="text-sm font-medium text-slate-700">Available</span>
                  <input name="availability" checked={formState.availability} onChange={handleChange} type="checkbox" className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Short description</span>
                <input name="shortDescription" value={formState.shortDescription} onChange={handleChange} className={inputClass} />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Description</span>
                <textarea name="description" value={formState.description} onChange={handleChange} rows="4" className={inputClass} />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Amenities</span>
                <input name="amenities" value={formState.amenities} onChange={handleChange} placeholder="WiFi, AC, TV" className={inputClass} />
              </label>

              <label className={`${mutedPanelClass} block cursor-pointer px-4 py-4`}>
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Upload className="h-4 w-4 text-cyan-700" />
                  Upload images
                </span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="mt-3 w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700" />
                <p className="mt-2 text-sm text-slate-500">Upload new images to add to the room gallery.</p>
              </label>

              <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70">
                <CheckCircle2 className="h-4 w-4" />
                {selectedRoom ? 'Update room' : 'Create room'}
              </button>
            </form>
          </section>

          <section className={`${panelClass} overflow-hidden`}>
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Users</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">Active users</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{activeUsers} active</span>
            </div>

            <div className="divide-y divide-slate-100">
              {users.map((userData) => (
                <div key={userData._id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-slate-950">{userData.name}</h3>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{userData.role === 'admin' ? 'Admin' : 'User'}</span>
                      </div>
                      <p className="mt-1 truncate text-sm text-slate-500">{userData.email}</p>
                    </div>
                    <span className={userData.isLoggedIn ? 'shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700' : 'shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600'}>
                      {userData.isLoggedIn ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">Last login: {userData.lastLoginAt ? new Date(userData.lastLoginAt).toLocaleString() : 'Never'}</p>
                </div>
              ))}
              {users.length === 0 && <p className="m-5 rounded-lg bg-slate-50 p-5 text-sm text-slate-600">No users found.</p>}
            </div>
          </section>
        </div>

        <section className={`${panelClass} mt-6 overflow-hidden`}>
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Bookings</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">Room bookings overview</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{bookings.length} total bookings</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[1.4fr_1.4fr_1fr_0.7fr_0.8fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span>Room</span>
                <span>Guest</span>
                <span>Stay</span>
                <span>Guests</span>
                <span className="text-right">Rate</span>
              </div>
              <div className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <div key={booking._id} className="grid grid-cols-[1.4fr_1.4fr_1fr_0.7fr_0.8fr] gap-4 px-5 py-4 text-sm">
                    <div>
                      <p className="font-semibold text-slate-950">{booking.roomName}</p>
                      <p className="mt-1 text-xs text-slate-500">Booked {new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{booking.userId?.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{booking.userId?.email}</p>
                    </div>
                    <div className="text-slate-600">
                      <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                      <p className="mt-1">{new Date(booking.checkOut).toLocaleDateString()}</p>
                    </div>
                    <div className="text-slate-600">{booking.guests}</div>
                    <div className="text-right font-semibold text-cyan-700">${booking.price} / night</div>
                  </div>
                ))}
              </div>
              {bookings.length === 0 && <p className="m-5 rounded-lg bg-slate-50 p-5 text-sm text-slate-600">No bookings found.</p>}
            </div>
          </div>
        </section>

        <section className={`${panelClass} mt-6 overflow-hidden`}>
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Room inventory</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">Manage existing rooms</h2>
            </div>
            {rooms.length > 0 && <p className="text-sm text-slate-500">Click edit to load a room into the CMS form.</p>}
          </div>

          <div className="grid gap-4 p-5 lg:grid-cols-2">
            {rooms.map((room) => {
              const roomBookings = bookings.filter(booking => booking.roomId === room.id);
              return (
                <div key={room._id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-950">{room.name}</h3>
                        <span className={room.availability ? 'rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700' : 'rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700'}>
                          {room.availability ? 'Available' : 'Booked'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{room.type} - ${room.price} / night</p>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">{room.shortDescription}</p>
                      <p className="mt-2 text-xs font-medium text-slate-500">{room.amenities?.join(', ')}</p>
                    </div>
                    <div className="flex shrink-0 gap-2 sm:flex-col">
                      <button onClick={() => handleEdit(room)} title="Edit room" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-600 text-white transition hover:bg-cyan-700">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleToggleAvailability(room.id)} title={room.availability ? 'Mark booked' : 'Mark available'} className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${room.availability ? 'bg-rose-50 hover:bg-rose-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                        {room.availability ? <RoomGridIcon tone="rose" /> : <CheckCircle2 className="h-4 w-4" />}
                      </button>
                      <button onClick={() => handleDelete(room.id)} title="Delete room" className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-700 transition hover:bg-rose-100">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{room.rating} rating</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">{room.reviews} reviews</span>
                    {roomBookings.length > 0 && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700">
                        {roomBookings.length} bookings, latest {new Date(roomBookings[0].createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {rooms.length === 0 && <p className="rounded-lg bg-slate-50 p-5 text-sm text-slate-600">No rooms found.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
