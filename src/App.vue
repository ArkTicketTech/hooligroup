<template>
    <div id="app" align="center">
        <img src="./assets/logo.png" class="logo" v-if="['login', 'register'].indexOf($route.name) > -1">
        <navigation v-if="['login', 'register'].indexOf($route.name) == -1"></navigation>
        <router-view></router-view>
    </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
export default {
    name: 'app',
    components: {
        Navigation
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

.logo {
    position: relative;
    margin-top: 40px;
    margin-bottom: 40px;
}
</style>
