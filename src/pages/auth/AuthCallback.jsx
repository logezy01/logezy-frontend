import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../store/authStore';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error('Erreur de connexion Google');
          navigate('/login');
          return;
        }
        const googleUser = session.user;
        const res = await api.post('/auth/google', {
          email: googleUser.email,
          full_name: googleUser.user_metadata?.full_name || googleUser.email,
          avatar_url: googleUser.user_metadata?.avatar_url || null,
          google_id: googleUser.id,
        });
        if (res.data.new_user) {
          navigate('/auth/complete', {
            state: {
              email: googleUser.email,
              full_name: googleUser.user_metadata?.full_name || googleUser.email,
              avatar_url: googleUser.user_metadata?.avatar_url || null,
              google_id: googleUser.id,
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
      } catch (e) {
        toast.error('Erreur lors de la connexion');
        navigate('/login');
      }
    };
    handleCallback();
  }, []);

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