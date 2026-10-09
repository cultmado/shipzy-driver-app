<template>
  <!-- Label (with required star / optional hint) + input slot with an optional leading icon -->
  <div>
    <div class="flex items-center justify-between">
      <label :for="id" class="field-label" :class="compact ? 'mb-2 text-xs' : ''">
        {{ label }}<span v-if="required" class="ml-1 text-danger">*</span>
        <span v-if="optional" class="font-normal"> (Optional)</span>
      </label>
      <slot name="label-right" />
    </div>
    <div class="relative">
      <ion-icon
        v-if="icon"
        :icon="icon"
        class="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-lg text-ink-muted"
      />
      <slot />
    </div>
    <p v-if="hint" class="mt-1.5 text-[10px] text-ink-subtle">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

defineProps<{
  label: string;
  id?: string;
  icon?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  /** Smaller label used on profile settings pages. */
  compact?: boolean;
}>();
</script>
