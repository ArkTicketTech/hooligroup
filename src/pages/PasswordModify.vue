<template lang="html">
    <div @keyup.enter = "submitForm('newPasswordForm')" class="">
        <el-form :model="newPasswordForm" label-width="100px" ref="newPasswordForm">
            <el-form-item prop="oldpassword" label="原密码" :rules="rules.oldpassword">
                <el-input type="password" v-model="newPasswordForm.oldpassword"></el-input>
            </el-form-item>
            <el-form-item prop="newpassword" label="新密码" :rules="rules.newpassword">
                <el-input type="password" v-model="newPasswordForm.newpassword"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass" label="再次输入" :rules="rules.checkPass">
                <el-input type="password" v-model="newPasswordForm.checkPass"></el-input>
            </el-form-item>
            <el-button type="primary" style="float: right"@click="submitForm('newPasswordForm')">确认修改</el-button>
        </el-form>
    </div>
</template>

<script>
import * as types from '../store/types'
import api from '../axios'
export default {
    name: 'account',
    data() {
        // 密码安全性要求
        let validatePass1 = (rule, value, callback) => {
            // 6-16位, 数字, 字母, 字符至少包含两种, 同时不能包含中文和空格
            // TODO: move to common.js or util.js
            let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/;
            if (!reg.test(value)) {
                callback(new Error('密码长度需6-16位，且包含字母和字符'))
            } else {
                callback()
            }
        };
        // 监测两次密码是否相同
        let validatePass2 = (rule, value, callback) => {
            value === '' ? callback(new Error('请再次输入密码')) :
                value !== this.newPasswordForm.newpassword ? callback(new Error('两次输入密码不一致!')) :
                    callback()
        };
        return {
            newPasswordForm: {
                oldpassword: '',
                newpassword: '',
                checkPass: '',
            },
            rules: {
                oldpassword: [{
                    required: true,
                    message: '请输入原密码',
                    trigger: 'blur'
                }],
                newpassword: [{
                    required: true,
                    message: '请输入新密码',
                    trigger: 'blur'
                },
                {
                    validator: validatePass1,
                    trigger: 'blur'
                }
                ],
                checkPass: [{
                    required: true,
                    message: '请再次输入密码',
                    trigger: 'blur'
                },
                {
                    validator: validatePass2,
                    trigger: 'blur'
                }
                ]
            }
        }
    },
    methods: {
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let opt = this.newPasswordForm;
                    api.PasswordModify(opt).then(({
                            data
                        }) => {
                        if (data.success) {
                            this.$message({
                                type: 'success',
                                message: `修改成功，请登录`
                            })
                            //  修改密码成功后，成功跳转至登陆页面
                            this.$router.go(0)
                            this.$router.push('/login')
                        } else {
                            this.$message({
                                type: 'info',
                                message: '原密码错误'
                            })
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                } else {
                    console.log('Error Submit!!');
                    return false;
                }
            });
        }
    }
}
</script>

<style lang="css">

</style>