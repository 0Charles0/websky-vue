<template>
  <div class="common-layout">
    <el-container>
      <el-header height="56px" style="padding-left: 24px; padding-right: 28px">
        <el-row>
          <el-col>
            <el-button
              style="border: none; width: 133px; height: auto"
              :style="{ filter: isHovered ? 'brightness(1.1)' : '' }"
              @mouseover="isHovered = true"
              @mouseout="isHovered = false"
            >
              <img src="../../assets/logo@2x.png" style="width: 133px" />
            </el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="80px" style="height: 100vh">
          <el-row style="width: 80px; height: 58px; margin-top: 40px">
            <el-col style="width: 80px; height: 58px">
              <el-button
                style="border: none; width: 80px; height: 58px"
                :style="{ filter: isHovered1 ? 'brightness(1.1)' : '' }"
                @mouseover="isHovered1 = true"
                @mouseout="isHovered1 = false"
              >
                <div style="width: 80px; height: 58px">
                  <img
                    src="../../assets/icon-home-active.158e32eb.png"
                    style="width: 36px"
                  />
                  <p
                    style="
                      font-size: 12px;
                      margin-top: 6px;
                      margin-bottom: 0;
                      color: #06a7ff;
                    "
                  >
                    首页
                  </p>
                </div>
              </el-button>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHovered: false,
      isHovered1: false,
    };
  },
};
</script>

<style>
</style>