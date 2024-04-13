<template>
  <section>
    <div v-if="!quizTypesAvailable">
      <Message severity="info" :closable="false">There are no quiz types.</Message>
    </div>
    <div v-else>
      <div class="flex justify-content-between">
        <InputGroup class="w-10">
          <InputText placeholder="Search Quiz Type" />
          <Button icon="pi pi-search" class="bg-cyan-400 border-none" />
        </InputGroup>

        <div>
          <Button class="bg-gray-300 mr-2 border-0" @click="loadEntities">
            <i class="pi pi-refresh mr-2"></i>
            <span>Refresh</span>
          </Button>
          <Button class="bg-cyan-400 border-0" @click="isAddDialogVisible = true">
            <i class="pi pi-plus mr-2"></i>
            <span>Add</span>
          </Button>
        </div>
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

      <DataTable :value="quizTypeStore.getQuizTypes" class="mt-4" :rows="10" :paginator="true" :loading="entitiesLoading" sortfield="name">
        <Column field="id" header="Id" sortable></Column>
        <Column field="name" header="Quiz Type Name" sortable></Column>
        <Column header="Actions" sortable>
          <template #body>
            <div>
              <Button size="small" class="bg-cyan-400 border-0 mx-1">
                <i class="pi pi-pencil mr-2"></i>
                <span>Update</span>
              </Button>
              <Button size="small" class="bg-cyan-400 border-0 mx-1">
                <i class="pi pi-trash mr-2"></i>
                <span>Delete</span>
              </Button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Toast />
  </section>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed, ref } from 'vue';
import { useQuizTypeStore } from '@/stores/QuizTypeStore';
import { useToast } from 'primevue/usetoast';

import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Toast from 'primevue/toast';

const toast = useToast();
const quizTypeStore = useQuizTypeStore();
const quizTypeToAdd = reactive({ name: '' });
const entitiesLoading = ref(false);
const isAddDialogVisible = ref(false);
const quizTypesAvailable = computed(() => quizTypeStore.getQuizTypes.length > 0);

onMounted(() => {
  loadEntities();
});

const loadEntities = async () => {
  entitiesLoading.value = true;
  await quizTypeStore.fetchQuizTypes();
  entitiesLoading.value = false;
};

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
