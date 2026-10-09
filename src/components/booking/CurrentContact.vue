<template>
  <SectionCard title="Current Contact" :subtitle="subtitle">
    <div class="flex items-center gap-3">
      <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-ocean-600 text-[15px] font-semibold text-white">
        {{ initials(name) }}
      </span>
      <div class="min-w-0">
        <p class="text-[10px] font-semibold text-ink">{{ name }}</p>
        <p class="mt-1 text-[8px] text-ink-muted">{{ role }}</p>
        <p class="mt-0.5 text-[8px] font-semibold text-ocean-600">{{ place }}</p>
      </div>
    </div>
    <a :href="telHref(phone)" class="btn-ocean mt-2 h-[38px] w-full py-0 text-[12px] font-medium">
      <ion-icon :icon="callOutline" class="text-lg" />
      Call Contact
    </a>
  </SectionCard>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { callOutline } from 'ionicons/icons';
import SectionCard from '@/components/SectionCard.vue';
import { initials, telHref } from './helpers';

defineProps<{ name: string; role: string; place: string; phone: string; subtitle: string }>();
</script>
