<template>
  <main>
    <Stepper linear>
      <StepperPanel v-for="question in state.questions" :key="question.id">
        <template #content="{ nextCallback }">
          <div class="flex flex-column">
            <div class="border-2 border-dashed surface-border border-round surface-ground font-medium">
              <Card class="m-3">
                <template #content>{{ question.message }}</template>
              </Card>

              <div class="flex flex-column gap-3 m-3 mt-5">
                <div v-for="answer in question.answers" :key="answer.id" class="flex align-items-center text-lg">
                  <RadioButton :inputId="answer.id" name="dynamic" :value="answer.message" />
                  <label :for="answer.id" class="ml-2">{{ answer.message }}</label>
                </div>
              </div>
            </div>
          </div>
          <div class="flex pt-4 justify-content-end">
            <Button label="Next" icon="pi pi-arrow-right ml-2" iconPos="right" @click="nextCallback" />
          </div>
        </template>
      </StepperPanel>
    </Stepper>
  </main>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useQuizStore } from '@/stores/QuizStore';
import { useQuestionStore } from '@/stores/QuestionStore';
import { useAnswerStore } from '@/stores/AnswerStore';
import type IQuiz from '@/interfaces/IQuiz';
import type IQuestion from '@/interfaces/IQuestion';
import type IQuestionWithAnswers from '@/interfaces/IQuestionWithAnswers';

import Button from 'primevue/button';
import Card from 'primevue/card';
import RadioButton from 'primevue/radiobutton';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';

const route = useRoute();
const quizStore = useQuizStore();
const questionStore = useQuestionStore();
const answerStore = useAnswerStore();

const state = reactive({
  quiz: {} as IQuiz,
  questions: [] as IQuestionWithAnswers[]
});

onMounted(async () => {
  state.quiz = await quizStore.fetchQuiz(route.params.id.toString());

  const questions = await questionStore.getQuestionsFromQuiz(state.quiz.id);

  questions.forEach(async (question: IQuestion) => {
    state.questions.push({
      id: question.id,
      quizId: question.quizId,
      message: question.message,
      score: question.score,
      answers: await answerStore.getAnswersFromQuestion(question.id)
    });
  });
});
</script>
