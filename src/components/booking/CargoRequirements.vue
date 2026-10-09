<template>
  <SectionCard title="Cargo & Service Requirements" subtitle="Request schedule, cargo category, and declared shipment value.">
    <div class="grid grid-cols-2 gap-2.5">
      <InfoTile label="Request Type" :value="booking.requestType" />
      <InfoTile label="Pickup Schedule" :value="schedule[0]" :sub="schedule[1]" />
      <InfoTile class="col-span-2" label="Booking Created" :value="created[0]" :sub="created[1]" />
    </div>
    <div class="my-3 border-t border-line-soft" />
    <div class="grid grid-cols-2 gap-2.5">
      <InfoTile label="Declared Value" :value="peso(booking.cargo.declaredValue)" />
      <InfoTile label="Total Weight" :value="booking.cargo.weight" />
      <InfoTile class="col-span-2" label="Cargo Type" :value="booking.cargo.type" />
      <div class="tile col-span-2">
        <p class="text-[8px] text-ink-muted">Item Description</p>
        <p class="mt-1.5 text-[9px] leading-snug text-ink">{{ booking.cargo.description }}</p>
      </div>
    </div>
    <ul class="mt-4 space-y-3 px-2">
      <li v-for="s in booking.cargo.services" :key="s.key" class="flex items-center gap-3 rounded-lg border border-line px-3 py-3.5">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-ocean-50 text-ocean-600">
          <ion-icon :icon="serviceIcons[s.key]" class="text-[17px]" />
        </span>
        <div>
          <p class="text-[10px] font-semibold text-ink">{{ s.title }}</p>
          <p class="mt-1.5 text-[8px] text-ink-muted">{{ s.desc }}</p>
        </div>
      </li>
    </ul>
  </SectionCard>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { cubeOutline, enterOutline, peopleOutline, wineOutline } from 'ionicons/icons';
import { computed } from 'vue';
import InfoTile from '@/components/InfoTile.vue';
import SectionCard from '@/components/SectionCard.vue';
import { peso } from '@/composables/useStore';
import type { VehicleBooking } from '@/data/types';
import { splitStamp } from './helpers';

const props = defineProps<{ booking: VehicleBooking }>();

const serviceIcons = { fragile: wineOutline, loading: enterOutline, unloading: cubeOutline, helper: peopleOutline };

const schedule = computed(() => splitStamp(props.booking.schedule));
const created = computed(() => splitStamp(props.booking.createdAt));
</script>
