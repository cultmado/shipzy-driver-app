<template>
  <!-- Stylised map placeholder. Swap for Google Maps / Mapbox when wiring real navigation. -->
  <div class="relative overflow-hidden bg-[#e8ecf3]" :class="rounded ? 'rounded-2xl' : ''">
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" class="block h-full w-full">
      <rect x="250" y="-10" width="170" height="90" rx="18" class="fill-[#d5ecd9]" />
      <path d="M-10 190 C 80 170, 120 230, 220 215 S 360 180, 420 200 L 420 260 L -10 260 Z" class="fill-[#cfe1f7]" />
      <g class="stroke-white" stroke-linecap="round" fill="none">
        <path d="M-10 60 H 420" stroke-width="14" />
        <path d="M-10 140 H 420" stroke-width="10" />
        <path d="M90 -10 V 260" stroke-width="12" />
        <path d="M230 -10 V 260" stroke-width="10" />
        <path d="M330 -10 V 260" stroke-width="8" />
        <path d="M-10 230 L 160 -10" stroke-width="8" />
      </g>
      <path
        d="M90 175 V 140 H 230 V 60 H 318"
        fill="none"
        stroke="#0a5e84"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="route"
      />
      <!-- Pickup pin -->
      <circle cx="90" cy="175" r="9" fill="#fff" stroke="#0a5e84" stroke-width="4" />
      <!-- Driver -->
      <g v-if="showDriver" transform="translate(230 105)">
        <circle r="16" fill="#0a5e84" opacity="0.18" class="pulse" />
        <circle r="8" fill="#0a5e84" stroke="#fff" stroke-width="3" />
      </g>
      <!-- Drop-off pin -->
      <g transform="translate(318 60)">
        <path d="M0 0 C -12 -14 -12 -30 0 -30 C 12 -30 12 -14 0 0 Z" fill="#eb4335" stroke="#fff" stroke-width="2" />
        <circle cy="-20" r="4" fill="#fff" />
      </g>
    </svg>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ showDriver?: boolean; rounded?: boolean }>(), {
  showDriver: true,
  rounded: true,
});
</script>

<style scoped>
.route {
  stroke-dasharray: 10 8;
  animation: dash 1.2s linear infinite;
}
.pulse {
  transform-origin: center;
  animation: pulse 1.8s ease-out infinite;
}
@keyframes dash {
  to {
    stroke-dashoffset: -18;
  }
}
@keyframes pulse {
  0% {
    transform: scale(0.6);
    opacity: 0.35;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}
</style>
