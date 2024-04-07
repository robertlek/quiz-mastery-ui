<template>
  <header class="bg-primary-400 flex p-2 border-1 border-primary-900">
    <img src="/src/assets/icons/quiz-logo.png" alt="Logo" height="50" class="mr-3" />

    <RouterLink v-for="item in items" :to="item.link" :key="item.label" class="flex align-items-center mr-3 no-underline text-100">
      <span :class="item.icon" class="mr-2" />
      <span>{{ item.label }}</span>
    </RouterLink>
  </header>
</template>

<script setup>
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
