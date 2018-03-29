<template lang="html">
    <el-container style="margin-top:50px;">
        login by jaccount
    </el-container>
</template>

<script>
import api from '../axios'

export default {
    data() {
        return {
        }
    },
    methods: {
    },
    mounted() {
        let data = {
            code: this.$route.query.code
        }
        api.loginByJaccount(data).then(res => {
            if (res.data.success) {
                this.$message({
                    type: 'success',
                    message: '登录成功'
                })
                this.$store.dispatch('UserLogin', res.data.token)
                this.$store.dispatch('UserName', res.data.username)
                this.$store.dispatch('UserId', res.data._id)
                let redirect = decodeURIComponent(this.$route.query.redirect || '/')
                this.$router.push({
                    path: redirect
                })
            } else {
                this.$message({
                    type: 'info',
                    message: '密码错误'
                })
            }
        })
    }
}
</script>

<style lang="scss">

</style>