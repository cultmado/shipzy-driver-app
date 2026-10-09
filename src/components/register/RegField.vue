<template>
  <!-- FormField + inline validation message -->
  <div :data-invalid="error ? '' : undefined">
    <FormField :id="id" :label="label" :icon="icon" :required="required" :optional="optional" :hint="hint">
      <slot />
    </FormField>
    <p v-if="error" class="mt-1.5 text-[11px] leading-snug text-danger">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import FormField from '@/components/FormField.vue';

defineProps<{
  label: string;
  id?: string;
  icon?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
}>();
</script>
