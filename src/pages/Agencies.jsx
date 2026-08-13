import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, Phone, Users, ArrowRight, Building2, CheckCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import api from '../lib/axios';

function SkeletonAgency() {
  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#E8E8E8] dark:border-[#2A2A2A] animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] dark:bg-[#2A2A2A]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-[#F5F5F7] dark:bg-[#2A2A2A]" />
          <div className="h-3 w-20 rounded bg-[#F5F5F7] dark:bg-[#2A2A2A]" />
        </div>
      </div>
      <div className="h-3 w-full rounded bg-[#F5F5F7] dark:bg-[#2A2A2A] mb-2" />
      <div className="h-3 w-3/4 rounded bg-[#F5F5F7] dark:bg-[#2A2A2A]" />
    </div>
  );
}

export default function Agencies() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/agencies');
        setAgencies(res.data.agencies || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = agencies.filter(a =>
    !search ||
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#080B14] pb-20 md:pb-8">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#3A7D44]/20 border border-[#3A7D44]/30 text-[#4ade80] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <Building2 size={12} />
            Agences partenaires Logezy
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            Les agences immobilières du Bénin
          </h1>
          <p className="text-white/60 text-base mb-6">
            Trouvez des professionnels de confiance pour vous accompagner dans votre projet immobilier
          </p>
          <input
            type="text"
            placeholder="Rechercher une agence par nom ou ville..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md mx-auto block px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:border-[#3A7D44] transition-all text-sm"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Agences actives', value: agencies.length, icon: Building2 },
            { label: 'Agents', value: agencies.reduce((acc, a) => acc + (a.agents?.length || 0), 0), icon: Users },
            { label: 'Villes couvertes', value: [...new Set(agencies.map(a => a.city).filter(Boolean))].length, icon: MapPin },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 border border-[#E8E8E8] dark:border-[#2A2A2A] text-center">
              <Icon size={20} className="text-[#3A7D44] mx-auto mb-2" />
              <div className="text-2xl font-black text-[#0F172A] dark:text-white">{value}</div>
              <div className="text-xs text-[#94A3B8]">{label}</div>
            </div>
          ))}
        </div>

        {/* Liste agences */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonAgency key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#94A3B8]">
            <Building2 size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucune agence trouvée</p>
            <p className="text-sm mt-1">Essayez un autre terme de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(agency => (
              <Link key={agency.id} to={`/agences/${agency.id}`}
                className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 border border-[#E8E8E8] dark:border-[#2A2A2A] hover:border-[#3A7D44]/40 hover:shadow-lg transition-all group">

                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  {agency.logo_url ? (
                    <img src={agency.logo_url} alt={agency.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#E8E8E8] dark:border-[#2A2A2A] shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3A7D44] to-[#2D6235] flex items-center justify-center text-white font-black text-2xl shrink-0">
                      {agency.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-bold text-[#0F172A] dark:text-white truncate">{agency.name}</h3>
                      {agency.is_verified && (
                        <CheckCircle size={14} className="text-[#3A7D44] shrink-0" />
                      )}
                    </div>
                    {agency.city && (
                      <p className="text-xs text-[#94A3B8] flex items-center gap-1">
                        <MapPin size={11} />
                        {agency.city}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                {agency.description && (
                  <p className="text-sm text-[#64748B] dark:text-[#94A3B8] line-clamp-2 mb-4">
                    {agency.description}
                  </p>
                )}

                {/* Infos */}
                <div className="space-y-1.5 mb-4">
                  {agency.phone && (
                    <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
                      <Phone size={12} className="text-[#3A7D44]" />
                      {agency.phone}
                    </div>
                  )}
                  {agency.website_url && (
                    <div className="flex items-center gap-2 text-xs text-[#3A7D44] truncate">
                      <Globe size={12} />
                      {agency.website_url.replace('https://', '').replace('http://', '')}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] dark:border-[#2A2A2A]">
                  <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                    <Users size={12} />
                    {agency.agents?.length || 0} agent{(agency.agents?.length || 0) > 1 ? 's' : ''}
                  </div>
                  <span className="text-xs font-bold text-[#3A7D44] group-hover:gap-2 flex items-center gap-1 transition-all">
                    Voir l'agence <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}