import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../lib/axios';
import useAuthStore from '../../store/authStore';

let publicConfigRequest;

function getPublicConfig() {
  if (!publicConfigRequest) {
    publicConfigRequest = api.get('/site/config')
      .then(({ data }) => data)
      .catch((error) => {
        publicConfigRequest = null;
        throw error;
      });
  }
  return publicConfigRequest;
}

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  throw new Error('Ce navigateur ne permet pas de générer un identifiant de visite sécurisé.');
}

export default function SiteRuntime() {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const lastTrackedPath = useRef(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    getPublicConfig()
      .then((data) => {
        if (active) {
          setMaintenanceMode(data.settings?.maintenance_mode === true);
          setAnalyticsEnabled(data.analytics_enabled === true);
        }
      })
      .catch((error) => {
        console.warn('Configuration du site momentanément indisponible.', error.message);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!analyticsEnabled || user?.role === 'admin' || lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    try {
      let sessionId = sessionStorage.getItem('logezy_analytics_session');
      if (!sessionId) {
        sessionId = createId();
        sessionStorage.setItem('logezy_analytics_session', sessionId);
      }

      api.post('/site/visits', {
        visit_id: createId(),
        session_id: sessionId,
        page_path: pathname,
      }).catch((error) => {
        console.warn('Cette visite n’a pas pu être comptabilisée.', error.message);
      });
    } catch (error) {
      console.warn('Le suivi anonyme des visites est indisponible.', error.message);
    }
  }, [analyticsEnabled, pathname, user?.role]);

  const isAdmin = user?.role === 'admin';
  const canReachAdminLogin = pathname === '/login' || pathname.startsWith('/auth/');
  if (!maintenanceMode || isAdmin || canReachAdminLogin) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-6 text-center text-white">
      <div className="max-w-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
          🛠️
        </div>
        <h1 className="mb-3 text-2xl font-bold">Maintenance en cours</h1>
        <p className="text-white/70">
          Logezy revient bientôt. Nous effectuons une intervention pour améliorer la plateforme.
        </p>
      </div>
    </div>
  );
}
