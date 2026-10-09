<template>
  <SectionCard :title="title" :subtitle="subtitle">
    <p class="rounded-lg border border-line-soft bg-soft px-3 py-4 text-[10px] leading-snug text-ink">{{ notes }}</p>
  </SectionCard>
</template>

<script setup lang="ts">
import SectionCard from '@/components/SectionCard.vue';

withDefaults(defineProps<{ notes: string; title?: string; subtitle?: string }>(), {
  title: 'Notes for Rider',
  subtitle: 'Customer instructions for this delivery.',
});
</script>
