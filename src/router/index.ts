import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import { isAuthenticated } from '@/composables/useAuth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/splash'
  },
  {
    path: '/splash',
    component: () => import('@/views/SplashPage.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/register',
    component: () => import('@/views/register/RegisterPage.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/views/HomePage.vue')
      },
      {
        path: 'earnings',
        component: () => import('@/views/EarningsPage.vue')
      },
      {
        path: 'deliveries',
        component: () => import('@/views/BookingsPage.vue')
      },
      {
        path: 'notifications',
        component: () => import('@/views/NotificationsPage.vue')
      },
      {
        path: 'profile',
        component: () => import('@/views/ProfilePage.vue')
      }
    ]
  },
  {
    path: '/bookings/:id',
    component: () => import('@/views/booking/BookingDetailPage.vue')
  },
  {
    path: '/bookings/:id/invoice',
    component: () => import('@/views/invoice/InvoicePage.vue')
  },
  {
    path: '/help',
    component: () => import('@/views/HelpPage.vue')
  },
  {
    path: '/profile/personal',
    component: () => import('@/views/profile/PersonalInfoPage.vue')
  },
  {
    path: '/profile/contact',
    component: () => import('@/views/profile/ContactInfoPage.vue')
  },
  {
    path: '/profile/address',
    component: () => import('@/views/profile/AddressPage.vue')
  },
  {
    path: '/profile/vehicle',
    component: () => import('@/views/profile/VehicleInfoPage.vue')
  },
  {
    path: '/profile/password',
    component: () => import('@/views/profile/ChangePasswordPage.vue')
  },
  {
    path: '/profile/documents',
    component: () => import('@/views/profile/DocumentsPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Pages reachable without a session; everything else requires login.
const publicPaths = ['/splash', '/login', '/register']

router.beforeEach((to) => {
  const isPublic = publicPaths.includes(to.path)
  if (!isPublic && !isAuthenticated()) return { path: '/login', replace: true }
  if (isAuthenticated() && (to.path === '/login' || to.path === '/register')) return { path: '/tabs/home', replace: true }
})

export default router
