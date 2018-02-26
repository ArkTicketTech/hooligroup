<template lang="html">
    <el-container style="margin-top:50px;">
        <el-row style="width:100%;">
            <el-col :lg="{span:12, offset:'6'}" :xs="24" :sm="24">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="你的名字">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="选择日期">
                        <el-date-picker type="date" placeholder="你将要离开学校的那天" v-model="form.date" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="选择日期">
                        <el-date-picker type="date" placeholder="你考完试的那天" v-model="form.exam" style="width: 100%;"></el-date-picker>
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
                date: '',
                exam: ''
            }
        }
    },
    methods: {
        onSubmit() {
            if (!this.form.name || !this.form.date) {
                alert("表单不能为空")
                return;
            }
            console.log(this.form.date)
            api.vote(this.form).then(res => {
                if (res.data.success) {
                    alert('提交成功')
                }
            })
        }
    }
}
</script>

<style lang="scss">

</style>