import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index.js'

Vue.use(Router)

const router = new Router({
	routes: [{
		path: '/',
		name: 'Group',
		component(resolve) {
			require.ensure(['@/pages/Group.vue'], () => {
				resolve(require('@/pages/Group.vue'));
			});
		},
		// 设置 mata 字段，表示该字段需要验证
		meta: {
			requireAuth: true
		}
	},
	{
		path: '/group/:id',
		name: 'GroupDetail',
		component(resolve) {
			require.ensure(['@/pages/GroupDetail.vue'], () => {
				resolve(require('@/pages/GroupDetail.vue'));
			});
		},
		// 设置 mata 字段，表示该字段需要验证
		meta: {
			requireAuth: true
		}
	},
	{
		path: '/login',
		name: 'login',
		component(resolve) {
			require.ensure(['@/pages/Login.vue'], () => {
				resolve(require('@/pages/Login.vue'));
			});
		}
	},
	{
		path: '/register',
		name: 'register',
		component(resolve) {
			require.ensure(['@/pages/Register.vue'], () => {
				resolve(require('@/pages/Register.vue'));
			});
		}
	},
	{
		path: '/event/:id',
		name: 'event',
		component(resolve) {
			require.ensure(['@/pages/EventDetail.vue'], () => {
				resolve(require('@/pages/EventDetail.vue'));
			});
		}
	},
	{
		path: '/vote',
		name: 'vote',
		component(resolve) {
			require.ensure(['@/pages/Vote.vue'], () => {
				resolve(require('@/pages/Vote.vue'));
			});
		}
	},
	// 简单设置404页面
	{
		path: '*',
		component(resolve) {
			require.ensure(['@/pages/404.vue'], () => {
				resolve(require('@/pages/404.vue'));
			});
		},
		hidden: true
	}
	]
})

// 验证 token，存在才跳转
router.beforeEach((to, from, next) => {
	let token = localStorage.getItem('token')
	if (to.meta.requireAuth) {
		if (token) {
			next()
		} else {
			next({
				path: '/login',
				query: { redirect: to.fullPath }
			})
		}
	} else {
		next()
	}
})

export default router
