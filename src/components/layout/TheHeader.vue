<template>
  <header class="bg-cyan-600 flex p-2">
    <span id="header-logo" class="mr-5">
      <RouterLink to="/">
        <img src="/src/assets/icons/quiz-logo.png" alt="Logo" height="50" />
      </RouterLink>
    </span>

    <RouterLink v-for="item in items" :to="item.link" :key="item.label" class="header-link flex align-items-center no-underline text-100">
      <span :class="item.icon" class="mr-2" />
      <span>{{ item.label }}</span>
    </RouterLink>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    link: '/'
  },
  {
    label: 'Add Quiz',
    icon: 'pi pi-plus-circle',
    link: '/about'
  },
  {
    label: 'Quiz Types',
    icon: 'pi pi-book',
    link: '/quiz-types'
  }
]);
</script>
