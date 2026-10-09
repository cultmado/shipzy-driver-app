<template>
  <div class="space-y-4">
    <StatusHero v-bind="hero" title-case :tiles="[{ label: 'Last Updated', value: booking.lastUpdated }]" />

    <RouteTrackingCard :address="target" :show-driver="state === 'active'">
      <InfoTile label="Estimated arrival" :value="booking.route.eta" />
      <InfoTile label="Distance remaining" :value="booking.route.distanceLeft" />
      <InfoTile class="col-span-2 !py-2.5" label="Destination" :value="booking.dropoff.address" />
    </RouteTrackingCard>

    <SectionCard title="Delivery Progress" subtitle="Follow every stage of this Pabili delivery.">
      <ProgressTimeline :stages="stages" :current="booking.stage" :times="booking.stageTimes" :completed="state === 'completed'" />
    </SectionCard>

    <StoresCard :stores="booking.stores" />
    <DeliveryInfo :customer="booking.dropoff" :schedule="booking.schedule" :delivery-type="booking.deliveryType" />
    <NotesCard v-if="booking.notes" :notes="booking.notes" />
    <PaymentCollection :payment="booking.payment" :amount="sum(booking.invoice.fees)" />
    <EarningsCard :rows="booking.earnings" />
    <InfoRows :rows="info" />
  </div>
</template>

<script setup lang="ts">
import { basketOutline, checkmarkDoneOutline, closeCircleOutline } from 'ionicons/icons';
import { computed } from 'vue';
import InfoTile from '@/components/InfoTile.vue';
import SectionCard from '@/components/SectionCard.vue';
import { sum } from '@/composables/useStore';
import { serviceMeta, stagesFor, stateOf, statusOf } from '@/data/stages';
import type { PabiliBooking } from '@/data/types';
import DeliveryInfo from './DeliveryInfo.vue';
import EarningsCard from './EarningsCard.vue';
import InfoRows from './InfoRows.vue';
import NotesCard from './NotesCard.vue';
import PaymentCollection from './PaymentCollection.vue';
import ProgressTimeline from './ProgressTimeline.vue';
import RouteTrackingCard from './RouteTrackingCard.vue';
import StatusHero from './StatusHero.vue';
import StoresCard from './StoresCard.vue';

const props = defineProps<{ booking: PabiliBooking }>();

const stages = computed(() => stagesFor(props.booking));
const state = computed(() => stateOf(props.booking));

// Customer-facing wording for the status card, per stage key.
const heroCopy: Record<string, { title: string; desc: string }> = {
  accepted: { title: 'Delivery accepted', desc: 'You accepted this request. Head to the first store when you are ready.' },
  store: { title: 'Heading to the store', desc: 'Your rider is on the way to the assigned stores to buy the requested items.' },
  purchasing: { title: 'Purchasing your items', desc: 'Your rider is buying the requested items and uploading the official receipts.' },
  customer: {
    title: 'Your order is out for delivery',
    desc: "Your rider has completed the purchases and is now heading to your delivery address. Track the rider's latest location and estimated arrival below.",
  },
};

const hero = computed(() => {
  const b = props.booking;
  if (state.value === 'canceled' || state.value === 'completed') {
    const s = statusOf(b);
    return { icon: state.value === 'canceled' ? closeCircleOutline : checkmarkDoneOutline, title: s.title, desc: s.desc, danger: state.value === 'canceled' };
  }
  return { icon: basketOutline, ...heroCopy[stages.value[b.stage].key] };
});

/** Navigate to the next unfinished store while shopping, then to the customer. */
const target = computed(() => {
  const b = props.booking;
  if (b.stage >= 3) return b.dropoff.address;
  const store = b.stores.find((s) => s.status !== 'purchased') ?? b.stores[0];
  return store ? `${store.name}, ${store.address}` : b.pickup.address;
});

const info = computed(() => {
  const b = props.booking;
  return [
    { label: 'Booking ID', value: b.ref },
    { label: 'Created At', value: b.createdAt },
    { label: 'Accepted At', value: b.acceptedAt },
    { label: 'Service Type', value: serviceMeta.pabili.name },
    { label: 'Delivery Type', value: b.deliveryType },
    { label: 'Required Vehicle', value: b.requiredVehicle },
  ];
});
</script>
