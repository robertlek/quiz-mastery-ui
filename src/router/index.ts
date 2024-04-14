import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      alias: '/home',
      component: HomeView
    },
    {
      path: '/quiz-types',
      name: 'quiz types',
      component: () => import('@/views/QuizType/QuizTypesView.vue')
    },
    {
      path: '/manage-quizzes',
      name: 'Manage Quizzes',
      component: () => import('@/views/Quiz/ManageQuizzes.vue')
    },
    {
      path: '/add-quiz',
      name: 'Add Quiz',
      component: () => import('@/views/Quiz/AddQuizView.vue')
    },
    {
      path: '/update-quiz/:id',
      name: 'Update Quiz',
      component: () => import('@/views/Quiz/UpdateQuizView.vue')
    },
    {
      path: '/quiz/:id',
      name: 'Play Quiz',
      component: () => import('@/views/Quiz/PlayQuiz.vue')
    }
  ]
});

export default router;
