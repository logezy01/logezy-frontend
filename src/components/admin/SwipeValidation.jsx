import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { CheckCircle, XCircle, MapPin, Bed, Maximize, Calendar, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

function SwipeCard({ listing, onSwipe, isTop, stackIndex }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0, 1, 1, 1, 0]);
  const approveOpacity = useTransform(x, [0, 120], [0, 1]);
  const rejectOpacity = useTransform(x, [-120, 0], [1, 0]);

  const handleDragEnd = (event, info) => {
    const threshold = 140;
    if (info.offset.x > threshold) {
      onSwipe('approve', listing);
    } else if (info.offset.x < -threshold) {
      onSwipe('reject', listing);
    }
  };

  return (
    <motion.div
      style={{
        x, rotate,
        opacity: isTop ? opacity : 1,
        position: 'absolute',
        width: '100%',
        cursor: isTop ? 'grab' : 'default',
        zIndex: 10 - stackIndex,
      }}
      animate={{
        scale: 1 - stackIndex * 0.04,
        y: stackIndex * 10,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileTap={{ cursor: 'grabbing' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="card overflow-hidden select-none"
        style={{ boxShadow: isTop ? '0 20px 60px rgba(0,0,0,0.25)' : '0 8px 20px rgba(0,0,0,0.1)' }}>

        {/* Badge APPROUVER */}
        {isTop && (
          <motion.div style={{ opacity: approveOpacity }}
            className="absolute top-6 left-6 z-20 border-4 border-[#3A7D44] text-[#3A7D44] font-black text-2xl px-4 py-1 rounded-2xl bg-white/90"
            style={{ opacity: approveOpacity, rotate: '-15deg' }}>
            APPROUVER ✅
          </motion.div>
        )}

        {/* Badge REJETER */}
        {isTop && (
          <motion.div
            style={{ opacity: rejectOpacity, rotate: '15deg' }}
            className="absolute top-6 right-6 z-20 border-4 border-red-500 text-red-500 font-black text-2xl px-4 py-1 rounded-2xl bg-white/90">
            REJETER ❌
          </motion.div>
        )}

        {/* Image */}
        <div className="relative h-52 bg-[#F5F5F7] dark:bg-[#2A2A2A]">
          {listing.listing_images?.[0]?.image_url ? (
            <img src={listing.listing_images[0].image_url} alt={listing.title}
              className="w-full h-full object-cover" draggable={false} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🏠</div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="text-xs bg-[#FEF3C7] text-yellow-700 font-bold px-2 py-1 rounded-full">
              ⏳ En attente
            </span>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              listing.type === 'location' ? 'bg-blue-100 text-blue-600' : 'bg-[#FEF3C7] text-yellow-700'
            }`}>
              {listing.type === 'location' ? '🔑 Location' : '🏷️ Vente'}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5">
          <h3 className="font-display font-bold text-lg text-[#0F172A] dark:text-white mb-1 truncate">
            {listing.title}
          </h3>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1 mb-3">
            <MapPin size={14} className="text-[#3A7D44]" />
            {listing.city}{listing.neighborhood && ` · ${listing.neighborhood}`}
          </p>

          <div className="font-display font-black text-xl text-[#3A7D44] mb-3">
            {new Intl.NumberFormat('fr-FR').format(listing.price)} FCFA
            {listing.price_period && (
              <span className="text-sm font-normal text-[#94A3B8]"> /{listing.price_period}</span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-[#64748B] dark:text-[#94A3B8] mb-3">
            {listing.bedrooms > 0 && (
              <span className="flex items-center gap-1"><Bed size={13} /> {listing.bedrooms} ch.</span>
            )}
            {listing.area && (
              <span className="flex items-center gap-1"><Maximize size={13} /> {listing.area}m²</span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {new Date(listing.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>

          {listing.description && (
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] line-clamp-2 mb-3">
              {listing.description}
            </p>
          )}

          {listing.info_supplementaires && (
            <div className="bg-[#EBF5ED] dark:bg-[#2A2A2A] rounded-xl p-2.5 mb-3">
              <p className="text-xs text-[#3A7D44] line-clamp-2">
                💡 {listing.info_supplementaires}
              </p>
            </div>
          )}

          <div className="bg-[#F5F5F7] dark:bg-[#2A2A2A] rounded-xl p-2.5">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              👤 <strong className="text-[#0F172A] dark:text-white">{listing.users?.full_name}</strong>
              {listing.users?.email && ` · ${listing.users.email}`}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SwipeValidation({ listings, onApprove, onReject, onAllDone }) {
  const [queue, setQueue] = useState(listings);
  const [history, setHistory] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const handleSwipe = async (action, listing) => {
    setFeedback(action);
    setHistory(prev => [...prev, { listing, action }]);
    setQueue(prev => prev.filter(l => l.id !== listing.id));

    try {
      if (action === 'approve') {
        await onApprove(listing.id);
      } else {
        await onReject(listing.id);
      }
    } catch (e) {}

    setTimeout(() => setFeedback(null), 500);
    if (queue.length === 1) setTimeout(() => onAllDone?.(), 400);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setQueue(prev => [last.listing, ...prev]);
    toast('Action annulée ↩️');
  };

  return (
    <div className="flex flex-col items-center">

      {/* Compteur + Undo */}
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#0F172A] dark:text-white">
            {queue.length}
          </span>
          <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">
            annonce{queue.length !== 1 ? 's' : ''} restante{queue.length !== 1 ? 's' : ''}
          </span>
        </div>
        {history.length > 0 && (
          <button onClick={handleUndo}
            className="flex items-center gap-1.5 text-xs font-bold text-[#3A7D44] hover:underline">
            <RotateCcw size={13} /> Annuler
          </button>
        )}
      </div>

      {/* Barre de progression */}
      <div className="w-full max-w-md mb-5">
        <div className="w-full bg-[#F5F5F7] dark:bg-[#2A2A2A] rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-[#3A7D44] transition-all duration-500"
            style={{ width: `${Math.max(0, ((listings.length - queue.length) / listings.length) * 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-[#94A3B8] mt-1">
          <span>{listings.length - queue.length} traitées</span>
          <span>{listings.length} total</span>
        </div>
      </div>

      {/* Pile de cartes */}
      <div className="relative w-full max-w-md" style={{ height: 560 }}>
        <AnimatePresence>
          {queue.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-12 text-center absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="text-5xl">🎉</span>
              <p className="font-display font-bold text-lg text-[#0F172A] dark:text-white">
                Toutes les annonces traitées !
              </p>
              <p className="text-sm text-[#94A3B8]">Excellent travail 💪</p>
              <div className="flex gap-4 mt-2 text-sm">
                <div className="text-center">
                  <div className="font-black text-xl text-[#3A7D44]">
                    {history.filter(h => h.action === 'approve').length}
                  </div>
                  <div className="text-[#94A3B8]">Approuvées</div>
                </div>
                <div className="w-px bg-[#E2E8F0]" />
                <div className="text-center">
                  <div className="font-black text-xl text-red-500">
                    {history.filter(h => h.action === 'reject').length}
                  </div>
                  <div className="text-[#94A3B8]">Rejetées</div>
                </div>
              </div>
            </motion.div>
          ) : (
            queue.slice(0, 3).map((listing, i) => (
              <SwipeCard
                key={listing.id}
                listing={listing}
                isTop={i === 0}
                stackIndex={i}
                onSwipe={handleSwipe}
              />
            ))
          )}
        </AnimatePresence>

        {/* Flash feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.12 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl pointer-events-none z-30"
              style={{ background: feedback === 'approve' ? '#3A7D44' : '#EF4444' }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Boutons */}
      {queue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 mt-6">

          <button onClick={() => handleSwipe('reject', queue[0])}
            className="flex flex-col items-center gap-1 group">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-[#1A1A1A] border-2 border-red-200 dark:border-red-900/40 text-red-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-50 group-hover:border-red-400 transition-all active:scale-95">
              <XCircle size={28} />
            </div>
            <span className="text-xs text-[#94A3B8]">Rejeter</span>
          </button>

          <div className="text-center">
            <p className="text-xs text-[#94A3B8] font-medium">Glissez ou cliquez</p>
            <div className="flex items-center gap-1 mt-1 justify-center">
              <span className="text-xs text-red-400">← Rejeter</span>
              <span className="text-[#E2E8F0] mx-1">|</span>
              <span className="text-xs text-[#3A7D44]">Approuver →</span>
            </div>
          </div>

          <button onClick={() => handleSwipe('approve', queue[0])}
            className="flex flex-col items-center gap-1 group">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-[#1A1A1A] border-2 border-[#3A7D44]/30 text-[#3A7D44] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#EBF5ED] group-hover:border-[#3A7D44] transition-all active:scale-95">
              <CheckCircle size={28} />
            </div>
            <span className="text-xs text-[#94A3B8]">Approuver</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}