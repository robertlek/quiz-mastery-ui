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
                <Button :label="!questionEditing ? 'Add' : 'Edit'" class="w-full bg-cyan-400 border-0" @click="addQuestionInTheQueue"></Button>
              </div>
            </div>

            <Fieldset v-for="(question, index) in questions" :key="index" :legend="question.score + ' points'" class="mb-3">
              <template #legend> </template>
              <div class="flex justify-content-between">
                <p>{{ question.message }}</p>
                <Button severity="secondary" outlined @click="editQuestion(index)">
                  <i class="pi pi-pencil mr-2"></i>
                  <span>Edit</span>
                </Button>
              </div>
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
          <Button label="Finish" icon="pi pi-check-circle mr-2" @click="confirmQuiz" />
          <ConfirmDialog />
        </div>
      </template>
    </StepperPanel>
  </Stepper>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useQuizTypeStore } from '@/stores/QuizTypeStore';
import { useQuizStore } from '@/stores/QuizStore';
import { useQuestionStore } from '@/stores/QuestionStore';
import { useAnswerStore } from '@/stores/AnswerStore';
import { useConfirm } from 'primevue/useconfirm';
import { useRouter } from 'vue-router';

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

const quizTypeStore = useQuizTypeStore();
const quizStore = useQuizStore();
const questionStore = useQuestionStore();
const answerStore = useAnswerStore();
const confirm = useConfirm();
const router = useRouter();

const quizToAdd = reactive({
  quizType: '' as string,
  name: '' as string,
  maxScore: 0 as number,
  imageUrl: '' as string,
  description: '' as string
});

const questions = reactive([] as { message: string; score: number; answers: { message: string; isCorrect: boolean; isImage: boolean }[] }[]);
const nextQuestion = reactive({
  message: '' as string,
  score: 0 as number,
  answers: [] as { message: string; isCorrect: boolean; isImage: boolean }[]
});
const questionEditing = ref(false);
const questionBeingEdited = ref();

onMounted(() => {
  loadQuizTypes();
});

const loadQuizTypes = async () => {
  await quizTypeStore.fetchQuizTypes();
};

const addQuestionInTheQueue = () => {
  if (!questionEditing.value) {
    questions.push({
      message: nextQuestion.message,
      score: nextQuestion.score,
      answers: []
    });
  } else {
    questions[questionBeingEdited.value].message = nextQuestion.message;
    questions[questionBeingEdited.value].score = nextQuestion.score;

    questionEditing.value = false;
    questionBeingEdited.value = undefined;
  }

  nextQuestion.message = '';
  nextQuestion.score = 0;
  nextQuestion.answers = [];
};

const confirmQuiz = () => {
  confirm.require({
    message: 'Are you sure you want to create this quiz?',
    header: 'Submit Quiz',
    icon: 'pi pi-exclamation-circle',
    rejectClass: 'p-button-secondary p-button-outlined',
    rejectLabel: 'Cancel',
    acceptLabel: 'Create',
    accept: () => {
      submitQuiz();
    }
  });
};

const submitQuiz = async () => {
  const quizId = await quizStore.addQuiz({
    quizTypeId: quizTypeStore.getQuizTypeIdByName(quizToAdd.quizType),
    name: quizToAdd.name,
    maxScore: quizToAdd.maxScore,
    imageUrl: quizToAdd.imageUrl,
    description: quizToAdd.description
  });

  questions.forEach(async (question) => {
    const questionId = await questionStore.addQuestion({
      quizId,
      message: question.message,
      score: question.score
    });

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

const editQuestion = (index: number) => {
  questionEditing.value = true;
  questionBeingEdited.value = index;

  const question = questions[index];

  nextQuestion.message = question.message;
  nextQuestion.score = question.score;
};
</script>
