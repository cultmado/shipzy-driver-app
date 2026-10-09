<template>
  <PartySection
    :party="booking.pickup"
    :contact-name="contactOf(booking.pickup, 'Contact:')"
    eyebrow="Pick-up"
    :title="booking.pickup.name"
    tone="success"
  />
  <PartySection
    :party="booking.dropoff"
    :contact-name="contactOf(booking.dropoff, 'Receiver:')"
    eyebrow="Destination"
    title="Final Drop-off"
    tone="danger"
  />

  <InvoiceSection :icon="locationOutline" eyebrow="Vehicle Request Details" title="Package Information">
    <IllustrationTile :src="img[booking.vehicle.image]" />
    <div class="mt-4 grid grid-cols-3 gap-2">
      <InfoTile label="Vehicle" :value="booking.vehicle.name" />
      <InfoTile label="Capacity" :value="booking.vehicle.capacity.replace(/^Capacity\s+/i, '')" />
      <InfoTile label="Plate Number" :value="booking.vehicle.plate" />
      <InfoTile label="Cargo Type" :value="booking.cargo.type" />
      <InfoTile label="Total Weight" :value="booking.cargo.weight" />
      <InfoTile label="Request Type" :value="booking.requestType" />
    </div>
    <div class="mt-2 grid grid-cols-2 gap-2">
      <InfoTile label="Declared Value" :value="peso(booking.cargo.declaredValue)" accent />
      <InfoTile label="Distance" :value="booking.route.distance" />
      <InfoTile label="Pickup Schedule" :value="booking.schedule" />
      <InfoTile label="Travel Duration" :value="booking.route.travelTime" />
    </div>
  </InvoiceSection>

  <InvoiceSection v-if="booking.stops.length" eyebrow="Route Stops">
    <div class="space-y-3">
      <div v-for="(stop, i) in booking.stops" :key="i" class="rounded-lg border border-line-soft bg-soft px-3 py-3.5">
        <p class="text-[8px] font-semibold uppercase text-amber">Stop {{ i + 1 }}</p>
        <p class="mt-2 text-[11px] font-bold text-ink">{{ stop.name }}</p>
        <p class="mt-2 text-[8px] font-medium uppercase text-ink">{{ stop.address }}</p>
        <p class="mt-2 text-[8px] font-medium uppercase text-ink">{{ stop.contact }} · {{ stop.phone }}</p>
      </div>
    </div>
  </InvoiceSection>

  <InvoiceSection eyebrow="Cargo and Service Notes">
    <div class="space-y-2.5">
      <div class="rounded-lg border border-line-soft bg-soft px-3 py-3.5">
        <p class="text-[9px] font-medium text-amber">Item Description</p>
        <p class="mt-2.5 text-[8px] leading-snug uppercase text-ink">{{ booking.cargo.description }}</p>
      </div>
      <div
        v-for="service in services"
        :key="service.key"
        class="flex items-center gap-3 rounded-lg border border-line-soft bg-surface px-3 py-2"
      >
        <ion-icon :icon="checkmarkCircleOutline" class="text-base text-success" />
        <span class="text-[8px] font-semibold uppercase text-ink">{{ service.label }}</span>
      </div>
      <InfoBanner v-if="booking.notes" :icon="documentTextOutline" title="Additional Notes" strong>
        {{ booking.notes }}
      </InfoBanner>
      <InfoBanner :icon="cardOutline" title="Payment Information">
        {{ paymentLine }}
      </InfoBanner>
    </div>
  </InvoiceSection>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import { cardOutline, checkmarkCircleOutline, documentTextOutline, locationOutline } from 'ionicons/icons';
import { img } from '@/assets/images';
import InfoTile from '@/components/InfoTile.vue';
import { peso } from '@/composables/useStore';
import type { Party, VehicleBooking } from '@/data/types';
import IllustrationTile from './IllustrationTile.vue';
import InfoBanner from './InfoBanner.vue';
import InvoiceSection from './InvoiceSection.vue';
import PartySection from './PartySection.vue';

const props = defineProps<{ booking: VehicleBooking }>();

// Landmarks carry the on-site contact ("Contact: Ken Barchita"); fall back to the party name.
function contactOf(party: Party, prefix: string) {
  return party.landmark?.startsWith(prefix) ? party.landmark.slice(prefix.length).trim() : party.name;
}

const serviceLabels = {
  loading: 'Loading Assistance',
  unloading: 'Unloading Assistance',
  helper: '1 Additional Helper',
  fragile: 'Fragile Item Handling',
};
const order = ['loading', 'unloading', 'helper', 'fragile'] as const;

const services = computed(() =>
  order
    .filter((key) => props.booking.cargo.services.some((s) => s.key === key))
    .map((key) => ({ key, label: serviceLabels[key] })),
);

const paymentLine = computed(() => {
  const { method, transactionId } = props.booking.payment;
  const via = method === 'GCash' ? 'GCash Transfer' : 'Cash Payment';
  return transactionId ? `${via} · Transaction ${transactionId}` : via;
});
</script>
