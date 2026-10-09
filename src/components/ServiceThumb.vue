<template>
  <!-- Pale tile with the service illustration (Pabili bags, parcel box, van) -->
  <span class="flex shrink-0 items-center justify-center rounded-lg" :class="[sizeClass, bgClass]">
    <img :src="img[serviceMeta[type].image]" alt="" class="h-[78%] w-[78%] object-contain" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { img } from '@/assets/images';
import { serviceMeta } from '@/data/stages';
import type { ServiceType } from '@/data/types';

const props = withDefaults(defineProps<{ type: ServiceType; size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' });

const sizeClass = computed(() => ({ sm: 'size-8', md: 'size-10', lg: 'size-14' })[props.size]);
const bgClass = computed(() =>
  ({ pabili: 'bg-primary-50', parcel: 'bg-success-soft', vehicle: 'bg-amber-soft' })[props.type],
);
</script>
