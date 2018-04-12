<template lang="html">
    <el-container style="margin-top:26px;padding:24px;">
        <el-row style="width:100%;">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/group/'+groupId}">{{groupInfo.name}}</el-breadcrumb-item>
                        <el-breadcrumb-item>管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="group-admin">
                    <el-tabs v-model="currentPanel" @tab-click="selectPanel">
                        <el-tab-pane label="论坛管理" name="forum">
                            <el-tag
                                v-for="section in groupInfo.sections"
                                :key="section"
                                closable
                                type="primary"
                                @close="deleteSection(section)">
                                {{section}}
                            </el-tag>
                            <!-- TODO: -->
                            <el-input
                                class="input-new-section"
                                v-if="inputSectionVisible"
                                v-model="inputSection"
                                ref="saveSectionInput"
                                size="small"
                                @keyup.enter.native="handleSectionInputConfirm"
                                @blur="handleSectionInputConfirm"
                            >
                            </el-input>
                            <el-button v-else class="button-new-section" size="small" @click="showSectionInput">+ 版块</el-button>        
                        </el-tab-pane>
                        <el-tab-pane label="成员管理" name="member">
                            <el-table :data="groupInfo.members"
                                    tooltip-effect="dark"
                                    style="width: 100%"
                                    @selection-change="handleMemberSelectionChange">
                                <el-table-column type="selection"
                                                width="55">
                                </el-table-column>
                                <el-table-column prop="name"
                                                label="姓名"
                                                width="120">
                                </el-table-column>
                                <el-table-column prop="username"
                                                label="用户名"
                                                show-overflow-tooltip>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="审核加入" name="pendingMember">
                            <el-table :data="groupInfo.pendingMembers"
                                    tooltip-effect="dark"
                                    style="width: 100%"
                                    @selection-change="handlePendingMemberSelectionChange">
                                <el-table-column type="selection"
                                                width="55">
                                </el-table-column>
                                <el-table-column prop="name"
                                                label="姓名"
                                                width="120">
                                </el-table-column>
                                <el-table-column prop="username"
                                                label="用户名"
                                                show-overflow-tooltip>
                                </el-table-column>
                                    <el-table-column
                                        fixed="right"
                                        label="操作"
                                        width="100">
                                        <template slot-scope="scope">
                                            <el-button @click="confirmJoin(scope.row)" type="text" size="small">通过</el-button>
                                        </template>
                                    </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-card>
        </el-row>
    </el-container>
</template>

<script>
import api from '../axios'

export default {
    data() {
        return {
            groupInfo: '',
            groupId: '',
            inputSectionVisible: false,
            inputSection: '',
            currentPanel: 'forum',
            multipleMemberSelection: [],
            multiplePendingMemberSelection: []
        }
    },
    methods: {
        deleteSection(section) {
            // TODO: modal ask admins confirm deleting section
            alert("删除操作将导致相关帖子标签失去意义")
            let data = {
                groupId: this.groupId,
                section: section
            }
            let that = this
            api.deleteGroupSection(data).then(res => {
                that.groupInfo.sections.splice(that.groupInfo.sections.indexOf(section), 1)
                that.$message({
                    type: 'success',
                    message: '删除成功'
                })
            }, err => {
                that.$message({
                    type: 'info',
                    message: '删除失败'
                })
            })

        },

        showSectionInput() {
            this.inputSectionVisible = true;
        },

        selectPanel(tab, event) {
            this.currentPanel = tab.name
        },

        confirmJoin(pendingMember) {
            let that = this
            let data = {
                gid: that.groupId,
                uid: pendingMember._id 
            }
            api.confirmJoinGroup(data).then(res => {
                that.groupInfo.members.push(pendingMember)
                that.groupInfo.pendingMembers = that.groupInfo.pendingMembers.filter((member) => {
                    member._id != pendingMember._id
                })
                that.$message({
                    type: 'success',
                    message: '该成员已通过审核'
                })
            }, err => {
                that.$message({
                    type: 'info',
                    message: '该成员审核失败'
                })
            })
        },

        handleSectionInputConfirm() {
            let inputSection = this.inputSection;
            let that = this
            // TODO: rename
            let data = {
                groupId: this.groupId,
                section: inputSection
            }
            if (inputSection) {
                api.newGroupSection(data).then(res => {
                    that.groupInfo.sections.push(inputSection);
                    that.$message({
                        type: 'success',
                        message: '添加成功'
                    })
                }, err => {
                    that.$message({
                        type: 'info',
                        message: '添加失败'
                    })
                })
            }
            this.inputSectionVisible = false;
            this.inputSection = '';
        },

        handleMemberSelectionChange(val) {
            this.multipleMemberSelection = val;
            console.log(val)
        },
        handlePendingMemberSelectionChange(val) {
            this.multiplePendingMemberSelection = val;
            console.log(val)
        }
    },
    mounted() {
        this.groupId = this.$route.params.gid
        let data = {
            id: this.groupId
        }
        let that = this
        api.getGroupInfo(data).then((res) => {
            that.groupInfo = res.data
        })
    }
}
</script>

<style lang="scss" scoped>
.group-admin {
  .el-row {
    margin-bottom: 20px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-section {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-section {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>