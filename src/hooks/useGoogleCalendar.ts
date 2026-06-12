import { useGoogleLogin } from '@react-oauth/google';
import { useState, useEffect } from 'react';

const TOKEN_KEY = 'google_calendar_token';
const EXPIRY_KEY = 'google_calendar_expiry';

function getStoredToken(): string | null {
  const t = localStorage.getItem(TOKEN_KEY);
  const exp = localStorage.getItem(EXPIRY_KEY);
  if (t && exp && Date.now() < parseInt(exp)) return t;
  return null;
}

export function useGoogleCalendar() {
  const [token, setToken] = useState<string | null>(getStoredToken);

  // Check for token in URL hash after redirect (implicit flow callback)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.slice(1));
      const accessToken = params.get('access_token');
      const expiresIn = params.get('expires_in');
      if (accessToken && expiresIn) {
        const expiry = Date.now() + (parseInt(expiresIn) * 1000);
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(EXPIRY_KEY, expiry.toString());
        setToken(accessToken);
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  const isConnected = !!token;

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar',
    flow: 'implicit',
    onSuccess: (res) => {
      const expiry = Date.now() + (res.expires_in * 1000);
      localStorage.setItem(TOKEN_KEY, res.access_token);
      localStorage.setItem(EXPIRY_KEY, expiry.toString());
      setToken(res.access_token);
    },
    onError: (err) => console.error('Google login error:', err),
  });

  function disconnect() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    setToken(null);
  }

  async function createEvent(event: {
    title: string;
    description?: string;
    start: string;
    end: string;
  }): Promise<{ error: string | null }> {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setToken(null);
      return { error: 'Reconecte o Google Calendar nas Configurações.' };
    }

    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: event.title,
        description: event.description,
        start: { dateTime: event.start, timeZone: 'America/Porto_Velho' },
        end: { dateTime: event.end, timeZone: 'America/Porto_Velho' },
      }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        disconnect();
        return { error: 'Token expirado. Reconecte o Google Calendar nas Configurações.' };
      }
      return { error: 'Erro ao criar evento no Google Calendar.' };
    }

    return { error: null };
  }

  return { isConnected, login, disconnect, createEvent };
}
