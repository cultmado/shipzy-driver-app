<template>
  <SectionCard title="Delivery Earnings" subtitle="Estimated earnings for this shipment.">
    <div class="px-2">
      <div v-for="r in rows" :key="r.label" class="flex items-center justify-between gap-4 py-[7px] text-[9px]">
        <span class="text-ink-2">{{ r.label }}</span>
        <span class="font-semibold text-ink">{{ peso(r.amount) }}</span>
      </div>
      <div class="mt-2 flex items-center justify-between border-t border-line-soft pt-3.5 pb-1">
        <span class="text-[10px] font-semibold text-ink">Total Paid</span>
        <span class="text-[16px] font-bold text-ocean-600">{{ peso(sum(rows)) }}</span>
      </div>
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
import SectionCard from '@/components/SectionCard.vue';
import { peso, sum } from '@/composables/useStore';
import type { Fee } from '@/data/types';

defineProps<{ rows: Fee[] }>();
</script>
