<template>
  <ion-page>
    <ion-content ref="contentRef" :fullscreen="true">
      <div class="pt-safe px-5 pb-8">
        <!-- Header -->
        <AppLogo class="mx-auto mt-3 w-[210px]" />
        <h1 class="mt-6 text-2xl leading-tight text-ink">Create a driver account</h1>
        <p class="mt-2.5 text-[10px] leading-snug text-ink-2">
          Complete your personal, vehicle and document information to apply as a Shipzy driver partner.
        </p>
        <StepIndicator class="mt-3" :current="step" :total="STEP_COUNT" />

        <!-- Option lists (genders, vehicles, addresses…) failed to load -->
        <div
          v-if="options.error"
          role="alert"
          class="mt-5 flex items-center gap-3 rounded-xl border border-danger/20 bg-danger-soft px-3 py-2.5 text-xs text-danger"
        >
          <ion-icon :icon="cloudOfflineOutline" class="shrink-0 text-lg" />
          <span class="flex-1">{{ options.error }}</span>
          <button type="button" class="font-semibold underline" @click="reloadOptions">Retry</button>
        </div>

        <!-- Current step -->
        <form class="mt-7" novalidate @submit.prevent="next">
          <component :is="stepComponents[step - 1]" />

          <div class="mt-8 space-y-4">
            <button type="submit" class="btn-primary h-14 w-full text-base" :disabled="submitting">
              <template v-if="submitting">
                <ion-spinner name="crescent" class="size-5" />
                Submitting…
              </template>
              <template v-else-if="step < STEP_COUNT">
                Continue
                <ion-icon :icon="arrowForward" class="text-lg" />
              </template>
              <template v-else>Create Driver Account</template>
            </button>
            <button v-if="step > 1" type="button" class="btn-outline h-14 w-full text-base" :disabled="submitting" @click="prev">
              <ion-icon :icon="arrowBack" class="text-lg" />
              Back
            </button>
          </div>
        </form>

        <p class="mt-8 text-center text-xs text-ink-muted">
          Already have an account?
          <router-link to="/login" class="font-semibold text-primary-600">Log In</router-link>
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { alertController, IonContent, IonIcon, IonPage, IonSpinner, toastController, useIonRouter } from '@ionic/vue';
import { arrowBack, arrowForward, cloudOfflineOutline } from 'ionicons/icons';
import AppLogo from '@/components/AppLogo.vue';
import StepIndicator from '@/components/register/StepIndicator.vue';
import StepAccount from './steps/StepAccount.vue';
import StepPersonal from './steps/StepPersonal.vue';
import StepAddress from './steps/StepAddress.vue';
import StepVehicle from './steps/StepVehicle.vue';
import StepDocuments from './steps/StepDocuments.vue';
import StepReview from './steps/StepReview.vue';
import { provideRegisterForm, STEP_COUNT } from './useRegisterForm';

const stepComponents = [StepAccount, StepPersonal, StepAddress, StepVehicle, StepDocuments, StepReview];

const route = useRoute();
const router = useIonRouter();
const contentRef = ref<InstanceType<typeof IonContent>>();

/** `?step=N` opens the wizard on a given step (handy for QA). */
const queryStep = () => {
  const n = Number(route.query.step);
  return Number.isInteger(n) && n >= 1 && n <= STEP_COUNT ? n : 1;
};

const { step, check, options, reloadOptions, submit: submitForm } = provideRegisterForm(queryStep());
const submitting = ref(false);

watch(
  () => route.query.step,
  () => {
    if (route.path === '/register' && route.query.step) step.value = queryStep();
  },
);

watch(step, () => contentRef.value?.$el.scrollToTop(300));

/** Bring the first invalid field into view. */
async function scrollToError() {
  await nextTick();
  const el = contentRef.value?.$el.querySelector('[data-invalid]') as HTMLElement | null;
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function next() {
  if (!check(step.value)) {
    await scrollToError();
    return;
  }
  if (step.value < STEP_COUNT) {
    step.value++;
    return;
  }
  await submit();
}

function prev() {
  if (step.value > 1) step.value--;
}

async function submit() {
  submitting.value = true;
  const result = await submitForm();
  submitting.value = false;

  if (!result.ok) {
    // Validation errors from the API: jump to the step that holds the first one.
    if (result.step) {
      step.value = result.step;
      setTimeout(scrollToError, 350);
    }
    const toast = await toastController.create({
      message: result.message,
      duration: 4000,
      position: 'top',
      color: 'danger',
    });
    await toast.present();
    return;
  }

  const alert = await alertController.create({
    header: 'Application submitted',
    message:
      'Thanks for applying as a Shipzy driver partner! Your account is now under review. ' +
      "We'll notify you by email once your documents have been verified.",
    buttons: ['OK'],
    backdropDismiss: false,
  });
  await alert.present();
  await alert.onDidDismiss();
  router.navigate('/login', 'root', 'replace');
}
</script>
