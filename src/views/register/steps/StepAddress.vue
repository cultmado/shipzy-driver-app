<template>
  <div class="space-y-6">
    <StepHeading title="Residential Address" description="Provide your current and complete residential address." />

    <RegField id="reg-street" label="House / Lot / Block / Street" :icon="homeOutline" required :error="errors.street">
      <input
        id="reg-street"
        v-model="form.street"
        type="text"
        autocomplete="street-address"
        placeholder="Enter house, lot, block and street"
        class="input h-[52px] pl-11"
        :class="{ 'border-danger': errors.street }"
      />
    </RegField>

    <RegField id="reg-country" label="Country" :icon="flagOutline" required :error="errors.country">
      <RegSelect
        id="reg-country"
        v-model="form.country"
        :options="countryOptions"
        placeholder="Select country"
        icon
        :invalid="!!errors.country"
      />
    </RegField>

    <RegField id="reg-province" label="Province" :icon="businessOutline" required :error="errors.province">
      <RegSelect
        id="reg-province"
        v-model="form.province"
        :options="options.provinces"
        :loading="options.loading.has('provinces')"
        placeholder="Select province"
        icon
        :invalid="!!errors.province"
      />
    </RegField>

    <RegField id="reg-city" label="City / Municipality" :icon="businessOutline" required :error="errors.city">
      <RegSelect
        id="reg-city"
        v-model="form.city"
        :options="options.cities"
        :loading="options.loading.has('cities')"
        :disabled="!form.province"
        placeholder="Select city / municipality"
        icon
        :invalid="!!errors.city"
      />
    </RegField>

    <RegField id="reg-barangay" label="Barangay" :icon="businessOutline" required :error="errors.barangay">
      <RegSelect
        id="reg-barangay"
        v-model="form.barangay"
        :options="options.barangays"
        :loading="options.loading.has('barangays')"
        :disabled="!form.city"
        placeholder="Select barangay"
        icon
        :invalid="!!errors.barangay"
      />
    </RegField>

    <RegField id="reg-zip" label="ZIP Code" :icon="locationOutline" required :error="errors.zip">
      <input
        id="reg-zip"
        v-model.trim="form.zip"
        type="text"
        inputmode="numeric"
        autocomplete="postal-code"
        maxlength="4"
        placeholder="Enter ZIP code"
        class="input h-[52px] pl-11"
        :class="{ 'border-danger': errors.zip }"
      />
    </RegField>
  </div>
</template>

<script setup lang="ts">
import { businessOutline, flagOutline, homeOutline, locationOutline } from 'ionicons/icons';
import RegField from '@/components/register/RegField.vue';
import RegSelect from '@/components/register/RegSelect.vue';
import StepHeading from '@/components/register/StepHeading.vue';
import { countryOptions, useRegisterForm } from '../useRegisterForm';

const { form, errors, options } = useRegisterForm();
</script>
