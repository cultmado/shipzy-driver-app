// Philippine address lists bundled in public/ph-address (see the README there).

export interface Place {
  code: string;
  name: string;
}

interface City extends Place {
  province: string;
}

interface Barangay extends Place {
  city: string;
}

const BASE = `${import.meta.env.BASE_URL}ph-address`;
const cache = new Map<string, Promise<unknown>>();

function load<T>(path: string): Promise<T> {
  if (!cache.has(path)) {
    const p = fetch(`${BASE}/${path}`).then((r) => {
      if (!r.ok) throw new Error(`Could not load address data (${r.status}).`);
      return r.json();
    });
    // Let a failed load be retried.
    p.catch(() => cache.delete(path));
    cache.set(path, p);
  }
  return cache.get(path) as Promise<T>;
}

export const countries: Place[] = [{ code: 'PH', name: 'Philippines' }];

export const getProvinces = () => load<Place[]>('provinces.json');

export async function getCities(provinceCode: string): Promise<Place[]> {
  const all = await load<City[]>('cities.json');
  return all.filter((c) => c.province === provinceCode);
}

export async function getBarangays(provinceCode: string, cityCode: string): Promise<Place[]> {
  const all = await load<Barangay[]>(`barangays/${provinceCode}.json`);
  return all.filter((b) => b.city === cityCode);
}
