import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, MapPin, TrendingUp, Heart, ArrowRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import api from '../lib/axios';

export default function About() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_listings: 0,
    total_conversations: 0,
    satisfaction: '88%',
    cities: 12,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/site-stats');
        setStats(res.data.stats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const team = [
    { name: 'Équipe Logezy', role: 'Fondateurs', emoji: '👥', desc: 'Une équipe passionnée par l\'immobilier et la technologie au Bénin.' },
    { name: 'Support Client', role: 'Service client', emoji: '🎧', desc: 'Disponible 7j/7 pour vous accompagner dans votre recherche.' },
    { name: 'Agents Vérificateurs', role: 'Terrain', emoji: '🔍', desc: 'Notre équipe terrain vérifie chaque annonce publiée.' },
  ];

  const values = [
    { icon: <Shield size={24} className="text-[#3A7D44]" />, title: 'Confiance', desc: 'Chaque annonce est vérifiée par notre équipe pour garantir l\'authenticité.' },
    { icon: <Heart size={24} className="text-[#3A7D44]" />, title: 'Proximité', desc: 'Nous comprenons les réalités du marché immobilier béninois.' },
    { icon: <TrendingUp size={24} className="text-[#3A7D44]" />, title: 'Innovation', desc: 'Nous utilisons la technologie pour simplifier la recherche de logement.' },
    { icon: <Users size={24} className="text-[#3A7D44]" />, title: 'Communauté', desc: 'Nous construisons une communauté de confiance entre propriétaires et locataires.' },
  ];

  const displayStats = [
    { value: loading ? '...' : `${stats.total_listings}+`, label: 'Annonces actives', emoji: '🏠' },
    { value: loading ? '...' : `${stats.cities}`, label: 'Villes couvertes', emoji: '📍' },
    { value: loading ? '...' : `${stats.total_users}+`, label: 'Utilisateurs', emoji: '👥' },
    { value: loading ? '...' : stats.satisfaction, label: 'Satisfaction', emoji: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0F0F0F] pb-20 md:pb-0">
      <Navbar />

      {/* Hero */}
      <div className="bg-[#3A7D44] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="font-display text-4xl font-black mb-4">À propos de Logezy</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Logezy est la plateforme immobilière de référence au Bénin.
            Notre mission : rendre la recherche de logement simple, sûre et accessible à tous.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Notre histoire */}
        <div className="card p-8 animate-slide-up">
          <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white mb-4">
            Notre histoire 📖
          </h2>
          <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-4">
            Logezy est né d'un constat simple : trouver un logement au Bénin est souvent difficile,
            risqué et chronophage. Les arnaques sont fréquentes, les informations peu fiables,
            et le marché manque de transparence.
          </p>
          <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-4">
            Nous avons créé Logezy pour changer ça. Notre plateforme connecte propriétaires,
            agents immobiliers et locataires/acheteurs dans un environnement sécurisé et transparent.
          </p>
          <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Basés à Cotonou, nous couvrons aujourd'hui toutes les grandes villes du Bénin
            et visons une expansion progressive en Afrique de l'Ouest.
          </p>
        </div>

        {/* Logezy en chiffres — RÉELS */}
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white mb-2 text-center">
            Logezy en chiffres 📊
          </h2>
          <p className="text-center text-sm text-[#64748B] dark:text-[#94A3B8] mb-6">
            Données mises à jour en temps réel
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayStats.map((stat, i) => (
              <div key={i} className="card p-5 text-center animate-scale-in hover:shadow-float transition-all">
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className={`font-display font-black text-2xl text-[#3A7D44] ${loading ? 'animate-pulse' : ''}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#94A3B8] mt-3">
            🔄 Ces chiffres sont mis à jour automatiquement depuis notre base de données
          </p>
        </div>

        {/* Nos valeurs */}
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white mb-6 text-center">
            Nos valeurs 💚
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((value, i) => (
              <div key={i} className="card-hover p-6 animate-slide-up">
                <div className="w-12 h-12 bg-[#EBF5ED] rounded-2xl flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-2">{value.title}</h3>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notre équipe */}
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white mb-6 text-center">
            Notre équipe 👥
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {team.map((member, i) => (
              <div key={i} className="card p-6 text-center animate-fade-in hover:shadow-float transition-all">
                <div className="text-4xl mb-3">{member.emoji}</div>
                <h3 className="font-bold text-[#0F172A] dark:text-white mb-1">{member.name}</h3>
                <p className="text-xs text-[#3A7D44] font-bold mb-2">{member.role}</p>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#3A7D44] rounded-2xl p-8 text-center text-white">
          <h2 className="font-display text-2xl font-bold mb-3">
            Rejoignez Logezy aujourd'hui !
          </h2>
          <p className="text-white/70 mb-6">
            Des milliers de Béninois nous font déjà confiance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register"
              className="bg-white text-[#3A7D44] font-bold px-6 py-3 rounded-btn hover:bg-[#EBF5ED] transition-colors inline-flex items-center gap-2 justify-center">
              Créer un compte gratuit <ArrowRight size={16} />
            </Link>
            <Link to="/annonces"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-btn transition-colors inline-flex items-center gap-2 justify-center">
              Voir les annonces
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}