<template>
  <!-- Pale band closing the invoice card -->
  <footer class="border-t border-line-soft bg-ocean-50 px-6 pt-5 pb-6 text-center">
    <p class="flex items-center justify-center gap-2 text-[9px] font-semibold text-ink">
      <ion-icon :icon="shieldCheckmarkOutline" class="text-sm text-ocean-600" />
      Thank you for using Shipzy.
    </p>
    <p class="mt-3 text-[9px] leading-snug text-ink-muted">
      For questions about this invoice, please contact Shipzy support and provide your booking reference
      {{ bookingRef }}.
    </p>
  </footer>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { shieldCheckmarkOutline } from 'ionicons/icons';

defineProps<{ bookingRef: string }>();
</script>
