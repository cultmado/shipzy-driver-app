// Thin fetch wrapper for the Shipzy API.

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'https://api-staging.shipzy.ph/api').replace(/\/$/, '');
const TIMEOUT_MS = 20_000;

export class ApiError extends Error {
  /** Laravel validation errors (`{ field: [messages] }`) when the API sent them. */
  get fieldErrors(): Record<string, string> {
    const errors = (this.body as { errors?: unknown } | undefined)?.errors;
    if (!errors || typeof errors !== 'object') return {};
    return Object.fromEntries(
      Object.entries(errors as Record<string, unknown>).map(([k, v]) => [k, String(Array.isArray(v) ? v[0] : v)]),
    );
  }

  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let authToken: string | null = null;

/** Set (or clear) the bearer token sent with every request. */
export function setAuthToken(token: string | null) {
  authToken = token;
}

/**
 * Pull a readable message out of an error body. The API answers failures with
 * `{ message, errors }`, where `errors` is a string or a Laravel-style field map.
 */
function errorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object') {
    const { message, errors } = body as { message?: unknown; errors?: unknown };
    if (typeof errors === 'string' && errors) return errors;
    if (errors && typeof errors === 'object') {
      const first = Object.values(errors as Record<string, unknown>).flat()[0];
      if (typeof first === 'string') return first;
    }
    if (typeof message === 'string' && message) return message;
  }
  return fallback;
}

export async function api<T>(
  path: string,
  options: { method?: string; body?: unknown; timeoutMs?: number } = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? TIMEOUT_MS);

  // FormData goes out as multipart (the browser sets the boundary); anything else as JSON.
  const isForm = options.body instanceof FormData;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.body !== undefined && !isForm) headers['Content-Type'] = 'application/json';
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : isForm ? (options.body as FormData) : JSON.stringify(options.body),
      signal: controller.signal,
    });
  } catch (e) {
    const timedOut = e instanceof DOMException && e.name === 'AbortError';
    throw new ApiError(
      timedOut ? 'The server took too long to respond. Please try again.' : 'Unable to connect. Check your internet connection.',
      0,
    );
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : undefined;
  } catch {
    body = text;
  }

  if (!res.ok) throw new ApiError(errorMessage(body, `Request failed (${res.status}).`), res.status, body);
  return body as T;
}
