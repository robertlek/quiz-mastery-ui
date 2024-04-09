<template>
  <Stepper linear>
    <StepperPanel header="Quiz Details">
      <template #content="{ nextCallback }">
        <div class="flex flex-column">
          <div class="border-2 border-dashed surface-border border-round surface-ground font-medium p-5">
            <div class="flex justify-content-between">
              <div class="w-full">
                <label for="quiz-name" class="font-bold block mb-1">Quiz Name</label>
                <InputText v-model="quizToAdd.name" id="quiz-name" placeholder="Quiz Name" class="w-11"></InputText>
              </div>
              <div class="w-full">
                <label for="quiz-type" class="font-bold block mb-1">Quiz Type</label>
                <Dropdown
                  v-model="quizToAdd.quizType"
                  :options="quizTypeStore.getAllQuizTypesNames"
                  id="quiz-type"
                  class="w-12"
                  placeholder="Select a quiz type"
                ></Dropdown>
              </div>
            </div>
            <div class="flex justify-content-between mt-5">
              <div class="w-full">
                <label for="quiz-max-score" class="font-bold block mb-1">Maximum Score</label>
                <InputNumber v-model="quizToAdd.maxScore" id="quiz-max-score" class="w-11"></InputNumber>
              </div>
              <div class="w-full">
                <label for="quiz-image-url" class="font-bold block mb-1">Image URL (optional)</label>
                <InputText v-model="quizToAdd.imageUrl" id="quiz-image-url" class="w-12" placeholder="Image URL"></InputText>
              </div>
            </div>
            <div class="mt-5 w-full">
              <label for="description" class="font-bold block mb-1">Description</label>
              <Textarea v-moedl="quizToAdd.description" id="description" rows="5" class="w-full"></Textarea>
            </div>
          </div>
        </div>
        <div class="flex pt-4 justify-content-end">
          <Button label="Next" icon="pi pi-arrow-right ml-2" iconPos="right" @click="nextCallback" />
        </div>
      </template>
    </StepperPanel>
    <StepperPanel header="Questions">
      <template #content="{ prevCallback, nextCallback }">
        <div class="flex flex-column h-12rem">
          <div
            class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
          >
            Content II
          </div>
        </div>
        <div class="flex pt-4 justify-content-between">
          <Button label="Back" severity="secondary" icon="pi pi-arrow-left mr-2" @click="prevCallback" />
          <Button label="Next" icon="pi pi-arrow-right ml-2" iconPos="right" @click="nextCallback" />
        </div>
      </template>
    </StepperPanel>
    <StepperPanel header="Answers">
      <template #content="{ prevCallback }">
        <div class="flex flex-column h-12rem">
          <div
            class="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"
          >
            Content III
          </div>
        </div>
        <div class="flex pt-4 justify-content-between">
          <Button label="Back" severity="secondary" icon="pi pi-arrow-left mr-2" @click="prevCallback" />
          <Button label="Finish" icon="pi pi-check-circle mr-2" />
        </div>
      </template>
    </StepperPanel>
  </Stepper>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useQuizTypeStore } from '@/stores/QuizTypeStore';

import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import Textarea from 'primevue/textarea';

const quizTypeStore = useQuizTypeStore();

const quizToAdd = reactive({
  quizType: '' as string,
  name: '' as string,
  maxScore: 0 as number,
  imageUrl: '' as string,
  description: '' as string
});

onMounted(() => {
  loadQuizTypes();
});

const loadQuizTypes = async () => {
  await quizTypeStore.fetchQuizTypes();
};
</script>
