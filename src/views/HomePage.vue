<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="pt-safe space-y-4 px-4 pb-28">
        <!-- Top bar -->
        <div class="flex items-center justify-between pt-1">
          <AppLogo class="w-24" />
          <div class="flex items-center gap-3">
            <router-link to="/tabs/notifications" class="relative p-1 text-ink" aria-label="Notifications">
              <ion-icon :icon="notificationsOutline" class="text-2xl" />
              <span
                v-if="unreadCount"
                class="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white"
              >
                {{ unreadCount }}
              </span>
            </router-link>
            <router-link
              to="/tabs/profile"
              class="flex size-9 items-center justify-center rounded-full bg-ocean-600 text-xs font-semibold text-white"
            >
              {{ driver.initials }}
            </router-link>
          </div>
        </div>

        <div>
          <h1 class="text-base font-bold text-ink">{{ greeting }}, {{ driver.firstName }}!</h1>
          <p class="mt-0.5 text-[10px] text-ink-muted">
            You have {{ today.length }} {{ today.length === 1 ? 'delivery' : 'deliveries' }} today.
          </p>
        </div>

        <!-- Stats -->
        <div class="card grid grid-cols-2 gap-2.5 p-3">
          <component
            :is="s.to ? 'router-link' : 'div'"
            v-for="s in stats"
            :key="s.label"
            :to="s.to"
            class="flex min-h-[68px] items-center gap-2 rounded-lg px-2 py-2.5"
            :class="s.bg"
          >
            <img :src="s.image" alt="" class="size-12 shrink-0 object-contain" />
            <div class="min-w-0">
              <p class="leading-tight font-bold text-ink-2" :class="String(s.value).length > 8 ? 'text-[15px]' : 'text-xl'">
                {{ s.value }}
              </p>
              <p class="mt-0.5 text-[8px] font-medium text-ink">{{ s.label }}</p>
              <p class="text-[7px] text-ink-muted">{{ s.hint }}</p>
            </div>
          </component>
        </div>

        <!-- Active delivery -->
        <section v-if="current" class="card p-3">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-[10px] font-bold text-ink">Active Delivery</h2>
            <router-link to="/tabs/deliveries" class="flex items-center gap-0.5 text-[8px] font-semibold text-primary-600">
              View all <ion-icon :icon="chevronForward" />
            </router-link>
          </div>
          <div class="flex gap-2">
            <div class="flex min-w-0 flex-1 items-start gap-2">
              <ServiceThumb :type="current.type" />
              <div class="min-w-0">
                <p class="text-[10px] font-semibold text-ink">{{ serviceMeta[current.type].name }}</p>
                <p class="text-[7px] break-all text-ink-muted">Booking ID: {{ current.ref }}</p>
                <p class="mt-1.5 flex items-center gap-1 text-[7px] text-ink">
                  <span class="size-1.5 rounded-full bg-success" /> From: {{ city(current.pickup.area) }}
                </p>
                <p class="mt-0.5 flex items-center gap-1 text-[7px] text-ink">
                  <span class="size-1.5 rounded-full bg-danger" /> To: {{ city(current.dropoff.area) }}
                </p>
              </div>
            </div>
            <div class="shrink-0 border-l border-line-soft pl-3">
              <p class="text-[7px] text-ink-muted">Estimated Time</p>
              <p class="text-xs font-bold text-ink">{{ current.route.eta }}</p>
              <p class="mt-1.5 text-[7px] text-ink-muted">Remaining</p>
              <p class="text-[10px] font-bold text-ink">{{ current.route.travelTime }} ({{ current.route.distanceLeft }})</p>
            </div>
            <MapPreview class="h-[52px] w-[78px] shrink-0" :show-driver="false" />
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2 px-6">
            <router-link
              :to="`/bookings/${current.id}`"
              class="btn h-6 rounded-md border border-primary-600 bg-surface p-0 text-[8px] text-primary-600"
            >
              View Details
            </router-link>
            <a
              :href="mapsUrl(current.dropoff.address)"
              target="_blank"
              rel="noopener"
              class="btn h-6 rounded-md bg-primary-600 p-0 text-[8px] text-white"
            >
              <ion-icon :icon="navigateOutline" /> Navigate
            </a>
          </div>
        </section>

        <!-- Today's deliveries -->
        <section class="card p-3">
          <div class="mb-2 flex items-center justify-between">
            <h2 class="text-[10px] font-bold text-ink">Today's Deliveries</h2>
            <router-link to="/tabs/deliveries" class="flex items-center gap-0.5 text-[8px] font-semibold text-primary-600">
              View all <ion-icon :icon="chevronForward" />
            </router-link>
          </div>
          <ul class="overflow-hidden rounded-lg border border-line-soft">
            <li v-for="b in today.slice(0, 3)" :key="b.id" class="border-b border-line-soft last:border-b-0">
              <router-link :to="`/bookings/${b.id}`" class="flex items-center gap-2 px-2 py-2">
                <ServiceThumb :type="b.type" size="sm" />
                <div class="min-w-0 flex-1">
                  <p class="text-[8px] font-semibold text-ink">{{ serviceMeta[b.type].name }}</p>
                  <p class="truncate text-[7px] text-ink-muted">Booking ID: {{ b.ref }}</p>
                  <p class="text-[7px] text-ink-muted">{{ b.date }}</p>
                </div>
                <StatusChip :tone="statusOf(b).tone" :label="statusOf(b).label" class="min-w-[68px] justify-center" />
                <ion-icon :icon="chevronForward" class="text-sm text-ink" />
              </router-link>
            </li>
          </ul>
        </section>

        <!-- Notifications -->
        <section class="card p-3">
          <div class="mb-2 flex items-center justify-between">
            <h2 class="text-[10px] font-bold text-ink">Notifications</h2>
            <router-link to="/tabs/notifications" class="flex items-center gap-0.5 text-[8px] font-semibold text-primary-600">
              View all <ion-icon :icon="chevronForward" />
            </router-link>
          </div>
          <ul class="space-y-2">
            <li v-for="n in notifications.slice(0, 3)" :key="n.id">
              <router-link
                :to="`/bookings/${n.bookingId}`"
                class="flex items-start gap-2 rounded-md px-2 py-2.5"
                :class="n.unread ? 'bg-primary-50' : 'bg-soft'"
                @click="n.unread = false"
              >
                <ServiceThumb :type="n.type" size="sm" />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-[8px] font-semibold text-ink">{{ n.title }}</p>
                  <p class="truncate text-[7px] text-ink-muted">{{ n.body }}</p>
                </div>
                <span class="shrink-0 text-[7px] text-ink-muted">{{ n.ago }}</span>
              </router-link>
            </li>
          </ul>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonContent, IonIcon, IonPage } from '@ionic/vue';
