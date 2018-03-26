<template lang="html">
    <el-container style="margin-top:26px;padding:24px;">
        <el-row style="width:100%;">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/group/' + groupId }">论坛</el-breadcrumb-item>
                        <el-breadcrumb-item>发布话题</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="topic-editor">
                    <el-row>
                        <el-select v-model="selectedSection" placeholder="选择板块">
                            <el-option
                            v-for="section in sections"
                            :key="section.value"
                            :value="section.value">
                            </el-option>
                        </el-select>
                    </el-row>
                    <el-row>
                        <el-input v-model="title" placeholder="请输入标题"></el-input>
                    </el-row>
                    <el-row>
                        <quillEditor class="quill-editor" 
                            v-model="content"
                            :options="editorOption">
                        </quillEditor>
                    </el-row>
                </div>
                <el-button type="primary" @click="updateTopic()">提交</el-button>
            </el-card>
        </el-row>
    </el-container>
</template>

<script>
import api from '../axios'
import { quillEditor } from 'vue-quill-editor'

export default {
    data() {
        return {
            content: '',
            groupId: '',
            editorOption: {
                placeholder: '您想说点什么？',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        // [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        [{ 'font': [] }],
                        [{ 'align': [] }],
                    ]
                }
            },
            sections: [],
            title: '',
            selectedSection: '',
            from: '',
            content: '',
            title: '',
            groupInfo: '',
            comments: '',
            date: '',
            user: '', // owner
        }
    },
    components: {
        quillEditor
    },
    methods: {
        updateTopic() {
            let data = {
                content: this.content,
                title: this.title,
                section: this.selectedSection,
                group: this.groupId,
                topic: this.topicId
            }
            let that = this
            api.updateTopic(data).then(res => {
                this.$message({
                    type: 'success',
                    message: '编辑成功'
                })
                // TODO: redirect to topic detail page
                let url = '/group/' + that.groupId;
                that.$router.push({ path: url })
            }, (err) => {
                this.$message({
                    type: 'info',
                    message: '编辑失败'
                })
            })
        }
    },
    mounted() {
        let that = this
        this.groupId = this.$route.params.gid
        this.topicId = this.$route.params.tid
        this.editorOption.toolbar = this.toolbarOptions
        let requestTopicData = {
            id: this.$route.params.tid
        }
        let requestGroupData = {
            id: this.$route.params.gid
        }
        api.getGroupSections(requestGroupData).then(res => {
            res.data.forEach(section => {
                that.sections.push({
                    value: section
                })
            });
        }, err => {
            console.log(err)
        })
        api.getGroupInfo(requestGroupData).then(res => {
            that.groupInfo = res.data
        })
        api.getTopicInfo(requestTopicData).then((res) => {
            that.content = res.data.content;
            that.title = res.data.title;
            that.date = res.data.created_at;
            that.user = res.data.user;
            that.comments = res.data.comments;
            that.selectedSection = res.data.section
        }, (err) => {
            console.log(err)
        })
    }
}
</script>

<style lang="scss" scoped>
.topic-editor {
  .el-row {
    margin-bottom: 20px;
  }
}
</style>