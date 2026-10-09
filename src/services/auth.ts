import { ApiError, api } from './api';

export interface AuthUser {
  id?: string | number;
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
}

export interface Session {
  token: string;
  user: AuthUser;
}

type Json = Record<string, unknown>;

const str = (v: unknown) => (typeof v === 'string' && v ? v : undefined);
const obj = (v: unknown) => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Json) : undefined);

/**
 * The success payload isn't documented yet, so accept the common Laravel shapes:
 * `{ token, user }`, `{ data: { token, driver } }`, `{ access_token, ... }`, etc.
 */
function parseSession(body: unknown, email: string): Session {
  const root = obj(body) ?? {};
  const data = obj(root.data) ?? root;

  const token =
    str(data.token) ?? str(data.access_token) ?? str(root.token) ?? str(root.access_token) ?? str(obj(data.token)?.plainTextToken);
  if (!token) throw new ApiError('Login succeeded but no access token was returned.', 200, body);

  const u = obj(data.driver) ?? obj(data.user) ?? obj(root.driver) ?? obj(root.user) ?? {};
  return {
    token,
    user: {
      id: (u.id as string | number | undefined) ?? undefined,
      email: str(u.email) ?? email,
      firstName: str(u.first_name) ?? str(u.firstName),
      middleName: str(u.middle_name) ?? str(u.middleName),
      lastName: str(u.last_name) ?? str(u.lastName),
      name: str(u.name) ?? str(u.full_name),
      phone: str(u.mobile_number) ?? str(u.mobile) ?? str(u.phone),
    },
  };
}

export async function login(email: string, password: string): Promise<Session> {
  const body = await api<unknown>('/driver/login', { method: 'POST', body: { email, password } });
  return parseSession(body, email);
}
