<template scope='scope'>
    <div class="container">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-row>
                    <el-card class="box-card">
                        <div slot="header"
                             class="clearfix">
                            <span>{{eventInfo.name}}</span>
                        </div>
                        <div class="text item">
                            报名截止时间：{{eventInfo.enroll_end_time | formatDate}}
                            <br/> 活动时间：{{eventInfo.begin_time | formatDate}} 至 {{eventInfo.end_time | formatDate}}
                            <br/> 活动地点： {{eventInfo.location}}
                        </div>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card class="box-card">
                        <div slot="header"
                             class="clearfix">
                            <span>活动介绍</span>
                        </div>
                        <div class="text item">
                            {{eventInfo.description}}
                        </div>
                    </el-card>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header"
                         class="clearfix">
                        <span style="line-height: 36px;">他们也会去</span>
                        <el-button style="float: right;"
                                   type="primary"
                                   v-if="isInGroup && !isInEvent"
                                   @click="enroll(eventInfo._id)">报名</el-button>
                        <el-button style="float: right;"
                                   type="danger"
                                   v-if="isInGroup && isInEvent"
                                   @click="leave(eventInfo._id)">退出</el-button>
                    </div>
                    <div v-for="member in eventInfo.members"
                         v-bind:key="member.id"
                         class="text item"
                         style="max-height: 500px; overflow-y: scroll;">
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
            eventInfo: {},
            groupInfo: {},
            isInGroup: false,
            isInEvent: false,
            userId: ''
        }
    },
    mounted() {
        // TODO: mp2o
        this.userId = localStorage.getItem('userid')
        this.username = localStorage.getItem('username')
        this.getEventInfo()
        this.getGroupInfo()
    },
    methods: {
        getEventInfo() {
            // Q: any problems?
            let data = {
                id: this.$router.currentRoute.params.eid
            }
            let that = this
            let loadingInstance = Loading.service()
            api.getEventInfo(data).then((res) => {
                //TODO: rewrite the code here, and use some config file
                that.eventInfo = res.data
                that.eventInfo.members.forEach(member => {
                    if (member._id === that.userId) {
                        that.isInEvent = true
                    }
                })
                loadingInstance.close()
            }, (err) => {
                loadingInstance.close()
            })
        },
        getGroupInfo() {
            let data = {
                id: this.$router.currentRoute.params.gid
            }
            let that = this
            api.getGroupInfo(data).then((res) => {
                that.groupInfo = res.data
                if (that.groupInfo.admins) {
                    that.groupInfo.admins.forEach(admin => {
                        if (admin._id === that.userId) {
                            that.isInGroup = true
                        }
                    });
                    that.groupInfo.members.forEach(member => {
                        if (member._id === that.userId) {
                            that.isInGroup = true
                        }
                    });
                }
            }, (err) => {
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
            let request = {}
            request.id = eventId
            api.joinEvent(request).then((data) => {
                this.$message({
                    type: 'success',
                    message: '报名成功'
                })
                this.isInEvent = true
            }, (err) => {
                this.$message({
                    type: 'info',
                    message: '报名失败'
                })
            })
        },
        leave(eventId) {
            let request = {}
            request.id = eventId
            api.leaveEvent(request).then((data) => {
                this.$message({
                    type: 'success',
                    message: '退出成功'
                })
                this.isInEvent = false
            }, (err) => {
                this.$message({
                    type: 'info',
                    message: '退出失败'
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