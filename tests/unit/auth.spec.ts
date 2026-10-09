import { ApiError } from '@/services/api'
import { login } from '@/services/auth'
import { afterEach, describe, expect, test, vi } from 'vitest'

function mockFetch(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => vi.unstubAllGlobals())

describe('login service', () => {
  test('posts email and password to /driver/login', async () => {
    const fetchMock = mockFetch(200, { token: 'abc', user: { email: 'ken@shipzy.ph' } })
    await login('ken@shipzy.ph', 'secret123')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api-staging.shipzy.ph/api/driver/login')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ email: 'ken@shipzy.ph', password: 'secret123' })
  })

  test('reads token and driver from a nested data payload', async () => {
    mockFetch(200, {
      message: 'Login successful.',
      data: { access_token: 'tok-1', driver: { id: 7, first_name: 'Ken', last_name: 'Barchita', email: 'ken@shipzy.ph' } },
    })
    const s = await login('ken@shipzy.ph', 'secret123')
    expect(s.token).toBe('tok-1')
    expect(s.user).toMatchObject({ id: 7, firstName: 'Ken', lastName: 'Barchita' })
  })

  test('surfaces the API error message', async () => {
    mockFetch(500, { message: 'Login failed.', errors: 'The provided credentials are incorrect.' })
    await expect(login('x@y.z', 'nope')).rejects.toThrow('The provided credentials are incorrect.')
  })

  test('handles Laravel field-error maps', async () => {
    mockFetch(422, { message: 'Invalid.', errors: { email: ['The email field is required.'] } })
    await expect(login('', '')).rejects.toThrow('The email field is required.')
  })

  test('fails clearly when no token is returned', async () => {
    mockFetch(200, { message: 'ok' })
    await expect(login('x@y.z', 'pw')).rejects.toBeInstanceOf(ApiError)
  })

  test('reports network failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(login('x@y.z', 'pw')).rejects.toThrow('Unable to connect')
  })
})
