<template>
  <div>
    <StepHeading
      title="Vehicle and License Information"
      description="Enter the vehicle and driver license details used for deliveries."
    />

    <!-- Vehicle -->
    <div class="mt-4 space-y-6">
      <SubHeading :icon="carOutline" title="Vehicle Details" description="Information must match the submitted OR/CR." />

      <RegField id="reg-vtype" label="Vehicle Type" required :error="errors.vehicleType">
        <RegSelect
          id="reg-vtype"
          v-model="form.vehicleType"
          :options="options.vehicles"
          :loading="options.loading.has('vehicles')"
          placeholder="Select vehicle type"
          :invalid="!!errors.vehicleType"
        />
      </RegField>

      <RegField id="reg-vmodel" label="Vehicle Model" required :error="errors.vehicleModel">
        <input
          id="reg-vmodel"
          v-model="form.vehicleModel"
          type="text"
          placeholder="Example: Honda Click 160"
          class="input h-[52px]"
          :class="{ 'border-danger': errors.vehicleModel }"
        />
      </RegField>

      <RegField id="reg-plate" label="Plate Number" required :error="errors.plateNumber">
        <input
          id="reg-plate"
          v-model="form.plateNumber"
          type="text"
          autocapitalize="characters"
          placeholder="Enter plate number"
          class="input h-[52px] uppercase placeholder:normal-case"
          :class="{ 'border-danger': errors.plateNumber }"
        />
      </RegField>

      <RegField id="reg-orcr" label="OR/CR Number" required :error="errors.orcrNumber">
        <input
          id="reg-orcr"
          v-model="form.orcrNumber"
          type="text"
          placeholder="Enter OR/CR number"
          class="input h-[52px]"
          :class="{ 'border-danger': errors.orcrNumber }"
        />
      </RegField>

      <RegField id="reg-regdate" label="Date of Registration" required :error="errors.registrationDate">
        <input
          id="reg-regdate"
          v-model="form.registrationDate"
          type="date"
          :max="today"
          class="input h-[52px]"
          :class="[form.registrationDate ? 'text-ink' : 'text-ink-subtle', { 'border-danger': errors.registrationDate }]"
        />
      </RegField>

      <RegField id="reg-tin" label="TIN Number" optional>
        <input
          id="reg-tin"
          v-model="form.tin"
          type="text"
          inputmode="numeric"
          placeholder="Enter TIN number"
          class="input h-[52px]"
        />
      </RegField>
    </div>

    <hr class="my-6 border-0 border-t border-line" />

    <!-- License -->
    <div class="space-y-6">
      <SubHeading
        :icon="idCardOutline"
        title="Driver License Details"
        description="Use the information printed on your current driver's license."
      />

      <RegField id="reg-ltype" label="License Type" required :error="errors.licenseType">
        <RegSelect
          id="reg-ltype"
          v-model="form.licenseType"
          :options="licenseOptions"
          :loading="options.loading.has('licenseTypes')"
          placeholder="Select license type"
          :invalid="!!errors.licenseType"
        />
      </RegField>

      <RegField id="reg-lnum" label="License Number" required :error="errors.licenseNumber">
        <input
          id="reg-lnum"
          v-model="form.licenseNumber"
          type="text"
          autocapitalize="characters"
          placeholder="Enter license number"
          class="input h-[52px]"
          :class="{ 'border-danger': errors.licenseNumber }"
        />
      </RegField>
    </div>

    <hr class="mt-6 border-0 border-t border-line" />
  </div>
</template>

<script setup lang="ts">
import { carOutline, idCardOutline } from 'ionicons/icons';
import RegField from '@/components/register/RegField.vue';
import RegSelect from '@/components/register/RegSelect.vue';
import StepHeading from '@/components/register/StepHeading.vue';
import SubHeading from '@/components/register/SubHeading.vue';
import { toIso, useRegisterForm } from '../useRegisterForm';

const { form, errors, options, licenseOptions } = useRegisterForm();
const today = toIso(new Date());
</script>
