import type { Booking, BookingState, ServiceType, Stage } from './types';

const parcelStages: Stage[] = [
  { key: 'confirmed', title: 'Booking Confirmed', desc: 'Shipment details were received', action: 'Confirm Parcel Pickup' },
  { key: 'collected', title: 'Parcel Collected', desc: 'Courier collected the parcel from the sender.', action: 'Arrived at Hub' },
  { key: 'hub', title: 'Processed at Hub', desc: 'Package was checked and prepared for transit.', action: 'Start Transit' },
  { key: 'transit', title: 'In Transit', desc: 'Shipment is moving toward the destination city.', action: 'Arrived at Destination' },
  { key: 'out', title: 'Out for Delivery', desc: 'Courier is delivering the parcel to the receiver.', action: 'Mark as Delivered' },
  { key: 'delivered', title: 'Delivered', desc: 'Parcel was successfully received.' },
];

const pabiliStages: Stage[] = [
  { key: 'accepted', title: 'Delivery Accepted', desc: 'You accepted this Pabili delivery request.', action: 'Go to Store' },
  { key: 'store', title: 'Going to Store', desc: 'Proceed to the assigned stores to purchase the requested items.', action: 'Start Purchasing' },
  { key: 'purchasing', title: 'Purchasing Items', desc: 'Purchase the requested items and upload the official receipts.', action: 'Go to Customer' },
  { key: 'customer', title: 'Going to Customer', desc: 'Proceed to the customer delivery address.', action: 'Arrived at Customer' },
  { key: 'delivered', title: 'Delivered', desc: 'The items were successfully delivered to the customer.' },
];

function vehicleStages(stopCount: number): Stage[] {
  const stages: Stage[] = [
    { key: 'accepted', title: 'Delivery Accepted', desc: 'Your vehicle request was successfully confirmed.', action: 'Go to Pickup' },
    { key: 'pickup', title: 'Going to Pickup', desc: 'Head to the pick-up point to load the cargo.', action: 'Confirm Cargo Loaded' },
    {
      key: 'loaded',
      title: 'Cargo Loaded',
      desc: 'Cargo was loaded and the driver left the pickup point.',
      action: stopCount ? 'Arrived at Stop 1' : 'Go to Final Destination',
    },
  ];
  for (let k = 1; k <= stopCount; k++) {
    stages.push(
      { key: `at-stop-${k}`, title: `Currently at Stop ${k}`, desc: 'The driver is currently handling this scheduled stop.', action: `Complete Stop ${k}` },
      {
        key: `stop-${k}`,
        title: `Stop ${k} Completed`,
        desc: `Additional stop ${k} was completed successfully.`,
        action: k < stopCount ? `Arrived at Stop ${k + 1}` : 'Go to Final Destination',
      },
    );
  }
  stages.push(
    { key: 'final', title: 'Going to Final Destination', desc: 'The driver will continue to the receiver after completing the stops.', action: 'Arrived at Destination' },
    { key: 'unloaded', title: 'Cargo Unloaded', desc: 'Unload the cargo and confirm the receiver.', action: 'Confirm Delivery' },
    { key: 'delivered', title: 'Delivered', desc: 'Cargo will be marked delivered after recipient confirmation.' },
  );
  return stages;
}

export function stagesFor(b: Booking): Stage[] {
  if (b.type === 'parcel') return parcelStages;
  if (b.type === 'pabili') return pabiliStages;
  return vehicleStages(b.stops.length);
}

export function stateOf(b: Booking): BookingState {
  if (b.canceled) return 'canceled';
  if (b.stage >= stagesFor(b).length - 1) return 'completed';
  if (b.stage === 0) return 'pending';
  return 'active';
}

export type Tone = 'blue' | 'green' | 'orange' | 'red' | 'gray';

/** Status chip shown on list cards. */
export function statusOf(b: Booking): { label: string; tone: Tone; title: string; desc: string } {
  const stages = stagesFor(b);
  const current = stages[Math.min(b.stage, stages.length - 1)];
  switch (stateOf(b)) {
    case 'canceled':
      return { label: 'Canceled', tone: 'red', title: 'Booking Canceled', desc: 'This booking was canceled by the customer.' };
    case 'completed':
      return { label: 'Delivered', tone: 'green', title: 'Successfully Delivered', desc: 'The items were delivered successfully to the customer.' };
    case 'pending':
      return { label: 'Pending', tone: 'orange', title: 'Pending Pickup', desc: 'Pickup not started yet.' };
    default:
      return b.stage === stages.length - 2
        ? { label: 'Out for Delivery', tone: 'orange', title: current.title, desc: current.desc }
        : { label: 'On the Way', tone: 'blue', title: current.title, desc: current.desc };
  }
}

export const toneClasses: Record<Tone, { chip: string; dot: string; text: string }> = {
  blue: { chip: 'bg-primary-50 text-primary-600 border-primary-200', dot: 'bg-primary-600', text: 'text-primary-600' },
  green: { chip: 'bg-success-soft text-success border-success/20', dot: 'bg-success', text: 'text-success' },
  orange: { chip: 'bg-warning-soft text-warning border-warning/25', dot: 'bg-warning', text: 'text-warning' },
  red: { chip: 'bg-danger-soft text-danger border-danger/20', dot: 'bg-danger', text: 'text-danger' },
  gray: { chip: 'bg-soft-2 text-ink-muted border-line', dot: 'bg-ink-subtle', text: 'text-ink-muted' },
};

export const serviceMeta: Record<ServiceType, { name: string; short: string; image: 'pabiliBags' | 'parcelBox' | 'van' }> = {
  pabili: { name: 'Pabili Service', short: 'Pabili', image: 'pabiliBags' },
  parcel: { name: 'Parcel & Cargo', short: 'Parcel', image: 'parcelBox' },
  vehicle: { name: 'Vehicle Request', short: 'Vehicle', image: 'van' },
};
