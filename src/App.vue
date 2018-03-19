<template>
    <div id="app">
        <PageEditor :page_id="page_id" />
    </div>
</template>

<script>
 import PageEditor from './components/PageEditor'
 import Vue from 'vue'

 if(document.location.host.indexOf('localhost') > -1){
     Vue.prototype.$apiBaseUrl = 'http://bookulus.devv/api';
 } else {
     Vue.prototype.$apiBaseUrl = document.location.protocol + '//' + document.location.host + '/api';
 }
 
 export default {
     name: 'App',
     components: {
         PageEditor,
     },
     data(){
         return {
             page_id: parseInt(this.getQueryParameter('page_id')),
         };
     },
     methods: {
         getQueryParameter(name, url){
             if (!url) url = window.location.href;
             name = name.replace(/[\[\]]/g, "\\$&");
             var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                 results = regex.exec(url);
             if (!results) return null;
             if (!results[2]) return '';
             return decodeURIComponent(results[2].replace(/\+/g, " "));
         }
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
