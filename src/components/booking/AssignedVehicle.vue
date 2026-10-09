<template>
  <SectionCard title="Assigned Vehicle">
    <div class="mx-2 flex items-center gap-3 rounded-sm bg-soft px-3 py-3.5">
      <span class="flex size-[64px] shrink-0 items-center justify-center rounded-lg bg-surface">
        <img :src="img[vehicle.image]" alt="" class="w-[54px] object-contain" />
      </span>
      <div class="min-w-0">
        <p class="text-[12px] font-semibold text-ink">{{ vehicle.name }}</p>
        <p class="mt-1.5 text-[8px] text-ink-muted">{{ vehicle.capacity }}</p>
        <p class="mt-1.5 text-[8px] font-bold text-ocean-600">{{ vehicle.plate }}</p>
      </div>
    </div>
    <div class="mx-2 mt-2.5 grid grid-cols-2 gap-2.5">
      <div v-for="t in tiles" :key="t.label" class="rounded-sm bg-soft px-3 py-3">
        <p class="text-[11px] font-semibold text-ink">{{ t.value }}</p>
        <p class="mt-1 text-[8px] text-ink-muted">{{ t.label }}</p>
      </div>
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { img } from '@/assets/images';
import SectionCard from '@/components/SectionCard.vue';
import type { VehicleBooking } from '@/data/types';

const props = defineProps<{ vehicle: VehicleBooking['vehicle']; weight: string }>();

const tiles = computed(() => [
  { label: 'Cargo Weight', value: props.weight },
  { label: 'Capacity Usage', value: props.vehicle.capacityUsage },
]);
</script>
