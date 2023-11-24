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
                <el-button type="primary">登录</el-button>
            </el-col>
            <el-col :span="4">
                <el-button type="info">注册</el-button>
            </el-col>
        </el-row>
    </el-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const input1 = ref('')
const input2 = ref('')
</script>