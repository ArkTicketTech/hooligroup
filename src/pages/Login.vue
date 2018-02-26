<template lang="html">
  <div class="">
    <el-row>
      <el-col :span="10" :offset="7">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户登录" name="first">
            <el-col @keyup.enter.native = "submitForm('dynamicValidateForm')">
              <el-form :model="dynamicValidateForm" label-width="100px" ref="dynamicValidateForm">
                    <el-form-item
                      prop="username"
                      label="用户名"
                      :rules="rules.username"
                    >
                      <el-input v-model="dynamicValidateForm.username"></el-input>
                    </el-form-item>
                    <el-form-item
                    prop="password"
                    label="密码"
                    :rules = "rules.password"
                    >
                      <el-input type="password" v-model="dynamicValidateForm.password"></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="submitForm('dynamicValidateForm')">登录</el-button>
                    <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
              </el-form>
            </el-col>
          </el-tab-pane>
          <el-tab-pane label="用户注册" name="second">
            <Register></Register>
          </el-tab-pane>
      </el-tabs>
    </el-col>
    </el-row>
  </div>
</template>

<script>
import Register from '@/pages/Register.vue'
import * as types from '../store/types'
import api from '../axios'
export default {
    name: 'login',
    data() {
        return {
            dynamicValidateForm: {
                username: '',
                password: ''
            },
            activeName: this.$store.state.activeName,
            // 输入校验
            rules: {
                username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }
                ],
                password: {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }
            }
        }
    },
    components: {
        Register
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
                    let opt = this.dynamicValidateForm;
                    api.UserLogin(opt).then(({
                        data
                    }) => {
                        if (!data.info) {
                            this.$message({
                                type: 'info',
                                message: '账号不存在'
                            })
                        }
                        if (data.success) {
                            this.$message({
                                type: 'success',
                                message: '登录成功'
                            })
                            this.$store.dispatch('UserLogin', data.token)
                            this.$store.dispatch('UserName', data.username)
                            this.$store.dispatch('UserId', data._id)
                            let redirect = decodeURIComponent(this.$route.query.redirect || '/');
                            this.$router.push({
                                path: redirect
                            })
                        } else {
                            this.$message({
                                type: 'info',
                                message: '密码错误'
                            })
                        }
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

<style lang="scss">
</style>
