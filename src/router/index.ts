import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import MainView from '../views/websky/MainView.vue'
import LoginView from '../views/websky/LoginView.vue'
import RegisterView from '../views/websky/RegisterView.vue'
import ShareView from '../views/websky/ShareView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Main',
    component: MainView,
    meta: {
      requiresAuth: true, // 添加 requiresAuth 标记，表示需要登录权限
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register/:captcha',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/share/:shareFileId',
    name: 'share',
    component: ShareView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
// 添加路由导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  // 如果访问的页面需要登录权限，并且当前没有token，则重定向到登录页面
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
})

export default router