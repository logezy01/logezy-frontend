import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/alerts/contact', form);
      toast.success('Message envoyé ! Nous vous répondrons sous 24h. 📧');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const contacts = [
    {
      icon: <Mail size={20} className="text-[#3A7D44]" />,
      label: 'Email',
      value: 'miraclelohounme@gmail.com',
      link: 'mailto:miraclelohounme@gmail.com'
    },
    {
      icon: <Phone size={20} className="text-[#3A7D44]" />,
      label: 'Téléphone',
      value: '+229 01 90 82 12 82',
      link: 'tel:+2290190821282'
    },
    {
      icon: <MessageSquare size={20} className="text-[#3A7D44]" />,
      label: 'WhatsApp',
      value: '+229 01 90 82 12 82',
      link: 'https://wa.me/2290190821282'
    },
    {
      icon: <MapPin size={20} className="text-[#3A7D44]" />,
      label: 'Adresse',
      value: 'Cotonou, Bénin',
      link: null
    },
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
          <h1 className="font-display text-4xl font-black mb-4">Contactez-nous</h1>
          <p className="text-white/80 text-lg">
            Une question ? Un problème ? Notre équipe est là pour vous aider.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Infos contact */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-[#0F172A] dark:text-white text-xl mb-4">
              Nos coordonnées
            </h2>

            {contacts.map((contact, i) => (
              <div key={i} className="card p-4 flex items-center gap-3 animate-slide-up">
                <div className="w-10 h-10 bg-[#EBF5ED] rounded-xl flex items-center justify-center shrink-0">
                  {contact.icon}
                </div>
                <div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{contact.label}</div>
                  {contact.link ? (
                    <a href={contact.link}
                      className="text-sm font-bold text-[#0F172A] dark:text-white hover:text-[#3A7D44] transition-colors">
                      {contact.value}
                    </a>
                  ) : (
                    <div className="text-sm font-bold text-[#0F172A] dark:text-white">{contact.value}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Horaires */}
            <div className="card p-4 animate-slide-up">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={18} className="text-[#3A7D44]" />
                <span className="font-bold text-sm text-[#0F172A] dark:text-white">Horaires</span>
              </div>
              <div className="space-y-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
                <div className="flex justify-between">
                  <span>Lun — Ven</span>
                  <span className="font-medium">8h — 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span className="font-medium">9h — 15h</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span className="font-medium text-red-400">Fermé</span>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="card p-4 animate-slide-up">
              <h3 className="font-bold text-sm text-[#0F172A] dark:text-white mb-3">
                📱 Réseaux sociaux
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Facebook', value: 'Logezy Immobilier Digitale', link: 'https://www.facebook.com/profile.php?id=logezyimmobilierdigitale' },
{ label: 'Instagram', value: '@logezy_benin', link: 'https://instagram.com' },
                ].map((social, i) => (
                  <a key={i} href={social.link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between text-sm hover:text-[#3A7D44] transition-colors">
                    <span className="text-[#64748B] dark:text-[#94A3B8]">{social.label}</span>
                    <span className="font-medium text-[#0F172A] dark:text-white">{social.value}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="md:col-span-2">
            <div className="card p-6 animate-scale-in">
              <h2 className="font-display font-bold text-[#0F172A] dark:text-white text-xl mb-2">
                Envoyer un message
              </h2>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-6">
                📧 Votre message sera envoyé directement à notre équipe.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      placeholder="Jean Dupont"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">
                    Sujet *
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Choisir un sujet</option>
                    <option value="Problème avec une annonce">Problème avec une annonce</option>
                    <option value="Problème de compte">Problème de compte</option>
                    <option value="Question sur les paiements">Question sur les paiements</option>
                    <option value="Signalement d'une arnaque">Signaler une arnaque</option>
                    <option value="Proposition de partenariat">Proposition de partenariat</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#334155] dark:text-[#94A3B8] mb-2">
                    Message *
                  </label>
                  <textarea
                    placeholder="Décrivez votre demande en détail..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field min-h-[150px] resize-none"
                    rows={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      Envoyer le message
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-[#94A3B8]">
                  Nous répondons généralement sous 24 heures ouvrables.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}