<template>
  <main>
    <section v-if="isQuizValid">
      <Stepper linear>
        <StepperPanel header="Quiz Details">
          <template #content="{ nextCallback }">
            <div class="flex flex-column">
              <div class="border-2 border-dashed surface-border border-round surface-ground font-medium p-5">
                <div class="flex justify-content-between">
                  <div class="w-full">
                    <label for="quiz-name" class="font-bold block mb-1">Quiz Name</label>
                    <InputText v-model="quizToUpdate.name" id="quiz-name" placeholder="Quiz Name" class="w-11"></InputText>
                  </div>
                  <div class="w-full">
                    <label for="quiz-type" class="font-bold block mb-1">Quiz Type</label>
                    <Dropdown
                      v-model="quizToUpdate.quizType"
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
                    <InputNumber v-model="quizToUpdate.maxScore" id="quiz-max-score" class="w-11"></InputNumber>
                  </div>
                  <div class="w-full">
                    <label for="quiz-image-url" class="font-bold block mb-1">Image URL (optional)</label>
                    <InputText v-model="quizToUpdate.imageUrl" id="quiz-image-url" class="w-12" placeholder="Image URL"></InputText>
                  </div>
                </div>
                <div class="mt-5 w-full">
                  <label for="description" class="font-bold block mb-1">Description</label>
                  <Textarea v-model="quizToUpdate.description" id="description" rows="5" class="w-full"></Textarea>
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
                    <label for="question-score" class="font-bold block mb-1">Score (Max Score = {{ quizToUpdate.maxScore }})</label>
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
                  :question-answers="question.answers"
                  @attach-answers="(answers) => (question.answers = answers)"
                ></AddAnswer>
              </div>
            </div>
            <div class="flex pt-4 justify-content-between">
              <Button label="Back" severity="secondary" icon="pi pi-arrow-left mr-2" @click="prevCallback" />
              <Button label="Update" icon="pi pi-check-circle mr-2" @click="confirmQuiz" />
              <ConfirmDialog />
            </div>
          </template>
        </StepperPanel>
      </Stepper>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { useQuizStore } from '@/stores/QuizStore';
import { useQuizTypeStore } from '@/stores/QuizTypeStore';
import { useQuestionStore } from '@/stores/QuestionStore';
import { useAnswerStore } from '@/stores/AnswerStore';
import { useConfirm } from 'primevue/useconfirm';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

import AddAnswer from '@/components/quiz/AddAnswer.vue';

import Button from 'primevue/button';
import ConfirmDialog from 'primevue/confirmdialog';
import Dropdown from 'primevue/dropdown';
import Fieldset from 'primevue/fieldset';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import Textarea from 'primevue/textarea';
import type IQuestion from '@/interfaces/IQuestion';

const router = useRouter();
const route = useRoute();
const quizStore = useQuizStore();
const quizTypeStore = useQuizTypeStore();
const questionStore = useQuestionStore();
const answerStore = useAnswerStore();
const confirm = useConfirm();
const isQuizValid = ref(false);
const targetQuiz = ref();

const quizToUpdate = reactive({
  quizType: '' as string,
  name: '' as string,
  maxScore: 0 as number,
  imageUrl: '' as string,
  description: '' as string
});

const questions = reactive(
  [] as { id?: string; message: string; score: number; answers: { id?: string; message: string; isCorrect: boolean; isImage: boolean }[] }[]
);
const nextQuestion = reactive({
  message: '' as string,
  score: 0 as number,
  answers: [] as { id?: string; message: string; isCorrect: boolean; isImage: boolean }[]
});

onMounted(async () => {
  const quiz = await quizStore.fetchQuiz(route.params.id.toString());
  await loadQuizTypes();

  if (quiz !== null || quiz !== undefined) {
    isQuizValid.value = true;
    targetQuiz.value = quiz.id;

    quizToUpdate.name = quiz.name;
    quizToUpdate.maxScore = quiz.maxScore;
    quizToUpdate.imageUrl = quiz.imageUrl;
    quizToUpdate.description = quiz.description;
    quizToUpdate.quizType = quizTypeStore.getQuizTypeName(quiz.quizTypeId);
  }

  loadQuestionsWithAnswers();
});

const loadQuizTypes = async () => {
  await quizTypeStore.fetchQuizTypes();
};

const loadQuestionsWithAnswers = async () => {
  const questionsFromFetch = await questionStore.getQuestionsFromQuiz(targetQuiz.value);

  questionsFromFetch.forEach(async (question: IQuestion) => {
    const answersFromFetch = await answerStore.getAnswersFromQuestion(question.id);

    questions.push({
      id: question.id,
      message: question.message,
      score: question.score,
      answers: answersFromFetch
    });
  });
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

const confirmQuiz = () => {
  confirm.require({
    message: 'Are you sure you want to update this quiz?',
    header: 'Update Quiz',
    icon: 'pi pi-exclamation-circle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Cancel',
    acceptLabel: 'Update',
    accept: () => {
      submitQuiz();
    }
  });
};

const submitQuiz = async () => {
  quizStore.updateQuiz({
    id: targetQuiz.value,
    quizTypeId: quizTypeStore.getQuizTypeIdByName(quizToUpdate.quizType),
    name: quizToUpdate.name,
    maxScore: quizToUpdate.maxScore,
    imageUrl: quizToUpdate.imageUrl,
    description: quizToUpdate.description
  });

  questions.forEach(async (question) => {
    let questionId;

    if (question.id === undefined) {
      questionId = await questionStore.addQuestion({
        quizId: targetQuiz.value,
        message: question.message,
        score: question.score
      });
    } else {
      questionStore.updateQuestion({
        id: question.id,
        quizId: targetQuiz.value,
        message: question.message,
        score: question.score
      });

      questionId = question.id;
    }

    await answerStore.removeAnswersFromQuestion(questionId);

    question.answers.forEach((answer) => {
      answerStore.addAnswer({
        questionId,
        message: answer.message,
        isCorrect: answer.isCorrect,
        isImage: answer.isImage
      });
    });
  });

  router.push('/manage-quizzes');
};
</script>
