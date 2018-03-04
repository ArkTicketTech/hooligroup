<template scope='scope'>
    <div class="container">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-row>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="line-height: 36px;">{{groupInfo.name}}</span>
                        </div>
                        <div class="text item">
                            {{groupInfo.description}}
                        </div>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="line-height: 36px;">活动列表</span>
                            <el-button style="float: right;" type="primary" @click="showEventModal" v-if="isAdmin">创建活动</el-button>
                        </div>
                        <div v-for="event in groupInfo.events" v-bind:key="event._id" class="text item">
                            <div @click="goDetail(event._id)" style="height:36px;">
                                <div style="line-height:36px;">{{event.name}}</div>
                            </div>
                        </div>
                    </el-card>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px;">成员列表</span>
                        <el-button v-if="isInGroup" style="float: right;" type="danger">退出</el-button>
                        <el-button v-else style="float: right;" type="primary">报名</el-button>
                    </div>
                    <div v-for="member in groupInfo.members" v-bind:key="member._id" class="text item">
                        {{ member.name }}
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog title="创建活动" :visible.sync="eventModalVisible" width="30%">
            <el-form ref="eventForm" :model="eventForm" label-width="80px">
                <el-form-item label="活动名称">
                    <el-input v-model="eventForm.name"></el-input>
                </el-form-item>
                <el-form-item label="活动地点">
                    <el-input v-model="eventForm.location" placeholder="请选择活动区域"></el-input>
                </el-form-item>
                <el-form-item label="报名开始时间">
                    <el-date-picker v-model="eventForm.enroll_begin_time" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="报名截止时间">
                    <el-date-picker v-model="eventForm.enroll_end_time" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动开始时间">
                    <el-date-picker v-model="eventForm.begin_time" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="eventModalVisible = false">取 消</el-button>
                <el-button type="primary" @click="createEvent">创建活动</el-button>
            </span>
        </el-dialog>
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
            userId: '',
            groupInfo: {},
            eventForm: {
                name: '',
                location: '',
                begin_time: '',
                enroll_begin_time: '',
                enroll_end_time: ''
            },
            isAdmin: false,
            eventModalVisible: false
        }
    },
    mounted() {
        this.username = localStorage.getItem('username')
        this.userId = localStorage.getItem('userid')
        this.getGroupInfo()
    },
    computed: {
        isInGroup: function () {
            if (this.groupInfo.members) {
                for (let i = 0; i < this.groupInfo.members.length; i++) {
                    if (this.groupInfo.members[i]._id === this.userId) {
                        return true;
                    }
                }
            }
            return false;
        }
    },
    methods: {
        getGroupInfo() {
            let that = this
            let loadingInstance = Loading.service()
            console.log(this.$router.currentRoute.params)
            api.getGroupInfo(this.$router.currentRoute.params).then((data) => {
                //TODO: rewrite the code here, and use some config file
                that.groupInfo = data.data
                if (that.groupInfo.admins) {
                    that.groupInfo.admins.forEach(admin => {
                        if (admin._id === that.userId) {
                            that.isAdmin = true
                        }
                    });
                }
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
        },
        goDetail(eventId) {
            let url = '/event/' + eventId
            this.$router.push({
                path: url
            })
        },
        showEventModal() {
            this.eventModalVisible = true
        },
        createEvent() {
            let that = this
            let request = Object.assign({}, that.eventForm)
            request.group = this.$router.currentRoute.params.id
            api.createEvent(request).then((data) => {
                that.eventForm = {
                    name: '',
                    location: '',
                    begin_time: '',
                    enroll_begin_time: '',
                    enroll_end_time: ''
                }
                that.eventModalVisible = false
                that.$message({
                    type: 'success',
                    message: '创建成功'
                })
            }, (err) => {
                that.eventModalVisible = false
                that.$message({
                    type: 'info',
                    message: '创建失败'
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