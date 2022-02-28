const { defineConfig } = require('@vue/cli-service')

const { DefinePlugin } = require('webpack');
const packageJson = require('./package.json');

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: `"${packageJson.version}"`
        }
      })
    ]
  },
  transpileDependencies: [
    'vuetify'
  ]
})
