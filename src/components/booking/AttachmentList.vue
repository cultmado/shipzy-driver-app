<template>
  <SectionCard title="Handling Notes and Attachments" subtitle="Review special handling instructions and parcel photos.">
    <div v-if="notes" class="rounded-lg border border-line-soft bg-soft px-3 py-3.5">
      <p class="text-[8px] font-medium tracking-wide text-ink-muted uppercase">Handling Notes</p>
      <p class="mt-1 text-[10px] leading-snug text-ink">{{ notes }}</p>
    </div>
    <h3 class="mt-4 mb-3 text-[12px] font-bold text-ink">Attachments</h3>
    <ul class="space-y-2">
      <li v-for="a in files" :key="a.name" class="flex items-center gap-3 rounded-lg border border-line-soft px-2 py-2">
        <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-ocean-50 text-ocean-600">
          <ion-icon :icon="imageOutline" class="text-lg" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-[10px] text-ink">{{ a.name }}</p>
          <p class="mt-1 text-[7px] text-ink-muted">{{ a.size }}</p>
        </div>
        <button type="button" class="p-1.5 text-ocean-600" :aria-label="`Preview ${a.name}`" @click="preview(a.name)">
          <ion-icon :icon="eyeOutline" class="text-lg" />
        </button>
      </li>
      <li v-if="!files.length" class="text-[9px] text-ink-muted">No attachments.</li>
    </ul>
  </SectionCard>
</template>

<script setup lang="ts">
import { IonIcon, toastController } from '@ionic/vue';
import { eyeOutline, imageOutline } from 'ionicons/icons';
import SectionCard from '@/components/SectionCard.vue';

defineProps<{ notes?: string; files: { name: string; size: string }[] }>();

async function preview(name: string) {
  const t = await toastController.create({ message: `Opening ${name}…`, duration: 1500, position: 'top' });
  await t.present();
}
</script>
