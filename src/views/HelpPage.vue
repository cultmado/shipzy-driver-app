<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <PageHeader back fallback="/tabs/profile" title="Help & Faqs" subtitle="Find answers to common questions." />
      <div class="space-y-4 px-4 pb-6">
        <!-- FAQ accordion: one item open at a time -->
        <section class="card rounded-xl px-3.5 py-2">
          <div v-for="(f, i) in faqs" :key="f.q" :class="i ? 'border-t border-line-soft' : ''">
            <button
              class="flex min-h-8 w-full items-center justify-between gap-3 py-2 text-left text-[9px] font-semibold text-ink"
              :aria-expanded="open === i"
              @click="open = open === i ? -1 : i"
            >
              {{ f.q }}
              <ion-icon
                :icon="chevronDown"
                class="shrink-0 text-sm transition-transform duration-300"
                :class="open === i ? 'rotate-180' : ''"
              />
            </button>
            <div
              class="grid transition-[grid-template-rows] duration-300 ease-out"
              :class="open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <p class="overflow-hidden text-[9px] leading-relaxed text-ink-muted">
                <span class="block pb-2.5">{{ f.a }}</span>
              </p>
            </div>
          </div>
        </section>

        <!-- Email support -->
        <section class="card flex flex-col items-center rounded-xl px-7 pt-4 pb-4 text-center">
          <img :src="img.emailSupport" alt="" class="h-[120px] w-auto object-contain" />
          <h2 class="mt-2 text-base font-bold text-ink">Email Support</h2>
          <p class="mt-2 text-[10px] leading-relaxed text-ink-muted">
            Can't find what you're looking for? Send us an email and we'll get back to you as soon as possible.
          </p>
          <div class="mt-4 flex w-full items-center gap-4 rounded-md border border-line-soft px-3.5 py-2.5 text-left">
            <ion-icon :icon="mailOutline" class="text-2xl text-primary-600" />
            <div>
              <p class="text-[10px] text-ink-muted">Email Address</p>
              <p class="text-[11px] font-semibold text-primary-600">{{ supportEmail }}</p>
            </div>
          </div>
          <a :href="`mailto:${supportEmail}`" class="btn-primary mt-3 w-full rounded-lg py-2.5 text-xs font-medium">
            <ion-icon :icon="mailOutline" class="text-sm" />Send Email
          </a>
          <p class="mt-3 flex items-center gap-1.5 text-[9px] text-ink-muted">
            <ion-icon :icon="timeOutline" class="text-xs text-ink" />We usually respond within 24 hours.
          </p>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonIcon, IonPage } from '@ionic/vue';
import { chevronDown, mailOutline, timeOutline } from 'ionicons/icons';
import { ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import { img } from '@/assets/images';
import { faqs } from '@/data/mock';

const supportEmail = 'support@shipzy.com';
const open = ref(-1);
</script>
