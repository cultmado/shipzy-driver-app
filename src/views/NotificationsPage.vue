<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <PageHeader title="Notifications" subtitle="Stay updated with your bookings, deliveries, payments and account activity">
        <template #actions>
          <button
            class="flex h-[30px] shrink-0 items-center gap-2 rounded-md border border-line bg-surface px-3 text-[9px] font-medium text-ocean-600 disabled:opacity-50"
            :disabled="!unreadCount"
            @click="markAllRead"
          >
            <ion-icon :icon="checkmarkDoneOutline" class="text-base" /> Mark all as read
          </button>
        </template>
      </PageHeader>

      <div class="space-y-4 px-4 pb-28">
        <!-- Summary -->
        <div class="card grid grid-cols-3 divide-x divide-line-soft py-4">
          <button v-for="s in summary" :key="s.key" class="px-4 text-left" @click="tab = s.key">
            <span class="flex size-8 items-center justify-center rounded-lg" :class="s.tint">
              <ion-icon :icon="s.icon" class="text-lg" />
            </span>
            <p class="mt-2 text-lg leading-none font-bold text-ink-2">{{ s.count }}</p>
            <p class="mt-1 text-[9px] text-ink">{{ s.label }}</p>
            <p class="mt-1 text-[9px]" :class="s.color">{{ s.hint }}</p>
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2">
          <button
            v-for="t in tabs"
            :key="t"
            class="h-[27px] min-w-[52px] rounded-md border px-4 text-[9px] font-medium capitalize"
            :class="tab === t ? 'border-primary-600 bg-primary-600 text-white' : 'border-line-soft bg-surface text-ink'"
            @click="tab = t"
          >
            {{ t }}
          </button>
        </div>

        <!-- Search + filters -->
        <div class="card space-y-3 p-3">
          <div class="relative">
            <ion-icon :icon="searchOutline" class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base text-ink-muted" />
            <input
              v-model="query"
              type="search"
              class="input h-[34px] rounded-lg border-line-soft pl-9 text-[9px]"
              placeholder="Search by Booking ID, service, date or status..."
            />
          </div>
          <div class="flex items-center justify-between">
            <label class="relative flex h-[34px] items-center gap-2 rounded-lg border border-line-soft px-3 text-[9px] text-ink">
              <ion-icon :icon="reorderThreeOutline" class="text-base" />
              <select v-model="service" class="appearance-none pr-5 outline-none">
                <option value="">All Status</option>
                <option v-for="(m, key) in serviceMeta" :key="key" :value="key">{{ m.name }}</option>
              </select>
              <ion-icon :icon="chevronDown" class="pointer-events-none absolute right-2 text-sm" />
            </label>
            <button class="flex h-[34px] items-center gap-2 rounded-lg border border-line-soft px-3 text-[9px] text-ink" @click="reset">
              <ion-icon :icon="refreshOutline" class="text-base" /> Reset
            </button>
          </div>
        </div>

        <!-- List -->
        <ul class="space-y-3">
          <li v-for="n in list" :key="n.id" class="card p-3">
            <div class="flex gap-3">
              <span class="flex size-14 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <img :src="img[serviceMeta[n.type].image]" alt="" class="size-10 object-contain" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-[10px] font-semibold text-ink">
                    {{ serviceMeta[n.type].name }}
                    <span v-if="n.unread" class="ml-1.5 inline-flex items-center gap-1 text-[7px] font-semibold text-primary-600">
                      <span class="size-1 rounded-full bg-primary-600" /> New
                    </span>
                  </p>
                  <div class="flex shrink-0 items-start gap-1">
                    <div class="text-right text-[7px] leading-tight text-ink-muted">
                      <p>{{ n.date }}</p>
                      <p>{{ n.time }}</p>
                    </div>
                    <button class="-mt-0.5 -mr-1 text-ink-muted" aria-label="More actions" @click="openActions(n)">
                      <ion-icon :icon="ellipsisVertical" class="text-sm" />
                    </button>
                  </div>
                </div>
                <p class="mt-0.5 text-[13px] font-bold text-ink">{{ n.title }}</p>
                <p class="mt-0.5 text-[8px] leading-snug text-ink-muted">{{ n.body }}</p>
                <div class="mt-1.5 flex items-center gap-3 text-[7px] text-ink-muted">
                  <span class="flex items-center gap-1 text-ink"><span class="text-[9px] font-bold">#</span> {{ n.ref }}</span>
                  <span class="flex items-center gap-1"><ion-icon :icon="timeOutline" class="text-[9px]" /> {{ n.ago }}</span>
                </div>
                <button
                  class="mt-2 flex h-[22px] items-center gap-1.5 rounded border border-line px-2 text-[8px] font-medium text-ink"
                  @click="view(n)"
                >
                  <ion-icon :icon="eyeOutline" class="text-[11px]" /> View Notification
                </button>
              </div>
            </div>
          </li>
          <li v-if="!list.length" class="card px-6 py-10 text-center">
            <ion-icon :icon="notificationsOffOutline" class="text-3xl text-ink-subtle" />
            <p class="mt-2 text-sm font-semibold text-ink">You're all caught up</p>
            <p class="mt-1 text-[11px] text-ink-muted">No notifications match your filters.</p>
          </li>
        </ul>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { IonContent, IonIcon, IonPage, actionSheetController, useIonRouter } from '@ionic/vue';
