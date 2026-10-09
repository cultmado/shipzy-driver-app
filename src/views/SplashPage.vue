<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="flex h-full flex-col items-center justify-center px-10">
        <AppLogo class="logo-in w-56" />
        <p class="fade-in mt-3 text-xs font-medium tracking-wide text-ink-muted">Driver Partner</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IonContent, IonPage, useIonRouter } from '@ionic/vue';
import AppLogo from '@/components/AppLogo.vue';
import { isAuthenticated } from '@/composables/useAuth';

const ionRouter = useIonRouter();

onMounted(() => {
  setTimeout(() => ionRouter.navigate(isAuthenticated() ? '/tabs/home' : '/login', 'root', 'replace'), 1400);
});
</script>

<style scoped>
.logo-in {
  animation: logo-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.fade-in {
  animation: logo-in 0.7s 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes logo-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.96);
  }
}
</style>
