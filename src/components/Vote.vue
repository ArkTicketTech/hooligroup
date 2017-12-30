<template lang="html">
    <el-container style="margin-top:50px;">
        <el-row style="width:100%;">
            <el-col :span="12" :offset="6">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="你的名字">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="选择日期">
                        <el-date-picker type="date" placeholder="你将要离开学校的那天" v-model="form.date" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">发布</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-container>
</template>

<script>
    import api from '../axios'

    export default {
        data() {
            return {
                form: {
                    name: '',
                    date: ''
                }
            }
        },
        methods: {
            onSubmit() {
                if (!this.form.name || !this.form.date) {
                    alert("表单不能为空")
                    return;
                }
                api.vote(this.form).then(data => {
                    if (data.success) {
                        alert('提交成功')
                    }
                })
            }
        }
    }
</script>

<style lang="scss">

</style>