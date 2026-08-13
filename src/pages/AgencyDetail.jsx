import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, Phone, Users, ArrowLeft, CheckCircle, Building2, Mail, ExternalLink } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import ListingCard from '../components/common/ListingCard';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function AgencyDetail() {
  const { id } = useParams();
  const [agency, setAgency] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('listings');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/agencies/${id}`);
        setAgency(res.data.agency);
        setListings(res.data.listings || []);
      } catch {
        toast.error('Agence introuvable');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#080B14]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-8 space-y-4">
        <div className="h-48 rounded-2xl bg-[#E8E8E8] dark:bg-[#1A1A1A] animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-xl bg-[#E8E8E8] dark:bg-[#1A1A1A] animate-pulse" />)}
        </div>
      </div>
    </div>
  );

  if (!agency) return null;

  return (
    <div className="min-h-screen bg-[#F4F5F7] dark:bg-[#080B14] pb-20 md:pb-8">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#94A3B8] mb-4">
          <Link to="/agences" className="flex items-center gap-1 hover:text-[#3A7D44] transition-colors">
            <ArrowLeft size={14} /> Agences
          </Link>
          <span>/</span>
          <span className="text-[#334155] dark:text-white font-medium">{agency.name}</span>
        </div>

        {/* Header agence */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 border border-[#E8E8E8] dark:border-[#2A2A2A] mb-5">
          <div className="flex flex-col md:flex-row gap-5 items-start">

            {/* Logo */}
            {agency.logo_url ? (
              <img src={agency.logo_url} alt={agency.name}
                className="w-24 h-24 rounded-2xl object-cover border border-[#E8E8E8] dark:border-[#2A2A2A] shrink-0" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#3A7D44] to-[#2D6235] flex items-center justify-center text-white font-black text-4xl shrink-0">
                {agency.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-[#0F172A] dark:text-white">{agency.name}</h1>
                {agency.is_verified && (
                  <span className="flex items-center gap-1 text-xs bg-[#EBF5ED] text-[#3A7D44] font-bold px-2 py-1 rounded-full">
                    <CheckCircle size={11} /> Vérifiée
                  </span>
                )}
              </div>

              {agency.city && (
                <p className="text-sm text-[#94A3B8] flex items-center gap-1 mb-2">
                  <MapPin size={13} className="text-[#3A7D44]" />
                  {agency.city}{agency.address && ` — ${agency.address}`}
                </p>
              )}

              {agency.description && (
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-3">
                  {agency.description}
                </p>
              )}

              {/* Contacts */}
              <div className="flex flex-wrap gap-3">
                {agency.phone && (
                  <a href={`tel:${agency.phone}`}
                    className="flex items-center gap-2 text-xs bg-[#F8F9FA] dark:bg-[#2A2A2A] border border-[#E8E8E8] dark:border-[#3A3A3A] text-[#334155] dark:text-white px-3 py-2 rounded-xl hover:border-[#3A7D44] transition-all font-medium">
                    <Phone size={13} className="text-[#3A7D44]" />
                    {agency.phone}
                  </a>
                )}
                {agency.email && (
                  <a href={`mailto:${agency.email}`}
                    className="flex items-center gap-2 text-xs bg-[#F8F9FA] dark:bg-[#2A2A2A] border border-[#E8E8E8] dark:border-[#3A3A3A] text-[#334155] dark:text-white px-3 py-2 rounded-xl hover:border-[#3A7D44] transition-all font-medium">
                    <Mail size={13} className="text-[#3A7D44]" />
                    {agency.email}
                  </a>
                )}
                {agency.website_url && (
                  <a href={agency.website_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs bg-[#EBF5ED] border border-[#3A7D44]/20 text-[#3A7D44] px-3 py-2 rounded-xl hover:bg-[#3A7D44] hover:text-white transition-all font-bold">
                    <Globe size={13} />
                    Site web
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex md:flex-col gap-3 shrink-0">
              <div className="bg-[#EBF5ED] dark:bg-[#2A2A2A] rounded-xl p-3 text-center min-w-[70px]">
                <div className="text-xl font-black text-[#3A7D44]">{agency.agents?.length || 0}</div>
                <div className="text-xs text-[#94A3B8]">Agents</div>
              </div>
              <div className="bg-[#F8F9FA] dark:bg-[#2A2A2A] rounded-xl p-3 text-center min-w-[70px]">
                <div className="text-xl font-black text-[#0F172A] dark:text-white">{listings.length}</div>
                <div className="text-xs text-[#94A3B8]">Annonces</div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 bg-white dark:bg-[#1A1A1A] border border-[#E8E8E8] dark:border-[#2A2A2A] rounded-2xl p-1 mb-5">
          {[
            { id: 'listings', label: `Annonces (${listings.length})` },
            { id: 'agents', label: `Équipe (${agency.agents?.length || 0})` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#3A7D44] text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#334155] dark:hover:text-white'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Annonces */}
        {activeTab === 'listings' && (
          listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-[#94A3B8]">
              <Building2 size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium dark:text-white">Aucune annonce pour le moment</p>
            </div>
          )
        )}

        {/* Équipe */}
        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agency.agents?.map(agent => (
              <div key={agent.id} className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 border border-[#E8E8E8] dark:border-[#2A2A2A] flex items-center gap-4">
                {agent.avatar_url ? (
                  <img src={agent.avatar_url} alt={agent.full_name}
                    className="w-12 h-12 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#3A7D44] text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {agent.full_name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm text-[#0F172A] dark:text-white">{agent.full_name}</p>
                  <p className="text-xs text-[#94A3B8] capitalize">{agent.role === 'agent' ? 'Agent immobilier' : 'Propriétaire'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}