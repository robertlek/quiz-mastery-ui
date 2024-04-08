import { defineStore } from 'pinia';
import type IQuiz from '@/interfaces/IQuiz';

export const useQuizStore = defineStore('QuizStore', {
  state: () => {
    return {
      quizzes: [] as IQuiz[]
    };
  },
  actions: {
    async fetchQuizzes() {
      const response = await fetch('https://localhost:44351/api/Quiz/GetAllQuizzes');
      const data = await response.json();
      this.quizzes = data.result;
    }
  },
  getters: {
    getQuizzes(): IQuiz[] {
      return this.quizzes;
    }
  }
});
