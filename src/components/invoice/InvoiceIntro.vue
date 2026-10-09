<template>
  <!-- Logo, eyebrow, description and the invoice/booking numbers -->
  <section class="px-4 pt-5 pb-6">
    <AppLogo class="mx-auto w-[90px]" />
    <p class="mt-5 text-[9px] font-semibold uppercase text-ocean-600">{{ eyebrow }}</p>
    <p class="mt-2 text-[9px] leading-snug text-ink-muted">{{ description }}</p>
    <div class="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
      <InvoiceField label="Invoice No." :value="invoice.no" />
      <InvoiceField label="Booking No." :value="bookingRef" />
      <InvoiceField label="Invoice Date" :value="invoice.date" />
      <InvoiceField label="Time" :value="invoice.time" />
    </div>
  </section>
</template>

<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue';
import type { Invoice } from '@/data/types';
import InvoiceField from './InvoiceField.vue';

defineProps<{ eyebrow: string; description: string; invoice: Invoice; bookingRef: string }>();
</script>
