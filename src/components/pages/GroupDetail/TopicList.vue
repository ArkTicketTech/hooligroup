<template>
    <div>
        <div style="margin-bottom: 15px;">
            <el-button v-for="section in sections" v-bind:key="section" @click="selectSection(section)"  :type="section === selectedSection ? 'primary' : ''" round>{{section}}</el-button>
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
            topics: [],
            selectedSection: '全部'
        }
    },
    props: {
        isAdmin: {
            type: Boolean
        },
        sections: {
            type: [String]
        }
    },
    mounted() {
        this.userId = localStorage.getItem('userid')
        this.sections = this.sections.unshift('全部')
    },
    methods: {
        toCreateTopic() {
            let url = '/topic/create'
            this.$router.push({ path: url })
        },
        selectSection(section) {
            this.selectedSection = section;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>