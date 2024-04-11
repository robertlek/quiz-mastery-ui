import { defineStore } from 'pinia';

export const useQuestionStore = defineStore('QuestionStore', {
  actions: {
    async addQuestion(question: { quizId: string; message: string; score: number }) {
      const response = await fetch('https://localhost:44351/api/Question/AddQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(question)
      });
      const data = await response.json();
      return data.result.id;
    }
  }
});
