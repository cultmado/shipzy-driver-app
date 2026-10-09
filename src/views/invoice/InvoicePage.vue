<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <PageHeader back :title="booking ? `${meta.name} Invoice` : 'Invoice'" :fallback="`/bookings/${id}`">
        <template v-if="booking" #subtitle>
          Invoice number: <b class="font-semibold text-ink">{{ booking.invoice.no }}</b>
        </template>
      </PageHeader>

      <div v-if="booking" class="px-4 pt-2 pb-6">
        <article class="card divide-y divide-line-soft overflow-hidden">
          <InvoiceIntro
            :eyebrow="copy.eyebrow"
            :description="copy.description"
            :invoice="booking.invoice"
            :booking-ref="booking.ref"
          />
          <PabiliInvoice v-if="booking.type === 'pabili'" :booking="booking" />
          <ParcelInvoice v-else-if="booking.type === 'parcel'" :booking="booking" />
          <VehicleInvoice v-else :booking="booking" />
          <PaymentSummary :fees="booking.invoice.fees" />
          <InvoiceThanks :booking-ref="booking.ref" />
        </article>
      </div>

      <div v-else class="flex flex-col items-center px-8 pt-24 text-center">
        <span class="flex size-14 items-center justify-center rounded-2xl bg-soft-2 text-ink-muted">
          <ion-icon :icon="documentTextOutline" class="text-2xl" />
        </span>
        <p class="mt-4 text-[15px] font-bold text-ink">Invoice not found</p>
        <p class="mt-1 text-xs text-ink-muted">We couldn't find an invoice for this booking.</p>
        <router-link to="/tabs/deliveries" class="btn-ocean mt-6">Back to Bookings</router-link>
      </div>
    </ion-content>

    <FooterAction v-if="booking">
      <button class="btn-ocean w-full" @click="download">
        <ion-icon :icon="downloadOutline" class="text-lg" />
        Download Invoice
      </button>
    </FooterAction>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent, IonIcon, IonPage, toastController } from '@ionic/vue';
import { documentTextOutline, downloadOutline } from 'ionicons/icons';
import FooterAction from '@/components/FooterAction.vue';
import PageHeader from '@/components/PageHeader.vue';
import InvoiceIntro from '@/components/invoice/InvoiceIntro.vue';
import InvoiceThanks from '@/components/invoice/InvoiceThanks.vue';
import PabiliInvoice from '@/components/invoice/PabiliInvoice.vue';
import ParcelInvoice from '@/components/invoice/ParcelInvoice.vue';
import PaymentSummary from '@/components/invoice/PaymentSummary.vue';
import VehicleInvoice from '@/components/invoice/VehicleInvoice.vue';
import { downloadInvoice } from '@/components/invoice/invoiceDocument';
import { useStore } from '@/composables/useStore';
import { serviceMeta } from '@/data/stages';
import type { ServiceType } from '@/data/types';

const route = useRoute();
const { byId } = useStore();

const id = computed(() => String(route.params.id));
const booking = computed(() => byId(id.value));
const meta = computed(() => serviceMeta[booking.value?.type ?? 'parcel']);

const copyByType: Record<ServiceType, { eyebrow: string; description: string }> = {
  pabili: {
    eyebrow: 'Official Booking Invoice',
    description:
      'This invoice summarizes the purchased items, service charges, delivery fees, and payment information for your Pabili booking.',
  },
  parcel: {
    eyebrow: 'Official Shipment Invoice',
    description:
      'This invoice contains the shipment details, package information, service charges, and payment summary for your Parcel & Cargo booking.',
  },
  vehicle: {
    eyebrow: 'Official Vehicle Request Invoice',
    description: 'This invoice contains the vehicle, route, cargo, service, and payment details for your booking.',
  },
};
const copy = computed(() => copyByType[booking.value?.type ?? 'parcel']);

async function download() {
  if (!booking.value) return;
  downloadInvoice(booking.value);
  const toast = await toastController.create({
    message: 'Invoice downloaded',
    duration: 1800,
    position: 'top',
    color: 'dark',
  });
  await toast.present();
}
</script>
