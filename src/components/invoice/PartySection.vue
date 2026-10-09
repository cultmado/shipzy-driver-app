<template>
  <InvoiceSection :icon="icon" :eyebrow="eyebrow" :title="title" :tone="tone">
    <div class="space-y-3">
      <InvoiceField label="Full Name" :value="contactName ?? party.name" />
      <InvoiceField label="Mobile Number" :value="party.phone" />
      <InvoiceField label="Delivery Address" :value="party.address" />
    </div>
  </InvoiceSection>
</template>

<script setup lang="ts">
import { locationOutline } from 'ionicons/icons';
import type { Party } from '@/data/types';
import InvoiceField from './InvoiceField.vue';
import InvoiceSection from './InvoiceSection.vue';

withDefaults(
  defineProps<{
    party: Party;
    eyebrow: string;
    title: string;
    /** Person shown under "Full name" (defaults to the party name). */
    contactName?: string;
    icon?: string;
    tone?: 'ocean' | 'success' | 'danger';
  }>(),
  { icon: locationOutline, tone: 'ocean', contactName: undefined },
);
</script>
