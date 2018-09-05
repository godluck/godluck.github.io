<template>
    <div id="index">
        <h1>{{title}}</h1>
    </div>
</template>
<script>
export default {
    name: 'index',
    data() {
        return {
            title: 'This is a title'
        }
    }
}

</script>
<style scoped>
#index {
    position: relative;
    width: 100%;
    height: 100%;
}
h1{
    margin: 0;
}
</style>
