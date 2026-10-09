<template>
  <!-- Two variants from the design:
       - tab pages: bold title + muted subtitle, optional actions on the right
       - pushed pages (`back`): square back button, smaller title, subtitle underneath -->
  <header class="pt-safe px-4 pb-3" :class="back ? 'bg-bg' : ''">
    <div class="flex items-start gap-3" :class="back ? 'pt-2' : 'pt-1'">
      <button v-if="back" class="btn-back mt-0.5" aria-label="Go back" @click="goBack">
        <ion-icon :icon="arrowBack" class="text-base" />
      </button>
      <div class="min-w-0 flex-1">
        <h1 class="font-bold text-ink" :class="back ? 'text-[15px] leading-5' : 'text-base'">{{ title }}</h1>
        <p v-if="subtitle || $slots.subtitle" class="mt-0.5 text-[10px] leading-snug text-ink-muted">
          <slot name="subtitle">{{ subtitle }}</slot>
        </p>
      </div>
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { IonIcon, useIonRouter } from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';

const props = defineProps<{ title: string; subtitle?: string; back?: boolean; fallback?: string }>();

const ionRouter = useIonRouter();
function goBack() {
  if (ionRouter.canGoBack()) ionRouter.back();
  else ionRouter.navigate(props.fallback ?? '/tabs/home', 'back', 'replace');
}
</script>
