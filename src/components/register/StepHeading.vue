<template>
  <div>
    <h2 class="text-lg font-semibold text-ink">{{ title }}</h2>
    <p class="mt-2.5 text-[11px] leading-snug text-ink-subtle">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; description: string }>();
</script>
