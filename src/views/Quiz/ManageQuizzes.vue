<template>
  <section>
    <div class="flex justify-content-end">
      <Button class="bg-gray-300 mr-2 border-0" @click="loadEntities">
        <i class="pi pi-refresh mr-2"></i>
        <span>Refresh</span>
      </Button>
      <RouterLink to="/add-quiz">
        <Button class="bg-cyan-400 border-0">
          <i class="pi pi-plus mr-2"></i>
          <span>Add Quiz</span>
        </Button>
      </RouterLink>
    </div>
    <DataTable :value="quizzes" class="mt-4" :rows="10" :paginator="true" :loading="entitiesLoading">
      <Column field="quizType" header="Quiz Type"></Column>
      <Column field="name" header="Quiz Name"></Column>
      <Column field="description" header="Description"></Column>
      <Column field="maxScore" header="Maximum Score">
        <template #body="slotProps">
          <Badge :value="slotProps.data.maxScore" class="bg-cyan-400"></Badge>
        </template>
      </Column>
      <Column field="createdDate" header="Created On"></Column>
      <Column header="Actions">
        <template #body>
          <div>
            <Button size="small" class="bg-cyan-400 border-0 mx-1">
              <i class="pi pi-pencil mr-2"></i>
              <span>Edit</span>
            </Button>
            <Button size="small" class="bg-cyan-400 border-0 mx-1">
              <i class="pi pi-trash mr-2"></i>
              <span>Delete</span>
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuizStore } from '@/stores/QuizStore';
import { useQuizTypeStore } from '@/stores/QuizTypeStore';
import { RouterLink } from 'vue-router';

import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';

const quizStore = useQuizStore();
const quizTypeStore = useQuizTypeStore();
const entitiesLoading = ref(true);
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

onMounted(() => {
  loadEntities();
});

const loadEntities = async () => {
  entitiesLoading.value = true;
  await quizStore.fetchQuizzes();
  await quizTypeStore.fetchQuizTypes();
  entitiesLoading.value = false;
};
</script>
