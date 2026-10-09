<template>
  <article class="card p-3">
    <div class="flex gap-3">
      <span class="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary-50">
        <img :src="img[serviceMeta[booking.type].image]" alt="" class="size-12 object-contain" />
      </span>
      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <p class="text-[11px] font-semibold text-ink">{{ serviceMeta[booking.type].name }}</p>
          <button class="-mt-1 -mr-1 p-1 text-ink-muted" aria-label="More actions" @click="$emit('more', booking)">
            <ion-icon :icon="ellipsisVertical" class="text-base" />
          </button>
        </div>
        <div class="flex items-center justify-between gap-2">
          <p class="truncate text-[13px] font-bold text-ink">{{ booking.ref }}</p>
          <p class="shrink-0 text-sm font-bold text-ink">{{ peso(booking.amount) }}</p>
        </div>
        <p class="mt-1 flex items-center gap-1.5 text-[9px] text-ink-muted">
          <ion-icon :icon="calendarOutline" class="text-[11px]" /> {{ booking.date }}
          <span class="text-ink-subtle">•</span> {{ booking.time }}
        </p>
      </div>
    </div>

    <div class="mt-3 grid grid-cols-2 gap-2">
      <div class="flex min-w-0 items-start gap-2">
        <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-success-soft text-success">
          <ion-icon :icon="locationOutline" class="text-xs" />
        </span>
        <div class="min-w-0">
          <p class="text-[7px] font-medium tracking-wide text-ink-muted">PICKUP</p>
          <p class="truncate text-[9px] text-ink">{{ booking.pickup.area }}</p>
        </div>
      </div>
      <div class="flex min-w-0 items-start gap-2">
        <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-danger-soft text-danger">
          <ion-icon :icon="flagOutline" class="text-xs" />
        </span>
        <div class="min-w-0">
          <p class="text-[7px] font-medium tracking-wide text-ink-muted">DROP-OFF</p>
          <p class="truncate text-[9px] text-ink">{{ booking.dropoff.area }}</p>
        </div>
      </div>
    </div>

    <div class="mt-3 flex items-end justify-between gap-3">
      <div class="min-w-0">
        <p class="flex items-center gap-1.5 text-[9px] font-semibold" :class="toneClasses[status.tone].text">
          <span class="size-1.5 rounded-full" :class="toneClasses[status.tone].dot" />
          {{ status.title }}
        </p>
        <p class="mt-0.5 truncate text-[8px] text-ink-muted">{{ status.desc }}</p>
      </div>
      <router-link
        :to="`/bookings/${booking.id}`"
        class="flex shrink-0 items-center gap-1 text-[9px] font-semibold text-primary-600"
      >
        View Details <ion-icon :icon="arrowForward" class="text-xs" />
      </router-link>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import { arrowForward, calendarOutline, ellipsisVertical, flagOutline, locationOutline } from 'ionicons/icons';
import { img } from '@/assets/images';
import { serviceMeta, statusOf, toneClasses } from '@/data/stages';
import type { Booking } from '@/data/types';
import { peso } from '@/composables/useStore';

const props = defineProps<{ booking: Booking }>();
defineEmits<{ more: [booking: Booking] }>();

const status = computed(() => statusOf(props.booking));
</script>
