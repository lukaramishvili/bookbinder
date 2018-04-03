<template>
    <div id="app">
        <PageEditor :page_id="page_id" :preview_mode="preview_mode" />
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
             preview_mode: this.getQueryParameter('preview_mode') == 'true',
             facial_features_url_encoded: this.getQueryParameter('facial_features'),
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
     },
     computed: {
         facial_features: function(){
             var ret = null;
             try {
                 ret = JSON.parse(decodeURIComponent(this.facial_features_url_encoded));
             } catch(e){
                 // &facial_features=urlencoded json.stringified {} was not passed or was formatted incorrectly
             }
             return ret;
         },
     },
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
