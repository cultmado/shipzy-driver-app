<template>
  <InvoiceSection eyebrow="Payment Summary">
    <div class="-mt-1">
      <KeyValueRow v-for="fee in fees" :key="fee.label" :label="fee.label" :value="peso(fee.amount)" />
    </div>
    <div class="mt-3 flex items-end justify-between gap-3 border-t border-line-soft pt-4">
      <div>
        <p class="text-[9px] uppercase text-ink-muted">Total Amount</p>
        <p class="mt-1 text-[9px] text-ink-muted">Inclusive of all applicable fees</p>
      </div>
      <p class="text-[15px] font-bold text-ocean-600">{{ peso(sum(fees)) }}</p>
    </div>
  </InvoiceSection>
</template>

<script setup lang="ts">
import { peso, sum } from '@/composables/useStore';
import type { Fee } from '@/data/types';
import InvoiceSection from './InvoiceSection.vue';
import KeyValueRow from './KeyValueRow.vue';

defineProps<{ fees: Fee[] }>();
</script>
