<template>
    <div />
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '/src/router'

// 在组件被挂载后发送请求
onMounted(async () => {
    try {
        const captcha = useRoute().params.captcha.split(":")
        const captchaData = {
            email: captcha[0],
            code: captcha[1]
        }
        const response = await axios.patch('http://localhost:8081/user/register/verify', captchaData)
        if (response.data.code === 200) {
            ElMessage.success("注册成功")
            router.push('/');
        }
        // 处理请求成功的逻辑
    } catch (error) {
        ElMessage.error("408 Error：请求超时")
        // 处理请求失败的逻辑
    }
})
</script>