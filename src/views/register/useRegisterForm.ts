import { computed, inject, markRaw, provide, reactive, ref, watch, type ComputedRef, type InjectionKey, type Ref } from 'vue';
import { ApiError } from '@/services/api';
import { countries, getBarangays, getCities, getProvinces, type Place } from '@/services/address';
import { getGenders, getLicenseTypes, getVehicleOptions, type Option, type VehicleOption } from '@/services/references';
import { registerDriver, type RegisterPayload } from '@/services/register';
import {
  carOutline,
  carSportOutline,
  documentTextOutline,
  idCardOutline,
  scanOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

/* ---------- Static options ---------- */

export const STEP_COUNT = 6;

export type { Option };

/** Turn address records into select options. */
const toOptions = (places: Place[]): Option[] => places.map((p) => ({ value: p.code, label: p.name }));

export const countryOptions = toOptions(countries);

/** Label for a stored id/code, for the Review step. */
export const labelOf = (options: Option[], value: string) => options.find((o) => o.value === value)?.label ?? '';

export type DocKey =
  | 'license'
  | 'orcr'
  | 'clearance'
  | 'nbi'
  | 'selfie'
  | 'vehicleFront'
  | 'vehicleBack'
  | 'vehicleWhole';

export interface DocMeta {
  key: DocKey;
  title: string;
  description: string;
  icon: string;
  optional?: boolean;
}

export const documents: DocMeta[] = [
  { key: 'license', title: "Driver's License", description: 'Upload a clear front image or PDF copy.', icon: idCardOutline },
  { key: 'orcr', title: 'OR/CR', description: 'Upload the official receipt and certificate of registration.', icon: documentTextOutline },
  {
    key: 'clearance',
    title: 'Police / Barangay Clearance',
    description: 'Upload a valid Police or Barangay clearance document.',
    icon: shieldCheckmarkOutline,
  },
  {
    key: 'nbi',
    title: 'NBI Clearance',
    description: 'Optional — upload your NBI clearance if available.',
    icon: shieldCheckmarkOutline,
    optional: true,
  },
  { key: 'selfie', title: 'Selfie', description: 'Upload a recent and clear selfie photo.', icon: scanOutline },
  { key: 'vehicleFront', title: 'Vehicle Front Photo', description: 'The entire front of the vehicle must be visible.', icon: carOutline },
  { key: 'vehicleBack', title: 'Vehicle Back Photo', description: 'The entire back and plate number must be visible.', icon: carOutline },
  { key: 'vehicleWhole', title: 'Whole Vehicle Photo', description: 'Upload a complete side-angle photo of the vehicle.', icon: carSportOutline },
];

export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export interface UploadedDoc {
  name: string;
  file: File;
}

/* ---------- Helpers ---------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Strip spaces / dashes from a PH mobile number. */
export const digits = (v: string) => v.replace(/\D/g, '');

/** Age in whole years for an ISO yyyy-mm-dd date. */
export function ageFrom(iso: string, today = new Date()): number {
  const [y, m, d] = iso.split('-').map(Number);
  let age = today.getFullYear() - y;
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--;
  return age;
}

/** Latest birth date allowed for an 18-year-old (yyyy-mm-dd). */
export function maxBirthDate(today = new Date()): string {
  const d = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return toIso(d);
}

export function toIso(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "1995-12-07" → "December 7, 1995" */
export function formatDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/* ---------- Form state ---------- */

function createState() {
  return reactive({
    // 1 · Account
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    // 2 · Personal
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    mobile: '',
    telephone: '',
    gcashSame: false,
    gcashName: '',
    gcashMobile: '',
    // 3 · Address
    street: '',
    country: 'PH',
    province: '',
    city: '',
    barangay: '',
    zip: '',
    // 4 · Vehicle & license
    vehicleType: '',
    vehicleModel: '',
    plateNumber: '',
    orcrNumber: '',
    registrationDate: '',
    tin: '',
    licenseType: '',
    licenseNumber: '',
    // 5 · Documents
    docs: Object.fromEntries(documents.map((d) => [d.key, null])) as Record<DocKey, UploadedDoc | null>,
    // 6 · Review
    agreed: false,
  });
}

export type RegisterState = ReturnType<typeof createState>;
type Errors = Record<string, string>;

function validate(f: RegisterState, step: number): Errors {
  const e: Errors = {};
  const need = (key: keyof RegisterState, msg: string) => {
    if (!String(f[key] ?? '').trim()) e[key] = msg;
  };

  if (step === 1) {
    if (!f.email.trim()) e.email = 'Email address is required.';
    else if (!EMAIL_RE.test(f.email.trim())) e.email = 'Enter a valid email address.';
    if (!f.password) e.password = 'Password is required.';
    else if (f.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (!f.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (f.confirmPassword !== f.password) e.confirmPassword = 'Passwords do not match.';
  }

  if (step === 2) {
    need('firstName', 'First name is required.');
    need('lastName', 'Last name is required.');
    if (!f.birthDate) e.birthDate = 'Birth date is required.';
    else if (ageFrom(f.birthDate) < 18) e.birthDate = 'You must be at least 18 years old to apply.';
    need('gender', 'Please select your gender.');
    if (!f.mobile.trim()) e.mobile = 'Mobile number is required.';
    else if (!/^9\d{9}$/.test(digits(f.mobile))) e.mobile = 'Enter a valid 10-digit mobile number (e.g. 912 345 6789).';
    if (!f.gcashSame) {
      need('gcashName', 'GCash account name is required.');
      if (!f.gcashMobile.trim()) e.gcashMobile = 'GCash mobile number is required.';
      else if (!/^9\d{9}$/.test(digits(f.gcashMobile))) e.gcashMobile = 'Enter a valid 10-digit mobile number.';
    }
  }

  if (step === 3) {
    need('street', 'House / lot / block / street is required.');
    need('country', 'Please select a country.');
    need('province', 'Please select a province.');
    need('city', 'Please select a city / municipality.');
    need('barangay', 'Please select a barangay.');
    if (!f.zip.trim()) e.zip = 'ZIP code is required.';
    else if (!/^\d{4}$/.test(f.zip.trim())) e.zip = 'ZIP code must be 4 digits.';
  }

  if (step === 4) {
    need('vehicleType', 'Please select a vehicle type.');
    need('vehicleModel', 'Vehicle model is required.');
    need('plateNumber', 'Plate number is required.');
    need('orcrNumber', 'OR/CR number is required.');
    if (!f.registrationDate) e.registrationDate = 'Date of registration is required.';
    else if (f.registrationDate > toIso(new Date())) e.registrationDate = 'Date cannot be in the future.';
    need('licenseType', 'Please select a license type.');
    need('licenseNumber', 'License number is required.');
  }

  if (step === 5) {
    for (const d of documents) {
      if (!d.optional && !f.docs[d.key]) e[d.key] = 'Please upload this document.';
    }
  }

  if (step === 6 && !f.agreed) {
    e.agreed = 'Please confirm and agree to the Terms and Conditions and Privacy Policy.';
  }

  return e;
}

/* ---------- API mapping ---------- */

/** API field → [form key, wizard step] so server errors land on the right input. */
const apiFields: Record<string, [string, number]> = {
  email: ['email', 1],
  password: ['password', 1],
  password_confirmation: ['confirmPassword', 1],
  referral_code: ['referralCode', 1],
  first_name: ['firstName', 2],
  middle_name: ['middleName', 2],
  last_name: ['lastName', 2],
  birth_date: ['birthDate', 2],
  gender: ['gender', 2],
  mobile_number: ['mobile', 2],
  telephone_number: ['telephone', 2],
  gcash_same_with_mobile: ['gcashSame', 2],
  gcash_name: ['gcashName', 2],
  gcash_number: ['gcashMobile', 2],
  street: ['street', 3],
  country_code: ['country', 3],
  province_code: ['province', 3],
  city_code: ['city', 3],
  barangay_code: ['barangay', 3],
  zip_code: ['zip', 3],
  vehicle_option: ['vehicleType', 4],
  vehicle_model: ['vehicleModel', 4],
  plate_number: ['plateNumber', 4],
  or_cr_number: ['orcrNumber', 4],
  date_of_registration: ['registrationDate', 4],
  tin_number: ['tin', 4],
  license_type: ['licenseType', 4],
  license_number: ['licenseNumber', 4],
  license_file: ['license', 5],
  or_cr_file: ['orcr', 5],
  nbi_clearance: ['clearance', 5],
  nbi_clearance_optional: ['nbi', 5],
  selfie: ['selfie', 5],
  vehicle_front: ['vehicleFront', 5],
  vehicle_back: ['vehicleBack', 5],
  vehicle_picture: ['vehicleWhole', 5],
};

/** "912 345 6789" → "09123456789", the format the API expects. */
const localMobile = (v: string) => (v.trim() ? `0${digits(v).replace(/^(63|0)/, '')}` : '');

function toPayload(f: RegisterState): RegisterPayload {
  const file = (key: DocKey) => f.docs[key]?.file as File;
  return {
    email: f.email.trim(),
    password: f.password,
    password_confirmation: f.confirmPassword,
    referral_code: f.referralCode.trim(),
    first_name: f.firstName.trim(),
    middle_name: f.middleName.trim(),
    last_name: f.lastName.trim(),
    birth_date: f.birthDate,
    gender: f.gender,
    mobile_number: localMobile(f.mobile),
    telephone_number: f.telephone.trim(),
    gcash_same_with_mobile: f.gcashSame ? '1' : '0',
    gcash_name: f.gcashSame ? '' : f.gcashName.trim(),
    gcash_number: f.gcashSame ? '' : localMobile(f.gcashMobile),
    street: f.street.trim(),
    country_code: f.country,
    province_code: f.province,
    city_code: f.city,
    barangay_code: f.barangay,
    zip_code: f.zip.trim(),
    vehicle_option: f.vehicleType,
    vehicle_model: f.vehicleModel.trim(),
    plate_number: f.plateNumber.trim().toUpperCase(),
    or_cr_number: f.orcrNumber.trim(),
    date_of_registration: f.registrationDate,
    tin_number: f.tin.trim(),
    license_type: f.licenseType,
    license_number: f.licenseNumber.trim(),
    license_file: file('license'),
    or_cr_file: file('orcr'),
    nbi_clearance: file('clearance'),
    nbi_clearance_optional: f.docs.nbi?.file,
    selfie: file('selfie'),
    vehicle_front: file('vehicleFront'),
    vehicle_back: file('vehicleBack'),
    vehicle_picture: file('vehicleWhole'),
  };
}

export type SubmitResult = { ok: true } | { ok: false; message: string; step?: number };

/* ---------- Provide / inject ---------- */

export interface RegisterOptions {
  genders: Option[];
  licenseTypes: Option[];
  vehicles: VehicleOption[];
  provinces: Option[];
  cities: Option[];
  barangays: Option[];
  /** Keys of lists currently loading, e.g. 'cities'. */
  loading: Set<string>;
  /** Message when a list failed to load (shown with a retry button). */
  error: string;
}

export interface RegisterForm {
  form: RegisterState;
  step: Ref<number>;
  options: RegisterOptions;
  /** License types allowed for the chosen vehicle. */
  licenseOptions: ComputedRef<Option[]>;
  /** Errors visible for the current step (after Continue was pressed, or returned by the API). */
  errors: ComputedRef<Errors>;
  /** Validates `step`; returns true when valid and reveals errors otherwise. */
  check: (step: number) => boolean;
  setDoc: (key: DocKey, file: File | null) => void;
  reloadOptions: () => void;
  submit: () => Promise<SubmitResult>;
}

const KEY: InjectionKey<RegisterForm> = Symbol('register-form');

export function provideRegisterForm(initialStep = 1): RegisterForm {
  const form = createState();
  const step = ref(initialStep);
  // Steps on which the user already pressed Continue: errors update live from then on.
  const attempted = reactive(new Set<number>());
  // Validation messages returned by the API, keyed by form field.
  const serverErrors = reactive<Errors>({});

  const options = reactive<RegisterOptions>({
    genders: [],
    licenseTypes: [],
    vehicles: [],
    provinces: [],
    cities: [],
    barangays: [],
    loading: new Set(),
    error: '',
  });

  async function track<T>(key: string, task: Promise<T>, assign: (v: T) => void) {
    options.loading.add(key);
    try {
      assign(await task);
    } catch (e) {
      options.error = e instanceof Error ? e.message : 'Could not load the form options.';
    } finally {
      options.loading.delete(key);
    }
  }

  function reloadOptions() {
    options.error = '';
    track('genders', getGenders(), (v) => (options.genders = v));
    track('licenseTypes', getLicenseTypes(), (v) => (options.licenseTypes = v));
    track('vehicles', getVehicleOptions(), (v) => (options.vehicles = v));
    track('provinces', getProvinces(), (v) => (options.provinces = toOptions(v)));
    if (form.province) track('cities', getCities(form.province), (v) => (options.cities = toOptions(v)));
    if (form.province && form.city) {
      track('barangays', getBarangays(form.province, form.city), (v) => (options.barangays = toOptions(v)));
    }
  }
  reloadOptions();

  const licenseOptions = computed(() => {
    const vehicle = options.vehicles.find((v) => v.value === form.vehicleType);
    if (!vehicle) return options.licenseTypes;
    // Codes come from /references/license-types: "professional" / "non_professional".
    return options.licenseTypes.filter((l) => {
      if (l.code === 'professional') return vehicle.allowProfessional;
      if (l.code === 'non_professional') return vehicle.allowNonProfessional;
      return true;
    });
  });

  const errors = computed(() => {
    const own = attempted.has(step.value) ? validate(form, step.value) : {};
    return { ...serverErrors, ...own };
  });

  const check = (s: number) => {
    attempted.add(s);
    const ok = Object.keys(validate(form, s)).length === 0;
    // Server-side complaints for this step must be fixed (edited) before moving on.
    const pending = Object.entries(apiFields).some(([, [key, st]]) => st === s && serverErrors[key]);
    return ok && !pending;
  };

  const setDoc = (key: DocKey, file: File | null) => {
    form.docs[key] = file ? { name: file.name, file: markRaw(file) } : null;
    delete serverErrors[key];
  };

  // Editing a field clears the API error shown on it.
  watch(
    () => ({ ...form }),
    (now, before) => {
      for (const key of Object.keys(now) as (keyof RegisterState)[]) {
        if (now[key] !== before[key]) delete serverErrors[key];
      }
    },
  );

  // Cascade the address selects.
  watch(
    () => form.province,
    (province) => {
      form.city = '';
      form.barangay = '';
      options.cities = [];
      options.barangays = [];
      if (province) track('cities', getCities(province), (v) => (options.cities = toOptions(v)));
    },
  );
  watch(
    () => form.city,
    (city) => {
      form.barangay = '';
      options.barangays = [];
      if (city) track('barangays', getBarangays(form.province, city), (v) => (options.barangays = toOptions(v)));
    },
  );
  // Drop a license type the newly chosen vehicle doesn't allow.
  watch(licenseOptions, (allowed) => {
    if (form.licenseType && !allowed.some((o) => o.value === form.licenseType)) form.licenseType = '';
  });

  async function submit(): Promise<SubmitResult> {
    try {
      await registerDriver(toPayload(form));
      return { ok: true };
    } catch (e) {
      if (!(e instanceof ApiError)) return { ok: false, message: 'Something went wrong. Please try again.' };
      let firstStep: number | undefined;
      for (const [field, message] of Object.entries(e.fieldErrors)) {
        const [key, s] = apiFields[field] ?? [];
        if (!key || s === undefined) continue;
        serverErrors[key] = message;
        firstStep = firstStep === undefined ? s : Math.min(firstStep, s);
      }
      return { ok: false, message: e.message, step: firstStep };
    }
  }

  const ctx: RegisterForm = { form, step, options, licenseOptions, errors, check, setDoc, reloadOptions, submit };
  provide(KEY, ctx);
  return ctx;
}

export function useRegisterForm(): RegisterForm {
  const ctx = inject(KEY);
  if (!ctx) throw new Error('useRegisterForm() called outside RegisterPage');
  return ctx;
}
