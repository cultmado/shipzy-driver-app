<template>
  <!-- Origin / destination block with contact details, Call and Navigate actions -->
  <div class="rounded-xl border border-line-soft px-2 py-3.5">
    <div class="flex items-center gap-3 px-1.5">
      <span
        class="flex size-[30px] shrink-0 items-center justify-center rounded-full"
        :class="origin ? 'bg-success-soft text-success ring-1 ring-success/20' : 'bg-danger-soft text-danger ring-1 ring-danger/20'"
      >
        <ion-icon :icon="locationOutline" class="text-base" />
      </span>
      <div>
        <p class="text-[8px] font-bold tracking-wide uppercase" :class="origin ? 'text-success' : 'text-danger'">
          {{ origin ? 'Origin' : 'Destination' }}
        </p>
        <p class="mt-0.5 text-[11px] font-semibold text-ink">{{ origin ? 'Pickup from Address' : 'Deliver to Address' }}</p>
      </div>
    </div>
    <dl class="mt-3 space-y-2.5 px-1.5 text-[9px]">
      <div>
        <dt class="text-ink-muted">{{ origin ? 'Sender' : 'Receiver' }}</dt>
        <dd class="mt-1 font-bold text-ink">{{ party.name }}</dd>
      </div>
      <div>
        <dt class="text-ink-muted">Mobile Number</dt>
        <dd class="mt-1 text-ink">{{ party.phone }}</dd>
      </div>
      <div>
        <dt class="text-ink-muted">Address</dt>
        <dd class="mt-1 leading-snug text-ink">{{ party.address }}</dd>
      </div>
      <div v-if="party.landmark">
        <dt class="text-ink-muted">Landmark</dt>
        <dd class="mt-1 text-ink">{{ party.landmark }}</dd>
      </div>
    </dl>
    <div class="mt-3 space-y-2.5">
      <a :href="telHref(party.phone)" class="btn-outline-ocean h-[38px] w-full py-0 text-[12px] font-medium">
        <ion-icon :icon="callOutline" class="text-lg" />
        {{ origin ? 'Call Sender' : 'Call Receiver' }}
      </a>
      <button type="button" class="btn-ocean h-[38px] w-full py-0 text-[12px] font-medium" @click="openMaps(party.address)">
        <ion-icon :icon="navigateOutline" class="text-lg" />
        Navigate
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { callOutline, locationOutline, navigateOutline } from 'ionicons/icons';
import type { Party } from '@/data/types';
import { openMaps, telHref } from './helpers';

defineProps<{ party: Party; origin?: boolean }>();
</script>
