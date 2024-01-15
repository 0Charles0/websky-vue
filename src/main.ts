import { createApp } from 'vue'
import ElementPlus,{ ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import axios from 'axios'
// import { ElMessage } from 'element-plus'

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
    if(response.data.code!==200){
      ElMessage.error(response.data.code+" Error："+response.data.msg)
      if (response.data.code === 401 || response.data.code === 403) {
        // 处理 401/403 错误，清除 token 并跳转到登录页面
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
)

app.use(router)
app.use(ElementPlus)
app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}