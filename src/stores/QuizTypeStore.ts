import { defineStore } from 'pinia';
import type IQuizType from '@/interfaces/IQuizType';

export const useQuizTypeStore = defineStore('QuizTypeStore', {
  state: () => {
    return {
      quizTypes: [] as IQuizType[]
    };
  },
  actions: {
    async fetchQuizTypes() {
      const response = await fetch('https://localhost:44351/api/QuizType/GetAllQuizTypes');
      const data = await response.json();
      this.quizTypes = data.result;
    },
    async addQuizType(quizType: { name: string }) {
      const response = await fetch('https://localhost:44351/api/QuizType/AddQuizType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizType)
      });

      const data = await response.json();
      return data.isSuccess;
    },
    getQuizTypeName(id: string) {
      return this.quizTypes.find((x) => x.id === id)?.name;
    }
  },
  getters: {
    getQuizTypes(): IQuizType[] {
      return this.quizTypes;
    }
  }
});
