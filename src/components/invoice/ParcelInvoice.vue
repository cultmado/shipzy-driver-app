<template>
  <PartySection :party="booking.pickup" eyebrow="Origin" title="Pickup from Address" tone="success" />
  <PartySection :party="booking.dropoff" eyebrow="Destination" title="Deliver to Address" tone="danger" />

  <InvoiceSection :icon="locationOutline" eyebrow="Shipment Details" title="Package Information">
    <IllustrationTile :src="img.parcelBox" />
    <div class="mt-4 grid grid-cols-3 gap-2">
      <InfoTile label="Type" :value="pkg.type" />
      <InfoTile label="Size" :value="pkg.size" />
      <InfoTile label="Quantity" :value="pkg.quantity" />
      <InfoTile label="Verified Weight" :value="pkg.weight" />
      <InfoTile label="Dimensions"><span class="whitespace-nowrap">{{ pkg.dimensions }}</span></InfoTile>
      <InfoTile label="Total CBM" :value="pkg.cbm" />
    </div>
    <div class="mt-2 grid grid-cols-2 gap-2">
      <InfoTile label="Declared Value" :value="peso(pkg.declaredValue)" accent />
      <InfoTile label="Shipment Mode" :value="booking.shipmentMode" />
      <InfoTile class="col-span-2" label="Payment Mode" :value="booking.payment.method" />
      <InfoTile class="col-span-2" label="Tracking Number" :value="booking.trackingNo" />
    </div>
  </InvoiceSection>

  <InvoiceSection eyebrow="Handling Notes">
    <div class="space-y-3">
      <NoteBox v-if="booking.notes">{{ booking.notes }}</NoteBox>
      <InfoBanner :icon="calendarOutline" title="Estimated Delivery" strong>{{ booking.estimatedDelivery }}</InfoBanner>
      <InfoBanner>
        The final shipment amount is based on verified package dimensions, weight, service mode, insurance, and
        applicable charges.
      </InfoBanner>
    </div>
  </InvoiceSection>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { calendarOutline, locationOutline } from 'ionicons/icons';
import { img } from '@/assets/images';
import InfoTile from '@/components/InfoTile.vue';
import { peso } from '@/composables/useStore';
import type { ParcelBooking } from '@/data/types';
import IllustrationTile from './IllustrationTile.vue';
import InfoBanner from './InfoBanner.vue';
import InvoiceSection from './InvoiceSection.vue';
import NoteBox from './NoteBox.vue';
import PartySection from './PartySection.vue';

const props = defineProps<{ booking: ParcelBooking }>();

const pkg = computed(() => props.booking.package);
</script>
