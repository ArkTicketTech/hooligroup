<template scope='scope'>
    <div class="container">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-row>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="line-height: 36px;">{{eventInfo.name}}</span>
                        </div>
                        <div class="text item">
                            {{eventInfo.description}}
                        </div>
                    </el-card>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px;">成员列表</span>
                        <el-button style="float: right;" type="primary" @click="enroll(eventInfo._id)">报名</el-button>
                    </div>
                    <div v-for="member in eventInfo.members" v-bind:key="member.id" class="text item">
                        {{ member.name }}
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
    name: 'event',
    data() {
        return {
            msg: 'Welcome to Hooli Group',
            username: '',
            eventInfo: {}
        }
    },
    mounted() {
        this.getEventInfo()
        this.username = localStorage.getItem('username')
    },
    methods: {
        getEventInfo() {
            let that = this
            let loadingInstance = Loading.service()
            api.getEventInfo(this.$router.currentRoute.params).then((data) => {
                //TODO: rewrite the code here, and use some config file
                that.eventInfo = data.data
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
        enroll(eventId) {
            console.log(eventId)
            let request = {}
            request.id = eventId
            api.joinEvent(request).then((data) => {
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

<style lang="scss" scoped>
.container {
  padding: 24px;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>