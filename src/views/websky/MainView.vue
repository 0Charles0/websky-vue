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
            <el-button type="primary" round @click="dialogVisible1 = true">
              <el-icon>
                <Upload />
              </el-icon>上传
            </el-button>
            <el-button type="success" round @click="dialogVisible2 = true">
              <el-icon>
                <FolderAdd />
              </el-icon>新建文件夹
            </el-button>
            <el-button type="warning" round @click="dialogVisible3 = true">
              <el-icon>
                <Rank />
              </el-icon>批量移动
            </el-button>
            <el-button type="danger" round @click="dialogVisible4 = true">
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
          <el-table ref="multipleTableRef" :data="tableData" :default-sort="{ prop: 'date', order: 'descending' }"
            style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" />
            <el-table-column prop="date" label="文件名" sortable width="750">
              <template #default="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="name" label="修改时间" sortable width="500" />
            <el-table-column prop="address" label="大小" :formatter="formatter" show-overflow-tooltip sortable />
          </el-table>

          <el-dialog v-model="dialogVisible1" title="上传列表">
            <el-upload v-model:file-list="fileList" class="upload-demo" action="http://localhost:8081/file/upload"
              multiple :on-preview="handlePreview" :limit="10" :on-exceed="handleExceed" :before-upload="beforeUpload">
              <el-button type="primary">点击上传</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  一次最多上传10个文件。
                </div>
              </template>
            </el-upload>
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

          <el-dialog v-model="dialogVisible3" title="目标路径">
            <el-form>
              <el-form-item>
                <el-input v-model="input2" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit2">移动</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>

          <el-dialog v-model="dialogVisible4" title="确认删除">
            <el-form>
              <el-form-item>
                <el-button type="primary" @click="onSubmit3">确认</el-button>
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
import { Files, Menu, Picture, Document, VideoPlay, Headset, More, Upload, FolderAdd, Rank, Delete, Download, Search } from '@element-plus/icons-vue'
import { ref, reactive, toRefs } from 'vue'
import { ElTable, ElMessage, /* ElMessageBox */ } from 'element-plus'
import { useRouter } from 'vue-router'
import type { UploadProps, UploadUserFile } from 'element-plus'
import axios from 'axios'

interface User {
  date: string
  name: string
  address: string
}

const isHovered = ref(false);
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
const search = ref('')
const dialogVisible1 = ref(false)
const dialogVisible2 = ref(false)
const dialogVisible3 = ref(false)
const dialogVisible4 = ref(false)
const dialogVisible5 = ref(false)
const dialogVisible6 = ref(false)
const dialogVisible7 = ref(false)
const dialogVisible8 = ref(false)
const dialogVisible9 = ref(false)
const input1 = ref('')
const input2 = ref('')
const router = useRouter();

const refreshPage = () => {
  window.location.reload()
}
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val
}

const formatter = (row: User/* , column: TableColumnCtx<User> */) => {
  return row.address
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
    `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
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
  formData.append('file', file);
  // 使用 Axios 发起文件上传请求
  axios.post('http://localhost:8081/file/upload', formData)
    .then(response => {
      // 处理上传成功的逻辑
      console.log('Upload success:', response);
    })
    .catch(error => {
      // 处理上传失败的逻辑
      console.error('Upload error:', error);
    });
  // 阻止默认上传行为
  return false;
};

const onSubmit1 = () => {
  console.log('submit!')
}
const onSubmit2 = () => {
  console.log('submit!')
}
const onSubmit3 = () => {
  console.log('submit!')
}
const onSubmit4 = () => {
  console.log('submit!')
}
const logout = () => {
  // 清除 token 并跳转到登录页面
  localStorage.removeItem('token');
  router.push('/login');
}
const tableData: User[] = [
  {
    date: "Tom1",
    name: "2016-05-03",
    address: "107M",
  },
  {
    date: "Tom2",
    name: "2016-05-02",
    address: "106M",
  },
  {
    date: "Tom3",
    name: "2016-05-04",
    address: "105M",
  },
  {
    date: "Tom4",
    name: "2016-05-01",
    address: "104M",
  },
  {
    date: "Tom5",
    name: "2016-05-08",
    address: "103M",
  },
  {
    date: "Tom6",
    name: "2016-05-06",
    address: "102M",
  },
  {
    date: "Tom7",
    name: "2016-05-07",
    address: "101M",
  }
]
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