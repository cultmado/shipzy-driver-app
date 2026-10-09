<template>
  <div class="space-y-6">
    <StepHeading title="Account Information" description="Create your driver portal login credentials." />

    <RegField id="reg-email" label="Email Address" :icon="mailOutline" required :error="errors.email">
      <input
        id="reg-email"
        v-model.trim="form.email"
        type="email"
        inputmode="email"
        autocomplete="email"
        placeholder="Enter your email address"
        class="input h-[52px] pl-11"
        :class="{ 'border-danger': errors.email }"
      />
    </RegField>

    <RegField
      id="reg-password"
      label="Password"
      :icon="lockClosedOutline"
      required
      hint="Use at least 8 characters."
      :error="errors.password"
    >
      <input
        id="reg-password"
        v-model="form.password"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="new-password"
        placeholder="Enter your password"
        class="input h-[52px] pr-12 pl-11"
        :class="{ 'border-danger': errors.password }"
      />
      <button
        type="button"
        class="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center text-ink-muted"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        @click="showPassword = !showPassword"
      >
        <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline" class="text-xl" />
      </button>
    </RegField>

    <RegField
      id="reg-confirm"
      label="Confirm Password"
      :icon="lockClosedOutline"
      required
      :error="errors.confirmPassword"
    >
      <input
        id="reg-confirm"
        v-model="form.confirmPassword"
        :type="showConfirm ? 'text' : 'password'"
        autocomplete="new-password"
        placeholder="Enter your password"
        class="input h-[52px] pr-12 pl-11"
        :class="{ 'border-danger': errors.confirmPassword }"
      />
      <button
        type="button"
        class="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center text-ink-muted"
        :aria-label="showConfirm ? 'Hide password' : 'Show password'"
        @click="showConfirm = !showConfirm"
      >
        <ion-icon :icon="showConfirm ? eyeOffOutline : eyeOutline" class="text-xl" />
      </button>
    </RegField>

    <RegField id="reg-referral" label="Referral Code" :icon="ticketOutline" optional>
      <input
        id="reg-referral"
        v-model.trim="form.referralCode"
        type="text"
        autocapitalize="characters"
        placeholder="Enter referral code"
        class="input h-[52px] pl-11"
      />
    </RegField>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import { eyeOffOutline, eyeOutline, lockClosedOutline, mailOutline, ticketOutline } from 'ionicons/icons';
import RegField from '@/components/register/RegField.vue';
import StepHeading from '@/components/register/StepHeading.vue';
import { useRegisterForm } from '../useRegisterForm';

const { form, errors } = useRegisterForm();
const showPassword = ref(false);
const showConfirm = ref(false);
</script>
