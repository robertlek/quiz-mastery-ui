import { defineStore } from 'pinia';
import type IQuiz from '@/interfaces/IQuiz';
import { OperationCanceledException } from 'typescript';

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
    async fetchQuiz(id: string) {
      const response = await fetch(`https://localhost:44351/api/Quiz/GetQuiz/${id}`);
      const data = await response.json();
      return data.result;
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
    },
    updateQuiz(quiz: { id: string; quizTypeId: string; name: string; maxScore: number; imageUrl: string; description: string }) {
      fetch(`https://localhost:44351/api/Quiz/UpdateQuiz/${quiz.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quiz)
      });
    },
    getQuizById(id: string) {
      const quiz = this.quizzes.find((x) => x.id === id);

      if (quiz === undefined) {
        throw new OperationCanceledException();
      }

      return quiz;
    },
    async getQuizComponentsTree(id: string) {
      const response = await fetch(`https://localhost:44351/api/Quiz/GetQuizComponentsTree/${id}`);
      return (await response.json()).result;
    },
    async deleteQuiz(id: string) {
      await fetch(`https://localhost:44351/api/Quiz/RemoveQuiz/${id}`, {
        method: 'DELETE'
      });
    }
  },
  getters: {
    getQuizzes(): IQuiz[] {
      return this.quizzes;
    }
  }
});
