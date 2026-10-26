import { createRouter, createWebHistory } from 'vue-router'
import SlideView from '../views/SlideView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/slide/1'
    },
    {
      path: '/quiz',
      redirect: '/quiz/1'
    },
    {
      path: '/quiz/:id',
      name: 'quiz',
      component: () => import('../views/QuizView.vue'),
      props: (route) => ({
        questionId: parseInt(route.params.id as string, 10) || 1
      })
    },
    {
      path: '/slide/:id',
      name: 'slide',
      component: SlideView,
      props: (route) => ({
        slideId: parseInt(route.params.id as string, 10) || 1
      })
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/slide/1'
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
