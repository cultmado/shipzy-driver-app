<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="pt-safe flex min-h-full flex-col px-5">
        <AppLogo class="mx-auto mt-4 w-52" />

        <h1 class="mt-6 text-2xl text-ink">Login</h1>
        <p class="mt-2 text-[10px] text-ink-2">Log in to manage your bookings and track your deliveries.</p>

        <form class="mt-6 space-y-5" novalidate @submit.prevent="login">
          <FormField id="email" label="Email Address" :icon="mailOutline">
            <input
              id="email"
              v-model.trim="email"
              type="email"
              class="input h-[52px] pl-12"
              :class="errors.email && 'border-danger'"
              placeholder="Enter your email address"
              autocomplete="username"
            />
          </FormField>
          <p v-if="errors.email" class="-mt-3 text-[11px] text-danger">{{ errors.email }}</p>

          <FormField id="password" label="Password" :icon="lockClosedOutline">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input h-[52px] px-12"
              :class="errors.password && 'border-danger'"
              placeholder="Enter your password"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="absolute top-1/2 right-4 -translate-y-1/2 text-ink-muted"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline" class="text-xl" />
            </button>
          </FormField>
          <p v-if="errors.password" class="-mt-3 text-[11px] text-danger">{{ errors.password }}</p>

          <label class="flex items-center gap-2.5 text-sm text-ink-muted">
            <input v-model="remember" type="checkbox" class="size-4 accent-primary-600" />
            Remember me
          </label>

          <p
            v-if="serverError"
            role="alert"
            class="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger-soft px-3 py-2.5 text-xs text-danger"
          >
            <ion-icon :icon="alertCircleOutline" class="mt-px shrink-0 text-base" /> {{ serverError }}
          </p>

          <button type="submit" class="btn-primary h-14 w-full text-base" :disabled="loading">
            <ion-spinner v-if="loading" name="crescent" class="size-5" />
            <span v-else>Log In</span>
          </button>
        </form>

        <div class="my-4 flex items-center gap-3 text-sm text-ink-muted">
          <span class="h-px flex-1 bg-line" /> or continue with <span class="h-px flex-1 bg-line" />
        </div>

        <button type="button" class="btn-outline h-[52px] w-full border-line-soft text-sm" @click="googleSignIn">
          <svg viewBox="0 0 48 48" class="size-5" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
          </svg>
          Continue with Google
        </button>

        <p class="mt-5 text-sm text-ink-muted">
          Don't have an account?
          <router-link to="/register" class="ml-2 font-medium text-primary-600">Register</router-link>
        </p>

        <p class="pb-safe mt-auto pt-10 text-center text-[11px] leading-relaxed text-ink-muted">
          By continuing, you agree to Shipzy's<br />
          <a href="#" class="font-semibold text-primary-600">Terms and Conditions</a> and
          <a href="#" class="font-semibold text-primary-600">Privacy Policy</a>
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { IonContent, IonIcon, IonPage, IonSpinner, toastController, useIonRouter } from '@ionic/vue';
import { alertCircleOutline, eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline } from 'ionicons/icons';
import AppLogo from '@/components/AppLogo.vue';
import FormField from '@/components/FormField.vue';
import { useAuth } from '@/composables/useAuth';

const email = ref('');
const password = ref('');
const remember = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const errors = reactive<{ email?: string; password?: string }>({});
const serverError = ref('');

const ionRouter = useIonRouter();
const auth = useAuth();

async function login() {
  serverError.value = '';
  errors.email = /^\S+@\S+\.\S+$/.test(email.value) ? undefined : 'Enter a valid email address.';
  errors.password = password.value ? undefined : 'Enter your password.';
  if (errors.email || errors.password) return;

  loading.value = true;
  try {
    await auth.login(email.value, password.value, remember.value);
    password.value = '';
    ionRouter.navigate('/tabs/home', 'root', 'replace');
  } catch (e) {
    serverError.value = e instanceof Error ? e.message : 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
}

async function googleSignIn() {
  const toast = await toastController.create({ message: 'Google sign-in is not available yet.', duration: 2000, position: 'top' });
  await toast.present();
}
</script>
