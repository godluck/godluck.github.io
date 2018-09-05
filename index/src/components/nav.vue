<template>
    <nav id="navs">
        <ul>
            <li v-for="nav in navs" :key="nav.name">
                <a :href="nav.link">{{nav.name}}</a>
            </li>
        </ul>
    </nav>
</template>
<script>
export default {
    name: 'navs',
    data() {
        return {
            navs: [{
                link: '/',
                name: 'HOME PAGE'
            }]
        }
    }
}

</script>
<style scoped>
    #navs{
        position: absolute;
        width: 300px;
        height: 100%;
        left: 0;
        top:0;
        background-color: rgba(255,255,255,.5)
    }
    ul{
        list-style: none;
    }
</style>