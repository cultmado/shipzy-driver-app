<template>
  <div>
    <StepHeading
      title="Upload Documents"
      description="Upload clear and readable copies of all required documents and photos."
    />

    <div class="mt-3 flex items-center gap-3 rounded-xl bg-primary-100 px-3.5 py-2.5">
      <ion-icon :icon="informationCircleOutline" class="shrink-0 text-2xl text-primary-600" />
      <p class="text-[8px] leading-snug text-ink">
        Accepted formats: JPG, JPEG, PNG, WEBP, HEIC/HEIF or PDF. Maximum file size: 5 MB each.
      </p>
    </div>

    <div class="mt-6 space-y-6">
      <DocumentUploadCard
        v-for="d in documents"
        :key="d.key"
        :title="d.title"
        :description="d.description"
        :icon="d.icon"
        :optional="d.optional"
        :file-name="form.docs[d.key]?.name"
        :error="errors[d.key]"
        @pick="(f) => pick(d.key, f)"
        @clear="setDoc(d.key, null)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, toastController } from '@ionic/vue';
import { informationCircleOutline } from 'ionicons/icons';
import DocumentUploadCard from '@/components/register/DocumentUploadCard.vue';
import StepHeading from '@/components/register/StepHeading.vue';
import { documents, MAX_FILE_BYTES, useRegisterForm, type DocKey } from '../useRegisterForm';

const { form, errors, setDoc } = useRegisterForm();

const ACCEPTED = /\.(jpe?g|png|webp|heic|heif|pdf)$/i;

async function pick(key: DocKey, file: File) {
  let message = '';
  if (!ACCEPTED.test(file.name) && !file.type.startsWith('image/')) {
    message = 'Unsupported file type. Use JPG, PNG, WEBP, HEIC/HEIF or PDF.';
  } else if (file.size > MAX_FILE_BYTES) {
    message = 'File is too large. Maximum file size is 5 MB.';
  }
  if (message) {
    const toast = await toastController.create({ message, duration: 2500, position: 'bottom', color: 'danger' });
    await toast.present();
    return;
  }
  setDoc(key, file);
}
</script>
