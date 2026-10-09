<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <PageHeader
        back
        fallback="/tabs/profile"
        title="Personal Information"
        subtitle="View and update your personal details to keep your profile information accurate and up to date."
      />
      <div class="px-4 pb-6">
        <form :class="[formCard, 'space-y-4']" @submit.prevent="save">
          <FormField id="pi-name" label="Full Name" compact>
            <input id="pi-name" v-model.trim="form.fullName" :class="fieldInput" autocomplete="name" placeholder="Enter full name" />
          </FormField>
          <FormField id="pi-birth" label="Date of Birth" compact>
            <input id="pi-birth" v-model="form.birthDate" type="date" :class="fieldInput" />
          </FormField>
          <FormField id="pi-gender" label="Gender" compact>
            <ProfileSelect id="pi-gender" v-model="form.gender" :options="['Male', 'Female']" />
          </FormField>
        </form>
      </div>
    </ion-content>
    <FooterAction>
      <button :class="footerBtn" :disabled="!form.fullName" @click="save">
        Save
      </button>
    </FooterAction>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { reactive } from 'vue';
import FooterAction from '@/components/FooterAction.vue';
import FormField from '@/components/FormField.vue';
import PageHeader from '@/components/PageHeader.vue';
import ProfileSelect from '@/components/profile/ProfileSelect.vue';
import { fieldInput, footerBtn, formCard, useSaveAndBack } from '@/components/profile/form';
import { useStore } from '@/composables/useStore';
import type { Driver } from '@/data/types';

const { driver } = useStore();
const finish = useSaveAndBack();

const form = reactive({
  fullName: [driver.firstName, driver.middleName, driver.lastName].filter(Boolean).join(' '),
  birthDate: driver.birthDate,
  gender: driver.gender as string,
});

function save() {
  if (!form.fullName) return;
  // First word → first name, last word → last name, anything between → middle name.
  const parts = form.fullName.split(/\s+/);
  driver.firstName = parts[0];
  driver.lastName = parts.length > 1 ? parts[parts.length - 1] : '';
  driver.middleName = parts.slice(1, -1).join(' ') || undefined;
  driver.initials = (driver.firstName[0] + (driver.lastName[0] ?? '')).toUpperCase();
  driver.birthDate = form.birthDate;
  driver.gender = form.gender as Driver['gender'];
  finish('Personal information updated');
}
</script>
