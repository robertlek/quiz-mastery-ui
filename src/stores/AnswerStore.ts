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
    },
    async getAnswersFromQuestion(questionId: string) {
      const response = await fetch(`https://localhost:44351/api/Answer/GetAllAnswersFromQuestion/${questionId}`);
      const data = await response.json();
      return data.result;
    },
    updateAnswer(answer: { id: string; questionId: string; message: string; isCorrect: boolean; isImage: boolean }) {
      fetch(`https://localhost:44351/api/Answer/UpdateAnswer/${answer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answer)
      });
    }
  }
});
