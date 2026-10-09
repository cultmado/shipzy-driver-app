<template>
  <SectionCard title="Stores and Purchased Items" subtitle="Items are grouped by the store where they were requested.">
    <template #right>
      <span class="chip shrink-0 bg-ocean-100 text-[8px] font-medium text-ocean-600">{{ stores.length }} {{ stores.length === 1 ? 'store' : 'stores' }}</span>
    </template>
    <div class="space-y-3">
      <article v-for="(s, i) in stores" :key="s.name" class="overflow-hidden rounded-xl border border-line-soft">
        <header class="bg-soft px-2.5 pt-2.5 pb-2">
          <div class="flex items-center gap-2.5">
            <LogoThumb />
            <div class="min-w-0">
              <p class="text-[9px] font-semibold text-ink">{{ s.name }}</p>
              <p class="mt-1 text-[6px] text-ink-muted">{{ s.address }}</p>
            </div>
          </div>
          <div class="mt-1.5 flex items-center gap-2">
            <span
              class="rounded-full px-1.5 py-0.5 text-[6px] font-medium"
              :class="s.status === 'purchased' ? 'bg-success/15 text-success' : 'bg-amber/15 text-warning'"
            >
              {{ s.status === 'purchased' ? 'Purchased' : 'In progress' }}
            </span>
            <span class="text-[11px] font-semibold text-ocean-600">{{ peso(storeTotal(s)) }}</span>
          </div>
        </header>
        <ul>
          <li v-for="it in s.items" :key="it.name" class="flex items-center gap-2.5 border-t border-line-soft bg-surface px-2.5 py-2">
            <LogoThumb />
            <div class="min-w-0 flex-1">
              <p class="truncate text-[7px] font-medium text-ink">{{ it.name }}</p>
              <p class="mt-1 text-[6px] text-ink-muted">{{ peso(it.price) }} × {{ it.qty }}</p>
            </div>
            <span class="text-[7px] font-bold text-ink">{{ peso(it.price * it.qty) }}</span>
          </li>
        </ul>
        <footer class="border-t border-line-soft bg-soft px-2.5 py-2">
          <p class="text-[6px] text-ink-subtle">
            {{ s.receiptUploaded ? 'Official receipt uploaded by rider' : 'Official receipt not yet uploaded' }}
          </p>
          <div class="mt-1.5 flex items-center gap-4 text-[6px] font-medium">
            <button type="button" class="flex items-center gap-1.5 text-ocean-600" @click="openMaps(`${s.name}, ${s.address}`)">
              <ion-icon :icon="navigateOutline" class="text-[11px]" />
              Navigate to Store
            </button>
            <button v-if="s.receiptUploaded" type="button" class="flex items-center gap-1.5 text-ocean-600" @click="viewReceipt(s)">
              <ion-icon :icon="receiptOutline" class="text-[11px]" />
              View Receipt
            </button>
            <label v-else class="flex cursor-pointer items-center gap-1.5 text-warning">
              <ion-icon :icon="cloudUploadOutline" class="text-[11px]" />
              Upload Receipt
              <input type="file" accept="image/*,application/pdf" class="sr-only" @change="upload(i, $event)" />
            </label>
          </div>
        </footer>
      </article>
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
import { IonIcon, toastController } from '@ionic/vue';
import { cloudUploadOutline, navigateOutline, receiptOutline } from 'ionicons/icons';
import { defineComponent, h } from 'vue';
import { img } from '@/assets/images';
import SectionCard from '@/components/SectionCard.vue';
import { peso, sum } from '@/composables/useStore';
import type { PabiliStore } from '@/data/types';
import { openMaps } from './helpers';

const props = defineProps<{ stores: PabiliStore[] }>();

/** Square Shipzy-logo placeholder used for stores and items. */
const LogoThumb = defineComponent(() => () =>
  h('span', { class: 'flex size-[30px] shrink-0 items-center justify-center rounded-sm border border-ocean-200 bg-surface' }, [
    h('img', { src: img.logo, alt: '', class: 'w-[22px] object-contain' }),
  ]),
);

const storeTotal = (s: PabiliStore) => sum(s.items.map((it) => ({ amount: it.price * it.qty })));

// Receipts picked in this session, keyed by store name.
const receipts = new Map<string, string>();

async function toast(message: string, color?: string) {
  const t = await toastController.create({ message, duration: 1800, position: 'top', color });
  await t.present();
}

function viewReceipt(s: PabiliStore) {
  const url = receipts.get(s.name);
  if (url) window.open(url, '_blank');
  else toast(`Receipt for ${s.name} is on file.`);
}

function upload(i: number, e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const store = props.stores[i];
  receipts.set(store.name, URL.createObjectURL(file));
  // The stores array is the reactive booking's, so the card updates in place.
  store.receiptUploaded = true;
  store.status = 'purchased';
  input.value = '';
  toast(`Receipt uploaded for ${store.name}`, 'success');
}
</script>
