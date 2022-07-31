/*
 * @Author: liujun 18316880540@163.com
 * @Date: 2022-07-16 18:16:27
 * @LastEditors: liujun 18316880540@163.com
 * @LastEditTime: 2022-07-31 15:10:25
 * @FilePath: \fileUploade:\WWW\vue-admin-template\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import 'remixicon/fonts/remixicon.css'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import consts from '@/consts'
import * as common from '@/utils/common/'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

import { arrayScrollIndexFirst } from '@/utils' // error log

// 全局价格过滤器 20,000.00
import VueCurrencyFilter from 'vue-currency-filter'

import * as filters from './filters' // global filters

import '@/icons' // icon
import '@/permission' // permission control

// 水印
import watermark from '@/utils/watermark'
Vue.prototype.$watermark = watermark

Vue.filter('scrollIndexFirst', function(array, index) {
  return arrayScrollIndexFirst(index, array)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype.$consts = consts
console.log('安装$consts模块到Vue.prototype下，调用方式：this.$consts', Vue.prototype.$consts)

Vue.prototype.$utils = { common }
console.log('安装$utils模块到Vue.prototype下，调用方式：this.$utils', Vue.prototype.$utils)

dayjs.locale('zh-cn')
Vue.prototype.$dayjs = dayjs
console.log('安装$dayjs模块到Vue.prototype下，调用方式：this.$dayjs', Vue.prototype.$dayjs)

// 全局上传组件
import FileUpload from '@/components/FileUpload'
Vue.component('FileUpload', FileUpload)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// or with custom config
Vue.use(VueCurrencyFilter, {
  thousandsSeparator: ',',
  fractionCount: 2,
  fractionSeparator: '.',
  symbolPosition: 'front',
  symbolSpacing: false
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
