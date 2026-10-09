<template>
  <!-- Native select styled like the compact inputs, with a chevron on the right -->
  <div class="relative">
    <select
      :id="id"
      v-model="model"
      :class="[fieldInput, 'cursor-pointer appearance-none pr-10', icon ? 'pl-11' : '', model ? '' : 'text-ink-subtle']"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt" :value="opt" class="text-ink">{{ opt }}</option>
    </select>
    <ion-icon
      :icon="chevronDown"
      class="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-ink"
    />
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { chevronDown } from 'ionicons/icons';
import { fieldInput } from './form';

defineProps<{ options: string[]; id?: string; placeholder?: string; icon?: boolean }>();
const model = defineModel<string>({ default: '' });
</script>
