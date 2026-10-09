/** Small sample of PH locations for the address selects. */
export const countries = ['Philippines'];

export const provinces: Record<string, Record<string, string[]>> = {
  'Davao del Sur': {
    'Davao City': ['San Isidro', 'Buhangin', 'Talomo', 'Matina Crossing', 'Poblacion', 'Ecoland'],
    'Digos City': ['Zone 1', 'Aplaya', 'Tres de Mayo', 'San Jose'],
    'Sta. Cruz': ['Poblacion Zone I', 'Darong', 'Astorga'],
  },
  'Davao del Norte': {
    'Tagum City': ['Apokon', 'Magugpo Poblacion', 'Visayan Village'],
    'Panabo City': ['Gredu', 'New Pandan', 'San Francisco'],
  },
  'Metro Manila': {
    'Quezon City': ['Bagumbayan', 'Commonwealth', 'Batasan Hills'],
    'Makati City': ['Poblacion', 'Bel-Air', 'San Lorenzo'],
    'Pasig City': ['Kapitolyo', 'Ugong', 'San Antonio'],
  },
  Cebu: {
    'Cebu City': ['Lahug', 'Mabolo', 'Guadalupe'],
    'Mandaue City': ['Banilad', 'Subangdaku', 'Tipolo'],
  },
};
