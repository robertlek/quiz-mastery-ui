import type IAnswer from './IAnswer';

export default interface IQuestion {
  id: string;
  quizId: string;
  message: string;
  score: number;
  answers: IAnswer[];
}
