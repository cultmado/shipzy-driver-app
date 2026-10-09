<template>
  <!-- White sticky bar at the bottom of pushed pages (Save, Confirm, stage actions) -->
  <ion-footer class="ion-no-border">
    <div class="pb-safe border-t border-line-soft bg-surface px-4 pt-2.5">
      <p v-if="stage" class="mb-1.5 text-[10px] text-ink-muted">
        Current Stage: <span class="ml-1 font-semibold text-ink">{{ stage }}</span>
      </p>
      <slot />
    </div>
  </ion-footer>
</template>

<script setup lang="ts">
import { IonFooter } from '@ionic/vue';

defineProps<{ stage?: string }>();
</script>
