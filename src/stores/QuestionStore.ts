import { defineStore } from 'pinia';
import { useAnswerStore } from './AnswerStore';

const answerStore = useAnswerStore();

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
    },
    async getQuestionsFromQuiz(quizId: string) {
      const response = await fetch(`https://localhost:44351/api/Question/GetAllQuestionsFromQuiz/${quizId}`);
      const data = await response.json();
      return data.result;
    },
    async removeQuestionsFromQuiz(quizId: string) {
      const questions: { id: string; quizId: string; message: string; score: number }[] = await this.getQuestionsFromQuiz(quizId);

      questions.forEach(async (question) => {
        await answerStore.removeAnswersFromQuestion(question.id);
        fetch(`https://localhost:44351/api/Question/RemoveQuestion/${question.id}`, {
          method: 'DELETE'
        });
      });
    }
  }
});
