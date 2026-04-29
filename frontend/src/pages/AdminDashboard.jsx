import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

function AdminDashboard({ onRoomsUpdated }) {
  const { user, token, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState(initialFormState);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchAdminData = async () => {
    try {
      const [usersResponse, roomsResponse] = await Promise.all([
        axios.get('http://localhost:4000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:4000/api/admin/rooms', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setUsers(usersResponse.data);
      setRooms(roomsResponse.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    }
  };

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    fetchAdminData();
  }, [token, user, navigate]);

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

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Create, update, and manage rooms, bookings, and active users.</p>
        </div>
        <button onClick={logout} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
          Log out
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}
      {message && <p className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">{message}</p>}

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl bg-white p-8 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-500">Room CMS</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Create or update rooms</h2>
            </div>
            <button onClick={resetForm} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-200">
              {selectedRoom ? 'New room' : 'Reset form'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Name</span>
                <input name="name" value={formState.name} onChange={handleChange} required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Type</span>
                <input name="type" value={formState.type} onChange={handleChange} required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40" />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Price</span>
                <input name="price" value={formState.price} onChange={handleChange} type="number" min="0" required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Rating</span>
                <input name="rating" value={formState.rating} onChange={handleChange} type="number" step="0.1" min="0" max="5" required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Reviews</span>
                <input name="reviews" value={formState.reviews} onChange={handleChange} type="number" min="0" required className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Available</span>
                <input name="availability" checked={formState.availability} onChange={handleChange} type="checkbox" className="mt-3 h-5 w-5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-400" />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Short description</span>
              <input name="shortDescription" value={formState.shortDescription} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Description</span>
              <textarea name="description" value={formState.description} onChange={handleChange} rows="4" className="mt-2 w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Amenities</span>
              <input name="amenities" value={formState.amenities} onChange={handleChange} placeholder="WiFi, AC, TV" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-300/40" />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Upload images</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="mt-2 w-full text-sm text-slate-600" />
              <p className="mt-2 text-sm text-slate-500">Upload new images to add to the room gallery.</p>
            </label>

            <button type="submit" disabled={submitting} className="inline-flex w-full justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-70">
              {selectedRoom ? 'Update room' : 'Create room'}
            </button>
          </form>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-500">Users</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Active users</h2>
            </div>
            <span className="rounded-3xl bg-slate-50 px-4 py-2 text-sm text-slate-600">{users.filter((item) => item.isLoggedIn).length} active</span>
          </div>

          <div className="mt-8 space-y-4">
            {users.map((userData) => (
              <div key={userData._id} className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm font-medium text-slate-500">{userData.role === 'admin' ? 'Admin' : 'User'}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{userData.name}</h3>
                <p className="text-sm text-slate-600">{userData.email}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <span className={userData.isLoggedIn ? 'rounded-full bg-emerald-100 px-3 py-1 text-emerald-700' : 'rounded-full bg-slate-100 px-3 py-1 text-slate-600'}>
                    {userData.isLoggedIn ? 'Logged in' : 'Logged out'}
                  </span>
                  <span className="text-slate-500">{userData.lastLoginAt ? new Date(userData.lastLoginAt).toLocaleString() : 'Never'}</span>
                </div>
              </div>
            ))}
            {users.length === 0 && <p className="rounded-3xl bg-slate-50 p-6 text-slate-600">No users found.</p>}
          </div>
        </section>
      </div>

      <section className="mt-10 rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-500">Room inventory</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Manage existing rooms</h2>
          </div>
          {rooms.length > 0 && <p className="text-sm text-slate-500">Click edit to load a room into the CMS form.</p>}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {rooms.map((room) => (
            <div key={room._id} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{room.type} · ${room.price} / night</p>
                  <p className="mt-2 text-sm text-slate-500">{room.amenities?.join(', ')}</p>
                  <p className="mt-2 text-sm text-slate-500">{room.shortDescription}</p>
                </div>
                <div className="space-y-2 text-right">
                  <button onClick={() => handleEdit(room)} className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600">Edit</button>
                  <button onClick={() => handleDelete(room.id)} className="rounded-2xl bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200">Delete</button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={room.availability ? 'rounded-full bg-emerald-100 px-3 py-1 text-emerald-700' : 'rounded-full bg-rose-100 px-3 py-1 text-rose-700'}>
                  {room.availability ? 'Available' : 'Booked'}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{room.rating} ⭐ • {room.reviews} reviews</span>
              </div>
            </div>
          ))}
          {rooms.length === 0 && <p className="rounded-3xl bg-slate-50 p-6 text-slate-600">No rooms found.</p>}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
