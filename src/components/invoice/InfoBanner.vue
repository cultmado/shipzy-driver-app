<template>
  <!-- Blue banner: ⓘ disclaimer, Estimated Delivery, Additional Notes, Payment Information -->
  <div class="flex gap-2.5 rounded-lg border px-3 py-3" :class="strong ? 'border-[#bcdcf5] bg-[#d9ebfb]' : 'border-[#d3e6f6] bg-[#eef6fd]'">
    <ion-icon :icon="icon" class="mt-px shrink-0 text-base text-ocean-600" />
    <div class="min-w-0">
      <p v-if="title" class="text-[9px] font-semibold text-ink">{{ title }}</p>
      <p class="text-[9px] leading-snug" :class="title ? 'mt-0.5 text-ink-muted' : 'text-ink-muted'">
        <slot />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { informationCircleOutline } from 'ionicons/icons';

withDefaults(defineProps<{ icon?: string; title?: string; strong?: boolean }>(), {
  icon: informationCircleOutline,
  title: undefined,
});
</script>
