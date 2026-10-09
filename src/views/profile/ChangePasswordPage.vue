<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <PageHeader
        back
        fallback="/tabs/profile"
        title="Change Password"
        subtitle="Update your password to keep your account secure and protected."
      />
      <div class="px-4 pb-6">
        <form :class="[formCard, 'space-y-4']" @submit.prevent="confirm">
          <FormField v-for="f in fields" :id="`pw-${f.key}`" :key="f.key" :label="f.label" required compact>
            <input
              :id="`pw-${f.key}`"
              v-model="form[f.key]"
              :type="shown[f.key] ? 'text' : 'password'"
              :autocomplete="f.key === 'current' ? 'current-password' : 'new-password'"
              :class="[fieldInput, 'pr-11']"
              :placeholder="f.placeholder"
            />
            <button
              type="button"
              class="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center text-ink-muted"
              :aria-label="shown[f.key] ? 'Hide password' : 'Show password'"
              @click="shown[f.key] = !shown[f.key]"
            >
              <ion-icon :icon="shown[f.key] ? eyeOffOutline : eyeOutline" class="text-lg" />
            </button>
          </FormField>
          <p v-if="mismatch" class="-mt-2 text-[10px] text-danger">Passwords do not match.</p>

          <div class="mt-6 rounded-lg bg-soft p-3">
            <h3 class="mb-2 text-xs font-bold text-ink">Password requirements</h3>
            <ul class="space-y-1.5">
              <li
                v-for="r in rules"
                :key="r.label"
                class="flex items-center gap-2 text-[9px] transition-colors"
                :class="r.met ? 'text-success' : 'text-ink-muted'"
              >
                <span
                  class="flex size-[18px] items-center justify-center rounded-full transition-colors"
                  :class="r.met ? 'bg-success/20 text-success' : 'bg-line-soft text-ink-muted'"
                >
                  <ion-icon :icon="checkmark" class="text-[11px]" />
                </span>
                {{ r.label }}
              </li>
            </ul>
          </div>
        </form>
      </div>
    </ion-content>
    <FooterAction>
      <button :class="footerBtn" :disabled="!canConfirm" @click="confirm">Confirm</button>
    </FooterAction>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonIcon, IonPage } from '@ionic/vue';
import { checkmark, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { computed, reactive } from 'vue';
import FooterAction from '@/components/FooterAction.vue';
import FormField from '@/components/FormField.vue';
import PageHeader from '@/components/PageHeader.vue';
import { fieldInput, footerBtn, formCard, useSaveAndBack } from '@/components/profile/form';

const finish = useSaveAndBack();

const fields = [
  { key: 'current', label: 'Current Password', placeholder: 'Enter password' },
  { key: 'next', label: 'Password', placeholder: 'Enter password' },
  { key: 'again', label: 'Confirm Password', placeholder: 'Re-enter password' },
] as const;

const form = reactive({ current: '', next: '', again: '' });
const shown = reactive({ current: false, next: false, again: false });

const rules = computed(() => [
  { label: 'Minimum of 8 characters', met: form.next.length >= 8 },
  { label: 'One uppercase letter', met: /[A-Z]/.test(form.next) },
  { label: 'One lowercase letter', met: /[a-z]/.test(form.next) },
  { label: 'One number', met: /\d/.test(form.next) },
  { label: 'One special character', met: /[^A-Za-z0-9\s]/.test(form.next) },
]);

const mismatch = computed(() => !!form.again && form.again !== form.next);
const canConfirm = computed(
  () => !!form.current && rules.value.every((r) => r.met) && form.again === form.next,
);

function confirm() {
  if (!canConfirm.value) return;
  finish('Password changed successfully');
}
</script>
