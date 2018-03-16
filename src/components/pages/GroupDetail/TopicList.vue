<template>
    <div>
        <div style="margin-bottom: 15px;">
            <el-button v-for="section in sections" v-bind:key="section" @click="selectSection(section)" :type="section === selectedSection ? 'primary' : ''" round>{{section}}</el-button>
            <el-button @click="toCreateTopic" style="float: right; margin-left: 5px;" type="primary">发帖</el-button>
        </div>
        <el-card v-for="topic in filteredTopics" v-bind:key="topic._id" class="box-card">
            <el-tag type="success">{{topic.section}}</el-tag>
            <a class="topic_title" :href="'/group/'+groupId+'/topic/' + topic._id">{{topic.title}}</a>
            <span style="float:right;">{{topic.created_at | formatDateDiff}}</span>
        </el-card>
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
            selectedSection: '全部'
        }
    },
    props: {
        isAdmin: {
            type: Boolean
        },
        sections: {
            type: Array
        },
        topics: {
            type: Array
        },
        groupId: {
            type: String
        }
    },
    mounted() {
        this.userId = localStorage.getItem('userid')
    },
    computed: {
        filteredTopics() {
            if (this.selectedSection === '全部')
                return this.topics;
            let topics = this.topics.filter((topic) => {
                return topic.section === this.selectedSection
            })
            return topics
        }
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
a.topic_title {
    color: #333;
    max-width: 70%;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    text-decoration: none;
}
a.topic_title:visited {
    color: #888;
}
</style>