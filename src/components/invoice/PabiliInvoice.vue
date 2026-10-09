<template>
  <PartySection
    :party="booking.dropoff"
    :icon="personOutline"
    eyebrow="Billed To"
    title="Customer Information"
  />

  <InvoiceSection :icon="clipboardOutline" eyebrow="Booking Details" title="Service Information">
    <KeyValueRow label="Service" :value="serviceMeta.pabili.name" />
    <KeyValueRow label="Delivery Type" :value="`${booking.deliveryType} Delivery`" />
    <KeyValueRow label="Schedule" :value="booking.schedule.replace(' at ', ' • ')" />
    <KeyValueRow label="Payment Method" :value="booking.payment.method" />
    <KeyValueRow label="Payment Status">
      <span class="chip" :class="booking.payment.status === 'Paid' ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'">
        {{ booking.payment.status }}
      </span>
    </KeyValueRow>
  </InvoiceSection>

  <InvoiceSection :icon="basketOutline" eyebrow="Order Breakdown" title="Purchased Items">
    <div class="space-y-3">
      <StoreItems v-for="store in booking.stores" :key="store.name" :store="store" />
    </div>
  </InvoiceSection>

  <InvoiceSection eyebrow="Customer Notes">
    <div class="space-y-3">
      <NoteBox v-if="booking.notes">{{ booking.notes }}</NoteBox>
      <InfoBanner>
        This invoice is generated for your Shipzy Pabili booking. Store receipts may be viewed separately from the
        booking details page.
      </InfoBanner>
    </div>
  </InvoiceSection>
</template>

<script setup lang="ts">
import { basketOutline, clipboardOutline, personOutline } from 'ionicons/icons';
import { serviceMeta } from '@/data/stages';
import type { PabiliBooking } from '@/data/types';
import InfoBanner from './InfoBanner.vue';
import InvoiceSection from './InvoiceSection.vue';
import KeyValueRow from './KeyValueRow.vue';
import NoteBox from './NoteBox.vue';
import PartySection from './PartySection.vue';
import StoreItems from './StoreItems.vue';

defineProps<{ booking: PabiliBooking }>();
</script>
