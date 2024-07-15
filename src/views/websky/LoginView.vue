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
                <el-button type="primary" @click="login" :loading="loading1" style="width:100%">
                    <p v-if="!loading1">登录</p>
                </el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="info" @click="register" :loading="loading2" style="width:100%">
                    <p v-if="!loading2">注册</p>
                </el-button>
            </el-col>
        </el-row>
    </el-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const input1 = ref('')
const input2 = ref('')
const router = useRouter()
const loading1 = ref(false)  // 添加 loading 变量
const loading2 = ref(false)
const login = async () => {
    try {
        // 在登录开始时设置 loading 为 true
        loading1.value = true

        const loginData = {
            email: input1.value,
            password: input2.value
        }
        const result = await axios.post('http://localhost:8081/user/login', loginData)
        if (result.data.code === 200) {
            // 存储 token 到 localStorage
            localStorage.setItem('token', result.data.data);
            // 跳转到其他页面
            router.push('/')
        }
    } catch (error) {
        ElMessage.error("408 Error：请求超时")
    } finally {
        // 无论操作成功还是失败，最终将 loading 设置为 false
        loading1.value = false
    }
}
const register = async () => {
    try {
        loading2.value = true
        const registerData = {
            email: input1.value,
            password: input2.value
        }
        const result = await axios.post('http://localhost:8081/user/register', registerData)
        if (result.data.code === 200) {
            ElMessage.success(result.data.data)
        }
    } catch (error) {
        ElMessage.error("408 Error：请求超时")
    } finally {
        loading2.value = false;
    }
}
</script>