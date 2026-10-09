<template>
  <div class="space-y-4">
    <StatusHero v-bind="hero" :tiles="[{ label: 'Estimated Delivery', value: booking.estimatedDelivery }]" />

    <RouteTrackingCard :address="nextStop.address" :show-driver="state === 'active'">
      <InfoTile label="Estimated travel time" :value="booking.route.travelTime" />
      <InfoTile label="Distance remaining" :value="booking.route.distanceLeft" />
      <InfoTile class="col-span-2 !py-2.5" label="Next Destination" :value="nextStop.address" />
    </RouteTrackingCard>

    <SectionCard title="Delivery Progress" subtitle="Follow each driver stage for this shipment.">
      <ProgressTimeline :stages="stages" :current="booking.stage" :times="booking.stageTimes" :completed="state === 'completed'" />
    </SectionCard>

    <SectionCard title="Pickup and Delivery Information" subtitle="Sender, receiver, address, and service type details.">
      <div class="space-y-8">
        <PartyCard :party="booking.pickup" origin />
        <PartyCard :party="booking.dropoff" />
      </div>
    </SectionCard>

    <PackageInfo :pkg="booking.package" :mode="booking.shipmentMode" :tracking-no="booking.trackingNo" />
    <AttachmentList :notes="booking.notes" :files="booking.attachments" />
    <PickupProof v-if="booking.pickupProof && booking.stage >= 1" :proof="booking.pickupProof" />
    <PaymentCollection :payment="booking.payment" :amount="sum(booking.invoice.fees)" />
    <EarningsCard :rows="booking.earnings" />
    <InfoRows :rows="info" />
  </div>
</template>

<script setup lang="ts">
import {
  businessOutline,
  checkmarkDoneOutline,
  closeCircleOutline,
  clipboardOutline,
  cubeOutline,
} from 'ionicons/icons';
import { computed } from 'vue';
import InfoTile from '@/components/InfoTile.vue';
import SectionCard from '@/components/SectionCard.vue';
import { sum } from '@/composables/useStore';
import { stagesFor, stateOf, statusOf } from '@/data/stages';
import type { ParcelBooking } from '@/data/types';
import AttachmentList from './AttachmentList.vue';
import EarningsCard from './EarningsCard.vue';
import InfoRows from './InfoRows.vue';
import PackageInfo from './PackageInfo.vue';
import PartyCard from './PartyCard.vue';
import PaymentCollection from './PaymentCollection.vue';
import PickupProof from './PickupProof.vue';
import ProgressTimeline from './ProgressTimeline.vue';
import RouteTrackingCard from './RouteTrackingCard.vue';
import StatusHero from './StatusHero.vue';
import { truckOutline } from './helpers';

const props = defineProps<{ booking: ParcelBooking }>();

const stages = computed(() => stagesFor(props.booking));
const state = computed(() => stateOf(props.booking));

const stageIcons: Record<string, string> = {
  confirmed: clipboardOutline,
  collected: cubeOutline,
  hub: businessOutline,
  transit: truckOutline,
  out: truckOutline,
  delivered: checkmarkDoneOutline,
};

const hero = computed(() => {
  const b = props.booking;
  if (state.value === 'canceled' || state.value === 'completed') {
    const s = statusOf(b);
    return { icon: state.value === 'canceled' ? closeCircleOutline : checkmarkDoneOutline, title: s.title, desc: s.desc, danger: state.value === 'canceled' };
  }
  const st = stages.value[b.stage];
  return { icon: stageIcons[st.key], title: st.title, desc: st.desc };
});

/** Before collection the driver heads to the sender, afterwards to the receiver. */
const nextStop = computed(() => (props.booking.stage < 1 ? props.booking.pickup : props.booking.dropoff));

const info = computed(() => {
  const b = props.booking;
  return [
    { label: 'Booking ID', value: b.ref },
    { label: 'Tracking Number', value: b.trackingNo },
    { label: 'Created At', value: b.createdAt },
    { label: 'Accepted At', value: b.acceptedAt },
    { label: 'Shipment Mode', value: b.shipmentMode },
    { label: 'Required Vehicle', value: b.requiredVehicle },
    { label: 'Package Count', value: b.package.quantity },
  ];
});
</script>
