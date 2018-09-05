<template>
    <div id="app">
        <bg/>
        <navs/>
        <div id="page">
            <router-view/>
        </div>
    </div>
</template>
<script>
import navs from './components/nav'
import bg from './components/bg'
export default {
    name: 'App',
    components: {
        navs,
        bg
    }
}

</script>
<style lang="scss">
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    position: relative;
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: PingFangSC-Regular, "Microsoft Yahei", Helvetica, Arial, "\5b8b\4f53", sans-serif;
        -webkit-tap-highlight-color: transparent;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        -webkit-overflow-scrolling: touch;
    }
}

#page {
    width: calc(100% - 300px);
    position: absolute;
    top: 0;
    right: 0;
}

input,
textarea {
    -webkit-user-select: text;
}

html {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow: auto;
}

body {
    width: 100%;
    height: 100%;
    font-size: initial;
    margin: 0 auto;
    overflow: auto;
}

img {
    border: none;
}

ul {
    list-style: none;
}

a {
    text-decoration: none;
    color: inherit;
}

</style>
