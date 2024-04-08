export default interface IQuiz {
  id: string;
  quizTypeId: string;
  name: string;
  description: string;
  maxScore: number;
  imageUrl: string;
  isActive: boolean;
  createdDate: Date;
}
