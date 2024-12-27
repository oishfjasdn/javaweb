import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/HomeView.vue')
        },
        {
          path: 'category/:id',
          name: 'category',
          component: () => import('../views/CategoryView.vue')
        },
        {
          path: 'product/:id',
          name: 'product',
          component: () => import('../views/ProductView.vue')
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('../views/CartView.vue')
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: () => import('../views/CheckoutView.vue')
        }
      ]
    }
  ]
})

export default router 