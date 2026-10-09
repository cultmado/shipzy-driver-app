<template>
  <span class="inline-flex items-center rounded-md border px-2 py-1 text-[9px] font-semibold" :class="toneClasses[tone].chip">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { toneClasses, type Tone } from '@/data/stages';

defineProps<{ tone: Tone; label?: string }>();
</script>
