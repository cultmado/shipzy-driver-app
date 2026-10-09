<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <template v-if="booking">
        <PageHeader :title="titles[booking.type]" back fallback="/tabs/deliveries">
          <template #subtitle>
            {{ booking.type === 'pabili' ? 'Booking reference:' : 'Delivery reference:' }}
            <b class="font-semibold text-ink-2">{{ booking.ref }}</b>
          </template>
        </PageHeader>
        <div class="px-4 pt-1 pb-6">
          <ParcelDetails v-if="booking.type === 'parcel'" :booking="booking" />
          <VehicleDetails v-else-if="booking.type === 'vehicle'" :booking="booking" />
          <PabiliDetails v-else :booking="booking" />
        </div>
      </template>

      <template v-else>
        <PageHeader title="Booking Details" back fallback="/tabs/deliveries" />
        <div class="flex flex-col items-center px-8 pt-20 text-center">
          <span class="flex size-16 items-center justify-center rounded-full bg-ocean-50 text-ocean-600">
            <ion-icon :icon="searchOutline" class="text-3xl" />
          </span>
          <h2 class="mt-4 text-[15px] font-bold text-ink">Booking not found</h2>
          <p class="mt-1.5 text-xs leading-relaxed text-ink-muted">
            We couldn't find a booking with the reference "{{ id }}". It may have been removed or reassigned.
          </p>
          <button type="button" class="btn-ocean mt-6 w-full" @click="router.navigate('/tabs/deliveries', 'back', 'replace')">
            <ion-icon :icon="arrowBack" class="text-lg" />
            Back to Deliveries
          </button>
        </div>
      </template>
    </ion-content>

    <FooterAction v-if="booking && state !== 'canceled'" :stage="stage.title">
      <button v-if="stage.action" type="button" class="btn-ocean h-[38px] w-full py-0 text-[12px] font-medium" @click="confirmAdvance">
        <ion-icon :icon="booking.type === 'parcel' ? locationOutline : checkmarkCircleOutline" class="text-lg" />
        {{ stage.action }}
      </button>
      <button v-else type="button" class="btn-ocean h-[38px] w-full py-0 text-[12px] font-medium" @click="router.push(`/bookings/${booking.id}/invoice`)">
        <ion-icon :icon="documentTextOutline" class="text-lg" />
        View Invoice
      </button>
    </FooterAction>
  </ion-page>
</template>

<script setup lang="ts">
import { alertController, IonContent, IonIcon, IonPage, toastController, useIonRouter } from '@ionic/vue';
import { arrowBack, checkmarkCircleOutline, documentTextOutline, locationOutline, searchOutline } from 'ionicons/icons';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import FooterAction from '@/components/FooterAction.vue';
import PageHeader from '@/components/PageHeader.vue';
import PabiliDetails from '@/components/booking/PabiliDetails.vue';
import ParcelDetails from '@/components/booking/ParcelDetails.vue';
import VehicleDetails from '@/components/booking/VehicleDetails.vue';
import { timeOf } from '@/components/booking/helpers';
import { useStore } from '@/composables/useStore';
import { stagesFor, stateOf } from '@/data/stages';
import type { Booking, ServiceType } from '@/data/types';

const titles: Record<ServiceType, string> = {
  parcel: 'Parcel & Cargo Delivery Details',
  vehicle: 'Vehicle Request Delivery Details',
  pabili: 'Pabili Booking Details',
};

const route = useRoute();
const router = useIonRouter();
const store = useStore();

const id = computed(() => String(route.params.id ?? ''));
const booking = computed(() => store.byId(id.value));
const state = computed(() => (booking.value ? stateOf(booking.value) : 'pending'));
const stage = computed(() => {
  const b = booking.value;
  if (!b) return { title: '', desc: '' } as ReturnType<typeof stagesFor>[number];
  const list = stagesFor(b);
  return list[Math.min(b.stage, list.length - 1)];
});

/** Mirror the new stage onto type-specific fields (stop times, "last updated"). */
function syncAfterAdvance(b: Booking) {
  const key = stagesFor(b)[b.stage].key;
  const time = timeOf(b.stageTimes[b.stage]);
  if (b.type === 'pabili') {
    b.lastUpdated = `Today • ${time}`;
  } else if (b.type === 'vehicle') {
    const k = Number(key.split('-').pop()) - 1;
    const stop = b.stops[k];
    if (stop && key.startsWith('at-stop-')) stop.arrived ??= time;
    else if (stop && key.startsWith('stop-')) {
      stop.completed ??= time;
      stop.left ??= time;
    }
  }
}

async function confirmAdvance() {
  const b = booking.value;
  if (!b || !stage.value.action) return;
  const action = stage.value.action;
  const from = b.stage;
  const alert = await alertController.create({
    header: action,
    message: `Confirm "${action}" for ${b.ref}? This updates the delivery status.`,
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Confirm',
        handler: () => {
          // Ignore repeated taps while the alert is closing.
          if (b.stage !== from) return;
          store.advance(b.id);
          syncAfterAdvance(b);
          void showToast(`Status updated: ${stagesFor(b)[b.stage].title}`);
        },
      },
    ],
  });
  await alert.present();
}

async function showToast(message: string) {
  const toast = await toastController.create({ message, duration: 1800, position: 'top', color: 'success' });
  await toast.present();
}
</script>
