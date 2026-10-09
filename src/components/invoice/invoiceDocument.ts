import { peso, sum } from '@/composables/useStore';
import { serviceMeta } from '@/data/stages';
import type { Booking } from '@/data/types';

const esc = (s: string | number) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const rows = (pairs: [string, string | number][]) =>
  `<table>${pairs.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table>`;

/** Type-specific lines of the printable invoice. */
function details(b: Booking): string {
  if (b.type === 'pabili') {
    return b.stores
      .map(
        (s) =>
          `<h3>${esc(s.name)}</h3>` +
          rows(s.items.map((i) => [`${i.name} (${peso(i.price)} × ${i.qty})`, peso(i.price * i.qty)])),
      )
      .join('');
  }
  if (b.type === 'parcel') {
    const p = b.package;
    return rows([
      ['Type', p.type],
      ['Size', p.size],
      ['Quantity', p.quantity],
      ['Verified Weight', p.weight],
      ['Dimensions', p.dimensions],
      ['Total CBM', p.cbm],
      ['Declared Value', peso(p.declaredValue)],
      ['Shipment Mode', b.shipmentMode],
      ['Tracking Number', b.trackingNo],
      ['Estimated Delivery', b.estimatedDelivery],
    ]);
  }
  return (
    rows([
      ['Vehicle', `${b.vehicle.name} (${b.vehicle.plate})`],
      ['Cargo Type', b.cargo.type],
      ['Total Weight', b.cargo.weight],
      ['Declared Value', peso(b.cargo.declaredValue)],
      ['Distance', b.route.distance],
      ['Pickup Schedule', b.schedule],
      ['Travel Duration', b.route.travelTime],
    ]) +
    `<h3>Route Stops</h3>` +
    rows(b.stops.map((s, i) => [`Stop ${i + 1}`, `${s.address} — ${s.contact} · ${s.phone}`]))
  );
}

/** Standalone HTML version of the invoice, used for the "Download Invoice" action. */
export function invoiceHtml(b: Booking): string {
  const { invoice } = b;
  const title = `${serviceMeta[b.type].name} Invoice ${invoice.no}`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>
body{font-family:Inter,system-ui,sans-serif;color:#00093a;max-width:640px;margin:24px auto;padding:0 16px;font-size:14px}
h1{font-size:20px;margin:0}h2{font-size:13px;color:#0a5e84;text-transform:uppercase;margin:24px 0 8px}h3{font-size:14px;margin:12px 0 4px}
table{width:100%;border-collapse:collapse}th{text-align:left;font-weight:400;color:#4e5471;padding:4px 0}td{text-align:right;font-weight:600;padding:4px 0}
.total td,.total th{border-top:1px solid #d7deea;padding-top:10px;font-size:16px;color:#0a5e84;font-weight:700}
</style></head><body>
<h1>${esc(title)}</h1>
${rows([
  ['Invoice No.', invoice.no],
  ['Booking No.', b.ref],
  ['Invoice Date', invoice.date],
  ['Time', invoice.time],
])}
<h2>${b.type === 'pabili' ? 'Billed To' : 'Pick-up'}</h2>
${rows([
  ['Full Name', (b.type === 'pabili' ? b.dropoff : b.pickup).name],
  ['Mobile Number', (b.type === 'pabili' ? b.dropoff : b.pickup).phone],
  ['Address', (b.type === 'pabili' ? b.dropoff : b.pickup).address],
])}
${b.type === 'pabili' ? '' : `<h2>Destination</h2>${rows([['Full Name', b.dropoff.name], ['Mobile Number', b.dropoff.phone], ['Address', b.dropoff.address]])}`}
<h2>Details</h2>
${details(b)}
${b.notes ? `<h2>Notes</h2><p>${esc(b.notes)}</p>` : ''}
<h2>Payment Summary</h2>
<table>${invoice.fees.map((f) => `<tr><th>${esc(f.label)}</th><td>${esc(peso(f.amount))}</td></tr>`).join('')}
<tr class="total"><th>Total Amount</th><td>${esc(peso(sum(invoice.fees)))}</td></tr></table>
<p>Payment: ${esc(b.payment.method)} · ${esc(b.payment.status)}${b.payment.transactionId ? ` · ${esc(b.payment.transactionId)}` : ''}</p>
<p style="color:#4e5471;font-size:12px;margin-top:24px">Thank you for using Shipzy. For questions about this invoice, please contact Shipzy support and provide your booking reference ${esc(b.ref)}.</p>
</body></html>`;
}

/** Save the invoice as an .html file via a temporary download link. */
export function downloadInvoice(b: Booking) {
  const blob = new Blob([invoiceHtml(b)], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${b.invoice.no}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
