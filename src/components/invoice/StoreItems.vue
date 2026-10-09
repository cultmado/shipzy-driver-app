<template>
  <!-- One store of a Pabili order: header row with store total, then its items -->
  <div class="overflow-hidden rounded-lg border border-line-soft">
    <div class="flex items-center gap-3 bg-surface px-3 py-2.5">
      <LogoThumb />
      <div class="min-w-0 flex-1">
        <p class="truncate text-[9px] font-semibold text-ink">{{ store.name }}</p>
        <p class="mt-0.5 truncate text-[7px] text-ink-muted">{{ store.address }}</p>
      </div>
      <p class="text-[8px] font-bold text-ink">{{ peso(total) }}</p>
    </div>
    <ul class="divide-y divide-line-soft border-t border-line-soft bg-soft">
      <li v-for="(item, i) in store.items" :key="i" class="flex items-center gap-3 px-3 py-2">
        <LogoThumb />
        <div class="min-w-0 flex-1">
          <p class="truncate text-[8px] font-medium text-ink">{{ item.name }}</p>
          <p class="mt-0.5 text-[7px] text-ink-muted">{{ peso(item.price) }} × {{ item.qty }}</p>
        </div>
        <p class="text-[8px] font-bold text-ink">{{ peso(item.price * item.qty) }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { peso } from '@/composables/useStore';
import type { PabiliStore } from '@/data/types';
import LogoThumb from './LogoThumb.vue';

const props = defineProps<{ store: PabiliStore }>();

const total = computed(() => props.store.items.reduce((s, i) => s + i.price * i.qty, 0));
</script>
