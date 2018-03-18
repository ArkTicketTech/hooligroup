// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from './axios'
import store from './store/index.js'
import Filters from './common/filters'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(ElementUI)

// 注册过滤器
Object.keys(Filters).forEach( key => {
	Vue.filter(key, Filters[key])
})

/* eslint-disable no-new */
new Vue({
		axios,
		store,
		router,
		render: h => h(App)
	})
	.$mount('#app')
