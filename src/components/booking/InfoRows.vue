<template>
  <!-- Label / value rows ("Booking Information") -->
  <SectionCard :title="title">
    <dl class="space-y-0.5 px-2">
      <div v-for="r in rows" :key="r.label" class="flex items-center justify-between gap-4 py-[7px] text-[9px]">
        <dt class="text-ink-2">{{ r.label }}</dt>
        <dd class="text-right font-semibold text-ink">{{ r.value }}</dd>
      </div>
    </dl>
  </SectionCard>
</template>

<script setup lang="ts">
import SectionCard from '@/components/SectionCard.vue';

withDefaults(defineProps<{ rows: { label: string; value: string | number }[]; title?: string }>(), {
  title: 'Booking Information',
});
</script>
