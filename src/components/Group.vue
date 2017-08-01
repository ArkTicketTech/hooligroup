<template scope='scope'>
    <div class="group container">
        <div v-for="(item, index) in groups">
            <el-row>
                <h2>{{item.type}}</h2>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6" v-for="(each, index) in item.arr" :key="each._id">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span style="line-height: 36px;">{{each.name}}</span>
                            <el-button style="float: right;" type="primary">详情</el-button>
                        </div>
                        <div class="text item">
                            {{each.description}}
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
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
                //TODO: rewrite the code here, and use some config file
                this.groups = {};
                if (data.data.length > 0) {
                    data.data.forEach(function (element) {
                        if (this.groups.hasOwnProperty(element.type)) {
                            this.groups[element.type].arr.push(element);
                        } else {
                            this.groups[element.type] = {};
                            this.groups[element.type].type = element.type;
                            this.groups[element.type].arr = [];
                            this.groups[element.type].arr.push(element);
                        }
                    }, this);
                }
                loadingInstance.close();
            }, (err) => {
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

.container {
    padding: 24px;
}

.container h2 a,
.container h3 a,
.container h4 a,
.container h5 a {
    float: left;
    margin-left: -20px;
    opacity: 0;
    cursor: pointer;
}

.container h2,
.container h3,
.container h4,
.container h5 {
    float: left;
}

a {
    color: #4078c0;
    text-decoration: none;
}
</style>