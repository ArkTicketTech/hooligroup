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
                    社群管理
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
            groupId: ''
        }
    },
    methods: {
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
}
</style>