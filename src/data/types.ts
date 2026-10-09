export type ServiceType = 'pabili' | 'parcel' | 'vehicle';

/** Derived bucket used by filters and stats. */
export type BookingState = 'pending' | 'active' | 'completed' | 'canceled';

export interface Party {
  name: string;
  phone: string;
  address: string;
  /** Short place label shown on cards, e.g. "Brgy. San Isidro, Davao City". */
  area: string;
  landmark?: string;
}

export interface Fee {
  label: string;
  amount: number;
}

export interface Payment {
  method: 'GCash' | 'Cash';
  status: 'Paid' | 'Unpaid';
  transactionId?: string;
}

export interface Invoice {
  no: string;
  date: string;
  time: string;
  fees: Fee[];
}

export interface BookingBase {
  /** Route id, e.g. "pc-0042". */
  id: string;
  type: ServiceType;
  /** Booking reference, e.g. "PC-2026-0717-0042". */
  ref: string;
  /** Short date/time shown on list cards. */
  date: string;
  time: string;
  /** True when the booking belongs to today's run. */
  today: boolean;
  createdAt: string;
  acceptedAt: string;
  deliveryType: 'Scheduled' | 'Immediate';
  schedule: string;
  requiredVehicle: string;
  /** Index into the booking's stage list (see `stagesFor`). */
  stage: number;
  /** Time stamps for stages that are done, same order as the stages. */
  stageTimes: string[];
  canceled?: boolean;
  /** Amount shown on list cards (driver earnings for the trip). */
  amount: number;
  pickup: Party;
  dropoff: Party;
  route: {
    eta: string;
    travelTime: string;
    distance: string;
    distanceLeft: string;
  };
  notes?: string;
  payment: Payment;
  earnings: Fee[];
  invoice: Invoice;
}

export interface ParcelBooking extends BookingBase {
  type: 'parcel';
  trackingNo: string;
  estimatedDelivery: string;
  shipmentMode: 'Express' | 'Standard';
  package: {
    type: string;
    size: string;
    quantity: number;
    weight: string;
    dimensions: string;
    cbm: string;
    declaredValue: number;
    handling: string[];
  };
  attachments: { name: string; size: string }[];
  pickupProof?: {
    photo: string;
    condition: string;
    quantity: string;
    uploadedAt: string;
    notes: string;
  };
}

export interface VehicleStop {
  name: string;
  address: string;
  contact: string;
  phone: string;
  instructions?: string;
  arrived?: string;
  completed?: string;
  left?: string;
}

export interface VehicleBooking extends BookingBase {
  type: 'vehicle';
  requestType: 'Scheduled' | 'Immediate';
  stops: VehicleStop[];
  cargo: {
    declaredValue: number;
    weight: string;
    type: string;
    description: string;
    services: { key: 'fragile' | 'loading' | 'unloading' | 'helper'; title: string; desc: string }[];
  };
  vehicle: {
    name: string;
    capacity: string;
    plate: string;
    image: 'vanClosed' | 'truckBox' | 'truckWing' | 'truckFlatbed' | 'van' | 'sedan' | 'motorcycle';
    capacityUsage: string;
  };
}

export interface PabiliItem {
  name: string;
  price: number;
  qty: number;
}

export interface PabiliStore {
  name: string;
  address: string;
  status: 'purchased' | 'in_progress';
  receiptUploaded: boolean;
  items: PabiliItem[];
}

export interface PabiliBooking extends BookingBase {
  type: 'pabili';
  stores: PabiliStore[];
  lastUpdated: string;
}

export type Booking = ParcelBooking | VehicleBooking | PabiliBooking;

export interface Stage {
  key: string;
  title: string;
  /** Description shown in the progress timeline. */
  desc: string;
  /** Label of the button that completes this stage and moves to the next one. */
  action?: string;
}

export interface AppNotification {
  id: string;
  bookingId: string;
  type: ServiceType;
  title: string;
  body: string;
  ref: string;
  date: string;
  time: string;
  ago: string;
  unread: boolean;
}

export interface Driver {
  firstName: string;
  middleName?: string;
  lastName: string;
  initials: string;
  birthDate: string;
  gender: 'Male' | 'Female';
  email: string;
  emailVerified: boolean;
  mobile: string;
  telephone?: string;
  since: string;
  address: {
    street: string;
    country: string;
    province: string;
    city: string;
    barangay: string;
    zip: string;
  };
  vehicle: {
    type: string;
    model: string;
    plate: string;
    orcr: string;
    registeredAt: string;
    tin: string;
    licenseType: string;
    licenseNo: string;
  };
  documents: DriverDocument[];
}

export interface DriverDocument {
  key: string;
  title: string;
  desc: string;
  file?: { name: string; size: string };
}
