<template>
  <section class="card p-3.5">
    <div v-if="title" class="mb-3 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h2 class="text-[13px] font-bold text-ink">{{ title }}</h2>
        <p v-if="subtitle" class="mt-0.5 text-[10px] text-ink-muted">{{ subtitle }}</p>
      </div>
      <slot name="right" />
    </div>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{ title?: string; subtitle?: string }>();
</script>
