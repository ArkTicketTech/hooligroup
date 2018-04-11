<template lang="html">
    <div class="">
        <div style="text-align: center">
            <h3>个人中心</h3>
        </div>
        <el-row>
            <el-col :span="10" :offset="6">
                <el-tabs tab-position="left" style="height: 230px;" v-model="activeName" @tab-click="handleClick">
                    <!-- TODO: name is first and second? wtf -->
                    <!-- TODO: encrypt password in front end -->
                    <el-tab-pane label="基本信息" name="first">
                        <el-col @keyup.enter.native="submitForm('UpdateInfoForm')">
                            <el-form :model="UpdateInfoForm" label-width="100px" ref="UpdateInfoForm">
                                <el-form-item prop="name" label="真实姓名" :rules="rules.name">
                                    <el-input v-model="UpdateInfoForm.name"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-button type="primary" style="float:right" @click="submitForm('UpdateInfoForm')">确认修改</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="修改密码" name="second">
                        <UpdatePassword></UpdatePassword>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import UpdatePassword from '@/pages/UpdatePassword.vue'
import * as types from '../store/types'
import api from '../axios'
export default {
    // props order should be changed and unified
    name: 'account',
    data() {
        return {
            // camelCase or PascalCase
            username: '',
            UpdateInfoForm: {
                username: '',
                name: '',
                password: ''
            },
            activeName: this.$store.state.activeName,
            // 输入校验
            rules: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                name: [{
                    required: true,
                    message: '请输入真实姓名',
                    trigger: 'blur'
                }],
                password: {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }
            }
        }
    },
    components: {
        UpdatePassword
    },
    mounted() {
        this.username = localStorage.getItem('username')
    },
    methods: {
        handleClick(tab, event) {},
        // 重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 登录
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let opt = this.UpdateInfoForm;
                    api.UpdateUserInfo(opt).then(({
                        data
                    }) => {
                        if (!data.info) {
                            this.$message({
                                type: 'info',
                                message: '此账户已存在'
                            })
                        }
                        if (data.success) {
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            })
                        } else {
                            this.$message({
                                type: 'info',
                                message: '修改失败'
                            })
                        }
                    })
                } else {
                    return false;
                }
            });
        }
    }
}
</script>

<style lang="scss">

</style>
