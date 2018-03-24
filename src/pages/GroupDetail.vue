<template scope='scope'>
    <div class="container">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-row>
                    <el-card class="box-card">
                        <div slot="header"
                             class="clearfix">
                            <span style="line-height: 36px;">{{groupInfo.name}}</span>
                            <el-button v-if="isAdmin"
                                       style="float: right;"
                                       type="primary"
                                       @click="goAdmin(groupInfo._id)">管理</el-button>
                            <el-button v-if="isInGroup && !isAdmin"
                                       style="float: right;"
                                       type="danger"
                                       @click="leaveGroup(groupInfo._id)">退出</el-button>
                            <el-button v-if="!isInGroup && !isAdmin"
                                       style="float: right;"
                                       type="primary"
                                       @click="enroll(groupInfo._id)">报名</el-button>
                        </div>
                        <div class="text item">
                            {{groupInfo.description}}
                        </div>
                    </el-card>
                </el-row>
                <el-tabs v-model="currentPanel"
                         @tab-click="selectPanel">
                    <el-tab-pane label="活动"
                                 name="events">
                        <event-list :groupInfo="groupInfo"
                                    :isAdmin="isAdmin"></event-list>
                    </el-tab-pane>
                    <el-tab-pane label="论坛"
                                 name="forum">
                        <topic-list :sections="groupInfo.sections"
                                    :groupId="groupInfo._id"
                                    :topics="groupInfo.topics"
                                    :isAdmin="isAdmin"
                                    :isInGroup="isInGroup"></topic-list>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header"
                         class="clearfix">
                        <span style="line-height: 36px;">成员列表</span>
                    </div>
                    <div v-for="admin in groupInfo.admins"
                         v-bind:key="admin._id"
                         class="text item">
                        {{ admin.name }}
                        <el-tag type="success">管理员</el-tag>
                    </div>
                    <div v-for="member in groupInfo.members"
                         v-bind:key="member._id"
                         class="text item">
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
import EventList from '../components/pages/GroupDetail/EventList'
import TopicList from '../components/pages/GroupDetail/TopicList'
export default {
    name: 'group',
    data() {
        return {
            msg: 'Welcome to Hooli Group',
            userId: '',
            username: '',
            indexOfUser: '',
            groupInfo: {},
            isAdmin: false,
            currentPanel: 'events'
        }
    },
    components: {
        EventList,
        TopicList
    },
    mounted() {
        this.userId = localStorage.getItem('userid')
        this.username = localStorage.getItem('username')
        this.getGroupInfo()
    },
    computed: {
        isInGroup: function () {
            if (this.groupInfo.members) {
                for (let i = 0; i < this.groupInfo.members.length; i++) {
                    if (this.groupInfo.members[i]._id === this.userId) {
                        this.indexOfUser = i;
                        return true;
                    }
                }
            }
            if (this.groupInfo.admins) {
                for (let i = 0; i < this.groupInfo.admins.length; i++) {
                    if (this.groupInfo.admins[i]._id === this.userId) {
                        this.indexOfUser = i;
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
                that.groupInfo.sections = ['全部'].concat(that.groupInfo.sections)
                loadingInstance.close()
            }, (err) => {
                loadingInstance.close()
            })
        },
        enroll(groupId) {
            let request = {}
            request.id = groupId
            api.joinGroup(request).then((data) => {
                var newUser = {};
                newUser._id = this.userId;
                newUser.name = this.username;
                this.groupInfo.members.push(newUser)
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
        selectPanel(tab, event) {
            this.currentPanel = tab.name
        },
        goAdmin(groupId) {
            let url = '/group/' + groupId + '/admin'
            console.log(url)
            this.$router.push({
                path: url
            })
        },
        leaveGroup(groupId) {
            let request = {}
            request.id = groupId
            api.leaveGroup(request).then((data) => {
                this.groupInfo.members.splice(this.indexOfUser, 1);
                this.$message({
                    type: 'success',
                    message: '退出成功'
                })
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