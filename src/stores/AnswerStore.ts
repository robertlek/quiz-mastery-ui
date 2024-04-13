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
    async removeAnswersFromQuestion(questionId: string) {
      const answers: { id: string; questionId: string; message: string; isCorrect: boolean; isImage: boolean }[] =
        await this.getAnswersFromQuestion(questionId);

      answers.forEach((answer) => {
        fetch(`https://localhost:44351/api/Answer/RemoveAnswer/${answer.id}`, {
          method: 'DELETE'
        });
      });
    }
  }
});
