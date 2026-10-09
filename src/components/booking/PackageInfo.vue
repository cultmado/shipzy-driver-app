<template>
  <SectionCard title="Package Information" subtitle="Declared shipment specifications and packaging.">
    <div class="flex items-start gap-2.5">
      <span class="flex size-[115px] shrink-0 items-center justify-center rounded-sm bg-ocean-600">
        <img :src="img.parcelBox" alt="" class="w-[70px] object-contain" />
      </span>
      <ul class="space-y-1.5">
        <li
          v-for="h in pkg.handling"
          :key="h"
          class="flex items-center gap-2 rounded-sm bg-warning-soft px-2 py-1.5 text-[10px] text-warning"
        >
          <ion-icon :icon="warningOutline" class="text-base" />
          {{ h }}
        </li>
      </ul>
    </div>
    <div class="mt-3.5 grid grid-cols-3 gap-2.5">
      <InfoTile label="Type" :value="pkg.type" />
      <InfoTile label="Size" :value="pkg.size" />
      <InfoTile label="Quantity" :value="pkg.quantity" />
      <InfoTile label="Verified Weight" :value="pkg.weight" />
      <InfoTile label="Dimensions" :value="pkg.dimensions" />
      <InfoTile label="Total CBM" :value="pkg.cbm" />
    </div>
    <div class="mt-2.5 grid grid-cols-2 gap-2.5">
      <InfoTile label="Declared Value" :value="peso(pkg.declaredValue)" accent />
      <InfoTile label="Shipment Mode" :value="mode" />
      <InfoTile class="col-span-2" label="Tracking Number" :value="trackingNo" accent />
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { warningOutline } from 'ionicons/icons';
import { img } from '@/assets/images';
import InfoTile from '@/components/InfoTile.vue';
import SectionCard from '@/components/SectionCard.vue';
import { peso } from '@/composables/useStore';
import type { ParcelBooking } from '@/data/types';

defineProps<{ pkg: ParcelBooking['package']; mode: string; trackingNo: string }>();
</script>
