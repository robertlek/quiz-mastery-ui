<template>
  <section>
    <DataTable :value="quizzes">
      <Column field="quizType" header="Quiz Type"></Column>
      <Column field="name" header="Quiz Name"></Column>
      <Column field="description" header="Description"></Column>
      <Column field="maxScore" header="Maximum Score"></Column>
      <Column field="createdDate" header="Created On"></Column>
    </DataTable>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useQuizStore } from '@/stores/QuizStore';
import { useQuizTypeStore } from '@/stores/QuizTypeStore';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const quizStore = useQuizStore();
const quizTypeStore = useQuizTypeStore();
const quizzes = computed(() => {
  return quizStore.getQuizzes.map((quiz) => {
    return {
      quizType: quizTypeStore.getQuizTypeName(quiz.quizTypeId),
      name: quiz.name,
      description: quiz.description,
      maxScore: quiz.maxScore,
      createdDate: new Date(quiz.createdDate).toDateString()
    };
  });
});

onMounted(async () => {
  await quizStore.fetchQuizzes();
  await quizTypeStore.fetchQuizTypes();
});
</script>
