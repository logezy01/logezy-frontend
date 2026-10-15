import api from './axios';

const SESSION_STORAGE_KEY = 'logezy_authenticated_session';
let currentStartPromise = null;
let currentStartId = null;

function createSessionId() {
  if (typeof crypto === 'undefined' || !crypto.randomUUID) {
    throw new Error('Ce navigateur ne permet pas de générer un identifiant de session sécurisé.');
  }
  return crypto.randomUUID();
}

function getOrCreateSessionId(forceNew = false) {
  let sessionId = forceNew ? null : sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = createSessionId();
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
}

export function startUserSession(forceNew = false) {
  const token = localStorage.getItem('logezy_token');
  if (!token) return Promise.resolve(null);

  let sessionId;
  try {
    sessionId = getOrCreateSessionId(forceNew);
  } catch (error) {
    return Promise.reject(error);
  }

  if (currentStartPromise && currentStartId === sessionId) return currentStartPromise;

  currentStartId = sessionId;
  currentStartPromise = api.post('/site/sessions/start', { session_id: sessionId }, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(() => sessionId)
    .catch((error) => {
      currentStartPromise = null;
      currentStartId = null;
      throw error;
    });

  return currentStartPromise;
}

export async function sendSessionHeartbeat(sessionId) {
  const token = localStorage.getItem('logezy_token');
  if (!token || !sessionId) return;
  await api.post('/site/sessions/heartbeat', { session_id: sessionId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function endUserSession() {
  let sessionId;
  try {
    sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
  } catch (error) {
    return Promise.reject(error);
  }
  if (!sessionId) return Promise.resolve();

  const token = localStorage.getItem('logezy_token');
  const finish = async () => {
    if (!token) return;
    await api.post('/site/sessions/end', { session_id: sessionId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const pendingStart = currentStartId === sessionId ? currentStartPromise : null;
  const result = (pendingStart ? pendingStart.catch(() => null) : Promise.resolve())
    .then(finish)
    .finally(() => {
      try {
        if (sessionStorage.getItem(SESSION_STORAGE_KEY) === sessionId) {
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch (error) {
        console.warn('Impossible de supprimer l’identifiant temporaire de session.', error.message);
      }
      if (currentStartId === sessionId) {
        currentStartId = null;
        currentStartPromise = null;
      }
    });

  return result;
}
