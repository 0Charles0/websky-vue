<template>
  <div class="common-layout">
    <el-container>
      <el-header style="padding-left:30px">
        <el-row>
          <el-col :span="8">
            <el-button style="border:none;width:106px;height:50px;float:left"
              :style="{ filter: isHovered ? 'brightness(1.1)' : '' }" @mouseover="isHovered = true"
              @mouseout="isHovered = false" @click="refreshPage">
              <img src="../../assets/logo.png" style="width:106px;height:50px;float:left" />
            </el-button>
          </el-col>
          <el-col :span="8">
            <div class="input_box">
              <el-input v-model="shareSearchInput" size="small" placeholder="搜索共享资源" class="input-with-select"
                style="border:none;box-shadow:none" @keydown.enter="shareSearch(shareSearchInput); dialogVisible4 = true">
                <template #prepend>
                  <el-button @click="shareSearch(shareSearchInput); dialogVisible4 = true">
                    <el-icon>
                      <Search />
                    </el-icon>
                  </el-button>
                </template>
              </el-input>
            </div>
          </el-col>
          <el-col :span="8">
            <el-dropdown @command="handleCommand" trigger="hover" style="float:right;margin-top:1%">
              <el-button @click="dialogVisible7 = true" size="small" circle>
                <el-avatar :size="size" :src="userInfo.image + '?' + Date.now()" />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile" @click="dialogVisible8 = true">个人信息</el-dropdown-item>
                  <el-dropdown-item command="settings"
                    @click="queryShare(); dialogVisible9 = true">分享管理</el-dropdown-item>
                  <el-dropdown-item command="logout" @click="logout">登出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
        </el-row>

      </el-header>
      <el-container>
        <el-aside>
          <el-menu :default-openeds="['1', '3']">
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <Files />
                </el-icon>我的文件
              </template>
              <el-menu-item index="1-1" @click="queryFiles('/')"><el-icon>
                  <Menu />
                </el-icon>全部</el-menu-item>
              <el-menu-item index="1-2" @click="queryCategory('图片')"><el-icon>
                  <Picture />
                </el-icon>图片</el-menu-item>
              <el-menu-item index="1-3" @click="queryCategory('文档')"><el-icon>
                  <Document />
                </el-icon>文档</el-menu-item>
              <el-menu-item index="1-4" @click="queryCategory('视频')"><el-icon>
                  <VideoPlay />
                </el-icon>视频</el-menu-item>
              <el-menu-item index="1-5" @click="queryCategory('音频')"><el-icon>
                  <Headset />
                </el-icon>音频</el-menu-item>
              <el-menu-item index="1-6" @click="queryCategory('其它')"><el-icon>
                  <More />
                </el-icon>其它</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-row>
            <el-col :span="2">
              <el-dropdown>
                <el-button type="primary" round>
                  <el-icon>
                    <Upload />
                  </el-icon>上传<el-icon><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-upload v-model:file-list="fileList" class="upload-demo" action="http://localhost:8081/file/upload"
                      multiple :on-preview="handlePreview" :limit="10" :on-exceed="handleExceed"
                      :before-upload="beforeUpload" :directory="true">
                      <el-button text style="width:100px">文件</el-button>
                    </el-upload>
                    <el-button text style="width:100px" @click="onAddFolder">文件夹</el-button>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-col>
            <el-col :span="2">
              <el-button type="success" round @click="dialogVisible2 = true">
                <el-icon>
                  <FolderAdd />
                </el-icon>新建文件夹
              </el-button>
            </el-col>
            <el-col :span="3">
              <el-button type="danger" round @click="batchDeletion">
                <el-icon>
                  <Delete />
                </el-icon>删除选中文件
              </el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" round @click="batchDownload">
                <el-icon>
                  <Download />
                </el-icon>下载选中文件
              </el-button>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" round @click="dialogVisible1 = true">
                <el-icon>
                  <Share />
                </el-icon>分享选中文件
              </el-button>
            </el-col>
            <el-col :span="2" @keydown.enter.stop>
              <div class="input_box" style="margin-left:20px;width:250px">
                <el-input v-model="userSearchInput" size="small" placeholder="搜索盘内资源" class="input-with-select"
                  style="border:none;box-shadow:none" @keydown.enter="userSearch(userSearchInput)">
                  <template #prepend>
                    <el-button @click="userSearch(userSearchInput)">
                      <el-icon>
                        <Search />
                      </el-icon>
                    </el-button>
                  </template>
                </el-input>
              </div>
            </el-col>
          </el-row>
          <br>
          <div class="input_box" style="margin-left:20px">
            <el-input v-model="currentPath" :clearable="true" placeholder="" @keydown.enter="queryFiles(currentPath)"
              @blur="queryFiles(currentPath)" class="input-with-select">
              <template #prepend><el-button :icon="Back" round @click="queryFiles(superiorPath)" /></template>
              <template #prefix>/&nbsp;</template>
            </el-input>
          </div>
          <el-table ref="multipleTableRef" :data="tableData" :default-sort="{ prop: 'fileName', order: 'descending' }"
            style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" />
            <el-table-column prop="fileName" label="文件名" sortable width="750">
              <template #default="scope">
                <el-button v-if="scope.row.fileName.slice(-1) === '/'" text @click="queryFiles(scope.row.fileName)"
                  :icon="Folder" style="padding-left:0px">{{
                    scope.row.fileName.slice(0, -1).slice(scope.row.fileName.slice(0, -1).lastIndexOf('/') + 1)
                  }}</el-button>
                <el-link v-else-if="scope.row.category === '图片'" :href="scope.row.url"
                  :icon="Picture">&nbsp;&nbsp;{{ scope.row.fileName.slice(scope.row.fileName.lastIndexOf('/') + 1)
                  }}</el-link>
                <el-link v-else-if="scope.row.category === '文档'" :href="scope.row.url"
                  :icon="Document">&nbsp;&nbsp;{{ scope.row.fileName.slice(scope.row.fileName.lastIndexOf('/') + 1)
                  }}</el-link>
                <el-link v-else-if="scope.row.category === '视频'" :href="scope.row.url"
                  :icon="VideoPlay">&nbsp;&nbsp;{{ scope.row.fileName.slice(scope.row.fileName.lastIndexOf('/') + 1)
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
          <el-dialog v-model="dialogVisible1" title="标题">
            <el-form>
              <el-form-item>
                <el-input v-model="titleImput" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="batchShare(false)">链接分享</el-button>
                <el-button type="primary" @click="batchShare(true)">链接及公开分享</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-dialog v-model="dialogVisible2" title="文件夹命名">
            <el-form>
              <el-form-item>
                <el-input v-model="input1" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit1">创建</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-dialog v-model="dialogVisible3">
            <el-result icon="success" title="分享成功">
              <template #extra>
                <el-link href="shareLink" target="_blank">分享链接：{{ shareLink }}</el-link>
                <el-button size="small" @click="onCopy()">复制</el-button>
                <br>
                <el-button type="primary" @click="closeDialogVisible3()">返回</el-button>
              </template>
            </el-result>
          </el-dialog>
          <el-dialog v-model="dialogVisible4" title="共享资源" width="20%">
            <el-table :data="shareSearchFiles">
              <el-table-column prop="title" label="标题">
                <template #default="scope3">
                  <el-link :href="scope3.row.url" target="_blank">{{ scope3.row.title }}</el-link>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
          <el-dialog v-model="dialogVisible7" title="更换头像" headers.stop width="20%">
            <el-upload class="avatar-uploader" action="http://localhost:8081/file/uploadImage" :headers="{ token: jwt }"
              name="files" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
            <br>
            <el-button>确认</el-button>
          </el-dialog>
          <el-dialog v-model="dialogVisible8" title="个人信息" width="30%">
            <el-form :model="userInfo" label-width="auto">
              <el-form-item label="用户名">
                <el-input v-model="userInfo.userName" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="userInfo.email" disabled />
              </el-form-item>
              <el-form-item label="修改密码">
                <el-input v-model="newPassword" placeholder="新密码" />
              </el-form-item>
              <el-button @click="updatePassword(newPassword)">确认修改</el-button>
            </el-form>
          </el-dialog>
          <el-dialog v-model="dialogVisible9" title="分享管理" width="20%">
            <el-table :data="shareFiles">
              <el-table-column prop="title" label="我的分享">
                <template #default="scope2">
                  <el-link :href="scope2.row.url" target="_blank">{{ scope2.row.title }}</el-link>
                </template>
              </el-table-column>
              <el-table-column align="right">
                <el-button>删除</el-button>
              </el-table-column>
            </el-table>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { Files, Menu, Picture, Document, VideoPlay, Headset, More, Upload, FolderAdd, Delete, Download, Search, Back, Folder, Tickets, Share } from '@element-plus/icons-vue'
import { ref, /* reactive, toRefs, */ onMounted } from 'vue'
import { ElTable, ElMessage, /* ElMessageBox */ } from 'element-plus'
import { useRouter } from 'vue-router'
import type { UploadProps, UploadUserFile } from 'element-plus'
import axios from 'axios'

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

const isHovered = ref(false);
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<File[]>([])
const userSearchInput = ref('')
const shareSearchInput = ref('')
const dialogVisible1 = ref(false)
const dialogVisible2 = ref(false)
const dialogVisible3 = ref(false)
const dialogVisible4 = ref(false)
const dialogVisible7 = ref(false)
const dialogVisible8 = ref(false)
const dialogVisible9 = ref(false)
const input1 = ref('')
const titleImput = ref('')
const currentPath = ref('')
const superiorPath = ref('')
const tableData = ref([])
const router = useRouter()
const selectedFileName = ref<string[]>([])
const newPassword = ref('')
const imageUrl = ref('')
const jwt = ref(localStorage.getItem('token'))
const shareLink = ref('')
const shareFiles = ref([])
const shareSearchFiles = ref([])
const userInfo = ref<User>({
  userName: '',
  email: '',
  image: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

onMounted(() => {
  queryFiles(currentPath.value)
  queryUser()
})

/* const openLink = (url: string) => {
  window.open(url, '_blank');
} */
const closeDialogVisible3 = () => {
  dialogVisible3.value = false
}
const refreshPage = () => {
  window.location.reload()
}
const handleSelectionChange = (val: File[]) => {
  multipleSelection.value = val
  selectedFileName.value = multipleSelection.value.map(file => file.fileName)
}

const formatter = (row: File/* , column: TableColumnCtx<File> */) => {
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

/* const state = reactive({
  circleUrl:
    // 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    userInfo.value.image
})

const { circleUrl } = toRefs(state) */

const size = ''; // 头像大小，根据你的需求调整

const handleCommand = (command: string) => {
  // 处理菜单项的点击事件
  if (command === 'profile') {
    // 执行个人信息操作
  } else if (command === 'settings') {
    // 执行设置操作
  } else if (command === 'logout') {
    // 执行退出操作
  }
};
const fileList = ref<UploadUserFile[]>([])

/* const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  if (file && file.status === 'success') {
    console.log(uploadFiles)
  }
} */

const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 10, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
    } totally`
  )
}

/* const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFiles)
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  )
} */
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  // 创建一个 FormData 对象，用于将文件上传到服务器
  const formData = new FormData();
  // 将文件追加到 FormData 中，注意 'file' 参数需要和后端接口中接收文件的参数名一致
  formData.append('files', file, currentPath.value + file.name);
  // 使用 Axios 发起文件上传请求
  axios.post('http://localhost:8081/file/upload', formData)
    .then(response => {
      // 处理上传成功的逻辑
      console.log('Upload success:', response);
      // 上传完刷新显示
      queryFiles(currentPath.value)
    })
    .catch(error => {
      // 处理上传失败的逻辑
      console.error('Upload error:', error);
    })
  // 阻止默认上传行为
  return false;
}
// 上传文件夹
const onAddFolder = () => {
  const input = document.createElement("input")
  input.type = "file"
  input.setAttribute("allowdirs", "true")
  input.setAttribute("directory", "true")
  input.style.cssText = "display:none"
  input.setAttribute("webkitdirectory", "true")
  input.multiple = true
  document.querySelector("body")!.appendChild(input)
  // todo 这里增加了input标签，可以给它删掉
  input.click()
  input.onchange = async (e) => {
    console.log(e)
    console.log((e.target as HTMLInputElement).files)
    const formData = new FormData()
    const file = (e.target as HTMLInputElement).files
    for (let i = 0; i < file!.length; i++) {
      formData.append("files", file![i], currentPath.value + file![i].webkitRelativePath)
    }
    console.log(formData)
    try {
      const response = await axios.post("http://localhost:8081/file/upload", formData);
      const msg = response.data.msg;
      // 处理消息
      console.log(msg);
      // 上传完刷新显示
      queryFiles(currentPath.value)
    } catch (error) {
      // 处理错误
      console.error(error);
    }
    document.querySelector("body")!.removeChild(input)
  }
}
const onSubmit1 = () => {
  dialogVisible2.value = false
  const formData = new FormData()
  formData.append('folderName', input1.value)
  formData.append('path', currentPath.value)
  // 使用 Axios 发起新建文件夹请求
  axios.post('http://localhost:8081/file/addFolder', formData)
    .then(response => {
      // 处理新建成功的逻辑
      console.log('AddFolder success:', response)
      // 上传完刷新显示
      queryFiles(currentPath.value)
    })
    .catch(error => {
      // 处理新建失败的逻辑
      console.error('AddFolder error:', error)
    })
}
const logout = () => {
  // 清除 token 并跳转到登录页面
  localStorage.removeItem('token');
  router.push('/login');
}
const queryFiles = async (path: string) => {
  if (path === '') {
    path = '/'
  }
  // 在组件挂载后获取数据
  axios.get(`http://localhost:8081/file/fileList?path=${path}`)
    .then(response => {
      if (path !== '/') {
        currentPath.value = path
      }
      else {
        currentPath.value = ''
      }
      superiorPath.value = response.data.data[0].fileName
      tableData.value = response.data.data.slice(1)
      console.log('Query success:', response)
    })
    .catch(error => {
      // 处理查询失败的逻辑
      console.error('Query error:', error)
    })
}
const queryCategory = async (category: string) => {
  axios.get(`http://localhost:8081/file/category?category=${category}`)
    .then(response => {
      tableData.value = response.data.data
      console.log('Query success:', response)
    })
    .catch(error => {
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
const updatePassword = async (newPassword: string) => {
  const data = new FormData()
  data.append('password', newPassword)
  axios.patch('http://localhost:8081/user/updatePassword', data)
    .then(response => {
      console.log('Update success:', response)
    })
    .catch(error => {
      console.error('Update error:', error)
    })
}
const userSearch = async (userSearchName: string) => {
  // 在组件挂载后获取数据
  axios.get(`http://localhost:8081/file/userSearch?userSearchName=${userSearchName}`)
    .then(response => {
      tableData.value = response.data.data.slice(1)
      console.log('UserSearch success:', response)
    })
    .catch(error => {
      // 处理搜索失败的逻辑
      console.error('UserSearch error:', error)
    })
}
const shareSearch = async (shareSearchName: string) => {
  // 在组件挂载后获取数据
  axios.get(`http://localhost:8081/shareFile/shareSearch?shareSearchName=${shareSearchName}`)
    .then(response => {
      shareSearchFiles.value = response.data.data
      console.log('ShareSearch success:', response)
    })
    .catch(error => {
      // 处理搜索失败的逻辑
      console.error('ShareSearch error:', error)
    })
}
const batchDeletion = () => {
  // 使用 Axios 发起批量删除请求
  axios.delete('http://localhost:8081/file/delete', {
    data: selectedFileName.value
  })
    .then(response => {
      // 处理删除成功的逻辑
      console.log('BatchDeletion success:', response)
      // 上传完刷新显示
      queryFiles(currentPath.value)
    })
    .catch(error => {
      // 处理删除失败的逻辑
      console.error('BatchDeletion error:', error)
    })
}
const batchDownload = () => {
  // 使用 Axios 发起批量下载请求
  axios({
    method: 'get',
    url: `http://localhost:8081/file/download?fileNames=${selectedFileName.value}`,
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
const batchShare = (isOpen: boolean) => {
  dialogVisible1.value = false
  // 构建请求数据体
  const requestData = {
    title: titleImput.value,
    files: selectedFileName.value,
    open: isOpen
  }
  // 使用 Axios 发起分享文件请求
  axios.post('http://localhost:8081/shareFile/share', requestData)
    .then(response => {
      // 处理分享成功的逻辑
      shareLink.value = response.data.data
      dialogVisible3.value = true
      console.log('Share success:', response)
    })
    .catch(error => {
      // 处理分享失败的逻辑
      console.error('Share error:', error)
    })
}
const queryShare = () => {
  // 使用 Axios 发起查询已分享文件请求
  axios.get('http://localhost:8081/shareFile/queryShare')
    .then(response => {
      // 处理查询成功的逻辑
      shareFiles.value = response.data.data
      console.log('QueryShare success:', response)
    })
    .catch(error => {
      // 处理查询失败的逻辑
      console.error('QueryShare error:', error)
    })
}
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  queryUser()
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
const onCopy = () => {
  navigator.clipboard.writeText(shareLink.value)
    .then(() => {
      console.log('复制成功');
    })
    .catch((err) => {
      console.error('复制失败:', err);
    });
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.input-with-select .el-input-group__prepend {
  border-radius: 100px;
  box-shadow: none;
}

.input-with-select .el-input__wrapper {
  border-radius: 100px;
  box-shadow: none;
}

.input_box {
  border-radius: 100px;
  border: 1px solid#ccc;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

/* 取消下拉蓝框 */
.el-tooltip__trigger:focus-visible {
  outline: unset;
}

/* 对话框标题对齐 */
.el-dialog__header {
  margin-right: unset;
}
</style>