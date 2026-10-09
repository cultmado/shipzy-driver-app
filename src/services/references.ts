import { api } from './api';

export interface Option {
  value: string;
  label: string;
  /** Stable code from the API, e.g. "professional". */
  code?: string;
}

export interface VehicleOption extends Option {
  allowProfessional: boolean;
  allowNonProfessional: boolean;
}

interface ListResponse<T> {
  message?: string;
  result: T[];
}

interface CodeRow {
  id: number;
  code: string;
  display: string;
  status_id?: number;
}

interface VehicleRow {
  id: number;
  vehicle: string;
  allow_professional: number;
  allow_non_professional: number;
  status_id?: number;
}

const active = <T extends { status_id?: number }>(rows: T[]) => rows.filter((r) => r.status_id === undefined || r.status_id === 1);

// Reference lists rarely change, so fetch each once per app session.
const cache = new Map<string, Promise<unknown>>();
function once<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) {
    const p = fn();
    p.catch(() => cache.delete(key));
    cache.set(key, p);
  }
  return cache.get(key) as Promise<T>;
}

const codeList = (path: string) =>
  once(path, async () => {
    const res = await api<ListResponse<CodeRow>>(path);
    return active(res.result).map<Option>((r) => ({ value: String(r.id), label: r.display, code: r.code }));
  });

export const getGenders = () => codeList('/references/genders');

export const getLicenseTypes = () => codeList('/references/license-types');

export const getVehicleOptions = () =>
  once('/references/vehicle-options', async () => {
    const res = await api<ListResponse<VehicleRow>>('/references/vehicle-options');
    return active(res.result).map<VehicleOption>((r) => ({
      value: String(r.id),
      label: r.vehicle.trim(),
      allowProfessional: !!r.allow_professional,
      allowNonProfessional: !!r.allow_non_professional,
    }));
  });
