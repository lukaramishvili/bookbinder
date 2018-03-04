<template>
    <div class="page-editor" :data-page-id="page_id">
        <button type="button" class="add-btn" @click="addLayer()">დამატება</button>
        <button type="button" class="save-btn" @click="save()">დამახსოვრება</button>
        <template v-for="l in page.layers" v-bind="l">
            <Layer :layer="l" @remove-layer="removeLayer(l)" @bring-front="arrangeLayer(l, ...arguments)"></Layer>
        </template>
    </div>
</template>

<script>
 import Layer from './Layer'
 import Colors from '../lib/Colors'
 
 export default {
     name: 'PageEditor',
     components: {
         Layer
     },
     props: {
         page_id : {
             type: Number,
             required: true,
             /* validator: function (value) {
                  return /^\d+$/.test(value);
                  }*/
         }
     },
     data() {
         return {
             page: {
                 id: 30,
                 page_number: 1,
                 layers: [
                     {
                         id: 1,
                         name: 'el1',
                         x: 100,
                         y: 30,
                         w: 80,
                         h: 70,
                         z: 1,
                         bg: Colors.hexRandom(),
                     },
                     {
                         id: 2,
                         name: 'el2',
                         x: 250,
                         y: 60,
                         w: 40,
                         h: 70,
                         z: 2,
                         bg: Colors.hexRandom(),
                     }
                 ],
             },
         };
     },
     methods: {
         zNewLayer(){
             return 1 + this.page.layers.reduce((zMax, l2) => Math.max(zMax, l2.z), 0);
         },
         genLayer(){
             return {
                 id: (new Date()).getTime(), name: 'new1', x: 0, y:0, w:100, h:80,
                 z: this.zNewLayer(), bg: Colors.hexRandom(),
             };
         },
         addLayer(e){
             //this.$el, this.$parent, this._props, this._data
             this.page.layers.push(this.genLayer());
         },
         removeLayer(layer){
             this.page.layers = this.page.layers.filter(l => l.id != layer.id);
         },
         arrangeLayer(layer, direction, moveFurthest){
             console.log(arguments);
         },
         save(){
             //ajax save
         }
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.page-editor {
    position: relative; height: 300px; border: 1px dotted gray; margin-bottom: 30px;
}
.add-btn {
    position: absolute; right: calc(50% + 5px); top: calc(100% + 5px);
}
.save-btn {
    position: absolute; left: calc(50% + 5px); top: calc(100% + 5px);
}
</style>
