<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <!-- Floating white bar; "Deliveries" sits in a raised teal circle in the middle. -->
      <ion-tab-bar slot="bottom" class="shipzy-tabbar">
        <ion-tab-button v-for="tab in tabs" :key="tab.name" :tab="tab.name" :href="`/tabs/${tab.name}`">
          <span
            v-if="tab.center"
            class="flex size-14 flex-col items-center justify-center gap-0.5 rounded-full bg-ocean-600 text-white shadow-lg shadow-ocean-600/30"
          >
            <ion-icon aria-hidden="true" :icon="tab.icon" class="text-xl" />
            <span class="text-[8px] font-medium">{{ tab.label }}</span>
          </span>
          <template v-else>
            <span class="relative">
              <ion-icon aria-hidden="true" :icon="tab.icon" class="text-xl" />
              <span
                v-if="tab.name === 'notifications' && unreadCount"
                class="absolute -top-1 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-danger px-1 text-[8px] font-bold text-white"
              >
                {{ unreadCount }}
              </span>
            </span>
            <ion-label class="mt-1 text-[9px] font-medium">{{ tab.label }}</ion-label>
          </template>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue';
import { clipboardOutline, home, notificationsOutline, personOutline, walletOutline } from 'ionicons/icons';
import { useStore } from '@/composables/useStore';

const { unreadCount } = useStore();

const tabs = [
  { name: 'home', label: 'Home', icon: home },
  { name: 'earnings', label: 'Earnings', icon: walletOutline },
  { name: 'deliveries', label: 'Deliveries', icon: clipboardOutline, center: true },
  { name: 'notifications', label: 'Notifications', icon: notificationsOutline },
  { name: 'profile', label: 'Profile', icon: personOutline },
];
</script>

<style scoped>
.shipzy-tabbar {
  --background: #ffffff;
  --border: 0;
  --color: #4e5471;
  --color-selected: #0a5e84;
  margin: 0 12px calc(env(safe-area-inset-bottom) + 8px);
  padding: 4px 0 0;
  height: 64px;
  border-radius: 20px;
  box-shadow: var(--shadow-nav);
}
.shipzy-tabbar ion-tab-button {
  --padding-top: 0;
  --padding-bottom: 0;
}
</style>
