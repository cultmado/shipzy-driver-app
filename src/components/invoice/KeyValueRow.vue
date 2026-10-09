<template>
  <!-- Muted label on the left, bold value on the right -->
  <div class="flex items-center justify-between gap-3 py-[5px]">
    <span class="text-[9px] text-ink-muted">{{ label }}</span>
    <span class="text-right text-[9px] font-semibold text-ink">
      <slot>{{ value }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value?: string }>();
</script>
