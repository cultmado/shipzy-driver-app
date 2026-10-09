<template>
  <!-- Vehicle "Delivery Timeline": done (green), current (teal), upcoming (pale) -->
  <ol>
    <li v-for="(e, i) in events" :key="e.key" class="flex gap-3.5">
      <div class="flex flex-col items-center">
        <span
          class="flex size-8 shrink-0 items-center justify-center rounded-full"
          :class="{
            'bg-success text-white': e.state === 'done',
            'bg-ocean-600 text-white': e.state === 'current',
            'bg-soft-2 text-ink-subtle': e.state === 'upcoming',
          }"
        >
          <ion-icon :icon="e.icon" class="text-base" />
        </span>
        <span v-if="i < events.length - 1" class="min-h-3 w-px flex-1 bg-line" />
      </div>
      <div class="min-w-0 pt-px" :class="i < events.length - 1 ? 'pb-4' : ''">
        <p class="text-[10px] font-semibold text-ink">{{ e.title }}</p>
        <p class="mt-1 text-[8px] leading-snug text-ink-muted">{{ e.desc }}</p>
        <p v-if="e.time" class="mt-2 text-[8px] text-ink-muted">
          <span class="font-medium text-ink">{{ e.time[0] }}</span>
          <template v-if="e.time[1]"><span class="mx-1">•</span>{{ e.time[1] }}</template>
        </p>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

export interface TimelineEvent {
  key: string;
  title: string;
  desc: string;
  icon: string;
  state: 'done' | 'current' | 'upcoming';
  /** [date, time] */
  time?: [string, string];
}

defineProps<{ events: TimelineEvent[] }>();
</script>
