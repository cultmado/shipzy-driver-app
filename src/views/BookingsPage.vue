<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <PageHeader title="My Bookings" subtitle="Track and manage all your bookings in one place." />

      <div class="space-y-4 px-4 pb-28">
        <!-- Summary -->
        <div class="card grid grid-cols-5 divide-x divide-line-soft px-1 py-4">
          <button
            v-for="s in summary"
            :key="s.key"
            class="flex flex-col items-center gap-1.5 px-1"
            @click="filter = s.key"
          >
            <span class="flex size-8 items-center justify-center rounded-lg" :class="s.tint">
              <ion-icon :icon="s.icon" class="text-lg" />
            </span>
            <span class="text-lg leading-none font-bold text-ink-2">{{ s.count }}</span>
            <span class="text-[9px] text-ink">{{ s.label }}</span>
          </button>
        </div>

        <!-- Filter chips -->
        <div class="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
          <button
            v-for="s in summary"
            :key="s.key"
            class="h-[27px] min-w-[52px] shrink-0 rounded-md border px-4 text-[9px] font-medium transition"
            :class="filter === s.key ? 'border-primary-600 bg-primary-600 text-white' : 'border-line-soft bg-surface text-ink'"
            @click="filter = s.key"
          >
            {{ s.key === 'all' ? 'All' : s.label }}
          </button>
        </div>

        <!-- Search + filter -->
        <div class="flex gap-3">
          <div class="relative flex-1">
            <ion-icon :icon="searchOutline" class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base text-ink-muted" />
            <input
              v-model="query"
              type="search"
              class="input h-[34px] rounded-lg border-line-soft pl-9 text-[9px]"
              placeholder="Search by Booking ID, service, date or status..."
            />
          </div>
          <button
            class="flex h-[34px] items-center gap-1.5 rounded-lg border px-3 text-[9px] font-medium"
            :class="service ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-line-soft bg-surface text-ink'"
            @click="chooseService"
          >
            <ion-icon :icon="funnelOutline" class="text-sm" /> {{ service ? serviceMeta[service].short : 'Filter' }}
          </button>
        </div>

        <!-- List -->
        <div class="space-y-3">
          <BookingCard v-for="b in list" :key="b.id" :booking="b" @more="openActions" />

          <div v-if="!list.length" class="card flex flex-col items-center px-6 py-10 text-center">
            <img :src="img.statClipboard" alt="" class="w-16" />
            <p class="mt-3 text-sm font-semibold text-ink">No bookings found</p>
            <p class="mt-1 text-[11px] text-ink-muted">Try another filter or search term.</p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { IonContent, IonIcon, IonPage, actionSheetController, useIonRouter } from '@ionic/vue';
import {
  calendarClearOutline,
  cartOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  funnelOutline,
  searchOutline,
  timeOutline,
} from 'ionicons/icons';
import { img } from '@/assets/images';
import { serviceMeta, stateOf, statusOf } from '@/data/stages';
import type { Booking, BookingState, ServiceType } from '@/data/types';
import { useStore } from '@/composables/useStore';
import BookingCard from '@/components/BookingCard.vue';
import PageHeader from '@/components/PageHeader.vue';

const { bookings, active, pending, completed, canceled } = useStore();
const ionRouter = useIonRouter();

const filter = ref<BookingState | 'all'>('all');
const service = ref<ServiceType>();
const query = ref('');

const summary = computed(() => [
  { key: 'all' as const, label: 'Total', count: bookings.length, icon: calendarClearOutline, tint: 'bg-primary-50 text-primary-600' },
  { key: 'active' as const, label: 'Active', count: active.value.length, icon: timeOutline, tint: 'bg-success-soft text-success' },
  { key: 'pending' as const, label: 'Pending', count: pending.value.length, icon: cartOutline, tint: 'bg-warning-soft text-warning' },
  { key: 'completed' as const, label: 'Completed', count: completed.value.length, icon: checkmarkCircleOutline, tint: 'bg-primary-50 text-primary-600' },
  { key: 'canceled' as const, label: 'Canceled', count: canceled.value.length, icon: closeCircleOutline, tint: 'bg-danger-soft text-danger' },
]);

const list = computed(() => {
  const q = query.value.trim().toLowerCase();
  return bookings.filter((b) => {
    if (filter.value !== 'all' && stateOf(b) !== filter.value) return false;
    if (service.value && b.type !== service.value) return false;
    if (!q) return true;
    const s = statusOf(b);
    return [b.ref, serviceMeta[b.type].name, b.date, s.label, s.title, b.pickup.area, b.dropoff.area].some((v) =>
      v.toLowerCase().includes(q),
    );
  });
});

async function chooseService() {
  const sheet = await actionSheetController.create({
    header: 'Filter by service',
    buttons: [
      ...(Object.keys(serviceMeta) as ServiceType[]).map((t) => ({
        text: serviceMeta[t].name,
        handler: () => {
          service.value = t;
        },
      })),
      {
        text: 'All services',
        handler: () => {
          service.value = undefined;
        },
      },
      { text: 'Cancel', role: 'cancel' },
    ],
  });
  await sheet.present();
}

async function openActions(b: Booking) {
  const isDone = stateOf(b) === 'completed';
  const sheet = await actionSheetController.create({
    header: b.ref,
    buttons: [
      { text: 'View Details', handler: () => ionRouter.push(`/bookings/${b.id}`) },
      ...(isDone ? [{ text: 'View Invoice', handler: () => ionRouter.push(`/bookings/${b.id}/invoice`) }] : []),
      { text: `Call ${b.dropoff.name}`, handler: () => {
          window.open(`tel:${b.dropoff.phone.replace(/\s/g, '')}`);
        },
      },
      { text: 'Cancel', role: 'cancel' },
    ],
  });
  await sheet.present();
}
</script>
