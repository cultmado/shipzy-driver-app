<template>
  <div class="space-y-4">
    <StatusHero v-bind="hero" :tiles="heroTiles" />

    <RouteTrackingCard :show-driver="state === 'active'">
      <InfoTile label="Total Distance" :value="booking.route.distance" />
      <InfoTile label="Travel Time" :value="booking.route.travelTime" />
      <InfoTile label="Additional Stops" :value="booking.stops.length" />
      <InfoTile label="Vehicle Used" :value="booking.vehicle.name" />
    </RouteTrackingCard>

    <RouteStops :booking="booking" />

    <SectionCard title="Delivery Timeline" subtitle="Latest events and driver progress.">
      <EventTimeline :events="events" />
    </SectionCard>

    <CargoRequirements :booking="booking" />
    <CurrentContact v-if="state !== 'canceled'" v-bind="contact" />
    <AssignedVehicle :vehicle="booking.vehicle" :weight="booking.cargo.weight" />
    <PaymentCollection :payment="booking.payment" :amount="sum(booking.invoice.fees)" />
    <EarningsCard :rows="booking.earnings" />
    <InfoRows :rows="info" />
  </div>
</template>

<script setup lang="ts">
import {
  checkmark,
  checkmarkDoneOutline,
  closeCircleOutline,
  cubeOutline,
  flagOutline,
  navigateOutline,
  personOutline,
} from 'ionicons/icons';
import { computed } from 'vue';
import InfoTile from '@/components/InfoTile.vue';
import SectionCard from '@/components/SectionCard.vue';
import { sum } from '@/composables/useStore';
import { stagesFor, stateOf, statusOf } from '@/data/stages';
import type { VehicleBooking } from '@/data/types';
import AssignedVehicle from './AssignedVehicle.vue';
import CargoRequirements from './CargoRequirements.vue';
import CurrentContact from './CurrentContact.vue';
import EarningsCard from './EarningsCard.vue';
import EventTimeline, { type TimelineEvent } from './EventTimeline.vue';
import InfoRows from './InfoRows.vue';
import PaymentCollection from './PaymentCollection.vue';
import RouteStops from './RouteStops.vue';
import RouteTrackingCard from './RouteTrackingCard.vue';
import StatusHero from './StatusHero.vue';
import { splitStamp } from './helpers';

const props = defineProps<{ booking: VehicleBooking }>();

const stages = computed(() => stagesFor(props.booking));
const state = computed(() => stateOf(props.booking));
const current = computed(() => stages.value[props.booking.stage]);
const stopNo = (key: string) => Number(key.split('-').pop());

const hero = computed(() => {
  const b = props.booking;
  if (state.value === 'canceled' || state.value === 'completed') {
    const s = statusOf(b);
    return { icon: state.value === 'canceled' ? closeCircleOutline : checkmarkDoneOutline, title: s.title, desc: s.desc, danger: state.value === 'canceled' };
  }
  const st = current.value;
  const title = st.key.startsWith('at-stop-') ? `Currently at Stop ${stopNo(st.key)} of ${b.stops.length}` : st.title;
  return { icon: navigateOutline, title, desc: st.desc };
});

const heroTiles = computed(() => {
  const b = props.booking;
  // Stop k is completed once the "stop-k" stage (index 4 + 2(k-1)) is reached.
  const remaining = b.stops.filter((_, k) => b.stage < 4 + 2 * k).length;
  return [
    { label: 'Estimated Delivery', value: b.route.eta },
    { label: 'Distance Left', value: state.value === 'completed' ? '0 km' : b.route.distanceLeft },
    { label: 'Stops Remaining', value: `${remaining} of ${b.stops.length}` },
  ];
});

const eventIcons: Record<string, string> = {
  accepted: checkmark,
  pickup: personOutline,
  loaded: cubeOutline,
  final: navigateOutline,
  unloaded: cubeOutline,
  delivered: flagOutline,
};

/** Hide "Currently at Stop k" once passed and "Stop k Completed" until reached. */
const events = computed<TimelineEvent[]>(() => {
  const b = props.booking;
  const done = state.value === 'completed';
  return stages.value.flatMap((s, i) => {
    if (s.key.startsWith('at-stop-') && i !== b.stage) return [];
    if (s.key.startsWith('stop-') && i > b.stage) return [];
    const st: TimelineEvent['state'] = i < b.stage || (done && i === b.stage) ? 'done' : i === b.stage ? 'current' : 'upcoming';
    const icon = s.key.startsWith('stop-') ? checkmark : s.key.startsWith('at-stop-') ? navigateOutline : eventIcons[s.key];
    const stamp = st !== 'upcoming' ? b.stageTimes[i] : undefined;
    return [{ key: s.key, title: s.title, desc: s.desc, icon, state: st, time: stamp ? splitStamp(stamp) : undefined }];
  });
});

/** Who the driver deals with right now: pickup, the active / next stop, or the receiver. */
const contact = computed(() => {
  const b = props.booking;
  const key = current.value.key;
  const place = (addr: string) => addr.split(',')[0];
  let k = -1;
  if (key === 'loaded') k = 0;
  else if (key.startsWith('at-stop-')) k = stopNo(key) - 1;
  else if (key.startsWith('stop-')) k = stopNo(key);
  const stop = b.stops[k];
  if (stop)
    return {
      name: stop.contact,
      role: `Stop ${k + 1} Contact`,
      place: place(stop.address),
      phone: stop.phone,
      subtitle: key.startsWith('at-stop-') ? 'Contact for the active stop.' : 'Contact for the next stop.',
    };
  const atPickup = key === 'accepted' || key === 'pickup';
  const party = atPickup ? b.pickup : b.dropoff;
  const name = party.landmark?.split(/:\s*/)[1] ?? party.name;
  return {
    name,
    role: atPickup ? 'Pick-up Contact' : 'Receiver',
    place: party.name,
    phone: party.phone,
    subtitle: atPickup ? 'Contact for the pick-up point.' : 'Contact for the final drop-off.',
  };
});

const info = computed(() => {
  const b = props.booking;
  return [
    { label: 'Booking ID', value: b.ref },
    { label: 'Created At', value: b.createdAt },
    { label: 'Accepted At', value: b.acceptedAt },
    { label: 'Request Type', value: b.requestType },
    { label: 'Pickup Schedule', value: b.schedule },
    { label: 'Required Vehicle', value: b.requiredVehicle },
    { label: 'Total Stops', value: b.stops.length },
  ];
});
</script>
