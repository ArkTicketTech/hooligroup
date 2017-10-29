<template scope='scope'>
    <div class="container">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px;">{{groupInfo.name}}</span>
                    </div>
                    <div class="text item">
                        {{groupInfo.description}}
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px;">成员列表</span>
                        <el-button style="float: right;" type="primary">报名</el-button>
                    </div>
                    <div v-for="member in groupInfo.members" class="text item">
                        {{ member }}
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    /**
     * @author: wfnuser
     */
    import * as types from '../store/types'
    import api from '../axios'
    import {
        Loading
    } from 'element-ui';
    export default {
        name: 'group',
        data() {
            return {
                msg: 'Welcome to Hooli Group',
                username: '',
                groupInfo: {}
            }
        },
        mounted() {
            this.getGroupInfo()
            this.username = localStorage.getItem('username')
        },
        methods: {
            getGroupInfo() {
                let that = this
                let loadingInstance = Loading.service()
                console.log(this.$router.currentRoute.params)
                api.getGroupInfo(this.$router.currentRoute.params).then((data) => {
                    //TODO: rewrite the code here, and use some config file
                    that.groupInfo = data.data
                    console.log(that.groupInfo)
                    loadingInstance.close()
                }, (err) => {
                    loadingInstance.close()
                })
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
            enroll(groupId) {
                console.log(groupId)
                let request = {}
                request.id = groupId
                api.joinGroup(request).then((data) => {
                    this.$message({
                        type: 'success',
                        message: '报名成功'
                    })
                }, (err) => {
                    this.$message({
                        type: 'info',
                        message: '报名失败'
                    })
                })
            }
        }
    }
</script>

<style scoped>
    .container {
        padding: 24px;
    }
</style>