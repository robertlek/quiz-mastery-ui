import { defineStore } from 'pinia';
import type IQuizType from '@/interfaces/IQuizType';

export const useQuizTypeStore = defineStore('QuizType', () => {
  async function fetchQuizTypes() {
    const response = await fetch('https://localhost:44351/api/QuizType/GetAllQuizTypes');
    const data = await response.json();

    return data.result;
  }

  async function addQuizType(quizType: { name: string }) {
    const response = await fetch('https://localhost:44351/api/QuizType/AddQuizType', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quizType)
    });

    const data = await response.json();
    return data.isSuccess;
  }

  function getQuizTypeName(quizTypes: IQuizType[], id: string) {
    return quizTypes.find((x) => x.id === id)?.name;
  }

  return { fetchQuizTypes, addQuizType, getQuizTypeName };
});
