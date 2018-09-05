<template>
    <div id="bg">
        <div class="canvas-container" ref="canvasContainer"></div>
    </div>
</template>
<script>
import bgCanvas from '../lib/bg.js'
import arrow from '../assets/arrow.png'
export default {
    name: 'bg',
    mounted: function() {
        let canvas = this.$refs.canvasContainer
        bgCanvas(canvas,arrow)
    }
}

</script>
<style scoped>
#bg {
    width: 100%;
    height: 100%;
    position: relative;
}

canvas-container {
    width: 100%;
    height: 100%;
}

</style>
