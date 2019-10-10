const path = require('path');

module.exports = {
  devServer: {
    https: process.env.NODE_ENV === 'development' ? false : process.env.VUE_APP_HTTPS,
    host: process.env.NODE_ENV === 'development' ? 'analytics.growthy.game.line-alpha.me' : process.env.VUE_APP_HOST,
    port: process.env.NODE_ENV === 'development' ? 8999 : process.env.VUE_APP_PORT,
    proxy: {
      '^/v1' : {
        target: process.env.NODE_ENV === 'development' ? "http://growthy-agw-dev.game.line-alpha.me" : process.env.VUE_APP_PROXY_TARGET,
        changeOrigin: true
      }
    },
    watchOptions: {
      poll: true
    }
  },
  publicPath: '/',
  outputDir: './target/dist',
  assetsDir: './static',
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        return options
      })
  }
}
