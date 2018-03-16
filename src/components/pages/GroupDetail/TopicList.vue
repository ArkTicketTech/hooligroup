<template>
    <div>
        <div style="margin-bottom: 15px;">
            <el-button @click="selectSection()" type="primary" round>全部</el-button>
            <el-button @click="selectSection()" type="" round>公告</el-button>
            <el-button @click="selectSection()" type="" round>水</el-button>
            <el-button @click="toCreateTopic" style="float: right; margin-left: 5px;" type="primary">发帖</el-button>
        </div>
        <div v-for="topic in topics" v-bind:key="topic._id" class="text item">
        </div>
    </div>
</template>

<script>
/**
 * @author: wfnuser
 */
import * as types from '../../../store/types'
import _ from 'lodash'
import api from '../../../axios'
import {
    Loading
} from 'element-ui';
export default {
    name: 'TopicList',
    data() {
        return {
            userId: '',
            topics: []
        }
    },
    props: {
        isAdmin: {
            type: Boolean
        }
    },
    mounted() {
        this.userId = localStorage.getItem('userid')
    },
    methods: {
        toCreateTopic() {
            let url = '/topic/create'
            this.$router.push({ path: url })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>