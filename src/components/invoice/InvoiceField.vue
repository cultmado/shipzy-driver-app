<template>
  <!-- Stacked uppercase label + value (Full name, Invoice No., …) -->
  <div class="min-w-0">
    <p class="text-[9px] leading-tight uppercase text-ink-muted">{{ label }}</p>
    <p class="mt-1 text-[9.5px] leading-snug font-semibold break-words text-ink">
      <slot>{{ value }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value?: string }>();
</script>
