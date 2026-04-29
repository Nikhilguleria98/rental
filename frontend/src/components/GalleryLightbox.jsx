function GalleryLightbox({ images, index, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4">
      <button onClick={onClose} className="absolute right-6 top-6 rounded-full bg-white/90 p-3 text-slate-950 shadow-lg transition hover:bg-white">Close</button>
      <div className="max-w-5xl overflow-hidden rounded-[2rem] bg-slate-900 shadow-2xl">
        <img src={images[index]} alt={`Gallery ${index + 1}`} className="h-[70vh] w-full object-cover" />
      </div>
    </div>
  );
}

export default GalleryLightbox;
