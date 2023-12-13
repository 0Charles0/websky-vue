const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 解决域名访问 Invalid Host header
  devServer: {
    allowedHosts: "all"
  }
})
