<template>
  <section>
    <div class="flex justify-content-between">
      <InputGroup class="w-10">
        <InputText placeholder="Search Quiz" />
        <Button icon="pi pi-search" class="bg-cyan-400 border-none" />
      </InputGroup>

      <div>
        <Button class="bg-gray-300 border-0 mr-2" @click="loadEntities">
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
    </div>
    <DataTable :value="quizzes" class="mt-4" :rows="10" :paginator="true" :loading="entitiesLoading" sortField="name">
      <Column field="quizType" header="Quiz Type" sortable></Column>
      <Column field="name" header="Quiz Name" sortable></Column>
      <Column field="description" header="Description" sortable></Column>
      <Column field="maxScore" header="Maximum Score" sortable>
        <template #body="slotProps">
          <Badge :value="slotProps.data.maxScore" class="bg-cyan-400"></Badge>
        </template>
      </Column>
      <Column field="createdDate" header="Created On" sortable></Column>
      <Column header="Actions" sortable>
        <template #body="slotProps">
          <div class="flex flex-column">
            <RouterLink :to="`/update-quiz/${slotProps.data.id}`">
              <Button size="small" class="bg-cyan-400 border-0 mx-1">
                <i class="pi pi-pencil mr-2"></i>
                <span>Update</span>
              </Button>
            </RouterLink>
            <Button size="small" class="bg-cyan-400 border-0 mx-1" @click="confirmDeleteQuiz(slotProps.data.id)">
              <i class="pi pi-trash mr-2"></i>
              <span>Delete</span>
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>

    <ConfirmDialog />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuizStore } from '@/stores/QuizStore';
import { useQuizTypeStore } from '@/stores/QuizTypeStore';
import { RouterLink } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';

import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';

const quizStore = useQuizStore();
const quizTypeStore = useQuizTypeStore();
const entitiesLoading = ref(true);
const quizzes = computed(() => {
  return quizStore.getQuizzes.map((quiz) => {
    return {
      id: quiz.id,
      quizType: quizTypeStore.getQuizTypeName(quiz.quizTypeId),
      name: quiz.name,
      description: quiz.description,
      maxScore: quiz.maxScore,
      createdDate: new Date(quiz.createdDate).toDateString()
    };
  });
});
const confirm = useConfirm();

onMounted(() => {
  loadEntities();
});

const loadEntities = async () => {
  entitiesLoading.value = true;
  await quizStore.fetchQuizzes();
  await quizTypeStore.fetchQuizTypes();
  entitiesLoading.value = false;
};

const confirmDeleteQuiz = (id: string) => {
  confirm.require({
    message: 'All questions and answers of the quiz will be removed as well.',
    header: 'Are you sure you want to delete this quiz?',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      deleteQuiz(id);
    }
  });
};

const deleteQuiz = async (id: string) => {
  await quizStore.deleteQuiz(id);
  await loadEntities();
};
</script>
