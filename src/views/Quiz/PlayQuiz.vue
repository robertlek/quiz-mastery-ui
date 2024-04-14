<template>
  <main>
    <Card class="overflow-hidden shadow-2 mb-5">
      <template #title>
        {{ state.quiz.name }}
        <Divider class="mt-2 mb-2" />
      </template>
      <template #content>
        <div class="flex justify-content-between">
          <div class="flex flex-column gap-1">
            <div><Tag severity="secondary" :value="state.questionsLeft.toString()"></Tag> questions left</div>
            <div><Tag severity="success" :value="state.correctAnswers.toString()"></Tag> correct answers</div>
            <div><Tag severity="danger" :value="state.wrongAnswers.toString()"></Tag> wrong answers</div>
          </div>
          <Knob
            v-if="!state.isQuizFinished"
            v-model="state.totalScore"
            disabled
            :min="0"
            :max="state.quiz.maxScore"
            :valueTemplate="Math.min((state.totalScore / state.quiz.maxScore) * 100, 100).toFixed(0) + '%'"
            valueColor="var(--cyan-400)"
          />
        </div>
      </template>
    </Card>
    <Stepper linear v-if="!state.isQuizFinished">
      <StepperPanel v-for="question in state.questions" :key="question.id">
        <template #content="{ nextCallback }">
          <div class="flex flex-column">
            <div class="border-2 border-dashed surface-border border-round surface-ground font-medium">
              <Card class="m-3">
                <template #content>{{ question.message }}</template>
              </Card>

              <div class="flex flex-column gap-3 m-3 mt-5">
                <div v-for="answer in question.answers" :key="answer.id" class="flex align-items-center text-lg">
                  <RadioButton
                    v-model="state.selectedAnswer"
                    :inputId="answer.id"
                    name="dynamic"
                    :value="answer"
                    :disabled="state.questionAnswered"
                  />
                  <label
                    :for="answer.id"
                    class="ml-2"
                    :class="{
                      'text-green-400': state.questionAnswered && answer.isCorrect,
                      'text-red-400': state.questionAnswered && !answer.isCorrect
                    }"
                    >{{ answer.message }}</label
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="flex pt-4 justify-content-end">
            <Button
              label="Submit"
              icon="pi pi-check ml-2"
              :disabled="state.questionAnswered || !state.selectedAnswer.id"
              iconPos="right"
              class="mr-2"
              @click="submitAnswer(question)"
            />
            <Button
              :label="state.questionsLeft > 0 ? 'Next' : 'Finish'"
              icon="pi pi-arrow-right ml-2"
              :disabled="!state.questionAnswered"
              iconPos="right"
              @click="moveToNextQuestion(nextCallback)"
            />
          </div>
        </template>
      </StepperPanel>
    </Stepper>
    <Card v-else class="shadow-2">
      <template #title>
        <div class="flex flex-column align-items-center">
          <div class="mb-4">
            You have finished <span class="text-green-400">{{ state.quiz.name }}</span> and scored
            <span class="text-green-400">{{ state.totalScore }}/{{ state.quiz.maxScore }}</span> points.
          </div>
          <div class="flex">
            <img src="/src/assets/images/quiz-finished-icon.svg" height="350" class="mr-7" />
            <Knob
              v-model="state.totalScore"
              disabled
              :min="0"
              :max="state.quiz.maxScore"
              :valueTemplate="Math.min((state.totalScore / state.quiz.maxScore) * 100, 100).toFixed(0) + '%'"
              :size="300"
            />
          </div>
        </div>
      </template>
    </Card>
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
import type IAnswer from '@/interfaces/IAnswer';

import Button from 'primevue/button';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Knob from 'primevue/knob';
import RadioButton from 'primevue/radiobutton';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import Tag from 'primevue/tag';

const route = useRoute();
const quizStore = useQuizStore();
const questionStore = useQuestionStore();
const answerStore = useAnswerStore();

const state = reactive({
  quiz: {} as IQuiz,
  questions: [] as IQuestionWithAnswers[],
  selectedAnswer: {} as IAnswer,
  questionAnswered: false as boolean,
  questionsLeft: 0 as number,
  correctAnswers: 0 as number,
  wrongAnswers: 0 as number,
  totalScore: 0 as number,
  isQuizFinished: false as boolean
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

    state.questionsLeft++;
  });
});

const submitAnswer = (question: IQuestion) => {
  const isAnswerCorrect = state.selectedAnswer.isCorrect;

  if (isAnswerCorrect) {
    state.correctAnswers++;
  } else {
    state.wrongAnswers++;
  }

  state.questionsLeft--;
  state.questionAnswered = true;
  state.totalScore += isAnswerCorrect ? question.score : 0;

  resetSelectedAnswer();
};

const moveToNextQuestion = (callback: Function) => {
  if (state.questionsLeft > 0) {
    state.questionAnswered = false;
    callback();
  } else {
    state.isQuizFinished = true;
  }
};

const resetSelectedAnswer = () => {
  state.selectedAnswer.id = '';
};
</script>
