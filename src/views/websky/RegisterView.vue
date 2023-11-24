<template>
    注册成功/失败
</template>

<script setup>
import { useRoute } from 'vue-router'
const captcha = useRoute().params.captcha
console.log('验证码:', captcha)
</script>