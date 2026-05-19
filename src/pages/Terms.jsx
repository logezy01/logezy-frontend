import { Link } from 'react-router-dom';
import { ChevronLeft, FileText } from 'lucide-react';
import Navbar from '../components/common/Navbar';

export default function Terms() {
  const sections = [
    {
      title: '1. Acceptation des conditions',
      content: `En utilisant Logezy, vous acceptez les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.

Ces conditions s'appliquent à tous les utilisateurs de Logezy, qu'ils soient locataires, propriétaires, agents immobiliers ou administrateurs.`
    },
    {
      title: '2. Description du service',
      content: `Logezy est une plateforme immobilière en ligne permettant :

- Aux propriétaires et agents de publier des annonces immobilières
- Aux locataires et acheteurs de rechercher des biens immobiliers
- À tous les utilisateurs de communiquer via notre messagerie intégrée
- De faciliter les transactions immobilières au Bénin

Logezy n'est pas une agence immobilière et n'est pas partie aux transactions entre utilisateurs.`
    },
    {
      title: '3. Création de compte',
      content: `Pour utiliser certaines fonctionnalités de Logezy, vous devez créer un compte. Vous vous engagez à :

- Fournir des informations exactes et complètes lors de l'inscription
- Maintenir la confidentialité de vos identifiants de connexion
- Notifier immédiatement Logezy de toute utilisation non autorisée de votre compte
- Ne pas créer plusieurs comptes pour le même utilisateur
- Être âgé d'au moins 18 ans pour utiliser la plateforme`
    },
    {
      title: '4. Publication d\'annonces',
      content: `En publiant une annonce sur Logezy, vous vous engagez à :

- Être propriétaire du bien ou avoir l'autorisation de le publier
- Fournir des informations exactes sur le bien (superficie, prix, équipements)
- Utiliser des photos authentiques du bien
- Mettre à jour le statut de l'annonce (disponible/loué/vendu)
- Ne pas publier de fausses annonces ou des arnaques

Logezy se réserve le droit de supprimer toute annonce ne respectant pas ces règles.`
    },
    {
      title: '5. Comportement des utilisateurs',
      content: `Les utilisateurs de Logezy s'engagent à ne pas :

- Publier des contenus illégaux, offensants ou frauduleux
- Harceler ou menacer d'autres utilisateurs
- Utiliser la plateforme à des fins commerciales non autorisées
- Tenter de contourner les systèmes de sécurité
- Collecter les données d'autres utilisateurs sans autorisation
- Publier des annonces discriminatoires basées sur l'origine, la religion ou toute autre caractéristique`
    },
    {
      title: '6. Responsabilités',
      content: `Logezy agit comme intermédiaire entre propriétaires et locataires. En conséquence :

- Logezy n'est pas responsable de l'exactitude des annonces publiées
- Logezy n'est pas responsable des transactions entre utilisateurs
- Logezy n'est pas responsable des dommages liés à l'utilisation de la plateforme
- Les utilisateurs sont seuls responsables de leurs interactions et transactions

Nous recommandons de toujours visiter physiquement un bien avant tout paiement.`
    },
    {
      title: '7. Propriété intellectuelle',
      content: `Tout le contenu de Logezy (logo, design, code, textes) est protégé par les droits de propriété intellectuelle.

Les utilisateurs conservent la propriété des contenus qu'ils publient (photos, descriptions) mais accordent à Logezy une licence d'utilisation pour afficher ces contenus sur la plateforme.

Il est interdit de copier, reproduire ou distribuer le contenu de Logezy sans autorisation préalable.`
    },
    {
      title: '8. Modification et résiliation',
      content: `Logezy se réserve le droit de :

- Modifier ces conditions d'utilisation à tout moment
- Suspendre ou supprimer un compte ne respectant pas ces conditions
- Interrompre temporairement le service pour maintenance
- Faire évoluer les fonctionnalités de la plateforme

Les utilisateurs seront notifiés des modifications importantes par email.`
    },
    {
      title: '9. Droit applicable',
      content: `Les présentes conditions d'utilisation sont régies par le droit béninois.

Tout litige relatif à l'utilisation de Logezy sera soumis à la compétence exclusive des tribunaux de Cotonou, République du Bénin.

Pour toute question juridique, contactez-nous à : legal@logezy.bj`
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0F0F0F] pb-20 md:pb-0">
      <Navbar />

      {/* Header */}
      <div className="bg-[#3A7D44] text-white py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ChevronLeft size={16} /> Retour à l'accueil
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">Conditions d'utilisation</h1>
              <p className="text-white/60 text-sm">Dernière mise à jour : Mai 2026</p>
            </div>
          </div>
          <p className="text-white/70 leading-relaxed">
            Veuillez lire attentivement ces conditions avant d'utiliser Logezy.
            En utilisant notre plateforme, vous acceptez ces conditions.
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        {sections.map((section, i) => (
          <div key={i} className="card p-6 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <h2 className="font-display font-bold text-[#0F172A] dark:text-white text-lg mb-4">
              {section.title}
            </h2>
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
          </div>
        ))}

        {/* Contact */}
        <div className="card p-6 bg-[#EBF5ED] border-[#3A7D44]/20">
          <h2 className="font-display font-bold text-[#3A7D44] mb-2">📬 Questions ?</h2>
          <p className="text-sm text-[#334155] leading-relaxed">
            Pour toute question sur ces conditions d'utilisation :
          </p>
          <div className="mt-3 space-y-1 text-sm">
            <p>📧 <strong>Email :</strong> legal@logezy.bj</p>
            <p>📍 <strong>Adresse :</strong> Cotonou, République du Bénin</p>
          </div>
          <div className="flex gap-3 mt-4">
            <Link to="/contact" className="btn-primary text-sm px-4 py-2">
              Nous contacter
            </Link>
            <Link to="/confidentialite" className="btn-secondary text-sm px-4 py-2">
              Politique de confidentialité
            </Link>
          </div>
        </div>

        <div className="text-center text-xs text-[#94A3B8] pb-4">
          © 2026 Logezy — Tous droits réservés 🇧🇯
        </div>
      </div>
    </div>
  );
}