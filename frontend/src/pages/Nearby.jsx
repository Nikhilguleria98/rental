import attractions from '../data/attractions';

function Nearby() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-500">Nearby Attractions</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Discover famous places around you</h1>
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
    </main>
  );
}

export default Nearby;