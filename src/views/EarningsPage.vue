<template>
  <!-- No Figma frame exists for Earnings; built from the same visual language as Home and My Bookings. -->
  <ion-page>
    <ion-content :fullscreen="true">
      <PageHeader title="Earnings" subtitle="Track your trip earnings, incentives and payouts." />

      <div class="space-y-4 px-4 pb-28">
        <!-- Balance -->
        <div class="relative overflow-hidden rounded-2xl bg-ocean-600 p-4 text-white shadow-card">
          <div class="absolute -top-10 -right-10 size-36 rounded-full bg-white/10" />
          <img :src="img.statWallet" alt="" class="absolute right-3 bottom-3 w-20" />
          <p class="relative text-[11px] text-ocean-100">Available for payout</p>
          <p class="relative mt-1 text-[28px] leading-tight font-bold">{{ peso(balance) }}</p>
          <p class="relative mt-1 text-[10px] text-ocean-100">Auto-payout to GCash every Monday, 9:00 AM</p>
          <button class="btn relative mt-4 h-9 rounded-lg bg-white px-4 text-xs text-ocean-600" @click="cashOut">
            <ion-icon :icon="arrowUpCircleOutline" class="text-base" /> Cash out now
          </button>
        </div>

        <!-- Summary tiles -->
        <div class="card grid grid-cols-3 divide-x divide-line-soft py-4 text-center">
          <div v-for="s in summary" :key="s.label" class="px-2">
            <p class="text-[15px] leading-none font-bold" :class="s.color">{{ s.value }}</p>
            <p class="mt-1.5 text-[9px] text-ink-muted">{{ s.label }}</p>
          </div>
        </div>

        <!-- Weekly chart -->
        <SectionCard title="This Week" :subtitle="`Total ${peso(weekTotal)}`">
          <template #right>
            <span class="chip bg-success-soft text-success">
              <ion-icon :icon="trendingUp" class="mr-1" /> 12% vs last week
            </span>
          </template>
          <div class="flex h-36 items-end gap-2" role="img" :aria-label="`Daily earnings, highest ${peso(peak.amount)} on ${peak.day}`">
            <button
              v-for="d in weeklyEarnings"
              :key="d.day"
              class="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
              @click="selected = d.day"
            >
              <span class="text-[8px] font-semibold" :class="selected === d.day ? 'text-ink' : 'text-transparent'">
                ₱{{ d.amount.toLocaleString() }}
              </span>
              <span
                class="w-full rounded-t-md rounded-b-sm transition-all"
                :class="selected === d.day ? 'bg-ocean-600' : 'bg-ocean-100'"
                :style="{ height: `${(d.amount / peak.amount) * 100}%` }"
              />
              <span class="text-[9px]" :class="selected === d.day ? 'font-bold text-ink' : 'text-ink-muted'">{{ d.day }}</span>
            </button>
          </div>
        </SectionCard>

        <!-- Recent trips -->
        <SectionCard title="Recent Trip Earnings" subtitle="Completed bookings and their total driver earnings.">
          <ul class="divide-y divide-line-soft">
            <li v-for="b in completed.slice(0, 6)" :key="b.id">
              <router-link :to="`/bookings/${b.id}`" class="flex items-center gap-3 py-2.5">
                <ServiceThumb :type="b.type" />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-[11px] font-semibold text-ink">{{ b.ref }}</p>
                  <p class="text-[9px] text-ink-muted">{{ serviceMeta[b.type].name }} · {{ b.date }}</p>
                </div>
                <span class="text-xs font-bold text-success">+{{ peso(sum(b.earnings)) }}</span>
              </router-link>
            </li>
          </ul>
        </SectionCard>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { IonContent, IonIcon, IonPage, alertController } from '@ionic/vue';
import { arrowUpCircleOutline, trendingUp } from 'ionicons/icons';
import { img } from '@/assets/images';
import { weeklyEarnings } from '@/data/mock';
import { serviceMeta } from '@/data/stages';
import { peso, sum, useStore } from '@/composables/useStore';
import PageHeader from '@/components/PageHeader.vue';
import SectionCard from '@/components/SectionCard.vue';
import ServiceThumb from '@/components/ServiceThumb.vue';

const { completed, todayEarnings } = useStore();

const balance = ref(8450);
const weekTotal = sum(weeklyEarnings);
const peak = weeklyEarnings.reduce((a, b) => (b.amount > a.amount ? b : a));
const selected = ref(peak.day);

const summary = computed(() => [
  { label: 'Today', value: peso(todayEarnings.value), color: 'text-ocean-600' },
  { label: 'Trips completed', value: completed.value.length, color: 'text-ink-2' },
  { label: 'Incentives', value: peso(1150), color: 'text-success' },
]);

async function cashOut() {
  const alert = await alertController.create({
    header: 'Cash out to GCash',
    message: `Transfer ${peso(balance.value)} to your GCash account ending in 6789?`,
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Cash out',
        handler: () => {
          balance.value = 0;
        },
      },
    ],
  });
  await alert.present();
}
</script>
