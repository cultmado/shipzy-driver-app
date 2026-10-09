Philippine address data (province → city/municipality → barangay) keyed by the
PSGC-style codes the Shipzy API expects (`province_code` 4 digits, `city_code`
6 digits, `barangay_code` 9 digits).

Source: https://isaacdarcilla.github.io/philippine-addresses/ (the data behind the
MIT-licensed `select-philippines-address` npm package; the codes originate from the
PSA Philippine Standard Geographic Code). Reduced to `{ code, name }` records and
split per province so the app only loads what it needs.

Ideally the Shipzy API would serve these lists so the app and backend never drift;
replace `src/services/address.ts` when such endpoints exist.
