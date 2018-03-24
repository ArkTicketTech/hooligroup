<template scope='scope'>
    <el-menu theme="light" router :default-active="$route.path" mode="horizontal">
        <span class="logo-sm"><img src="../assets/logo-small.gif"></span>

        <el-menu-item index="/">小组</el-menu-item>
        <el-menu-item index="/event">活动</el-menu-item>

        <el-menu-item index="" class="right">
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                {{username}}<i class="el-icon-arrow-down" style="font-size:12px"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="Account">个人中心</el-dropdown-item>
                    <el-dropdown-item command="logout" divided>登出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-menu-item>
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
        handleCommand(command) {
            switch(command){
                case "Account": 
                  this.$options.methods.Account.bind(this)(); 
                  break;
                case "logout": 
                  this.$options.methods.logout.bind(this)(); 
                  break;
            }
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
        },
        Account() {
            let url = '/Account/'
            this.$router.push({ path: url })
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

.el-dropdown-link {
  cursor: pointer;
}

</style>