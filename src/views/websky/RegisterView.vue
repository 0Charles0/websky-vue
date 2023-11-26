<template>
    注册成功/失败
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

// 在组件被挂载后发送请求
onMounted(async () => {
    try {
        const captcha = useRoute().params.captcha.split(":")
        const captchaData = {
            email: captcha[0],
            code: captcha[1]
        }
        const response = await axios.patch('http://localhost:8081/register/status', captchaData)
        console.log('请求成功：', response.data)
        // 处理请求成功的逻辑
    } catch (error) {
        console.error('请求失败：', error)
        // 处理请求失败的逻辑
    }
})
</script>