<template>
  <main>
    <section class="flex justify-content-between mx-3">
      <InputGroup class="w-10">
        <InputText placeholder="Search Quiz" />
        <Button icon="pi pi-search" class="bg-cyan-400 border-none" />
      </InputGroup>

      <Button class="bg-cyan-400 border-none">
        <i class="pi pi-refresh mr-2"></i>
        <span>Refresh</span>
      </Button>
    </section>

    <section class="mx-3 mt-3">
      <Badge v-for="quizType in quizTypeStore.getQuizTypes" :key="quizType.id" severity="secondary" class="cursor-pointer mr-2">
        {{ quizType.name }}
      </Badge>
    </section>

    <section class="grid grid-nogutter mt-5">
      <QuizCard
        v-for="quiz in quizzes"
        :key="quiz.id"
        :name="quiz.name"
        :description="quiz.description"
        :image="quiz.image"
        class="col-12 sm:col-12 md:col-6 lg:col-4 xl:col-3 mb-5"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuizStore } from '@/stores/QuizStore';
import { useQuizTypeStore } from '@/stores/QuizTypeStore';
import QuizCard from '@/components/quiz/QuizCard.vue';

import Badge from 'primevue/badge';
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';

const quizStore = useQuizStore();
const quizTypeStore = useQuizTypeStore();
const quizzesAreLoading = ref(true);

const quizzes = computed(() => {
  return quizStore.getQuizzes.map((quiz) => {
    return {
      id: quiz.id,
      quizType: quizTypeStore.getQuizTypeName(quiz.quizTypeId),
      name: quiz.name,
      description: quiz.description,
      image: quiz.imageUrl,
      maxScore: quiz.maxScore,
      createdDate: new Date(quiz.createdDate).toDateString()
    };
  });
});

onMounted(() => {
  loadQuizzes();
});

const loadQuizzes = async () => {
  quizzesAreLoading.value = true;
  await quizTypeStore.fetchQuizTypes();
  await quizStore.fetchQuizzes();
  quizzesAreLoading.value = false;
};
</script>
