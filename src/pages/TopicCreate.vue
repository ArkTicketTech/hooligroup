<template lang="html">
    <el-container style="margin-top:26px;padding:24px;">
        <el-row style="width:100%;">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: from }">论坛</el-breadcrumb-item>
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
                <el-button type="primary" @click="createTopic()">提交</el-button>
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
            sections: [
                {
                    value: '灌水'
                },
                {
                    value: '公告'
                }
            ],
            title: '',
            selectedSection: '',
            from: ''
        }
    },
    components: {
        quillEditor
    },
    methods: {
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.from = from.path
        })
    },
    mounted() {
        this.editorOption.toolbar = this.toolbarOptions
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