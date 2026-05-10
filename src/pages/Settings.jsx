import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Bell, Lock, User, Trash2, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import useAuthStore from '../store/authStore';
import api from '../lib/axios';
import useThemeStore from '../store/themeStore';

export default function Settings() {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const themeStore = useThemeStore();

  const [theme, setTheme] = useState(localStorage.getItem('logezy_theme') || 'light');
  const [notifications, setNotifications] = useState({
    messages: localStorage.getItem('notif_messages') !== 'false',
    annonces: localStorage.getItem('notif_annonces') !== 'false',
    email: localStorage.getItem('notif_email') !== 'false',
  });
  const [language, setLanguage] = useState(localStorage.getItem('logezy_lang') || 'fr');
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });
  const [passwords, setPasswords] = useState({
    current: '', new: '', confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('profil');

  const handleTheme = (t) => {
    setTheme(t);
    themeStore.setTheme(t);
    toast.success(`Thème ${t === 'dark' ? '🌙 sombre' : '☀️ clair'} activé`);
  };

  const handleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem(`notif_${key}`, updated[key].toString());
    toast.success('Préférences mises à jour');
  };

  const handleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('logezy_lang', lang);
    toast.success(`Langue changée en ${lang === 'fr' ? 'Français' : 'English'}`);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', profileForm);
      updateUser(profileForm);
      toast.success('Profil mis à jour !');
      setEditProfile(false);
    } catch (e) {
      toast.error('Erreur mise à jour profil');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      toast.error('Fonctionnalité bientôt disponible');
    }
  };

  const SECTIONS = [
    { id: 'profil', icon: '👤', label: 'Profil' },
    { id: 'apparence', icon: '🎨', label: 'Apparence' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'langue', icon: '🌍', label: 'Langue' },
    { id: 'securite', icon: '🔒', label: 'Sécurité' },
    { id: 'compte', icon: '⚙️', label: 'Compte' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-20 md:pb-0">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6 animate-fade-in">
          <h1 className="font-display text-2xl font-bold text-[#0F172A]">Paramètres</h1>
          <p className="text-[#64748B] text-sm mt-1">Gérez vos préférences et votre compte</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* Sidebar */}
          <div className="card p-2 h-fit animate-slide-up">
            {SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-[#EEF0FB] text-[#2D3A8C] font-bold'
                    : 'text-[#334155] hover:bg-[#F5F5F7]'
                }`}
              >
                <span>{section.icon}</span>
                {section.label}
                {activeSection === section.id && (
                  <ChevronRight size={14} className="ml-auto text-[#2D3A8C]" />
                )}
              </button>
            ))}
          </div>

          {/* Contenu */}
          <div className="md:col-span-3 space-y-4 animate-scale-in">

            {/* PROFIL */}
            {activeSection === 'profil' && (
              <div className="card p-6">
                <h2 className="font-display font-bold text-[#0F172A] mb-4">Mon profil</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-[#F5F5F7] rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-[#2D3A8C] text-white flex items-center justify-center font-display font-black text-2xl">
                    {user?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A]">{user?.full_name}</div>
                    <div className="text-sm text-[#64748B]">{user?.email}</div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#EEF0FB] text-[#2D3A8C] capitalize mt-1 inline-block">
                      {user?.role}
                    </span>
                  </div>
                </div>

                {!editProfile ? (
                  <div className="space-y-3">
                    {[
                      { label: 'Nom complet', value: user?.full_name },
                      { label: 'Email', value: user?.email },
                      { label: 'Téléphone', value: user?.phone || 'Non renseigné' },
                      { label: 'Rôle', value: user?.role },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-[#E2E8F0] last:border-0">
                        <span className="text-sm text-[#64748B]">{item.label}</span>
                        <span className="text-sm font-medium text-[#0F172A] capitalize">{item.value}</span>
                      </div>
                    ))}
                    <button
                      onClick={() => setEditProfile(true)}
                      className="btn-primary w-full mt-4"
                    >
                      ✏️ Modifier le profil
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-2">Nom complet</label>
                      <input
                        type="text"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="input-field"
                        placeholder="+229 97 00 00 00"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSaveProfile} disabled={loading} className="btn-primary flex-1">
                        {loading ? 'Sauvegarde...' : '✅ Sauvegarder'}
                      </button>
                      <button onClick={() => setEditProfile(false)} className="btn-secondary flex-1">
                        Annuler
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* APPARENCE */}
            {activeSection === 'apparence' && (
              <div className="card p-6">
                <h2 className="font-display font-bold text-[#0F172A] mb-4">Apparence</h2>
                <p className="text-sm text-[#64748B] mb-6">Choisissez le thème qui vous convient</p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'light', label: '☀️ Thème clair', desc: 'Interface lumineuse', icon: <Sun size={24} className="text-[#F59E0B]" /> },
                    { value: 'dark', label: '🌙 Thème sombre', desc: 'Interface sombre', icon: <Moon size={24} className="text-[#6366F1]" /> },
                  ].map(t => (
                    <button
                      key={t.value}
                      onClick={() => handleTheme(t.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        theme === t.value
                          ? 'border-[#2D3A8C] bg-[#EEF0FB]'
                          : 'border-[#E2E8F0] hover:border-[#2D3A8C]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        {t.icon}
                        {theme === t.value && <Check size={16} className="text-[#2D3A8C]" />}
                      </div>
                      <div className="font-bold text-sm text-[#0F172A]">{t.label}</div>
                      <div className="text-xs text-[#64748B]">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === 'notifications' && (
              <div className="card p-6">
                <h2 className="font-display font-bold text-[#0F172A] mb-4">Notifications</h2>
                <p className="text-sm text-[#64748B] mb-6">Gérez vos préférences de notifications</p>

                <div className="space-y-4">
                  {[
                    { key: 'messages', label: 'Messages', desc: 'Recevoir une notification pour chaque nouveau message', emoji: '💬' },
                    { key: 'annonces', label: 'Nouvelles annonces', desc: 'Être alerté des nouvelles annonces correspondant à vos critères', emoji: '🏠' },
                    { key: 'email', label: 'Notifications par email', desc: 'Recevoir un résumé hebdomadaire par email', emoji: '📧' },
                  ].map(notif => (
                    <div key={notif.key} className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{notif.emoji}</span>
                        <div>
                          <div className="font-medium text-sm text-[#0F172A]">{notif.label}</div>
                          <div className="text-xs text-[#64748B] mt-0.5">{notif.desc}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotification(notif.key)}
                        className={`relative w-12 h-6 rounded-full transition-all ${
                          notifications[notif.key] ? 'bg-[#2D3A8C]' : 'bg-[#CBD5E1]'
                        }`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                          notifications[notif.key] ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LANGUE */}
            {activeSection === 'langue' && (
              <div className="card p-6">
                <h2 className="font-display font-bold text-[#0F172A] mb-4">Langue</h2>
                <p className="text-sm text-[#64748B] mb-6">Choisissez votre langue préférée</p>

                <div className="space-y-3">
                  {[
                    { value: 'fr', label: '🇫🇷 Français', desc: 'Interface en français' },
                    { value: 'en', label: '🇬🇧 English', desc: 'Interface en anglais (bientôt disponible)' },
                  ].map(lang => (
                    <button
                      key={lang.value}
                      onClick={() => handleLanguage(lang.value)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        language === lang.value
                          ? 'border-[#2D3A8C] bg-[#EEF0FB]'
                          : 'border-[#E2E8F0] hover:border-[#2D3A8C]/30'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-bold text-sm text-[#0F172A]">{lang.label}</div>
                        <div className="text-xs text-[#64748B]">{lang.desc}</div>
                      </div>
                      {language === lang.value && <Check size={18} className="text-[#2D3A8C]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SÉCURITÉ */}
            {activeSection === 'securite' && (
              <div className="card p-6">
                <h2 className="font-display font-bold text-[#0F172A] mb-4">Sécurité</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-[#EEF0FB] rounded-xl flex items-start gap-3">
                    <Lock size={20} className="text-[#2D3A8C] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm text-[#2D3A8C]">Compte sécurisé</div>
                      <div className="text-xs text-[#64748B] mt-0.5">Votre compte est protégé par un mot de passe chiffré</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-2">Mot de passe actuel</label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="input-field"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-2">Nouveau mot de passe</label>
                    <input
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="input-field"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-2">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="input-field"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    onClick={() => toast.success('Fonctionnalité bientôt disponible')}
                    className="btn-primary w-full"
                  >
                    🔒 Changer le mot de passe
                  </button>
                </div>
              </div>
            )}

            {/* COMPTE */}
            {activeSection === 'compte' && (
              <div className="space-y-4">
                <div className="card p-6">
                  <h2 className="font-display font-bold text-[#0F172A] mb-4">Gestion du compte</h2>

                  <div className="space-y-3">
                    <div className="p-4 bg-[#F5F5F7] rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-[#0F172A]">Statut du compte</div>
                        <div className="text-xs text-[#64748B] mt-0.5">Votre compte est actif</div>
                      </div>
                      <span className="bg-[#EEF0FB] text-[#2D3A8C] text-xs font-bold px-3 py-1 rounded-full">
                        ✅ Actif
                      </span>
                    </div>

                    <div className="p-4 bg-[#F5F5F7] rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-[#0F172A]">Membre depuis</div>
                        <div className="text-xs text-[#64748B] mt-0.5">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card p-6 border-red-100">
                  <h3 className="font-display font-bold text-red-500 mb-3">Zone dangereuse</h3>
                  <p className="text-sm text-[#64748B] mb-4">
                    La suppression de votre compte est irréversible. Toutes vos données seront perdues.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 px-4 py-2 rounded-btn border-2 border-red-200 text-red-500 hover:bg-red-50 text-sm font-bold transition-all"
                  >
                    <Trash2 size={16} />
                    Supprimer mon compte
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}