<template>
  <div>
    <div v-if="!quizTypesAvailable">
      <Message severity="info" :closable="false">There are no quiz types.</Message>
    </div>
    <div v-else>
      <div class="flex justify-content-between align-items-center mb-4">
        <span>Manage the quiz types available in the application.</span>
        <Button class="bg-primary-400" @click="isAddDialogVisible = true"><i class="pi pi-plus-circle"></i></Button>
      </div>
      <div>
        <Dialog v-model:visible="isAddDialogVisible" modal header="Add Quiz Type" :style="{ width: '25rem' }">
          <span class="p-text-secondary block mb-5">Set a name for the new quiz type.</span>
          <div class="flex align-items-center gap-3 mb-5">
            <label for="name" class="font-semibold w-6rem">Name</label>
            <InputText v-model.trim="quizTypeToAdd.name" id="name" class="flex-auto" autocomplete="off" />
          </div>
          <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="isAddDialogVisible = false"></Button>
            <Button type="button" label="Add" @click="addQuizType"></Button>
          </div>
        </Dialog>
      </div>
      <Card v-for="quizType in quizTypeStore.getQuizTypes" :key="quizType.id" class="bg-primary-400 text-100 shadow-1 mb-4">
        <template #title>
          <span>{{ quizType.name }}</span>
        </template>
      </Card>
    </div>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed, ref } from 'vue';
import { useQuizTypeStore } from '@/stores/QuizTypeStore';
import { useToast } from 'primevue/usetoast';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Toast from 'primevue/toast';

const toast = useToast();
const quizTypeStore = useQuizTypeStore();
const quizTypeToAdd = reactive({ name: '' });
const isAddDialogVisible = ref(false);
const quizTypesAvailable = computed(() => quizTypeStore.getQuizTypes.length > 0);

onMounted(async () => {
  await quizTypeStore.fetchQuizTypes();
});

const addQuizType = async () => {
  const response = await quizTypeStore.addQuizType(quizTypeToAdd);

  if (response) {
    isAddDialogVisible.value = false;
    toast.add({ severity: 'success', summary: 'Quiz Type added', detail: 'The quiz type has been added!', life: 3000 });
    await quizTypeStore.fetchQuizTypes();
    quizTypeToAdd.name = '';
  }
};
</script>
