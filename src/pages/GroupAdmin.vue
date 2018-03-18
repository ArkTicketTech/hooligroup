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
                    <el-tag
                        v-for="section in groupInfo.sections"
                        :key="section"
                        closable
                        type="primary"
                        @close="deleteSection(section)">
                        {{section}}
                    </el-tag>
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
            inputSection: ''
        }
    },
    methods: {
        deleteSection(section) {
            // TODO: modal ask admins confirm deleting section
            alert("删除操作将导致相关帖子标签失去意义")
            this.groupInfo.sections.splice(this.groupInfo.sections.indexOf(section), 1);
        },

        showSectionInput() {
            this.inputSectionVisible = true;
        },

        handleSectionInputConfirm() {
            let inputSection = this.inputSection;
            if (inputSection) {
                this.groupInfo.sections.push(inputSection);
            }
            this.inputSectionVisible = false;
            this.inputSection = '';
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