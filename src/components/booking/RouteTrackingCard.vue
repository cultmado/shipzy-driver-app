<template>
  <SectionCard title="Route Tracking" subtitle="Pickup, additional stops, and final drop-off.">
    <div class="px-2">
      <a
        v-if="address"
        :href="mapsUrl(address)"
        target="_blank"
        rel="noopener"
        class="btn-outline-ocean mb-3 h-[38px] w-full py-0 text-[12px] font-medium"
      >
        <ion-icon :icon="openOutline" class="text-lg" />
        Open in Google Maps
      </a>
      <MapPreview class="h-[238px]" :show-driver="showDriver" />
    </div>
    <div class="mt-3 grid grid-cols-2 gap-2.5">
      <slot />
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { openOutline } from 'ionicons/icons';
import MapPreview from '@/components/MapPreview.vue';
import SectionCard from '@/components/SectionCard.vue';
import { mapsUrl } from './helpers';

withDefaults(defineProps<{ address?: string; showDriver?: boolean }>(), { showDriver: true });
</script>
