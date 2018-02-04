import api from '../axios'
import Vue from 'vue'
import router from '../router/index'
import * as types from './types'

export default {
	UserLogin({ commit }, data) {
		commit(types.LOGIN, data)
	},

	UserLogout({ commit }) {
		commit(types.LOGOUT)
	},

	UserName({ commit }, data) {
		commit(types.USERNAME, data)
	},

	UserId({ commit }, data) {
		commit(types.USERID, data)
	}
}
