<template>
  <SectionCard title="Pickup Proof" subtitle="Photo and details captured when the parcel was collected.">
    <ul class="space-y-1.5 px-2">
      <li class="flex items-center gap-3 rounded-lg border border-line-soft px-3 py-3">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ocean-50 text-ocean-600">
          <ion-icon :icon="cameraOutline" class="text-lg" />
        </span>
        <div>
          <p class="text-[9px] text-ink-muted">Pickup Photo</p>
          <p class="mt-1 text-[10px] font-semibold text-ink">{{ proof.photo }}</p>
        </div>
      </li>
      <li v-for="r in rows" :key="r.label" class="rounded-lg border border-line-soft px-3 py-3">
        <p class="text-[9px] text-ink-muted">{{ r.label }}</p>
        <p class="mt-1 text-[10px] font-semibold text-ink">{{ r.value }}</p>
      </li>
    </ul>
  </SectionCard>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { cameraOutline } from 'ionicons/icons';
import { computed } from 'vue';
import SectionCard from '@/components/SectionCard.vue';
import type { ParcelBooking } from '@/data/types';

const props = defineProps<{ proof: NonNullable<ParcelBooking['pickupProof']> }>();

const rows = computed(() => [
  { label: 'Parcel Condition', value: props.proof.condition },
  { label: 'Quantity Collected', value: props.proof.quantity },
  { label: 'Uploaded At', value: props.proof.uploadedAt },
  { label: 'Pickup Notes', value: props.proof.notes },
]);
</script>
