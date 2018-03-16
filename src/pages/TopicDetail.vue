<template lang="html">
    <el-container style="margin-top:26px;padding:24px;">
        <el-row style="width:100%;">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/group/'+groupId}">论坛</el-breadcrumb-item>
                        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="topic-content">
                    <el-row>
                        <span v-html="content"></span>
                    </el-row>
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
            content: '',
            title: '',
            groupId: ''
        }
    },
    methods: {
    },
    mounted() {
        this.groupId = this.$route.params.gid
        let data = {
            id: this.$route.params.tid
        }
        let that = this
        api.getTopicInfo(data).then((res) => {
            that.content = res.data.content;
            that.title = res.data.title;
        }, (err) => {
            console.log(err)
        })
    }
}
</script>

<style lang="scss" scoped>
.topic-content {
  .el-row {
    margin-bottom: 20px;
  }
}
</style>