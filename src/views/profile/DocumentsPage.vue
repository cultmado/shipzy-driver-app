<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <PageHeader
        back
        fallback="/tabs/profile"
        title="Business Verification Documents"
        subtitle="Upload and manage your required driver and vehicle documents."
      />
      <div class="space-y-3 px-4 pb-6">
        <section v-for="doc in driver.documents" :key="doc.key" class="card rounded-xl p-3">
          <h2 class="text-[13px] font-bold text-ink">{{ doc.title }}</h2>
          <p class="mt-2 text-[8px] text-ink-muted">{{ doc.desc }}</p>

          <div v-if="doc.file" class="mt-3 flex items-center gap-3 rounded-lg bg-soft px-2 py-3">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary-600">
              <ion-icon :icon="documentOutline" class="text-xl" />
            </span>
            <div class="min-w-0">
              <p class="truncate text-[11px] font-medium text-ink">{{ doc.file.name }}</p>
              <p class="mt-0.5 text-[7px] text-ink-muted">{{ doc.file.size }}</p>
            </div>
          </div>

          <div class="mt-3 flex justify-end gap-3">
            <template v-if="doc.file">
              <button :class="[smallBtn, 'border border-primary-600 bg-surface text-primary-600']" @click="download(doc)">
                <ion-icon :icon="cloudDownloadOutline" class="text-xs" />Download
              </button>
              <button :class="[smallBtn, 'bg-primary-600 text-white']" @click="pick(doc.key)">
                <ion-icon :icon="cloudUploadOutline" class="text-xs" />Replace File
              </button>
              <button :class="[smallBtn, 'border border-danger bg-surface text-danger']" @click="remove(doc)">
                <ion-icon :icon="trashOutline" class="text-xs" />Remove
              </button>
            </template>
            <button v-else :class="[smallBtn, 'bg-primary-600 px-3.5 text-white']" @click="pick(doc.key)">
              <ion-icon :icon="cloudUploadOutline" class="text-xs" />Upload File
            </button>
          </div>
        </section>
        <input ref="fileInput" type="file" accept="image/*,application/pdf" class="sr-only" @change="onFile" />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonIcon, IonPage, alertController } from '@ionic/vue';
import { cloudDownloadOutline, cloudUploadOutline, documentOutline, trashOutline } from 'ionicons/icons';
import { ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import { showToast } from '@/components/profile/form';
import { useStore } from '@/composables/useStore';
import type { DriverDocument } from '@/data/types';

const { driver } = useStore();

const smallBtn =
  'inline-flex h-6 min-w-[90px] items-center justify-center gap-1.5 rounded px-2.5 text-[10px] font-medium transition active:scale-[0.97]';

const fileInput = ref<HTMLInputElement>();
const target = ref<string>('');
// Object URLs of files picked this session, so Download can hand back the real file.
const picked = new Map<string, string>();

function pick(key: string) {
  target.value = key;
  fileInput.value?.click();
}

function formatSize(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb < 0.1 ? mb.toFixed(2) : mb.toFixed(1)} MB`;
}

function onFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  const doc = driver.documents.find((d) => d.key === target.value);
  input.value = '';
  if (!file || !doc) return;
  const replacing = !!doc.file;
  const old = picked.get(doc.key);
  if (old) URL.revokeObjectURL(old);
  picked.set(doc.key, URL.createObjectURL(file));
  doc.file = { name: file.name, size: formatSize(file.size) };
  showToast(`${doc.title} ${replacing ? 'replaced' : 'uploaded'}`);
}

function download(doc: DriverDocument) {
  const url = picked.get(doc.key);
  if (!url || !doc.file) {
    showToast(`Downloading ${doc.file?.name ?? 'file'}…`, 'dark');
    return;
  }
  const a = document.createElement('a');
  a.href = url;
  a.download = doc.file.name;
  a.click();
}

async function remove(doc: DriverDocument) {
  const alert = await alertController.create({
    header: 'Remove file?',
    message: `${doc.file?.name} will be removed from "${doc.title}".`,
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Remove',
        role: 'destructive',
        handler: () => {
          const url = picked.get(doc.key);
          if (url) URL.revokeObjectURL(url);
          picked.delete(doc.key);
          doc.file = undefined;
          showToast('File removed', 'dark');
        },
      },
    ],
  });
  await alert.present();
}
</script>
