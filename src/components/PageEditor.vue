<template>
    <div class="page-editor" :data-page-id="page.id" :style="'background-image: url('+page.scene_bg+');'">
        <button type="button" class="add-btn" @click="addLayer()">დამატება</button>
        <button type="button" class="save-btn" @click="save()">დამახსოვრება</button>
        <template v-for="l in page.layers" v-bind="l">
            <Layer :layer="l" @remove-layer="removeLayer(l)" @arrange="arrangeLayer(l, ...arguments)"></Layer>
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
     beforeUpdate(){
         console.clear();
     },
     data() {
         //this._props.page_id
         return {
             page: {
                 id: 30,
                 page_number: 1,
                 scene_bg: 'http://localhost/bookulus/src/assets/p/pg_bg_30.png',
                 layers: [
                     {
                         id: 1,
                         name: 'el1',
                         x: 500,
                         y: 30,
                         w: 140,
                         h: 100,
                         z: 1,
                         bg: Colors.hexRandom(),
                     },
                     {
                         id: 2,
                         name: 'el2',
                         x: 750,
                         y: 60,
                         w: 200,
                         h: 120,
                         z: 2,
                         bg: Colors.hexRandom(),
                     }
                 ],
             },
         };
     },
     methods: {
         zMin(){ return this.page.layers.reduce((zMin, l2) => Math.min(zMin, l2.z), 0); },
         zMax(){ return this.page.layers.reduce((zMax, l2) => Math.max(zMax, l2.z), 0); },
         zNewLayer(){
             return 1 + this.zMax();
         },
         genLayer(){
             return {
                 id: this.page.layers.length + 1, name: 'new1', x: 50, y: 50, w:100, h:80,
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
         arrangeLayer(layer, direction, moveFurthest){console.log(layer.z);
             if(direction == 'up'){
                 layer.z = 1 + (moveFurthest ? this.zMax() : layer.z);
             } else {
                 layer.z = Math.max(1, -1 + (moveFurthest ? this.zMin() : layer.z));
             }
         },
         save(){
             //ajax save
         }
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 @mixin ratio($x: 1, $y: 1, $contentselector: ".nothing"){
     position: relative;
     &:before {
	 content: ""; display: block;
	 padding-top: percentage($y/$x);
	 pointer-events: none;
     }
     #{unquote($contentselector)} {
	 position: absolute; top: 0; left: 0; bottom: 0; right: 0;
     }
 }
 .page-editor {
     position: relative; border: 1px dotted gray; margin-bottom: 30px;
     background-size: 100% 100%; background-position: left top;
     @include ratio(2.83);
 }
.add-btn {
    position: absolute; right: calc(50% + 5px); top: calc(100% + 5px);
}
.save-btn {
    position: absolute; left: calc(50% + 5px); top: calc(100% + 5px);
}
</style>
