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
              <Textarea v-model="quizToAdd.description" id="description" rows="5" class="w-full"></Textarea>
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
        <div class="flex flex-column">
          <div class="border-2 border-dashed surface-border border-round surface-ground font-medium p-5">
            <div class="grid w-full flex align-items-end mb-5">
              <div class="col-9">
                <label for="question-message" class="font-bold block mb-1">Question</label>
                <InputText v-model="nextQuestion.message" id="question-message" placeholder="Question" class="w-full"></InputText>
              </div>
              <div class="col-2">
                <label for="question-score" class="font-bold block mb-1">Score (Max Score = {{ quizToAdd.maxScore }})</label>
                <InputNumber v-model="nextQuestion.score" id="question-score" class="w-full"></InputNumber>
              </div>
              <div class="col-1">
                <Button label="Add" class="w-full bg-cyan-400 border-0" @click="addQuestionInTheQueue"></Button>
              </div>
            </div>

            <Fieldset v-for="(question, index) in questions" :key="index" :legend="question.score + ' points'" class="mb-3">
              <template #legend> </template>
              <p>{{ question.message }}</p>
            </Fieldset>
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
        <div class="flex flex-column">
          <div class="border-2 border-dashed surface-border border-round surface-ground font-medium p-5">
            <AddAnswer
              v-for="(question, index) in questions"
              :key="index"
              :question-message="question.message"
              @attach-answers="(answers) => (question.answers = answers)"
            ></AddAnswer>
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
import AddAnswer from '@/components/quiz/AddAnswer.vue';

import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Fieldset from 'primevue/fieldset';
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

const questions = reactive([] as { message: string; score: number; answers: [] }[]);
const nextQuestion = reactive({
  message: '' as string,
  score: 0 as number,
  answers: []
});

onMounted(() => {
  loadQuizTypes();
});

const loadQuizTypes = async () => {
  await quizTypeStore.fetchQuizTypes();
};

const addQuestionInTheQueue = () => {
  questions.push({
    message: nextQuestion.message,
    score: nextQuestion.score,
    answers: []
  });

  nextQuestion.message = '';
  nextQuestion.score = 0;
  nextQuestion.answers = [];
};
</script>
