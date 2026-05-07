import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

export default function PhotoGallery({ images, title }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const photos = images && images.length > 0
    ? images.map(img => ({ url: `${baseURL}${img.image_url}` }))
    : [{ url: null }];

  const prev = () => setSelectedIndex(i => (i - 1 + photos.length) % photos.length);
  const next = () => setSelectedIndex(i => (i + 1) % photos.length);

  const lightboxPrev = () => setSelectedIndex(i => (i - 1 + photos.length) % photos.length);
  const lightboxNext = () => setSelectedIndex(i => (i + 1) % photos.length);

  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, selectedIndex]);

  return (
    <>
      <div className="card overflow-hidden">

        {/* Image principale */}
        <div className="relative h-72 md:h-96 bg-gradient-to-br from-[#E8F5EE] to-[#DBEAFE] overflow-hidden">
          {photos[selectedIndex].url ? (
            <img
              src={photos[selectedIndex].url}
              alt={`${title} - Photo ${selectedIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl">🏠</span>
            </div>
          )}

          {/* Compteur */}
          <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
            {selectedIndex + 1} / {photos.length}
          </div>

          {/* Zoom */}
          {photos[selectedIndex].url && (
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute bottom-3 right-3 bg-black/50 text-white p-2 rounded-xl hover:bg-black/70 transition-colors"
            >
              <ZoomIn size={18} />
            </button>
          )}

          {/* Navigation */}
          {photos.length > 1 && (
            <>
              <button onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-float hover:bg-white transition-colors">
                <ChevronLeft size={20} className="text-[#0F172A]" />
              </button>
              <button onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-float hover:bg-white transition-colors">
                <ChevronRight size={20} className="text-[#0F172A]" />
              </button>
            </>
          )}
        </div>

        {/* Miniatures */}
        {photos.length > 1 && (
          <div className="p-3 border-t border-[#E2E8F0] flex gap-2 overflow-x-auto">
            {photos.map((photo, i) => (
              <button key={i} onClick={() => setSelectedIndex(i)}
                className={`flex-none w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedIndex === i
                    ? 'border-[#1A6B3C] opacity-100'
                    : 'border-transparent opacity-50 hover:opacity-75'
                }`}>
                {photo.url ? (
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#E8F5EE] flex items-center justify-center text-xl">🏠</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}>

          <button onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
            <X size={20} />
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/50 px-4 py-1.5 rounded-full">
            {selectedIndex + 1} / {photos.length}
          </div>

          <div className="max-w-4xl w-full px-16" onClick={e => e.stopPropagation()}>
            <img
              src={photos[selectedIndex].url}
              alt={`${title} - Photo ${selectedIndex + 1}`}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>

          {photos.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); lightboxPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                <ChevronLeft size={24} />
              </button>
              <button onClick={e => { e.stopPropagation(); lightboxNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Miniatures lightbox */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((photo, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setSelectedIndex(i); }}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedIndex === i ? 'border-white opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
                  }`}>
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}