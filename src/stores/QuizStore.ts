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
    },
    async addQuiz(quiz: { quizTypeId: string; name: string; maxScore: number; imageUrl: string; description: string }) {
      const response = await fetch('https://localhost:44351/api/Quiz/AddQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quiz)
      });
      const data = await response.json();
      return data.result.id;
    }
  },
  getters: {
    getQuizzes(): IQuiz[] {
      return this.quizzes;
    }
  }
});
