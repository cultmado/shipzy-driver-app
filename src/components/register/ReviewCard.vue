<template>
  <!-- Review summary card: icon tile + title + "Edit", then label/value rows (optionally 2 columns) -->
  <section class="rounded-xl border border-line-soft bg-surface p-3">
    <header class="flex items-start gap-3">
      <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-600">
        <ion-icon :icon="icon" class="text-base" />
      </span>
      <h3 class="flex-1 self-center text-[13px] font-semibold text-ink">{{ title }}</h3>
      <button type="button" class="text-[9px] font-semibold text-primary-600" @click="emit('edit')">Edit</button>
    </header>
    <dl class="mt-3 grid gap-x-4 gap-y-2" :class="columns === 2 ? 'grid-cols-2' : 'grid-cols-1'">
      <div v-for="(row, i) in rows" :key="i" class="min-w-0">
        <template v-if="row.label">
          <dt class="text-[8px] text-ink-subtle">{{ row.label }}</dt>
          <dd class="mt-0.5 text-[9px] break-words text-ink">{{ row.value || '—' }}</dd>
        </template>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

withDefaults(
  defineProps<{
    title: string;
    icon: string;
    /** An empty label renders a blank grid cell (for column alignment). */
    rows: { label: string; value?: string }[];
    columns?: 1 | 2;
  }>(),
  { columns: 1 },
);

const emit = defineEmits<{ edit: [] }>();
</script>
