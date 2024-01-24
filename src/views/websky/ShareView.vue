<template>
    <el-container>
        <el-header style="padding-left:30px">
            <el-button style="border:none;width:106px;height:50px;float:left"
                :style="{ filter: isHovered ? 'brightness(1.1)' : '' }" @mouseover="isHovered = true"
                @mouseout="isHovered = false" @click="refreshPage">
                <img src="../../assets/logo.png" style="width:106px;height:50px;float:left" />
            </el-button>
            <el-dropdown @command="handleCommand" trigger="hover" style="float:right;margin-top:1%">
                <el-avatar :size="size" :src="userInfo.image + '?' + Date.now()" />
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="logout" @click="logout">登出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </el-header>
    </el-container>
    <el-container>
        <el-main>
            <el-text size="large" style="float:left;margin-left:3%;font-size:175%">{{ title }}</el-text>
            <el-button type="primary" round @click="batchDownload" style="float:left;margin-left:3%">
                <el-icon>
                    <Download />
                </el-icon>下载选中文件
            </el-button>
            <el-table ref="multipleTableRef" :data="tableData" :default-sort="{ prop: 'fileName', order: 'descending' }"
                style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="fileName" label="文件名" sortable width="750">
                    <template #default="scope">
                        <el-button v-if="scope.row.fileName.slice(-1) === '/'" text @click="queryFiles2(scope.row.fileName)"
                            :icon="Folder" style="padding-left:0px">{{
                                scope.row.fileName.slice(0, -1).slice(scope.row.fileName.slice(0, -1).lastIndexOf('/') + 1)
                            }}</el-button>
                        <el-link v-else-if="scope.row.category === '图片'" :href="scope.row.url"
                            :icon="Picture">&nbsp;&nbsp;{{ scope.row.fileName.slice(scope.row.fileName.lastIndexOf('/') + 1)
                            }}</el-link>
                        <el-link v-else-if="scope.row.category === '文档'" :href="scope.row.url"
                            :icon="Document">&nbsp;&nbsp;{{ scope.row.fileName.slice(scope.row.fileName.lastIndexOf('/') +
                                1)
                            }}</el-link>
                        <el-link v-else-if="scope.row.category === '视频'" :href="scope.row.url"
                            :icon="VideoPlay">&nbsp;&nbsp;{{ scope.row.fileName.slice(scope.row.fileName.lastIndexOf('/') +
                                1)
                            }}</el-link>
                        <el-link v-else-if="scope.row.category === '音频'" :href="scope.row.url"
                            :icon="Headset">&nbsp;&nbsp;{{ scope.row.fileName.slice(scope.row.fileName.lastIndexOf('/') + 1)
                            }}</el-link>
                        <el-link v-else-if="scope.row.category === '其它'" :href="scope.row.url"
                            :icon="Tickets">&nbsp;&nbsp;{{ scope.row.fileName.slice(scope.row.fileName.lastIndexOf('/') + 1)
                            }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="修改时间" sortable width="500" />
                <el-table-column prop="size" label="大小" :formatter="formatter" show-overflow-tooltip sortable />
            </el-table>
        </el-main>
    </el-container>
</template>

<script lang="ts" setup>
import { Picture, Document, VideoPlay, Headset, Folder, Tickets } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { ElTable } from 'element-plus'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

interface File {
    fileName: string
    url: string
    updateTime: string
    size: string
    category: string
}
interface User {
    userName: string
    email: string
    image: string
}

const router = useRouter()
const size = ''; // 头像大小，根据你的需求调整
const isHovered = ref(false);
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<File[]>([])
const tableData = ref([])
const selectedFileName = ref<string[]>([])
const title = ref('')
const userInfo = ref<User>({
    userName: '',
    email: '',
    image: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

onMounted(() => {
    // 取得路径后的 shareFileId 值
    const shareFileIdParam = useRoute().params.shareFileId;
    const shareFileIdArray = Array.isArray(shareFileIdParam) ? shareFileIdParam : [shareFileIdParam]    // 使用类型断言来明确告诉 TypeScript 变量的类型
    const shareFileId = shareFileIdArray[0].split(":")[0] // 然后再调用 split 方法
    console.log(shareFileId)
    queryFiles(shareFileId)
    queryUser()
})

const logout = () => {
    // 清除 token 并跳转到登录页面
    localStorage.removeItem('token');
    router.push('/login');
}
const handleCommand = (command: string) => {
    // 处理菜单项的点击事件
    if (command === 'profile') {
        // 执行个人信息操作
    } else if (command === 'settings') {
        // 执行设置操作
    } else if (command === 'logout') {
        // 执行退出操作
    }
}
const refreshPage = () => {
    window.location.reload()
}
const handleSelectionChange = (val: File[]) => {
    multipleSelection.value = val
    selectedFileName.value = multipleSelection.value.map(file => file.fileName)
}

const formatter = (row: File) => {
    const size = parseInt(row.size, 10);
    if (size < 1000) {
        return `${size} B`
    }
    else if (1000 <= size && size < 1000 * 1024) {
        return `${(size / 1000).toFixed(2)} KB`
    }
    else if (1000 * 1024 <= size && size < 1000 * (1024 ** 2)) {
        return `${(size / (1000 * 1024)).toFixed(2)} MB`
    }
    else if (1000 * (1024 ** 2) <= size && size < 1000 * (1024 ** 3)) {
        return `${(size / (1000 * (1024 ** 2))).toFixed(2)} GB`
    }
    else if (size >= 1000 * (1024 ** 3)) {
        return `${(size / (1000 * (1024 ** 3))).toFixed(2)} TB`
    }
}
const queryFiles = async (shareFileId: string) => {
    // 在组件挂载后获取数据
    axios.get(`http://localhost:8081/shareFile/fileList?shareFileId=${shareFileId}`)
        .then(response => {
            title.value = response.data.data.title
            tableData.value = response.data.data.files
            console.log('Query success:', response)
        })
        .catch(error => {
            // 处理查询失败的逻辑
            console.error('Query error:', error)
        })
}
const queryFiles2 = async (path: string) => {
    // 在组件挂载后获取数据
    axios.get(`http://localhost:8081/shareFile/fileList?path=${path}`)
        .then(response => {
            tableData.value = response.data.data.files
            console.log('Query success:', response)
        })
        .catch(error => {
            // 处理查询失败的逻辑
            console.error('Query error:', error)
        })
}
const queryUser = async () => {
    axios.get(`http://localhost:8081/user/userInfo`)
        .then(response => {
            userInfo.value = response.data.data
            console.log('Query success:', response)
        })
        .catch(error => {
            console.error('Query error:', error)
        })
}
const batchDownload = () => {
    // 使用 Axios 发起批量下载请求
    axios({
        method: 'get',
        url: `http://localhost:8081/shareFile/download?fileNames=${selectedFileName.value}`,
        responseType: 'blob'  // 指定响应类型为 blob
    })
        .then(response => {
            // 创建一个 Blob 对象
            const blob = new Blob([response.data], { type: 'application/zip' });
            // 创建一个下载链接
            const downloadLink = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            // 设置下载链接的属性
            downloadLink.href = url;
            // 模拟点击下载链接
            document.body.appendChild(downloadLink);
            downloadLink.click();
            // 释放 URL 对象
            window.URL.revokeObjectURL(url);
            // 移除下载链接
            document.body.removeChild(downloadLink);
        })
        .catch(error => {
            // 处理下载失败的逻辑
            console.error('BatchDownload error:', error);
        })
}
</script>