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
    }
  ]
});

export default router;
