import { Link } from 'react-router-dom';

function RoomCard({ room }) {
  return (
    <div className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <img src={room.images[0]} alt={room.name} className="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 top-4 flex justify-between px-5">
          <span className="rounded-full bg-slate-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-100">{room.type}</span>
          <div className="flex gap-2">
            <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-slate-900">{room.rating} ★</span>
            <span className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] ${room.availability ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
              {room.availability ? 'Available' : 'Booked'}
            </span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{room.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{room.shortDescription}</p>
          </div>
          <p className="text-right text-xl font-semibold text-slate-900">${room.price}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {room.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{amenity}</span>
          ))}
        </div>
        <Link to={`/rooms/${room.id}`} className="mt-6 inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600">View Details</Link>
      </div>
    </div>
  );
}

export default RoomCard;
