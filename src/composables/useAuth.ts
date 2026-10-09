import { computed, ref } from 'vue';
import { setAuthToken } from '@/services/api';
import { login as loginRequest, type Session } from '@/services/auth';
import { useStore } from './useStore';

const KEY = 'shipzy.session';

// "Remember me" keeps the session in localStorage; otherwise it lasts until the app/tab closes.
function read(): Session | null {
  for (const storage of [localStorage, sessionStorage]) {
    try {
      const raw = storage.getItem(KEY);
      if (raw) return JSON.parse(raw) as Session;
    } catch {
      /* storage unavailable or corrupt */
    }
  }
  return null;
}

function write(session: Session | null, remember = false) {
  for (const storage of [localStorage, sessionStorage]) {
    try {
      storage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }
  if (!session) return;
  try {
    (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(session));
  } catch {
    /* session still works in memory */
  }
}

const session = ref<Session | null>(read());
setAuthToken(session.value?.token ?? null);
applyUser(session.value);

/** Copy what the API told us about the driver into the profile shown in the app. */
function applyUser(s: Session | null) {
  if (!s) return;
  const { driver } = useStore();
  const u = s.user;
  const [first, ...rest] = (u.name ?? '').split(' ').filter(Boolean);
  driver.email = u.email;
  driver.firstName = u.firstName ?? first ?? driver.firstName;
  driver.lastName = u.lastName ?? (rest.length ? rest.join(' ') : driver.lastName);
  if (u.middleName) driver.middleName = u.middleName;
  if (u.phone) driver.mobile = u.phone.replace(/^\+?63\s?/, '');
  driver.initials = `${driver.firstName[0] ?? ''}${driver.lastName[0] ?? ''}`.toUpperCase();
}

export const isAuthenticated = () => !!session.value;

export function useAuth() {
  async function login(email: string, password: string, remember: boolean) {
    const s = await loginRequest(email, password);
    session.value = s;
    setAuthToken(s.token);
    write(s, remember);
    applyUser(s);
  }

  function logout() {
    session.value = null;
    setAuthToken(null);
    write(null);
  }

  return {
    session,
    user: computed(() => session.value?.user),
    isAuthenticated: computed(() => !!session.value),
    login,
    logout,
  };
}
