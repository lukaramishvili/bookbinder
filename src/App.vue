<template>
    <div id="app">
        <PageEditor :page_id="page_id" />
    </div>
</template>

<script>
 import PageEditor from './components/PageEditor'
 
 export default {
     name: 'App',
     components: {
         PageEditor,
     },
     data(){
         return {
             page_id: 30,
         };
     }
 }
</script>

<style lang="scss">
 html, body { margin: 0; padding: 0; }
 #app {
     font-family: 'Avenir', Helvetica, Arial, sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
     text-align: center;
     color: #2c3e50;
 }
 @import "../node_modules/vue-wysiwyg/dist/vueWysiwyg.css";
</style>