import {
  checkmarkDoneOutline,
  chevronDown,
  ellipsisVertical,
  eyeOutline,
  mailOpenOutline,
  mailOutline,
  notificationsOffOutline,
  notificationsOutline,
  refreshOutline,
  reorderThreeOutline,
  searchOutline,
  timeOutline,
} from 'ionicons/icons';
import { img } from '@/assets/images';
import { serviceMeta } from '@/data/stages';
import type { AppNotification, ServiceType } from '@/data/types';
import { useStore } from '@/composables/useStore';
import PageHeader from '@/components/PageHeader.vue';

const { notifications, unreadCount, markAllRead } = useStore();
const ionRouter = useIonRouter();

const tabs = ['all', 'unread', 'read'] as const;
const tab = ref<(typeof tabs)[number]>('all');
const service = ref<ServiceType | ''>('');
const query = ref('');

const summary = computed(() => [
  {
    key: 'all' as const,
    label: 'All Notifications',
    count: notifications.length,
    hint: 'All recent activity',
    icon: notificationsOutline,
    tint: 'bg-primary-50 text-primary-600',
    color: 'text-primary-600',
  },
  {
    key: 'unread' as const,
    label: 'Unread',
    count: unreadCount.value,
    hint: 'Needs your attention',
    icon: mailOutline,
    tint: 'bg-violet-soft text-violet',
    color: 'text-violet',
  },
  {
    key: 'read' as const,
    label: 'Read',
    count: notifications.length - unreadCount.value,
    hint: 'Previously viewed',
    icon: mailOpenOutline,
    tint: 'bg-success-soft text-success',
    color: 'text-success',
  },
]);

const list = computed(() => {
  const q = query.value.trim().toLowerCase();
  return notifications.filter((n) => {
    if (tab.value === 'unread' && !n.unread) return false;
    if (tab.value === 'read' && n.unread) return false;
    if (service.value && n.type !== service.value) return false;
    return !q || [n.ref, n.title, n.body, serviceMeta[n.type].name, n.date].some((v) => v.toLowerCase().includes(q));
  });
});

function reset() {
  tab.value = 'all';
  service.value = '';
  query.value = '';
}

function view(n: AppNotification) {
  n.unread = false;
  ionRouter.push(`/bookings/${n.bookingId}`);
}

async function openActions(n: AppNotification) {
  const sheet = await actionSheetController.create({
    header: n.title,
    buttons: [
      { text: 'View booking', handler: () => view(n) },
      {
        text: n.unread ? 'Mark as read' : 'Mark as unread',
        handler: () => {
          n.unread = !n.unread;
        },
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          notifications.splice(notifications.indexOf(n), 1);
        },
      },
      { text: 'Cancel', role: 'cancel' },
    ],
  });
  await sheet.present();
}
</script>
