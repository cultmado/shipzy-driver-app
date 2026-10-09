<template>
  <div class="space-y-6">
    <StepHeading title="Personal Information" description="Enter your personal and payout details." />

    <RegField id="reg-first" label="First Name" :icon="personOutline" required :error="errors.firstName">
      <input
        id="reg-first"
        v-model="form.firstName"
        type="text"
        autocomplete="given-name"
        placeholder="Enter first name"
        class="input h-[52px] pl-11"
        :class="{ 'border-danger': errors.firstName }"
      />
    </RegField>

    <RegField id="reg-middle" label="Middle Name" :icon="personOutline" optional>
      <input
        id="reg-middle"
        v-model="form.middleName"
        type="text"
        autocomplete="additional-name"
        placeholder="Enter middle name"
        class="input h-[52px] pl-11"
      />
    </RegField>

    <RegField id="reg-last" label="Last Name" :icon="personOutline" required :error="errors.lastName">
      <input
        id="reg-last"
        v-model="form.lastName"
        type="text"
        autocomplete="family-name"
        placeholder="Enter last name"
        class="input h-[52px] pl-11"
        :class="{ 'border-danger': errors.lastName }"
      />
    </RegField>

    <RegField
      id="reg-birth"
      label="Birth Date"
      required
      hint="Applicants must be at least 18 years old."
      :error="errors.birthDate"
    >
      <input
        id="reg-birth"
        v-model="form.birthDate"
        type="date"
        :max="maxBirth"
        autocomplete="bday"
        class="input h-[52px]"
        :class="[form.birthDate ? 'text-ink' : 'text-ink-subtle', { 'border-danger': errors.birthDate }]"
      />
    </RegField>

    <RegField id="reg-gender" label="Gender" :icon="peopleOutline" required :error="errors.gender">
      <RegSelect
        id="reg-gender"
        v-model="form.gender"
        :options="options.genders"
        :loading="options.loading.has('genders')"
        placeholder="Select gender"
        icon
        :invalid="!!errors.gender"
      />
    </RegField>

    <RegField id="reg-mobile" label="Mobile Number" required :error="errors.mobile">
      <div class="flex gap-3">
        <span
          class="flex h-[52px] w-16 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-sm text-ink"
        >
          +63
        </span>
        <input
          id="reg-mobile"
          v-model="form.mobile"
          type="tel"
          inputmode="numeric"
          autocomplete="tel-national"
          maxlength="13"
          placeholder="912 345 6789"
          class="input h-[52px]"
          :class="{ 'border-danger': errors.mobile }"
        />
      </div>
    </RegField>

    <RegField id="reg-phone" label="Telephone" :icon="callOutline" optional>
      <input
        id="reg-phone"
        v-model="form.telephone"
        type="tel"
        inputmode="tel"
        placeholder="Enter telephone number"
        class="input h-[52px] pl-11"
      />
    </RegField>

    <!-- GCash payout account -->
    <div class="rounded-xl border border-line bg-surface p-3">
      <div class="flex items-start gap-3">
        <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-600">
          <ion-icon :icon="cardOutline" class="text-base" />
        </span>
        <div>
          <p class="text-[15px] leading-tight font-semibold text-ink">GCash Account</p>
          <p class="mt-1 text-[9px] text-ink-subtle">This account may be used for eligible driver payouts.</p>
        </div>
      </div>
      <label class="mt-2.5 flex cursor-pointer items-start gap-2">
        <input
          v-model="form.gcashSame"
          type="checkbox"
          class="mt-px size-4 shrink-0 cursor-pointer accent-primary-600"
        />
        <span class="text-[10px] leading-snug text-ink-muted">
          My GCash account uses the same name and mobile number entered above.
        </span>
      </label>

      <div v-if="!form.gcashSame" class="mt-4 space-y-4 border-t border-line-soft pt-4">
        <RegField id="reg-gcash-name" label="GCash Account Name" :icon="personOutline" required :error="errors.gcashName">
          <input
            id="reg-gcash-name"
            v-model="form.gcashName"
            type="text"
            placeholder="Enter GCash account name"
            class="input h-[52px] pl-11"
            :class="{ 'border-danger': errors.gcashName }"
          />
        </RegField>
        <RegField id="reg-gcash-mobile" label="GCash Mobile Number" required :error="errors.gcashMobile">
          <div class="flex gap-3">
            <span
              class="flex h-[52px] w-16 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-sm text-ink"
            >
              +63
            </span>
            <input
              id="reg-gcash-mobile"
              v-model="form.gcashMobile"
              type="tel"
              inputmode="numeric"
              maxlength="13"
              placeholder="912 345 6789"
              class="input h-[52px]"
              :class="{ 'border-danger': errors.gcashMobile }"
            />
          </div>
        </RegField>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { callOutline, cardOutline, peopleOutline, personOutline } from 'ionicons/icons';
import RegField from '@/components/register/RegField.vue';
import RegSelect from '@/components/register/RegSelect.vue';
import StepHeading from '@/components/register/StepHeading.vue';
import { maxBirthDate, useRegisterForm } from '../useRegisterForm';

const { form, errors, options } = useRegisterForm();
const maxBirth = maxBirthDate();
</script>
