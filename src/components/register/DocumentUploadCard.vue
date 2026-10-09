<template>
  <!-- One document slot: empty → "Choose File"; uploaded → blue card, green filename, Replace + delete -->
  <div
    class="rounded-xl border p-3 transition-colors"
    :class="[
      fileName ? 'border-primary-600 bg-primary-50' : 'border-line bg-surface',
      error && !fileName ? 'border-danger' : '',
    ]"
    :data-invalid="error ? '' : undefined"
  >
    <div class="flex items-start gap-3">
      <span
        class="flex size-7 shrink-0 items-center justify-center rounded-md"
        :class="fileName ? 'bg-surface text-success' : 'bg-primary-100 text-primary-600'"
      >
        <ion-icon :icon="icon" class="text-base" />
      </span>
      <div class="min-w-0">
        <p class="text-base leading-tight font-semibold text-ink">
          {{ title }}<span v-if="!optional" class="ml-1 text-danger">*</span>
          <span v-else class="font-normal"> (Optional)</span>
        </p>
        <p class="mt-1 text-[9px] leading-snug text-ink-subtle">{{ description }}</p>
      </div>
    </div>

    <p v-if="fileName" class="mt-2 truncate text-[10px] text-success">{{ fileName }}</p>

    <div class="flex items-center gap-2" :class="fileName ? 'mt-1.5' : 'mt-3'">
      <button
        type="button"
        class="inline-flex h-6 items-center gap-1.5 rounded border border-line-soft bg-surface px-2 text-[9px] text-ink active:bg-soft"
        @click="input?.click()"
      >
        <ion-icon :icon="shareOutline" class="text-sm" />
        {{ fileName ? 'Replace File' : 'Choose File' }}
      </button>
      <button
        v-if="fileName"
        type="button"
        class="inline-flex size-6 items-center justify-center rounded border border-danger/70 bg-surface text-danger active:bg-danger-soft"
        :aria-label="`Remove ${title}`"
        @click="emit('clear')"
      >
        <ion-icon :icon="trashOutline" class="text-sm" />
      </button>
    </div>

    <p v-if="error && !fileName" class="mt-2 text-[11px] text-danger">{{ error }}</p>

    <input ref="input" type="file" accept="image/*,application/pdf" class="sr-only" @change="onPick" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import { shareOutline, trashOutline } from 'ionicons/icons';

defineProps<{
  title: string;
  description: string;
  icon: string;
  optional?: boolean;
  fileName?: string;
  error?: string;
}>();

const emit = defineEmits<{ pick: [file: File]; clear: [] }>();

const input = ref<HTMLInputElement>();

function onPick(e: Event) {
  const el = e.target as HTMLInputElement;
  const file = el.files?.[0];
  if (file) emit('pick', file);
  // Reset so picking the same file again still fires `change`.
  el.value = '';
}
</script>
