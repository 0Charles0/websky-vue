<template>
    <el-form
        style="width:20%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border:1px solid var(--el-border-color);borderRadius:var(--el-border-radius-round);boxShadow:var(--el-box-shadow-lighter);padding:50px">
        <img src="../../assets/logo.png" style="height:50px" />
        <el-form-item label="邮箱">
            <el-input v-model="input1" />
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="input2" type="password" show-password />
        </el-form-item>
        <el-row justify="space-evenly">
            <el-col :span="4">
                <el-button type="primary" @click="login">登录</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="info" @click="register">注册</el-button>
            </el-col>
        </el-row>
    </el-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const input1 = ref('')
const input2 = ref('')
const store = useStore();
const router = useRouter();
const login = async () => {
    try {
        const loginData = {
            email: input1.value,
            password: input2.value
        }
        const result = await axios.post('http://localhost:8081/login', loginData)
        console.log(result.data)
        // 存储 token 到 localStorage
        localStorage.setItem('token', result.data.data);
        // 存储 token 到 Vuex
        store.commit('setToken', result.data.data);
        // 跳转到其他页面
        router.push('/');
    } catch (error) {
        alert("Error：请求失败")
        console.error('Error：', "请求失败")
    }
}
const register = async () => {
    try {
        const result = await axios.get('http://localhost:8081/hello')
        console.log(result.data)
    } catch (error) {
        alert("Error：请求失败")
        console.error('Error：', "请求失败")
    }
}
</script>