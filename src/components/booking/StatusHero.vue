<template>
  <!-- Pale "Current status" card at the top of every booking detail page -->
  <section class="rounded-2xl border p-3 shadow-card" :class="danger ? 'border-danger/15 bg-danger-soft' : 'border-line-soft bg-ocean-50'">
    <div class="flex items-start gap-3.5 pr-6">
      <span class="flex size-9 shrink-0 items-center justify-center rounded-full text-white" :class="danger ? 'bg-danger' : 'bg-ocean-600'">
        <ion-icon :icon="icon" class="text-[17px]" />
      </span>
      <div class="min-w-0 pt-px">
        <p class="text-[10px] font-semibold" :class="[danger ? 'text-danger' : 'text-ocean-600', titleCase ? '' : 'tracking-wide uppercase']">
          Current Status
        </p>
        <h2 class="mt-1 text-[13px] leading-tight font-bold text-ink">{{ title }}</h2>
        <p class="mt-1.5 text-[9px] leading-snug text-ink-muted">{{ desc }}</p>
      </div>
    </div>
    <div v-if="tiles?.length" class="mt-3 grid gap-2" :class="tiles.length > 1 ? 'grid-cols-3' : 'grid-cols-1'">
      <div v-for="t in tiles" :key="t.label" class="rounded-sm bg-surface px-3 py-2.5">
        <p class="text-[8px] text-ink-muted">{{ t.label }}</p>
        <p class="mt-1.5 text-[8px] font-semibold text-ink">{{ t.value }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

defineProps<{
  icon: string;
  title: string;
  desc: string;
  tiles?: { label: string; value: string }[];
  /** Red variant for canceled bookings. */
  danger?: boolean;
  /** Pabili shows the eyebrow in title case instead of caps. */
  titleCase?: boolean;
}>();
</script>
