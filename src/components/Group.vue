<template scope='scope'>
    <div class="group">
        <el-row :gutter="20">
            <el-col :span="6" v-for="(item, index) in groups" :key="item._id">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 36px;">{{item.name}}</span>
                        <el-button style="float: right;" type="primary">详情</el-button>
                    </div>
                    <div class="text item">
                        {{item.description}}
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
    import { Loading } from 'element-ui';
    export default {
        name: 'group',
        data() {
            return {
                msg: 'Welcome to Hooli Group',
                username: '',
                groups: {}
            }
        },
        mounted() {
            this.getGroups()
            this.username = localStorage.getItem('username')
        },
        methods: {
            getGroups() {
                let loadingInstance = Loading.service();
                api.getGroups().then((data) => {
                    this.groups = data.data;
                    loadingInstance.close();
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
            }
        }
    }
</script>

<style scoped>
    .text {
        font-size: 14px;
    }

    .item {
        padding: 18px 0;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>