<template>
  <SectionCard title="Payment Collection" subtitle="Payment information required for delivery.">
    <div class="flex items-center gap-3 rounded-lg border border-line-soft px-3 py-3">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <ion-icon :icon="payment.method === 'GCash' ? phonePortraitOutline : cashOutline" class="text-base" />
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-[9px] font-semibold text-ink">{{ payment.method }}</p>
        <p class="mt-1 text-[8px] text-ink-muted">{{ payment.method === 'GCash' ? 'Digital payment' : 'Cash on delivery' }}</p>
      </div>
      <span class="chip text-[8px] font-medium" :class="paid ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'">
        {{ payment.status }}
      </span>
    </div>
    <div
      class="mt-2 flex items-start gap-2.5 rounded-lg px-3 py-2.5"
      :class="paid ? 'bg-success-soft text-success' : 'bg-amber-soft text-warning'"
    >
      <ion-icon :icon="paid ? informationCircleOutline : alertCircleOutline" class="mt-0.5 shrink-0 text-base" />
      <div class="text-[8px] leading-snug">
        <template v-if="paid">
          <p class="font-semibold">No cash collection required</p>
          <p class="mt-0.5 opacity-90">The customer has already completed payment through {{ payment.method }}.</p>
        </template>
        <template v-else>
          <p class="font-semibold">Collect {{ peso(amount) }} in cash</p>
          <p class="mt-0.5 opacity-90">Collect the full amount from the customer upon delivery.</p>
        </template>
      </div>
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { alertCircleOutline, cashOutline, informationCircleOutline, phonePortraitOutline } from 'ionicons/icons';
import { computed } from 'vue';
import SectionCard from '@/components/SectionCard.vue';
import { peso } from '@/composables/useStore';
import type { Payment } from '@/data/types';

const props = defineProps<{ payment: Payment; amount: number }>();

const paid = computed(() => props.payment.method === 'GCash' && props.payment.status === 'Paid');
</script>
