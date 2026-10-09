<template>
  <!-- Numbered wizard stepper: done/current steps are filled blue, future ones pale -->
  <ol class="flex items-center" :aria-label="`Step ${current} of ${total}`">
    <template v-for="n in total" :key="n">
      <li
        class="flex size-8 shrink-0 items-center justify-center rounded-full text-xs transition-colors"
        :class="n <= current ? 'bg-primary-600 font-medium text-white' : 'bg-line text-ink-muted/80'"
        :aria-current="n === current ? 'step' : undefined"
      >
        {{ n }}
      </li>
      <li v-if="n < total" aria-hidden="true" class="mx-2 h-0.5 flex-1 rounded-full bg-line" />
    </template>
  </ol>
</template>

<script setup lang="ts">
defineProps<{ current: number; total: number }>();
</script>
