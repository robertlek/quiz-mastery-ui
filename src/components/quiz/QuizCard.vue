<template>
  <div class="quiz-card-wrapper">
    <div class="quiz-card m-3 flex flex-column overflow-hidden min-h-full">
      <div class="quiz-card-header h-15rem">
        <img :src="image ?? '/src/assets/images/default-quiz-header.jpg'" alt="Header Image" class="h-15rem w-full" />
      </div>
      <div class="quiz-card-body flex-grow-1 p-3">
        <h4>{{ name }}</h4>
        <p class="text-sm mt-2">
          {{ description }}
        </p>
      </div>
      <div class="quiz-card-footer flex flex-column justify-content-center align-items-center">
        <Button label="Preview" severity="secondary" outlined class="w-11" @click="previewQuiz" />
        <Button label="Start Quiz" class="w-11 mt-2 mb-2" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

const props = defineProps({
  id: String,
  name: String,
  description: String,
  image: String
});

const emit = defineEmits(['previewQuiz']);

const previewQuiz = () => {
  emit('previewQuiz', props.id);
};
</script>

<style scoped>
.quiz-card {
  border: 1px solid #d3d3d3;
  border-radius: 5px;
}
</style>
