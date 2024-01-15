<template>
  <div class="common-layout">
    <el-container>
      <el-header style="padding-left: 30px;">
        <el-button style="border:none;width:106px;height:50px;float:left"
          :style="{ filter: isHovered ? 'brightness(1.1)' : '' }" @mouseover="isHovered = true"
          @mouseout="isHovered = false" @click="refreshPage">
          <img src="../../assets/logo.png" style="width:106px;height:50px;float:left" />
        </el-button>
        <el-dropdown @command="handleCommand" trigger="hover" style="float:right;margin-top:1%">
          <el-button @click="dialogVisible7 = true" size="small" circle>
            <el-avatar :size="size" :src="circleUrl" />
          </el-button>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" @click="dialogVisible8 = true">个人信息</el-dropdown-item>
              <el-dropdown-item command="settings" @click="dialogVisible9 = true">分享管理</el-dropdown-item>
              <el-dropdown-item command="logout" @click="logout">登出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
              <el-menu-item index="1-1"><el-icon>
                  <Menu />
                </el-icon>全部</el-menu-item>
              <el-menu-item index="1-2"><el-icon>
                  <Picture />
                </el-icon>图片</el-menu-item>
              <el-menu-item index="1-3"><el-icon>
                  <Document />
                </el-icon>文档</el-menu-item>
              <el-menu-item index="1-4"><el-icon>
                  <VideoPlay />
                </el-icon>视频</el-menu-item>
              <el-menu-item index="1-5"><el-icon>
                  <Headset />
                </el-icon>音频</el-menu-item>
              <el-menu-item index="1-6"><el-icon>
                  <More />
                </el-icon>其它</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-row>
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
            <el-button type="success" round @click="dialogVisible2 = true">
              <el-icon>
                <FolderAdd />
              </el-icon>新建文件夹
            </el-button>
            <el-button type="danger" round @click="batchDeletion">
              <el-icon>
                <Delete />
              </el-icon>批量删除
            </el-button>
            <el-button type="primary" round @click="dialogVisible5 = true">
              <el-icon>
                <Download />
              </el-icon>批量下载
            </el-button>
            <div class="input_box" style="margin-left:20px;width:250px">
              <el-input v-model="search" size="small" placeholder="Files to search" class="input-with-select"
                style="border:none;box-shadow:none">
                <template #prepend>
                  <el-button @click="dialogVisible6 = true">
                    <el-icon>
                      <Search />
                    </el-icon>
                  </el-button>
                </template>
              </el-input>
            </div>
          </el-row>
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
                <el-link v-if="scope.row.fileName.slice(-1) !== '/'" :href="scope.row.url" target="_blank"
                  :icon="Document">&nbsp;{{ scope.row.fileName.slice(scope.row.fileName.lastIndexOf('/') + 1) }}</el-link>
                <el-button v-else text @click="queryFiles(scope.row.fileName)" :icon="Folder" style="padding-left:0px">{{
                  scope.row.fileName.slice(0, -1).slice(scope.row.fileName.slice(0, -1).lastIndexOf('/') + 1)
                }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="修改时间" sortable width="500" />
            <el-table-column prop="size" label="大小" :formatter="formatter" show-overflow-tooltip sortable />
          </el-table>

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


          <el-dialog v-model="dialogVisible5" title="下载路径">
            <el-form>
              <el-form-item>
                <el-button type="primary" @click="onSubmit4">下载</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-dialog v-model="dialogVisible6" title="搜索结果">
            <el-form>
              <el-form-item>
                <el-table :data="gridData">
                  <el-table-column property="date" label="Date" width="150" />
                  <el-table-column property="name" label="Name" width="200" />
                  <el-table-column property="address" label="Address" />
                </el-table>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-dialog v-model="dialogVisible7" title="更换头像">
            <el-form>
              <el-form-item>

              </el-form-item>
            </el-form>
          </el-dialog>
          <el-dialog v-model="dialogVisible8" title="个人信息">
            <el-form>
              <el-form-item>

              </el-form-item>
            </el-form>
          </el-dialog>
          <el-dialog v-model="dialogVisible9" title="分享管理">
            <el-form>
              <el-form-item>

              </el-form-item>
            </el-form>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { Files, Menu, Picture, Document, VideoPlay, Headset, More, Upload, FolderAdd, Delete, Download, Search, Back, Folder } from '@element-plus/icons-vue'
import { ref, reactive, toRefs, onMounted } from 'vue'
import { ElTable, ElMessage, /* ElMessageBox */ } from 'element-plus'
import { useRouter } from 'vue-router'
import type { UploadProps, UploadUserFile } from 'element-plus'
import axios from 'axios'

interface File {
  fileName: string
  url: string
  updateTime: string
  size: string
}

const isHovered = ref(false);
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<File[]>([])
const search = ref('')
const dialogVisible2 = ref(false)
const dialogVisible5 = ref(false)
const dialogVisible6 = ref(false)
const dialogVisible7 = ref(false)
const dialogVisible8 = ref(false)
const dialogVisible9 = ref(false)
const input1 = ref('')
const currentPath = ref('')
const superiorPath = ref('')
const tableData = ref([])
const router = useRouter()
const selectedFileName = ref<string[]>([])

onMounted(() => {
  queryFiles(currentPath.value)
})

/* const openLink = (url: string) => {
  window.open(url, '_blank');
} */
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

const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

const { circleUrl } = toRefs(state)

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
const fileList = ref<UploadUserFile[]>([
  /* {
    name: 'element-plus-logo.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  },
  {
    name: 'element-plus-logo2.svg',
    url: 'https://element-plus.org/images/element-plus-logo.svg',
  }, */
])

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
const onSubmit4 = () => {
  console.log('submit!')
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
const gridData = [
  {
    date: '2016-05-02',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-04',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-01',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
  {
    date: '2016-05-03',
    name: 'John Smith',
    address: 'No.1518,  Jinshajiang Road, Putuo District',
  },
]
</script>

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
</style>