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

        // Nouveau utilisateur → page de choix du rôle
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

        // Utilisateur existant → connexion directe
        login(res.data.user, res.data.token);
        toast.success(`Compte déjà existant ! Connexion automatique 👋`); 

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
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#3A7D44] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-[#0F172A]">
          Connexion en cours...
        </h2>
        <p className="text-[#64748B] text-sm mt-2">
          Veuillez patienter
        </p>
      </div>
    </div>
  );
}