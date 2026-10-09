<template>
  <!-- Round blue icon + title/description, used for sub-sections inside a step -->
  <div class="flex items-center gap-3">
    <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
      <ion-icon :icon="icon" class="text-lg" />
    </span>
    <div class="min-w-0">
      <h3 class="text-[15px] leading-tight font-semibold text-ink">{{ title }}</h3>
      <p class="mt-0.5 text-[9px] text-ink-muted">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

defineProps<{ icon: string; title: string; description: string }>();
</script>
