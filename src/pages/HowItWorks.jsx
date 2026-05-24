import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/common/Navbar';

export default function HowItWorks() {
  const steps = {
    locataire: [
      { step: '01', emoji: '🔍', title: 'Recherchez', desc: 'Utilisez notre moteur de recherche pour trouver des biens par ville, prix, nombre de chambres ou superficie. Activez la carte pour voir les biens autour de vous.' },
      { step: '02', emoji: '❤️', title: 'Sauvegardez', desc: 'Ajoutez vos biens préférés aux favoris et créez des alertes pour être notifié par email dès qu\'une nouvelle annonce correspond à vos critères.' },
      { step: '03', emoji: '⚖️', title: 'Comparez', desc: 'Sélectionnez jusqu\'à 3 biens et comparez-les côte à côte : prix, superficie, équipements. Trouvez le meilleur rapport qualité-prix.' },
      { step: '04', emoji: '💬', title: 'Contactez', desc: 'Envoyez un message directement au propriétaire via notre messagerie sécurisée. Organisez une visite et finalisez votre location ou achat.' },
    ],
    proprietaire: [
      { step: '01', emoji: '📝', title: 'Créez votre compte', desc: 'Inscrivez-vous en 2 minutes en tant que propriétaire. C\'est gratuit et sans engagement.' },
      { step: '02', emoji: '📸', title: 'Publiez votre annonce', desc: 'Remplissez le formulaire simple : titre, description, prix, localisation et ajoutez jusqu\'à 10 photos. Votre annonce est en ligne en quelques minutes.' },
      { step: '03', emoji: '📊', title: 'Gérez depuis votre dashboard', desc: 'Suivez les vues, les messages reçus et le statut de vos annonces depuis votre tableau de bord personnalisé.' },
      { step: '04', emoji: '🤝', title: 'Trouvez votre locataire', desc: 'Répondez aux demandes via la messagerie intégrée, organisez les visites et choisissez votre locataire ou acheteur idéal.' },
    ],
    agent: [
      { step: '01', emoji: '🏢', title: 'Compte agent professionnel', desc: 'Créez un compte agent et gérez un portefeuille illimité de biens pour différents propriétaires depuis une seule interface.' },
      { step: '02', emoji: '📋', title: 'Publiez en masse', desc: 'Publiez rapidement plusieurs annonces avec notre formulaire optimisé. Gérez tous vos biens depuis votre dashboard agent.' },
      { step: '03', emoji: '📈', title: 'Suivez vos performances', desc: 'Analysez les vues, les contacts reçus et le taux de conversion de chaque annonce. Optimisez vos publications.' },
      { step: '04', emoji: '💼', title: 'Développez votre activité', desc: 'Logezy vous donne la visibilité nécessaire pour développer votre portefeuille client et conclure plus de transactions.' },
    ],
  };

  const faqs = [
    { q: 'Est-ce que Logezy est gratuit ?', r: 'La publication d\'annonces est gratuite pour les particuliers. Les fonctionnalités avancées pour les agents immobiliers sont disponibles avec nos formules premium (bientôt disponibles).' },
    { q: 'Comment sont vérifiées les annonces ?', r: 'Notre équipe contrôle chaque annonce avant publication. Nous vérifions la cohérence des informations et contactons les propriétaires en cas de doute.' },
    { q: 'Comment créer une alerte de recherche ?', r: 'Rendez-vous sur la page Annonces, définissez vos critères (ville, type, prix), puis cliquez sur "Créer une alerte". Vous recevrez un email automatique dès qu\'une nouvelle annonce correspond.' },
    { q: 'Mes données personnelles sont-elles protégées ?', r: 'Oui. Logezy respecte votre vie privée. Vos coordonnées ne sont partagées qu\'avec les utilisateurs avec qui vous choisissez de communiquer. Consultez notre politique de confidentialité pour plus de détails.' },
    { q: 'Comment contacter un propriétaire ?', r: 'Sur chaque annonce, cliquez sur "Contacter le propriétaire". Vous devez être connecté pour envoyer un message. La conversation se fait via notre messagerie sécurisée.' },
  ];

  const [activeRole, setActiveRole] = React.useState('locataire');

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0F0F0F] pb-20 md:pb-0">
      <Navbar />

      {/* Hero */}
      <div className="bg-[#3A7D44] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="font-display text-4xl font-black mb-4">Comment ça marche ?</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Logezy simplifie la recherche et la publication de biens immobiliers au Bénin.
            Voici comment utiliser la plateforme selon votre profil.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* Sélecteur de profil */}
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white text-center mb-6">
            Choisissez votre profil
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { id: 'locataire', emoji: '🔍', label: 'Locataire / Acheteur', desc: 'Je cherche un bien' },
              { id: 'proprietaire', emoji: '🏠', label: 'Propriétaire', desc: 'Je publie mon bien' },
              { id: 'agent', emoji: '🤝', label: 'Agent immobilier', desc: 'Je gère plusieurs biens' },
            ].map(role => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  activeRole === role.id
                    ? 'border-[#3A7D44] bg-[#EBF5ED] dark:bg-[#2A2A2A]'
                    : 'border-[#E2E8F0] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] hover:border-[#3A7D44]'
                }`}
              >
                <div className="text-3xl mb-2">{role.emoji}</div>
                <div className="font-bold text-sm text-[#0F172A] dark:text-white">{role.label}</div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">{role.desc}</div>
                {activeRole === role.id && (
                  <div className="mt-2 text-xs font-bold text-[#3A7D44]">✓ Sélectionné</div>
                )}
              </button>
            ))}
          </div>

          {/* Étapes selon le profil */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps[activeRole].map((step, i) => (
              <div key={i} className="card p-5 relative animate-scale-in hover:shadow-float transition-all">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#3A7D44] text-white rounded-full flex items-center justify-center font-display font-black text-xs">
                  {step.step}
                </div>
                <div className="text-3xl mb-3 mt-1">{step.emoji}</div>
                <h3 className="font-display font-bold text-[#0F172A] dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fonctionnalités clés */}
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white text-center mb-8">
            Nos fonctionnalités clés ✨
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: '🗺️', title: 'Carte interactive', desc: 'Visualisez tous les biens sur une carte du Bénin. Cliquez sur un marqueur pour voir les détails.' },
              { emoji: '🔔', title: 'Alertes email', desc: 'Sauvegardez vos critères de recherche et recevez automatiquement les nouvelles annonces par email.' },
              { emoji: '⚖️', title: 'Comparaison', desc: 'Comparez jusqu\'à 3 biens côte à côte pour faire le meilleur choix.' },
              { emoji: '💬', title: 'Messagerie sécurisée', desc: 'Communiquez directement avec les propriétaires via notre chat intégré.' },
              { emoji: '❤️', title: 'Favoris', desc: 'Sauvegardez les biens qui vous intéressent pour les retrouver facilement.' },
              { emoji: '📸', title: 'Galerie photos', desc: 'Consultez toutes les photos d\'un bien avec notre carousel et zoom intégré.' },
            ].map((feat, i) => (
              <div key={i} className="card p-5 flex items-start gap-4 hover:shadow-float transition-all animate-slide-up">
                <div className="text-3xl shrink-0">{feat.emoji}</div>
                <div>
                  <h3 className="font-bold text-sm text-[#0F172A] dark:text-white mb-1">{feat.title}</h3>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-display text-2xl font-bold text-[#0F172A] dark:text-white text-center mb-8">
            Questions fréquentes ❓
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="card p-5 group cursor-pointer animate-fade-in">
                <summary className="font-bold text-sm text-[#0F172A] dark:text-white flex items-center justify-between list-none">
                  {faq.q}
                  <span className="text-[#3A7D44] text-lg ml-3 shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed mt-3 pt-3 border-t border-[#E2E8F0] dark:border-[#2A2A2A]">
                  {faq.r}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#3A7D44] rounded-2xl p-8 text-center text-white">
          <h2 className="font-display text-2xl font-bold mb-3">Prêt à commencer ?</h2>
          <p className="text-white/70 mb-6">
            Rejoignez Logezy gratuitement et trouvez votre logement idéal au Bénin.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register"
              className="bg-white text-[#3A7D44] font-bold px-6 py-3 rounded-btn hover:bg-[#EBF5ED] transition-colors inline-flex items-center gap-2 justify-center">
              Créer un compte gratuit <ArrowRight size={16} />
            </Link>
            <Link to="/annonces"
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-btn transition-colors inline-flex items-center gap-2 justify-center">
              Parcourir les annonces
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}