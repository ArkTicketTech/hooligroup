<template lang="html">
    <el-container style="margin-top:26px;padding:24px;">
        <el-row style="width:100%;">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/group/'+groupId}">论坛</el-breadcrumb-item>
                        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-switch class="toggleButton" style="float: right;" v-model="onlyOwner" active-text="只看楼主"></el-switch>
                </div>
                <div class="topic-content">
                    <el-row>
                        <span v-html="content"></span>
                        <div class="bottom clearfix">
                            <el-tag size="mini">楼主</el-tag>
                            <time class="time">{{ this.user.username }}发表于{{ this.date  | formatDate }}</time>
                            <el-button type="text" @click="showCommentModal" v-if="isInGroup" class="button">回复</el-button>
                            <el-button type="text" @click="deleteTopic(id)" v-if="user._id === userId || isAdmin" class="button">删除</el-button>
                        </div>
                    </el-row>
                </div>
            </el-card>
            <div v-for="comment in filteredComments" v-bind:key="comment._id" class="topic-content">
                    <el-card class="box-card">
                        <el-row>
                            <span v-html="comment.content"></span>
                            <div class="bottom clearfix">
                                <el-tag size="mini" v-if="isOwner(comment.user)">楼主</el-tag>
                                <time class="time">{{ comment.user.username }}发表于{{ comment.created_at  | formatDate }}</time>
                                <el-button type="text" @click="deleteComment(comment._id)" v-if="comment.user._id === userId || isAdmin" class="button">删除</el-button>
                            </div>
                        </el-row>
                    </el-card>
            </div>
        </el-row>
        <el-dialog title="回复该帖" :visible.sync="commentModalVisible" width="65%">
            <div class="topic-editor">
                    <quillEditor class="quill-editor" 
                        v-model="newComment"
                        :options="editorOption">
                    </quillEditor>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="commentModalVisible = false">取 消</el-button>
                <el-button type="primary" @click="createComment">回复</el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
import api from '../axios'
import moment from 'moment'
import { quillEditor } from 'vue-quill-editor'
export default {
    data() {
        return {
            userId: '', //current user
            username: '',
            content: '',
            title: '',
            groupId: '',
            groupInfo: '',
            comments: '',
            date: '',
            user: '', // owner
            id: '', // topic id
            commentModalVisible: false,
            onlyOwner: false,
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
            newComment: ''
        }
    },
    computed: {
        filteredComments: function () {
            if (this.onlyOwner) {
                return this.comments.filter(comment => {
                    return comment.user._id === this.user._id
                })
            } else {
                return this.comments
            }
        },
        isInGroup: function () {
            if (this.groupInfo.members) {
                for (let i = 0; i < this.groupInfo.members.length; i++) {
                    if (this.groupInfo.members[i]._id === this.userId) {
                        return true;
                    }
                }
            }
            if (this.groupInfo.admins) {
                for (let i = 0; i < this.groupInfo.admins.length; i++) {
                    if (this.groupInfo.admins[i]._id === this.userId) {
                        return true;
                    }
                }
            }
            return false;
        },
        isAdmin: function () {
            if (this.groupInfo.admins) {
                for (let i = 0; i < this.groupInfo.admins.length; i++) {
                    if (this.groupInfo.admins[i]._id === this.userId) {
                        return true;
                    }
                }
            }
            return false;
        }
    },
    components: {
        quillEditor
    },
    filters: {
        formatDate: function (date) {
            if (typeof date === "number") {
                date = moment.unix(date)
            }
            return moment(String(date)).format('YYYY/MM/DD HH:mm')
        }
    },
    methods: {
        isOwner(user) {
            if (user._id === this.user._id) {
                return true
            } else {
                return false
            }
        },
        showCommentModal() {
            this.commentModalVisible = true
        },
        deleteTopic() {
            let data = {
                id: this.id
            }
            api.deleteTopic(data).then(res => {
                this.$message({
                    type: 'success',
                    message: '删帖成功'
                })
                let url = '/group/' + this.groupInfo._id
                this.$router.push({
                    path: url
                })
            }, err => {
                console.log(err)
                this.$message({
                    type: 'info',
                    message: '删帖失败'
                })
            })
        },
        deleteComment(commentId) {
            let data = {
                id: commentId
            }
            api.deleteComment(data).then(res => {
                this.$message({
                    type: 'success',
                    message: '删帖成功'
                })
                this.comments = this.comments.filter( comment => {
                    comment._id != commentId
                })
            }, err => {
                console.log(err)
                this.$message({
                    type: 'info',
                    message: '删帖失败'
                })
            })
        },
        createComment() {
            let data = {
                content: this.newComment,
                topic: this.id
            }
            let that = this
            api.createComment(data).then(res => {
                that.commentModalVisible = false;
                let newComment = {
                    user: {
                        _id: that.userId,
                        username: that.username
                    },
                    content: that.newComment,
                    created_at: Date.now() / 1000
                }
                that.comments.push(newComment);
                this.newComment = '';
                this.$message({
                    type: 'success',
                    message: '发帖成功'
                })
            }, (err) => {
                that.commentModalVisible = false;
                this.$message({
                    type: 'info',
                    message: '发帖失败'
                })
            })
        }
    },
    mounted() {
        this.userId = localStorage.getItem('userid')
        this.username = localStorage.getItem('username')
        this.editorOption.toolbar = this.toolbarOptions
        this.groupId = this.$route.params.gid
        let requestTopicData = {
            id: this.$route.params.tid
        }
        let requestGroupData = {
            id: this.$route.params.gid
        }
        let that = this
        api.getGroupInfo(requestGroupData).then(res => {
            that.groupInfo = res.data
        })
        api.getTopicInfo(requestTopicData).then((res) => {
            that.content = res.data.content;
            that.title = res.data.title;
            that.date = res.data.created_at;
            that.user = res.data.user;
            that.id = res.data._id;
            that.comments = res.data.comments;
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
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }

  .clearfix:after {
    clear: both;
  }
}

.topic-editor {
  .el-row {
    margin-bottom: 20px;
  }
}
.toggleButton {
  height: 0px;
}
</style>