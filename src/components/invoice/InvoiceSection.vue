<template>
  <!-- One block of the invoice card: optional icon header + content -->
  <section class="px-4 py-5">
    <div v-if="title || eyebrow" class="mb-4 flex items-center gap-2.5">
      <span v-if="icon" class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ocean-600 text-white">
        <ion-icon :icon="icon" class="text-base" />
      </span>
      <div class="min-w-0">
        <p class="text-[9px] leading-tight font-medium uppercase" :class="toneClass">{{ eyebrow }}</p>
        <h2 v-if="title" class="mt-0.5 text-[11px] leading-tight font-bold text-ink">{{ title }}</h2>
      </div>
    </div>
    <slot />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';

const props = withDefaults(
  defineProps<{ icon?: string; eyebrow?: string; title?: string; tone?: 'ocean' | 'success' | 'danger' }>(),
  { tone: 'ocean' },
);

const toneClass = computed(
  () => ({ ocean: 'text-ocean-600', success: 'text-success', danger: 'text-danger' })[props.tone],
);
</script>
