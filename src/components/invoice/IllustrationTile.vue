<template>
  <!-- Teal square holding a 3D illustration (parcel box, truck) -->
  <div class="flex size-[115px] items-center justify-center rounded-xl bg-ocean-600">
    <img :src="src" alt="" class="w-[82%] object-contain" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ src: string }>();
</script>
