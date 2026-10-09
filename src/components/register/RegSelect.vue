<template>
  <!-- Native select styled like the text inputs, with a trailing chevron (place inside FormField/RegField) -->
  <select
    :id="id"
    v-model="model"
    class="input h-[52px] cursor-pointer appearance-none pr-11 disabled:cursor-not-allowed disabled:bg-soft"
    :class="[icon ? 'pl-11' : '', model ? 'text-ink' : 'text-ink-subtle', invalid ? 'border-danger' : '']"
    :disabled="disabled || loading"
  >
    <option value="" disabled>{{ loading ? 'Loading…' : placeholder }}</option>
    <option v-for="o in normalized" :key="o.value" :value="o.value" class="text-ink">{{ o.label }}</option>
  </select>
  <ion-spinner
    v-if="loading"
    name="crescent"
    class="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-muted"
  />
  <ion-icon
    v-else
    :icon="chevronDownOutline"
    class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-lg text-ink"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonIcon, IonSpinner } from '@ionic/vue';
import { chevronDownOutline } from 'ionicons/icons';

const props = defineProps<{
  /** Plain strings, or `{ value, label }` pairs when the stored value is an id/code. */
  options: (string | { value: string; label: string })[];
  placeholder: string;
  id?: string;
  /** Leave room for FormField's leading icon. */
  icon?: boolean;
  invalid?: boolean;
  loading?: boolean;
  disabled?: boolean;
}>();

const model = defineModel<string>({ required: true });

const normalized = computed(() => props.options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o)));
</script>
