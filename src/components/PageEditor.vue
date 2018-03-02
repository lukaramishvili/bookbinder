<template>
    <div class="page-editor" :data-page-id="page.id">
        <template v-for="el in page.elements" v-bind="el">
            <vue-draggable-resizable :x="el.x" :y="el.y" :parent="true" :style="'border: 1px dashed gray; width: '+el.w+'px; height: '+el.h+'px; '" :drag-handle="'.drag-handle'">
                <div class="drag-handle">handle</div>
            </vue-draggable-resizable>
        </template>
    </div>
</template>

<script>
 // docs/examples: https://mauricius.github.io/vue-draggable-resizable/
 import VueDraggableResizable from '../../node_modules/vue-draggable-resizable/src/components/vue-draggable-resizable'
 
 export default {
     name: 'PageEditor',
     components: {
         VueDraggableResizable,
     },
     props: {
         page : {
             type: Object,
             required: true,
             /*validator: function (value) {
                return /^\d+$/.test(value);
                }*/
         }
     },
     data () {
         return {
             msg: 'Welcome to Your Vue.js App'
         }
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
