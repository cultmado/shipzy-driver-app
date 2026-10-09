<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <PageHeader
        back
        fallback="/tabs/profile"
        title="Contact Information"
        subtitle="Keep your contact details up to date so we can reach you when needed."
      />
      <div class="px-4 pb-6">
        <form :class="[formCard, 'space-y-4']" @submit.prevent="save">
          <FormField id="ci-email" label="Email Address" :icon="mailOutline" compact>
            <template #label-right>
              <span
                v-if="driver.emailVerified && form.email === driver.email"
                class="mb-2 rounded bg-success-soft px-1.5 py-0.5 text-[7px] font-semibold text-success ring-1 ring-success/15"
              >
                Verified
              </span>
            </template>
            <input
              id="ci-email"
              v-model.trim="form.email"
              type="email"
              autocomplete="email"
              :class="[fieldInput, 'pl-11']"
              placeholder="name@example.com"
            />
          </FormField>
          <FormField id="ci-mobile" label="Mobile Number" compact>
            <div
              class="flex h-[42px] overflow-hidden rounded-lg border border-line bg-surface focus-within:border-primary-600 focus-within:ring-4 focus-within:ring-primary-600/10"
            >
              <span class="flex items-center border-r border-line bg-soft px-2.5 text-[13px] text-ink">+63</span>
              <input
                id="ci-mobile"
                v-model.trim="form.mobile"
                type="tel"
                inputmode="numeric"
                autocomplete="tel-national"
                class="min-w-0 flex-1 px-2 text-[13px] text-ink outline-none placeholder:text-ink-subtle"
                placeholder="912 345 6789"
              />
            </div>
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
import { mailOutline } from 'ionicons/icons';
import { computed, reactive } from 'vue';
import FooterAction from '@/components/FooterAction.vue';
import FormField from '@/components/FormField.vue';
import PageHeader from '@/components/PageHeader.vue';
import { fieldInput, footerBtn, formCard, useSaveAndBack } from '@/components/profile/form';
import { useStore } from '@/composables/useStore';

const { driver } = useStore();
const finish = useSaveAndBack();

const form = reactive({ email: driver.email, mobile: driver.mobile });

const valid = computed(() => /^\S+@\S+\.\S+$/.test(form.email) && form.mobile.replace(/\D/g, '').length >= 10);

function save() {
  if (!valid.value) return;
  if (form.email !== driver.email) driver.emailVerified = false;
  driver.email = form.email;
  driver.mobile = form.mobile;
  finish('Contact information updated');
}
</script>
