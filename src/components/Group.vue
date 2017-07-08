<template scope='scope'>
<div class="group">
    <!-- v-for在进行过度时，使用 transition-group 标签，使用后内层标签需要有独有的 key 值 -->
    <transition-group name="list-complete" tag="ul">
        <li v-for="(item, index) in user" :key="item._id" class="list-complete-item">
            {{ index+1 }}. {{ item.username }}
        </li>
    </transition-group>
</div>
</template>

<script>
/**
 * @author: wfnuser
 */
import * as types from '../store/types'
import api from '../axios'
export default {
    name: 'group',
    data() {
        return {
            msg: 'Welcome to Hooli Group',
            user: '',
            username: ''
        }
    },
    mounted() {
        this.get_User()
        this.username = localStorage.getItem('username')
    },
    methods: {
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
    }
}
</script>

<style scoped>
</style>
