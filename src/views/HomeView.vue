<template>
  <main>
    <section class="flex justify-content-between">
      <InputGroup class="w-10">
        <InputText placeholder="Search Quiz" />
        <Button icon="pi pi-search" class="bg-cyan-400 border-none" />
      </InputGroup>

      <Button class="bg-cyan-400 border-none">
        <i class="pi pi-refresh mr-2"></i>
        <span>Refresh</span>
      </Button>
    </section>

    <section class="mt-3">
      <Badge v-for="quizType in quizTypeStore.getQuizTypes" :key="quizType.id" severity="secondary" class="cursor-pointer mr-2">
        {{ quizType.name }}
      </Badge>
    </section>

    <section class="grid grid-nogutter mt-4">
      <QuizCard
        v-for="quiz in quizzes"
        :key="quiz.id"
        :id="quiz.id"
        :name="quiz.name"
        :description="quiz.description"
        :image="quiz.image"
        class="col-12 sm:col-12 md:col-6 lg:col-4 xl:col-3 mb-5"
        @preview-quiz="(id) => previewQuiz(id)"
      />
    </section>

    <Dialog v-model:visible="previewQuizVisible" modal :dismissableMask="true">
      <template #header>
        <div class="inline-flex align-items-center justify-content-center gap-2">
          <span class="font-bold white-space-nowrap">{{ quizToPreview.object.Quiz }}</span>
        </div>
      </template>

      <div v-for="(question, index) in quizToPreview.object.Components" :key="index" class="mb-4">
        <Message severity="success" :closable="false" icon="pi pi-question-circle" class="mb-3">{{ question.Question }}</Message>

        <div v-for="(answer, index) in question.Components" :key="index" class="mb-1">
          <Message severity="secondary" icon="pi pi-pen-to-square" :closable="false">{{ answer.Answer }}</Message>
        </div>
      </div>

      <template #footer>
        <Button label="Close" outlined severity="secondary" class="w-full" style="min-width: 25rem" @click="previewQuizVisible = false" />
      </template>
    </Dialog>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { useQuizStore } from '@/stores/QuizStore';
import { useQuizTypeStore } from '@/stores/QuizTypeStore';
import QuizCard from '@/components/quiz/QuizCard.vue';

import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';

const quizStore = useQuizStore();
const quizTypeStore = useQuizTypeStore();
const quizzesAreLoading = ref(true);
const previewQuizVisible = ref(false);
const quizToPreview = reactive({
  object: {} as {
    Quiz: String;
    Components: {
      Question: String;
      Components: {
        Answer: String;
      }[];
    }[];
  }
});

const quizzes = computed(() => {
  return quizStore.getQuizzes.map((quiz) => {
    return {
      id: quiz.id,
      quizType: quizTypeStore.getQuizTypeName(quiz.quizTypeId),
      name: quiz.name,
      description: quiz.description,
      image: quiz.imageUrl,
      maxScore: quiz.maxScore,
      createdDate: new Date(quiz.createdDate).toDateString()
    };
  });
});

onMounted(() => {
  loadQuizzes();
});

const loadQuizzes = async () => {
  quizzesAreLoading.value = true;
  await quizTypeStore.fetchQuizTypes();
  await quizStore.fetchQuizzes();
  quizzesAreLoading.value = false;
};

const previewQuiz = async (id: string) => {
  quizToPreview.object = await quizStore.getQuizComponentsTree(id);
  previewQuizVisible.value = true;
};
</script>
