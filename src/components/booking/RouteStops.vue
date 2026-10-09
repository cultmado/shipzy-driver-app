<template>
  <!-- Vehicle "Route Details": pick-up, additional stops and final drop-off on a dashed line -->
  <SectionCard title="Route Details" subtitle="Complete pickup and delivery sequence.">
    <ol class="relative">
      <li v-for="(p, i) in points" :key="p.key" class="relative flex gap-3" :class="i < points.length - 1 ? 'pb-6' : ''">
        <div class="relative flex w-[30px] shrink-0 justify-center">
          <span
            v-if="i < points.length - 1"
            class="dash absolute top-[30px] -bottom-6 left-1/2 w-px"
          />
          <span
            class="relative mt-px flex size-[30px] items-center justify-center rounded-full text-[13px] font-bold text-white"
            :class="tone(p).marker"
          >
            <ion-icon v-if="p.kind === 'pickup'" :icon="locationOutline" class="text-base" />
            <ion-icon v-else-if="p.kind === 'dropoff'" :icon="flagOutline" class="text-base" />
            <template v-else>{{ p.n }}</template>
          </span>
        </div>
        <div class="min-w-0 flex-1 rounded-lg border p-3.5" :class="tone(p).card">
          <div class="flex items-center gap-2">
            <p class="text-[8px] font-semibold" :class="[tone(p).text, p.kind === 'stop' ? '' : 'uppercase']">{{ p.label }}</p>
            <span class="rounded-full px-1.5 py-0.5 text-[7px] font-semibold" :class="pill(p).cls">{{ pill(p).text }}</span>
          </div>
          <p class="mt-1.5 text-[12px] font-bold text-ink">{{ p.name }}</p>
          <p class="mt-1.5 text-[8px] leading-snug text-ink-2">{{ p.address }}</p>
          <div class="mt-2.5 space-y-3 border-t border-line-soft pt-2.5 text-[8px]">
            <div>
              <p class="text-ink-muted">{{ p.contactLabel }}</p>
              <p class="mt-1 font-semibold text-ink">{{ p.contact }}</p>
            </div>
            <div>
              <p class="text-ink-muted">Contact Number</p>
              <a :href="telHref(p.phone)" class="mt-1 block font-semibold text-ink">{{ p.phone }}</a>
            </div>
          </div>
          <template v-if="p.stop">
            <div v-if="p.stop.instructions" class="mt-3 rounded-sm bg-soft px-2 py-2 text-[8px]">
              <p class="font-medium text-ink-muted">Instructions</p>
              <p class="mt-1 text-ink-2">{{ p.stop.instructions }}</p>
            </div>
            <div class="mt-1.5 grid grid-cols-3 gap-1.5">
              <div v-for="t in stopTimes(p.stop)" :key="t.label" class="rounded-sm bg-soft px-2 py-2 text-[8px]">
                <p class="text-ink-muted">{{ t.label }}</p>
                <p class="mt-1 font-semibold text-ink">{{ t.value || 'Pending' }}</p>
              </div>
            </div>
          </template>
        </div>
      </li>
    </ol>
  </SectionCard>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { flagOutline, locationOutline } from 'ionicons/icons';
import { computed } from 'vue';
import SectionCard from '@/components/SectionCard.vue';
import type { Party, VehicleBooking, VehicleStop } from '@/data/types';
import { telHref } from './helpers';

type State = 'done' | 'current' | 'pending';
interface Point {
  key: string;
  kind: 'pickup' | 'stop' | 'dropoff';
  n?: number;
  label: string;
  name: string;
  address: string;
  contactLabel: string;
  contact: string;
  phone: string;
  state: State;
  stop?: VehicleStop;
}

const props = defineProps<{ booking: VehicleBooking }>();

/** "Receiver: Joanna Cruz" → ["Receiver", "Joanna Cruz"] (falls back to the party name). */
function contactOf(p: Party, fallback: string): [string, string] {
  const [label, value] = (p.landmark ?? '').split(/:\s*/);
  if (!value) return [fallback, p.name];
  return [label === 'Contact' ? 'Contact Person' : label, value];
}

const stateAt = (stage: number, arrive: number, done: number): State =>
  stage >= done ? 'done' : stage >= arrive ? 'current' : 'pending';

const points = computed<Point[]>(() => {
  const b = props.booking;
  const n = b.stops.length;
  const finalIdx = 3 + 2 * n;
  const [pl, pc] = contactOf(b.pickup, 'Contact Person');
  const [dl, dc] = contactOf(b.dropoff, 'Receiver');
  return [
    {
      key: 'pickup',
      kind: 'pickup',
      label: 'Pick-up Point',
      name: b.pickup.name,
      address: b.pickup.address,
      contactLabel: pl,
      contact: pc,
      phone: b.pickup.phone,
      state: stateAt(b.stage, 1, 2),
    },
    ...b.stops.map<Point>((s, k) => ({
      key: `stop-${k}`,
      kind: 'stop',
      n: k + 1,
      label: `Additional Stop ${k + 1}`,
      name: s.name,
      address: s.address,
      contactLabel: 'Contact Person',
      contact: s.contact,
      phone: s.phone,
      state: stateAt(b.stage, 3 + 2 * k, 4 + 2 * k),
      stop: s,
    })),
    {
      key: 'dropoff',
      kind: 'dropoff',
      label: 'Drop-off Point',
      name: b.dropoff.name,
      address: b.dropoff.address,
      contactLabel: dl,
      contact: dc,
      phone: b.dropoff.phone,
      state: stateAt(b.stage, finalIdx, finalIdx + 2),
    },
  ];
});

function tone(p: Point) {
  if (p.kind === 'dropoff' && p.state !== 'done')
    return { marker: 'bg-danger', card: 'border-danger/15 bg-danger-soft/70', text: 'text-danger' };
  if (p.state === 'done') return { marker: 'bg-success', card: 'border-success/10 bg-success-soft/70', text: 'text-success' };
  if (p.state === 'current') return { marker: 'bg-amber', card: 'border-amber/20 bg-amber-soft', text: 'text-amber' };
  return { marker: 'bg-ink-subtle', card: 'border-line-soft bg-surface', text: 'text-ink-muted' };
}

function pill(p: Point) {
  if (p.state === 'done') return { text: 'COMPLETED', cls: 'bg-success/15 text-success' };
  if (p.state === 'current')
    return { text: p.kind === 'stop' ? 'Current Stop' : 'In Progress', cls: 'bg-amber/15 text-amber' };
  return { text: 'Pending', cls: 'bg-soft-2 text-ink-muted' };
}

const stopTimes = (s: VehicleStop) => [
  { label: 'Arrived', value: s.arrived },
  { label: 'Completed', value: s.completed },
  { label: 'Left', value: s.left },
];
</script>

<style scoped>
/* Dashed connector between route markers */
.dash {
  background: repeating-linear-gradient(to bottom, var(--color-ink-subtle) 0 4px, transparent 4px 8px);
  opacity: 0.6;
}
</style>
