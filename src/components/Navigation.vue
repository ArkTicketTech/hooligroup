<template scope='scope'>
    <el-menu theme="dark" :default-active="defaultActiveIndex" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1">小组</el-menu-item>
        <el-menu-item index="2">活动</el-menu-item>
    
        <el-submenu index="3">
            <template slot="title">{{username}}</template>
            <el-menu-item index="2-1" @click="logout()">登出</el-menu-item>
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
        this.get_User()
        this.username = localStorage.getItem('username')
    },
    methods: {
        // handleSelect(key, keyPath) {
        //     console.log(key, keyPath);
        // },
        get_User() {
            setTimeout(() => {
                api.getUser().then(({
                    data
                }) => {
                    if (data.code == 401) {
                        console.log('token')
                        this.$router.push('/login')
                        this.$store.dispatch('UserLogout')
                        console.log(localStorage.token)
                    } else {
                        this.user = data
                    }
                })
            }, 100)
        },
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
                "Activity": "2"
            }
            return navMapping[this.$route.name];
        }
    }
}
</script>

<style scoped>

</style>
