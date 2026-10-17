import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../store/authStore';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { CountrySelect } from '../../components/common/CountrySelect';
import { requestBrowserCoordinates } from '../../lib/location';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [countryRequired, setCountryRequired] = useState(false);
  const [fallbackCountry, setFallbackCountry] = useState('BJ');
  const [loading, setLoading] = useState(true);

  const completeGoogleLogin = useCallback(async (manualCountryCode = null) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Erreur de connexion Google');
        navigate('/login');
        return;
      }
      const googleData = {
        access_token: session.access_token,
      };
      const coordinates = manualCountryCode ? null : await requestBrowserCoordinates();
      const res = await api.post('/auth/google', {
        ...googleData,
        ...(coordinates || {}),
        ...(manualCountryCode ? { country_code: manualCountryCode } : {}),
      });
      if (res.data.new_user) {
        navigate('/auth/complete', {
          state: {
            access_token: session.access_token,
            email: res.data.email,
            full_name: res.data.full_name,
            avatar_url: res.data.avatar_url,
            country_code: res.data.country_code,
          }
        });
        return;
      }
      login(res.data.user, res.data.token);
      toast.success(`Bienvenue ${res.data.user.full_name} ! 👋`);
      switch (res.data.user.role) {
        case 'proprietaire': navigate('/dashboard/proprietaire'); break;
        case 'agent': navigate('/dashboard/agent'); break;
        case 'admin': navigate('/dashboard/admin'); break;
        default: navigate('/dashboard/locataire');
      }
    } catch (error) {
      if (error.response?.data?.code === 'COUNTRY_REQUIRED') {
        setCountryRequired(true);
        toast('Choisissez votre pays pour terminer la connexion Google.');
      } else {
        toast.error(error.response?.data?.error || 'Erreur lors de la connexion');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [login, navigate]);

  useEffect(() => {
    const timeout = window.setTimeout(() => completeGoogleLogin(), 0);
    return () => window.clearTimeout(timeout);
  }, [completeGoogleLogin]);

  if (countryRequired) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0F172A] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] p-6">
          <h1 className="font-display text-xl font-bold text-[#0F172A] dark:text-white">
            Confirmez votre pays
          </h1>
          <p className="my-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
            La position n’a pas pu être détectée automatiquement. Le Bénin est proposé par défaut.
          </p>
          <CountrySelect value={fallbackCountry} onChange={setFallbackCountry} className="input-field" required />
          <button
            type="button"
            onClick={() => completeGoogleLogin(fallbackCountry)}
            disabled={loading || !fallbackCountry}
            className="btn-primary mt-4 w-full"
          >
            {loading ? 'Connexion...' : 'Continuer'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] flex items-center justify-center">
      <div className="text-center animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-[#EBF5ED] flex items-center justify-center mx-auto mb-6">
          <div className="w-10 h-10 border-3 border-[#3A7D44] border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
        </div>
        <img src="/logo-light.png" alt="Logezy"
          style={{ height: 36, width: 'auto' }}
          className="object-contain mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-[#0F172A] dark:text-white mb-2">
          Connexion en cours...
        </h2>
        <p className="text-[#64748B] dark:text-[#94A3B8] text-sm">
          Veuillez patienter quelques secondes
        </p>
      </div>
    </div>
  );
}