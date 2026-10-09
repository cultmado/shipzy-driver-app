<template>
  <!-- Titled group of navigation rows on the My Profile tab -->
  <section>
    <h3 class="mb-2 px-3 text-[13px] text-ink">{{ title }}</h3>
    <div class="overflow-hidden rounded-xl border border-line-soft bg-surface shadow-card">
      <router-link
        v-for="(item, i) in items"
        :key="item.to"
        :to="item.to"
        class="flex items-center justify-between px-3 transition active:bg-soft"
      >
        <span
          class="flex h-[49px] flex-1 items-center justify-between text-[15px] font-medium text-ink"
          :class="i ? 'border-t border-line-soft' : ''"
        >
          {{ item.label }}
          <ion-icon :icon="chevronForward" class="text-sm text-ink" />
        </span>
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { chevronForward } from 'ionicons/icons';

defineProps<{ title: string; items: { label: string; to: string }[] }>();
</script>
