<template>
  <div class="flex flex-column min-h-screen">
    <TheHeader />
    <MainWrapper class="flex-1 p-4" />
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import TheHeader from '@/components/layout/TheHeader.vue';
import MainWrapper from '@/components/layout/MainWrapper.vue';
import TheFooter from '@/components/layout/TheFooter.vue';
</script>
