import { api } from './api';

/** Fields for POST /driver/register (multipart/form-data). */
export interface RegisterPayload {
  email: string;
  password: string;
  password_confirmation: string;
  referral_code?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  /** yyyy-mm-dd */
  birth_date: string;
  /** id from /references/genders */
  gender: string;
  /** e.g. 09171234567 */
  mobile_number: string;
  telephone_number?: string;
  /** "1" when the GCash account matches the name and mobile above */
  gcash_same_with_mobile: '0' | '1';
  gcash_name?: string;
  gcash_number?: string;
  street: string;
  country_code: string;
  province_code: string;
  city_code: string;
  barangay_code: string;
  zip_code: string;
  /** id from /references/vehicle-options */
  vehicle_option: string;
  vehicle_model: string;
  plate_number: string;
  or_cr_number: string;
  /** yyyy-mm-dd */
  date_of_registration: string;
  tin_number?: string;
  /** id from /references/license-types */
  license_type: string;
  license_number: string;
  license_file: File;
  or_cr_file: File;
  /** Police / Barangay clearance (required) */
  nbi_clearance: File;
  /** NBI clearance (optional) */
  nbi_clearance_optional?: File;
  selfie: File;
  vehicle_front: File;
  vehicle_back: File;
  vehicle_picture: File;
}

export async function registerDriver(payload: RegisterPayload): Promise<unknown> {
  const body = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === '') continue;
    if (value instanceof File) body.append(key, value, value.name);
    else body.append(key, String(value));
  }
  // Up to 8 documents of 5 MB each: allow slow mobile uploads.
  return api('/driver/register', { method: 'POST', body, timeoutMs: 120_000 });
}
