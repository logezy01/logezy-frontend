import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputs = useRef([]);

  const { userId, email } = location.state || {};

  useEffect(() => {
    if (!userId) { navigate('/register'); return; }
    inputs.current[0]?.focus();
  }, []);

  // Countdown pour renvoyer le code
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Uniquement des chiffres
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    // Auto-focus suivant
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      inputs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      toast.error('Entrez le code complet à 6 chiffres');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-email', {
        userId,
        code: fullCode,
      });
      login(res.data.user, res.data.token);
      toast.success('Email vérifié ! Bienvenue sur Logezy 🎉');
      switch (res.data.user.role) {
        case 'proprietaire': navigate('/dashboard/proprietaire'); break;
        case 'agent': navigate('/dashboard/agent'); break;
        default: navigate('/dashboard/locataire');
      }
    } catch (e) {
      toast.error(e.response?.data?.error || 'Code incorrect');
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-code', { userId });
      toast.success('Nouveau code envoyé ! Vérifiez votre email.');
      setCountdown(60);
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } catch (e) {
      toast.error('Erreur envoi code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-scale-in">

        {/* Logo */}
        <div className="text-center mb-10">
          <img src="/logo-light.png" alt="Logezy"
            style={{ height: 48, width: 'auto' }}
            className="object-contain mx-auto mb-6" />

          {/* Icône email */}
          <div className="w-20 h-20 bg-[#EBF5ED] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📧</span>
          </div>

          <h1 className="font-display text-2xl font-black text-[#0F172A] dark:text-white mb-2">
            Vérifiez votre email
          </h1>
          <p className="text-[#64748B] dark:text-[#94A3B8] text-sm">
            Nous avons envoyé un code à 6 chiffres à
          </p>
          <p className="font-bold text-[#3A7D44] text-sm mt-1">
            {email}
          </p>
        </div>

        {/* Inputs code */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={el => inputs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className={`w-12 h-14 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all bg-white dark:bg-[#1A1A1A] text-[#0F172A] dark:text-white ${
                digit
                  ? 'border-[#3A7D44] bg-[#EBF5ED] dark:bg-[#3A7D44]/20 text-[#3A7D44]'
                  : 'border-[#E8E8E8] dark:border-[#2A2A2A] focus:border-[#3A7D44]'
              }`}
            />
          ))}
        </div>

        {/* Bouton vérifier */}
        <button onClick={handleVerify} disabled={loading || code.join('').length !== 6}
          className="w-full bg-[#3A7D44] hover:bg-[#2D6235] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(58,125,68,0.3)] mb-4">
          {loading
            ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <>Vérifier mon email <ArrowRight size={18} /></>
          }
        </button>

        {/* Renvoyer le code */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-sm text-[#94A3B8]">
              Renvoyer le code dans <strong className="text-[#0F172A] dark:text-white">{countdown}s</strong>
            </p>
          ) : (
            <button onClick={handleResend} disabled={resending}
              className="flex items-center gap-2 text-sm text-[#3A7D44] font-bold hover:underline mx-auto">
              {resending
                ? <div className="w-4 h-4 border-2 border-[#3A7D44] border-t-transparent rounded-full animate-spin" />
                : <RefreshCw size={14} />
              }
              Renvoyer le code
            </button>
          )}
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          Mauvaise adresse ?{' '}
          <button onClick={() => navigate('/register')}
            className="text-[#3A7D44] font-bold hover:underline">
            Modifier
          </button>
        </p>
      </div>
    </div>
  );
}