<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <PageHeader
        back
        fallback="/tabs/profile"
        title="Address"
        subtitle="Keep your current and complete residential address up to date."
      />
      <div class="px-4 pb-6">
        <form :class="[formCard, 'space-y-4']" @submit.prevent="save">
          <FormField id="ad-street" label="House / Lot / Block / Street" :icon="homeOutline" compact>
            <input
              id="ad-street"
              v-model.trim="form.street"
              :class="[fieldInput, 'pl-11']"
              autocomplete="street-address"
              placeholder="Enter house, lot, block and street"
            />
          </FormField>
          <FormField id="ad-country" label="Country" :icon="flagOutline" compact>
            <ProfileSelect id="ad-country" v-model="form.country" :options="countries" icon />
          </FormField>
          <FormField id="ad-province" label="Province" :icon="businessOutline" compact>
            <ProfileSelect
              id="ad-province"
              v-model="form.province"
              :options="Object.keys(provinces)"
              placeholder="Select province"
              icon
            />
          </FormField>
          <FormField id="ad-city" label="City / Municipality" :icon="businessOutline" compact>
            <ProfileSelect
              id="ad-city"
              v-model="form.city"
              :options="cities"
              placeholder="Select city / municipality"
              icon
            />
          </FormField>
          <FormField id="ad-barangay" label="Barangay" :icon="businessOutline" compact>
            <ProfileSelect
              id="ad-barangay"
              v-model="form.barangay"
              :options="barangays"
              placeholder="Select barangay"
              icon
            />
          </FormField>
          <FormField id="ad-zip" label="ZIP Code" :icon="locationOutline" compact>
            <input
              id="ad-zip"
              v-model.trim="form.zip"
              inputmode="numeric"
              maxlength="4"
              autocomplete="postal-code"
              :class="[fieldInput, 'pl-11']"
              placeholder="Enter ZIP code"
            />
          </FormField>
        </form>
      </div>
    </ion-content>
    <FooterAction>
      <button :class="footerBtn" :disabled="!valid" @click="save">Save</button>
    </FooterAction>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { businessOutline, flagOutline, homeOutline, locationOutline } from 'ionicons/icons';
import { computed, reactive, watch } from 'vue';
import FooterAction from '@/components/FooterAction.vue';
import FormField from '@/components/FormField.vue';
import PageHeader from '@/components/PageHeader.vue';
import ProfileSelect from '@/components/profile/ProfileSelect.vue';
import { countries, provinces } from '@/components/profile/address';
import { fieldInput, footerBtn, formCard, useSaveAndBack } from '@/components/profile/form';
import { useStore } from '@/composables/useStore';

const { driver } = useStore();
const finish = useSaveAndBack();

const form = reactive({ ...driver.address });

const cities = computed(() => Object.keys(provinces[form.province] ?? {}));
const barangays = computed(() => provinces[form.province]?.[form.city] ?? []);

// Clear dependent selects when a parent selection no longer contains them.
watch(cities, (list) => {
  if (!list.includes(form.city)) form.city = '';
});
watch(barangays, (list) => {
  if (!list.includes(form.barangay)) form.barangay = '';
});

const valid = computed(() => Object.values(form).every(Boolean));

function save() {
  if (!valid.value) return;
  Object.assign(driver.address, form);
  finish('Address updated');
}
</script>
