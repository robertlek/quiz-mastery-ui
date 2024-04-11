<template>
  <section class="mb-5">
    <Fieldset class="mb-4">
      <template #legend>
        <span class="bg-cyan-400 text-white border-round">
          <span class="pi pi-question-circle"></span>
          Question
        </span>
      </template>
      <p class="mt-4">{{ questionMessage }}</p>
    </Fieldset>

    <InputGroup v-for="(answer, index) in answers" :key="index" class="mb-1">
      <Button :icon="answer.isCorrect ? `pi pi-check` : `pi pi-times`" :severity="answer.isCorrect ? `success` : `danger`" />
      <InputText :value="answer.message" disabled />
    </InputGroup>

    <div v-if="!answersLimitReached" class="flex align-items-center w-full mt-4">
      <InputText v-model="nextAnswer.message" placeholder="Answer" class="col-7"></InputText>
      <div class="flex justify-content-center col-2">
        <Checkbox v-model="nextAnswer.isCorrect" :binary="true" id="is-correct"></Checkbox>
        <label for="is-correct" class="ml-2">Is Correct Answer</label>
      </div>
      <div class="flex justify-content-center col-2">
        <Checkbox v-model="nextAnswer.isImage" :binary="true" id="is-image"></Checkbox>
        <label for="is-image" class="ml-2">Is Image</label>
      </div>
      <div class="col-1">
        <Button @click="attachAnswerToQuestion" label="Add" class="w-full bg-cyan-400 border-0"></Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';

import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Fieldset from 'primevue/fieldset';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';

defineProps({
  questionMessage: String,
  questionIndex: Number
});

const emit = defineEmits(['attachAnswers']);

const answers = reactive([] as { message: string; isCorrect: boolean; isImage: boolean }[]);
const nextAnswer = reactive({
  message: '' as string,
  isCorrect: false as boolean,
  isImage: false as boolean
});

const answersLimitReached = computed(() => {
  return answers.length >= 4;
});

const resetAnswer = () => {
  nextAnswer.message = '';
  nextAnswer.isCorrect = false;
  nextAnswer.isImage = false;
};

const attachAnswerToQuestion = () => {
  answers.push({
    message: nextAnswer.message,
    isCorrect: nextAnswer.isCorrect,
    isImage: nextAnswer.isImage
  });

  emit('attachAnswers', answers);

  resetAnswer();
};
</script>
