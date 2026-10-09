<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <PageHeader
        back
        fallback="/tabs/profile"
        title="Vehicle & License Information"
        subtitle="Vehicle & License Information"
      />
      <div class="px-4 pb-6">
        <form :class="[formCard, 'space-y-4']" @submit.prevent="save">
          <FormField id="vh-type" label="Vehicle Type" compact>
            <ProfileSelect id="vh-type" v-model="form.type" :options="vehicleTypes" />
          </FormField>
          <FormField v-for="f in textFields" :id="`vh-${f.key}`" :key="f.key" :label="f.label" compact>
            <input :id="`vh-${f.key}`" v-model.trim="form[f.key]" :class="fieldInput" :placeholder="f.placeholder" />
          </FormField>
          <FormField id="vh-reg" label="Date of Registration" compact>
            <input id="vh-reg" v-model="form.registeredAt" type="date" :class="fieldInput" />
          </FormField>
          <FormField id="vh-tin" label="TIN Number" compact>
            <input id="vh-tin" v-model.trim="form.tin" :class="fieldInput" placeholder="000-000-000-000" />
          </FormField>
          <FormField id="vh-license-type" label="License Type" compact>
            <ProfileSelect id="vh-license-type" v-model="form.licenseType" :options="licenseTypes" />
          </FormField>
          <FormField id="vh-license-no" label="Driver's License Number" compact>
            <input id="vh-license-no" v-model.trim="form.licenseNo" :class="fieldInput" placeholder="N00-00-000000" />
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
import { computed, reactive } from 'vue';
import FooterAction from '@/components/FooterAction.vue';
import FormField from '@/components/FormField.vue';
import PageHeader from '@/components/PageHeader.vue';
import ProfileSelect from '@/components/profile/ProfileSelect.vue';
import { fieldInput, footerBtn, formCard, useSaveAndBack } from '@/components/profile/form';
import { useStore } from '@/composables/useStore';

const { driver } = useStore();
const finish = useSaveAndBack();

const vehicleTypes = ['Motorcycle', 'Sedan', 'MPV', 'Van', 'Closed Van', 'Pickup Truck', 'Box Truck', 'Wing Van', 'Flatbed Truck'];
const licenseTypes = ['Professional', 'Non-Professional', 'Student Permit'];

const textFields = [
  { key: 'model', label: 'Vehicle Model', placeholder: 'e.g. Honda Click 160' },
  { key: 'plate', label: 'Plate Number', placeholder: 'ABC 1234' },
  { key: 'orcr', label: 'OR/CR Number', placeholder: 'ORCR-0000-000000' },
] as const;

const form = reactive({ ...driver.vehicle });

const valid = computed(() => Object.values(form).every(Boolean));

function save() {
  if (!valid.value) return;
  Object.assign(driver.vehicle, form);
  finish('Vehicle & license information updated');
}
</script>
