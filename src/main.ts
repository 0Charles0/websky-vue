import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import store from './store' // 引入 Vuex store
import axios from 'axios'

const app = createApp(App)
// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // 在请求头中加入 token
      config.headers.token = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)
// 设置 axios 响应拦截器
axios.interceptors.response.use(
  (response) => {
    const responseData = response.data;
    if (responseData.code === 401) {
      // 处理 401 错误，例如清除 token 并跳转到登录页面
      localStorage.removeItem('token');
      router.push('/login');
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
)

app.use(router)
app.use(ElementPlus)
app.use(store)
app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}