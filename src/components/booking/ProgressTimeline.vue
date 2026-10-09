<template>
  <!-- Parcel / Pabili "Delivery Progress": numbered steps joined by a vertical line -->
  <ol>
    <li v-for="(s, i) in stages" :key="s.key" class="flex gap-3.5">
      <div class="flex flex-col items-center">
        <span
          class="flex size-10 shrink-0 items-center justify-center rounded-full"
          :class="stateOf(i) === 'pending' ? 'bg-line-soft text-ink-muted' : 'bg-ocean-600 text-white'"
        >
          <ion-icon v-if="stateOf(i) === 'done'" :icon="checkmark" class="text-xl" />
          <ion-icon v-else-if="stateOf(i) === 'current'" :icon="currentIcon ?? truckOutline" class="text-xl" />
          <span v-else class="text-base font-semibold">{{ i + 1 }}</span>
        </span>
        <span
          v-if="i < stages.length - 1"
          class="min-h-6 w-0.5 flex-1"
          :class="i < current ? 'bg-ocean-600' : 'bg-line-soft'"
        />
      </div>
      <div class="min-w-0 pt-0.5" :class="i < stages.length - 1 ? 'pb-4' : ''">
        <p class="text-[10px] font-semibold" :class="stateOf(i) === 'pending' ? 'text-ink-subtle' : 'text-ink'">{{ s.title }}</p>
        <p class="mt-1 text-[8px] font-semibold text-ink-muted">{{ stateOf(i) === 'pending' ? 'Pending' : times[i] ?? '' }}</p>
        <p class="mt-1 text-[8px] leading-snug text-ink-muted">{{ s.desc }}</p>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { checkmark } from 'ionicons/icons';
import type { Stage } from '@/data/types';
import { truckOutline } from './helpers';

const props = defineProps<{
  stages: Stage[];
  current: number;
  times: string[];
  /** All stages done (the last stage is reached). */
  completed?: boolean;
  currentIcon?: string;
}>();

function stateOf(i: number): 'done' | 'current' | 'pending' {
  if (i < props.current || (props.completed && i === props.current)) return 'done';
  return i === props.current ? 'current' : 'pending';
}
</script>
