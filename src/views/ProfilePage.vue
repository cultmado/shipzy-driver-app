<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="flex min-h-full flex-col pb-[110px]">
        <PageHeader title="My Profile" subtitle="Manage your personal information and account settings" />

        <div class="space-y-4 px-4">
          <!-- Profile card -->
          <section class="rounded-2xl border border-primary-200 bg-primary-50/60 p-3">
            <div class="flex items-center gap-4 px-1 pt-1 pb-3">
              <div class="relative shrink-0">
                <div
                  class="flex size-[72px] items-center justify-center overflow-hidden rounded-full bg-ocean-600 text-[22px] font-semibold text-white"
                >
                  <img v-if="avatarUrl" :src="avatarUrl" alt="Profile photo" class="size-full object-cover" />
                  <span v-else>{{ driver.initials }}</span>
                </div>
                <button
                  class="absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full border-2 border-white bg-primary-600 text-white active:scale-95"
                  aria-label="Change profile photo"
                  @click="photoInput?.click()"
                >
                  <ion-icon :icon="cameraOutline" class="text-[13px]" />
                </button>
                <input ref="photoInput" type="file" accept="image/*" class="sr-only" @change="onPhoto" />
              </div>
              <div class="min-w-0">
                <h2 class="truncate text-[15px] font-bold text-ink">{{ driver.firstName }} {{ driver.lastName }}</h2>
                <span
                  class="mt-1 inline-flex items-center gap-1.5 rounded border border-success/60 bg-success-soft px-2 py-0.5 text-[9px] font-semibold text-success"
                >
                  <span class="size-1.5 rounded-full bg-success" />Active Driver
                </span>
                <p class="mt-1.5 flex items-center gap-1.5 text-[9px] text-ink">
                  <ion-icon :icon="calendarClearOutline" class="text-[11px]" />Driver since {{ driver.since }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-3 rounded-xl bg-surface py-2.5 shadow-card">
              <div
                v-for="(s, i) in stats"
                :key="s.label"
                class="flex flex-col items-center"
                :class="i ? 'border-l border-line-soft' : ''"
              >
                <span class="text-base leading-6 font-bold" :class="s.color">{{ s.value }}</span>
                <span class="text-[8px] text-ink-muted">{{ s.label }}</span>
                <TruckIcon v-if="!s.icon" class="mt-1.5 size-[15px]" :class="s.color" />
                <ion-icon v-else :icon="s.icon" class="mt-1.5 text-[15px]" :class="s.color" />
              </div>
            </div>
          </section>

          <ProfileMenu title="Account & Settings" :items="accountItems" />
          <ProfileMenu title="Support" :items="supportItems" />
        </div>

        <div class="mt-auto px-4 pt-8">
          <button
            class="btn w-full rounded-lg border border-ink-muted/50 bg-transparent py-2.5 text-[13px] text-ink-muted active:bg-soft"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonIcon, IonPage, alertController, useIonRouter } from '@ionic/vue';
import { calendarClearOutline, cameraOutline, checkmarkCircleOutline, cubeOutline } from 'ionicons/icons';
import { computed, ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import TruckIcon from '@/components/profile/TruckIcon.vue';
import ProfileMenu from '@/components/profile/ProfileMenu.vue';
import { avatarUrl } from '@/components/profile/avatar';
import { useAuth } from '@/composables/useAuth';
import { useStore } from '@/composables/useStore';

const { driver, bookings, completed, active, pending } = useStore();
const { logout: logoutSession } = useAuth();
const ionRouter = useIonRouter();

const stats = computed(() => [
  { label: 'Total Bookings', value: bookings.length, icon: cubeOutline, color: 'text-primary-600' },
  { label: 'Completed', value: completed.value.length, icon: checkmarkCircleOutline, color: 'text-success' },
  { label: 'In Progress', value: active.value.length + pending.value.length, icon: '', color: 'text-warning' },
]);

const accountItems = [
  { label: 'Personal Information', to: '/profile/personal' },
  { label: 'Contact Information', to: '/profile/contact' },
  { label: 'Address', to: '/profile/address' },
  { label: 'Vehicle & License', to: '/profile/vehicle' },
  { label: 'Business Documents', to: '/profile/documents' },
  { label: 'Security & Password', to: '/profile/password' },
];
const supportItems = [{ label: 'Help & FAQs', to: '/help' }];

const photoInput = ref<HTMLInputElement>();
function onPhoto(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  if (avatarUrl.value) URL.revokeObjectURL(avatarUrl.value);
  avatarUrl.value = URL.createObjectURL(file);
  input.value = '';
}

async function logout() {
  const alert = await alertController.create({
    header: 'Log out?',
    message: 'You will need to sign in again to receive bookings.',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Logout',
        role: 'destructive',
        handler: () => {
          logoutSession();
          ionRouter.navigate('/login', 'root', 'replace');
        },
      },
    ],
  });
  await alert.present();
}
</script>
