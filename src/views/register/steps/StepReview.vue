<template>
  <div>
    <StepHeading
      title="Review Your Information"
      description="Confirm that all information is correct before creating the account."
    />

    <div class="mt-5 space-y-4">
      <ReviewCard
        title="Account"
        :icon="keyOutline"
        :rows="[
          { label: 'Email', value: form.email },
          { label: 'Referral Code', value: form.referralCode },
        ]"
        @edit="goTo(1)"
      />
      <ReviewCard
        title="Personal and GCash Information"
        :icon="idCardOutline"
        :rows="[
          { label: 'Full Name', value: fullName },
          { label: 'Birth Date', value: formatDate(form.birthDate) },
          { label: 'Gender', value: labelOf(options.genders, form.gender) },
          { label: 'Mobile Number', value: phone(form.mobile) },
          ...(form.telephone ? [{ label: 'Telephone', value: form.telephone }] : []),
          { label: 'G-Cash Name and Mobile Number', value: gcash },
        ]"
        @edit="goTo(2)"
      />
      <ReviewCard
        title="Residential Address"
        :icon="homeOutline"
        :rows="[{ label: 'Full Address', value: fullAddress }]"
        @edit="goTo(3)"
      />
      <ReviewCard
        title="Vehicle and License"
        :icon="carOutline"
        :columns="2"
        :rows="[
          { label: 'Vehicle', value: vehicle },
          { label: 'License Type', value: labelOf(options.licenseTypes, form.licenseType) },
          { label: 'Plate Number', value: form.plateNumber.toUpperCase() },
          { label: 'License Number', value: form.licenseNumber },
          { label: 'OR/CR Number', value: form.orcrNumber },
          { label: form.tin ? 'TIN Number' : '', value: form.tin },
          { label: 'Registration Date', value: formatDate(form.registrationDate) },
        ]"
        @edit="goTo(4)"
      />
      <ReviewCard
        title="Uploaded Documents"
        :icon="documentsOutline"
        :columns="2"
        :rows="documents.map((d) => ({ label: d.title, value: form.docs[d.key]?.name }))"
        @edit="goTo(5)"
      />
    </div>

    <div class="mt-4" :data-invalid="errors.agreed ? '' : undefined">
      <label class="flex cursor-pointer items-start gap-2.5">
        <input
          v-model="form.agreed"
          type="checkbox"
          class="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary-600"
        />
        <span class="text-[10px] leading-relaxed text-ink-muted">
          I confirm that the information provided is accurate and I agree to Shipzy's
          <span class="font-semibold text-primary-600">Terms and Conditions</span> and
          <span class="font-semibold text-primary-600">Privacy Policy</span>
        </span>
      </label>
      <p v-if="errors.agreed" class="mt-1.5 text-[11px] text-danger">{{ errors.agreed }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { carOutline, documentsOutline, homeOutline, idCardOutline, keyOutline } from 'ionicons/icons';
import ReviewCard from '@/components/register/ReviewCard.vue';
import StepHeading from '@/components/register/StepHeading.vue';
import { countryOptions, digits, documents, formatDate, labelOf, useRegisterForm } from '../useRegisterForm';

const { form, errors, step, options } = useRegisterForm();

const goTo = (n: number) => (step.value = n);

const phone = (v: string) => (v.trim() ? `+63 ${digits(v)}` : '');

const fullName = computed(() =>
  [form.firstName, form.middleName, form.lastName].map((s) => s.trim()).filter(Boolean).join(' '),
);

const gcash = computed(() => {
  const name = form.gcashSame ? fullName.value : form.gcashName.trim();
  const mobile = phone(form.gcashSame ? form.mobile : form.gcashMobile);
  return [name, mobile].filter(Boolean).join(' - ');
});

const fullAddress = computed(() =>
  [
    form.street.trim(),
    labelOf(options.barangays, form.barangay),
    labelOf(options.cities, form.city).toUpperCase(),
    labelOf(options.provinces, form.province).toUpperCase(),
    form.zip,
    labelOf(countryOptions, form.country),
  ]
    .filter(Boolean)
    .join(', '),
);

const vehicle = computed(() =>
  [labelOf(options.vehicles, form.vehicleType), form.vehicleModel.trim()].filter(Boolean).join(' — '),
);
</script>
