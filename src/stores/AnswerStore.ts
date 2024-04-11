import { defineStore } from 'pinia';

export const useAnswerStore = defineStore('AnswerStore', {
  actions: {
    addAnswer(answer: { questionId: string; message: string; isCorrect: boolean; isImage: boolean }) {
      fetch('https://localhost:44351/api/Answer/AddAnswer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answer)
      });
    }
  }
});
