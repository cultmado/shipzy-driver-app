import { ApiError } from '@/services/api'
import { getLicenseTypes, getVehicleOptions } from '@/services/references'
import { registerDriver, type RegisterPayload } from '@/services/register'
import { afterEach, describe, expect, test, vi } from 'vitest'

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status })

afterEach(() => vi.unstubAllGlobals())

const file = (name: string) => new File(['x'], name, { type: 'image/png' })

const payload: RegisterPayload = {
  email: 'juan@example.com',
  password: 'Password123!',
  password_confirmation: 'Password123!',
  first_name: 'Juan',
  middle_name: '',
  last_name: 'Dela Cruz',
  birth_date: '1995-05-15',
  gender: '1',
  mobile_number: '09171234567',
  gcash_same_with_mobile: '1',
  street: '123 Main Street',
  country_code: 'PH',
  province_code: '0128',
  city_code: '012801',
  barangay_code: '012801001',
  zip_code: '2428',
  vehicle_option: '1',
  vehicle_model: 'Toyota Vios 2024',
  plate_number: 'ABC1234',
  or_cr_number: 'OR123456789',
  date_of_registration: '2025-01-15',
  license_type: '2',
  license_number: 'N01-23-456789',
  license_file: file('license.png'),
  or_cr_file: file('orcr.png'),
  nbi_clearance: file('clearance.png'),
  selfie: file('selfie.png'),
  vehicle_front: file('front.png'),
  vehicle_back: file('back.png'),
  vehicle_picture: file('whole.png'),
}

describe('registerDriver', () => {
  test('sends multipart form data with files and skips empty optionals', async () => {
    const fetchMock = vi.fn().mockResolvedValue(json(200, { message: 'ok' }))
    vi.stubGlobal('fetch', fetchMock)
    await registerDriver(payload)

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api-staging.shipzy.ph/api/driver/register')
    expect(init.headers['Content-Type']).toBeUndefined() // browser sets the multipart boundary
    const body = init.body as FormData
    expect(body.get('province_code')).toBe('0128')
    expect(body.get('gcash_same_with_mobile')).toBe('1')
    expect((body.get('selfie') as File).name).toBe('selfie.png')
    expect(body.has('middle_name')).toBe(false)
    expect(body.has('nbi_clearance_optional')).toBe(false)
  })

  test('exposes Laravel field errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(json(422, { message: 'Invalid.', errors: { email: ['The email has already been taken.'] } })),
    )
    const err = await registerDriver(payload).catch((e) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err.fieldErrors).toEqual({ email: 'The email has already been taken.' })
  })
})

describe('references', () => {
  test('maps license types and vehicle options to select options', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) =>
        Promise.resolve(
          url.endsWith('license-types')
            ? json(200, { result: [{ id: 3, code: 'professional', display: 'Professional', status_id: 1 }] })
            : json(200, {
                result: [
                  { id: 1, vehicle: 'Motorcycle', allow_professional: 1, allow_non_professional: 0, status_id: 1 },
                  { id: 9, vehicle: 'Retired', allow_professional: 1, allow_non_professional: 1, status_id: 2 },
                ],
              }),
        ),
      ),
    )
    expect(await getLicenseTypes()).toEqual([{ value: '3', label: 'Professional', code: 'professional' }])
    expect(await getVehicleOptions()).toEqual([
      { value: '1', label: 'Motorcycle', allowProfessional: true, allowNonProfessional: false },
    ])
  })
})
