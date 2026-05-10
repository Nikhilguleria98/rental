import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

function RoomGridStatus({ available }) {
  const occupiedTiles = available ? [1, 5] : [0, 1, 3, 4, 6, 7];

  return (
    <span
      className={`inline-grid h-9 w-9 grid-cols-3 gap-0.5 rounded-lg border p-1 ${
        available ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'
      }`}
      title={available ? 'Rooms available' : 'Rooms booked'}
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <span
          key={index}
          className={`rounded-[2px] ${
            occupiedTiles.includes(index)
              ? available
                ? 'bg-emerald-500'
                : 'bg-rose-500'
              : 'bg-white'
          }`}
        />
      ))}
    </span>
  );
}

function RoomCard({ room }) {
  return (
    <div className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <img
          src={room.images[0]}
          alt={room.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-4 flex items-start justify-between gap-3 px-4">
          <span className="rounded bg-slate-950/85 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
            {room.type}
          </span>
          <div className="flex items-center gap-2 rounded bg-white/95 p-1.5 shadow-lg shadow-slate-950/10">
            <RoomGridStatus available={room.availability} />
            <span
              className={`rounded px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                room.availability ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {room.availability ? 'Open' : 'Booked'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold text-slate-900">{room.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{room.shortDescription}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xl font-semibold text-slate-950">${room.price}</p>
            <p className="text-xs font-medium text-slate-500">per night</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-amber-500">
          <Star className="h-4 w-4 fill-current" />
          <span>{room.rating}</span>
          <span className="font-medium text-slate-400">/ 5</span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {room.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs font-medium text-slate-600"
            >
              {amenity}
            </span>
          ))}
        </div>

        <Link
          to={`/rooms/${room.id}`}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default RoomCard;