import { chevronForward, navigateOutline, notificationsOutline } from 'ionicons/icons';
import { img } from '@/assets/images';
import { serviceMeta, stateOf, statusOf } from '@/data/stages';
import { peso, useStore } from '@/composables/useStore';
import AppLogo from '@/components/AppLogo.vue';
import MapPreview from '@/components/MapPreview.vue';
import ServiceThumb from '@/components/ServiceThumb.vue';
import StatusChip from '@/components/StatusChip.vue';

const { driver, today, active, notifications, unreadCount, todayEarnings } = useStore();

const hour = new Date().getHours();
const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

const current = computed(() => active.value[0]);

const city = (area: string) => area.split(',').pop()?.trim() ?? area;
const mapsUrl = (address: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

const stats = computed(() => {
  const done = today.value.filter((b) => stateOf(b) === 'completed').length;
  const pending = today.value.filter((b) => stateOf(b) === 'pending').length;
  return [
    {
      label: "Today's Deliveries",
      value: today.value.length,
      hint: `${done} Completed | ${pending} Pending`,
      image: img.statClipboard,
      bg: 'bg-[#ebf0f9]',
      to: '/tabs/deliveries',
    },
    { label: 'Completed Today', value: done, hint: 'Keep it up!', image: img.statShield, bg: 'bg-success-soft' },
    { label: 'Pending Pickup', value: pending, hint: 'Pickup not started', image: img.statClock, bg: 'bg-[#fcf5e8]' },
    {
      label: "Earning's Today",
      value: peso(todayEarnings.value),
      hint: 'View breakdown',
      image: img.statWallet,
      bg: 'bg-violet-soft',
      to: '/tabs/earnings',
    },
  ];
});
</script>
