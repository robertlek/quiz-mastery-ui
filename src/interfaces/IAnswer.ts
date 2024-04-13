export default interface IAnswer {
  id: string;
  questionId: string;
  message: string;
  isCorrect: boolean;
  isImage: boolean;
}
