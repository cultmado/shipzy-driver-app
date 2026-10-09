<template>
  <SectionCard title="Delivery Information" subtitle="Where and when your items will be delivered.">
    <ul class="space-y-2.5">
      <li v-for="r in rows" :key="r.label" class="flex items-start gap-3 rounded-lg border border-line-soft px-3 py-3.5">
        <span class="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-ocean-50 text-ocean-600">
          <ion-icon :icon="r.icon" class="text-base" />
        </span>
        <div class="min-w-0 pt-0.5">
          <p class="text-[8px] text-ink-muted" :class="r.caps ? 'tracking-wide uppercase' : ''">{{ r.label }}</p>
          <p class="mt-1 text-[8px] leading-snug text-ink" :class="r.caps ? 'font-semibold' : ''">{{ r.value }}</p>
          <p v-if="r.sub" class="mt-1 text-[8px] text-ink-muted">{{ r.sub }}</p>
          <a
            v-if="r.link"
            :href="r.link.href"
            :target="r.link.external ? '_blank' : undefined"
            rel="noopener"
            class="mt-2 inline-flex items-center gap-1.5 text-[6px] font-semibold text-ocean-600"
          >
            <ion-icon :icon="r.link.icon" class="text-[10px]" />
            {{ r.link.label }}
          </a>
        </div>
      </li>
    </ul>
  </SectionCard>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { callOutline, calendarOutline, locationOutline, navigateOutline, personOutline } from 'ionicons/icons';
import { computed } from 'vue';
import SectionCard from '@/components/SectionCard.vue';
import type { Party } from '@/data/types';
import { mapsUrl, telHref } from './helpers';

const props = defineProps<{ customer: Party; schedule: string; deliveryType: string }>();

const rows = computed(() => [
  {
    label: 'Delivery Address',
    caps: true,
    icon: locationOutline,
    value: props.customer.address,
    link: { label: 'Navigate to Customer', icon: navigateOutline, href: mapsUrl(props.customer.address), external: true },
  },
  {
    label: 'Customer',
    icon: personOutline,
    value: props.customer.name,
    sub: props.customer.phone,
    link: { label: 'Call Customer', icon: callOutline, href: telHref(props.customer.phone) },
  },
  { label: `${props.deliveryType} Delivery`, icon: calendarOutline, value: props.schedule },
]);
</script>
