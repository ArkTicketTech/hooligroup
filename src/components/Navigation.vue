<template scope='scope'>
    <el-menu theme="light" router :default-active="$route.path" mode="horizontal">
        <span class="logo-sm"><img src="../assets/logo-small.gif"></span>

        <el-menu-item index="/">小组</el-menu-item>
        <el-menu-item index="/event">活动</el-menu-item>

        <el-submenu index="$route.path" class="right">
            <template slot="title">{{username}}</template>
            <el-menu-item index="$route.path" @click="logout()">登出</el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
/**
 * @author: wfnuser
 */
import * as types from '../store/types'
import api from '../axios'

export default {
    name: 'navigation',
    data() {
        return {
            user: '',
            username: ''
        }
    },
    mounted() {
        this.username = localStorage.getItem('username')
    },
    methods: {
        logout() {
            this.$store.dispatch('UserLogout')
            if (!this.$store.state.token) {
                this.$router.push('/login')
                this.$message({
                    type: 'success',
                    message: '登出成功'
                })
            } else {
                this.$message({
                    type: 'info',
                    message: '登出失败'
                })
            }
        }
    },
    computed: {
        defaultActiveIndex: function () {
            var navMapping = {
                "Group": "1",
                "Event": "2"
            }
            return navMapping[this.$route.name || "Group"];
        }
    }
}
</script>

<style scoped>
.logo-sm {
  float: left;
  margin-top: 9px;
  margin-left: 20px;
}

.right {
  float: right !important;
  margin-right: 20px;
}
</style>