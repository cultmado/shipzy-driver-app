<template>
  <!-- Grey label/value box (Estimated travel time, Type, Size, …) -->
  <div class="tile min-w-0">
    <p class="text-[8px] leading-tight text-ink-muted">{{ label }}</p>
    <p class="mt-1 text-[11px] leading-snug font-semibold" :class="accent ? 'text-ocean-600' : 'text-ink'">
      <slot>{{ value }}</slot>
    </p>
    <p v-if="sub" class="mt-0.5 text-[8px] font-semibold text-ocean-600">{{ sub }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value?: string | number; sub?: string; accent?: boolean }>();
</script>
