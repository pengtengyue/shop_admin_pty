// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入通用样式
import '@/assets/base.css'

// 导入element
import ElementUI from 'element-ui'
// 导入element-ui的样式文件
import 'element-ui/lib/theme-chalk/index.css'

// 引入element-tree-grid
import ElTreeGrid from 'element-tree-grid'

// 引入moment插件
import moment from 'moment'

// axios的相关设置
// 把axios绑定要vue的原型上
import axios from 'axios'
Vue.prototype.axios = axios
// 设置axios的默认baseURL
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 设置axios的请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前设置请求体把token带上
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据直接返回它的data值， 方便后期代码的简写，优化代码
    return response.data
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 使用element-ui插件
Vue.use(ElementUI)

// 关闭提示
Vue.config.productionTip = false

// 注册一个element-tree-grid全局组件
Vue.component(ElTreeGrid.name, ElTreeGrid)

// 定义一个全局的过滤器
Vue.filter('dataFilter', (input, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(format)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
