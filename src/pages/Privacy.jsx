import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Mail, ChevronLeft } from 'lucide-react';
import Navbar from '../components/common/Navbar';

export default function Privacy() {
  const sections = [
    {
      icon: <Database size={20} className="text-[#2D3A8C]" />,
      title: '1. Données collectées',
      content: `Logezy collecte les informations suivantes lors de votre inscription et utilisation de la plateforme :
      
- Informations d'identité : nom complet, adresse email, numéro de téléphone
- Informations de profil : type de compte (locataire, propriétaire, agent)
- Données d'annonces : titre, description, photos, localisation, prix
- Données de communication : messages échangés entre utilisateurs
- Données techniques : adresse IP, type de navigateur, pages visitées
- Données de transaction : historique des paiements (à venir)`
    },
    {
      icon: <Eye size={20} className="text-[#2D3A8C]" />,
      title: '2. Utilisation des données',
      content: `Vos données personnelles sont utilisées pour :

- Créer et gérer votre compte utilisateur
- Publier et gérer vos annonces immobilières
- Faciliter la communication entre propriétaires et locataires
- Améliorer nos services et personnaliser votre expérience
- Envoyer des notifications importantes concernant votre compte
- Prévenir la fraude et assurer la sécurité de la plateforme
- Respecter nos obligations légales au Bénin`
    },
    {
      icon: <Lock size={20} className="text-[#2D3A8C]" />,
      title: '3. Protection des données',
      content: `Logezy met en œuvre des mesures de sécurité strictes :

- Chiffrement SSL/TLS pour toutes les transmissions de données
- Hachage bcrypt pour les mots de passe (jamais stockés en clair)
- Tokens JWT sécurisés pour l'authentification
- Accès limité aux données selon le principe du moindre privilège
- Sauvegardes régulières et sécurisées via Supabase
- Surveillance continue des accès suspects`
    },
    {
      icon: <Shield size={20} className="text-[#2D3A8C]" />,
      title: '4. Vos droits',
      content: `Conformément aux lois en vigueur, vous disposez des droits suivants :

- Droit d'accès : consulter toutes vos données personnelles
- Droit de rectification : corriger vos informations inexactes
- Droit à l'effacement : demander la suppression de votre compte
- Droit d'opposition : refuser certains traitements de vos données
- Droit à la portabilité : exporter vos données dans un format standard
- Droit de retrait : retirer votre consentement à tout moment

Pour exercer ces droits, contactez-nous à : privacy@logezy.bj`
    },
    {
      icon: <Mail size={20} className="text-[#2D3A8C]" />,
      title: '5. Partage des données',
      content: `Logezy ne vend jamais vos données personnelles à des tiers.
      
Vos données peuvent être partagées uniquement dans ces cas :

- Avec les autres utilisateurs : vos annonces et informations de contact sont visibles selon vos paramètres
- Avec nos prestataires techniques : Supabase (hébergement), Render (serveur), Vercel (frontend)
- Sur obligation légale : si requis par les autorités béninoises compétentes
- Avec votre consentement explicite pour tout autre partage`
    },
    {
      icon: <Database size={20} className="text-[#2D3A8C]" />,
      title: '6. Cookies',
      content: `Logezy utilise des cookies et données de stockage local pour :

- Maintenir votre session de connexion (token JWT)
- Mémoriser vos préférences (thème, langue, notifications)
- Analyser l'utilisation de la plateforme (données anonymisées)

Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, mais cela pourrait affecter le fonctionnement de la plateforme.`
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-20 md:pb-0">
      <Navbar />

      {/* Header */}
      <div className="bg-[#2D3A8C] text-white py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ChevronLeft size={16} /> Retour à l'accueil
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">Politique de confidentialité</h1>
              <p className="text-white/60 text-sm">Dernière mise à jour : Mai 2026</p>
            </div>
          </div>
          <p className="text-white/70 leading-relaxed">
            Chez Logezy, la protection de vos données personnelles est une priorité absolue.
            Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {sections.map((section, i) => (
          <div key={i} className="card p-6 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#EEF0FB] rounded-xl flex items-center justify-center">
                {section.icon}
              </div>
              <h2 className="font-display font-bold text-[#0F172A] text-lg">{section.title}</h2>
            </div>
            <div className="text-sm text-[#64748B] leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
          </div>
        ))}

        {/* Contact */}
        <div className="card p-6 bg-[#EEF0FB] border-[#2D3A8C]/20">
          <h2 className="font-display font-bold text-[#2D3A8C] mb-2">📬 Nous contacter</h2>
          <p className="text-sm text-[#334155] leading-relaxed">
            Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
          </p>
          <div className="mt-3 space-y-1 text-sm">
            <p>📧 <strong>Email :</strong> privacy@logezy.bj</p>
            <p>📍 <strong>Adresse :</strong> Cotonou, République du Bénin</p>
            <p>📞 <strong>Téléphone :</strong> +229 97 00 00 00</p>
          </div>
        </div>

        <div className="text-center text-xs text-[#94A3B8] pb-4">
          © 2026 Logezy — Tous droits réservés 🇧🇯
        </div>
      </div>
    </div>
  );
}