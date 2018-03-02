<template>
    <div id="app">
        <!-- <img src="./assets/logo.png"> -->
        <PageEditor :page="page" />
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
             page: {
                 id: 30,
                 elements: [
                     {
                         name: 'el1',
                         x: 100,
                         y: 30,
                         w: 80,
                         h: 70,
                     },
                     {
                         name: 'el2',
                         x: 250,
                         y: 60,
                         w: 40,
                         h: 70,
                     }
                 ],
             },
         };
     }
 }
</script>

<style lang="scss">
 #app {
     font-family: 'Avenir', Helvetica, Arial, sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
     text-align: center;
     color: #2c3e50;
     margin-top: 60px;
 }
</style>
