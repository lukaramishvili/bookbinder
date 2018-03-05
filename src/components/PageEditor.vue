<template>
    <div class="page-editor" :data-page-id="page.id" :style="'background-image: url('+page.scene_bg+');'">
        <div class="page-editor-actions">
            <select class="select-new-layer-type" v-model="newLayerType">
                <option value="text">ტექსტური</option>
                <option value="image">სურათი</option>
                <option value="character">პერსონაჟი</option>
            </select>
            <button type="button" class="add-btn" @click="addLayer(newLayerType)">დამატება</button>
            <button type="button" class="save-btn" @click="save()">დამახსოვრება</button>
        </div>
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
             newLayerType: 'text',//default selection
             page: {
                 id: 30,
                 page_number: 1,
                 scene_bg: 'http://localhost/bookulus/src/assets/p/pg_bg_30.png',
                 layers: [
                     this.genLayer('text'),
                     this.genLayer('image')
                 ],
             },
         };
     },
     methods: {
         zMin(){
             if(this && this.page){
                 return this.page.layers.reduce((zMin, l2) => Math.min(zMin, l2.z), 0);
             } else {
                 return 1;
             }
         },
         zMax(){
             if(this && this.page){
                 return this.page.layers.reduce((zMax, l2) => Math.max(zMax, l2.z), 0);
             } else {
                 return 1;
             }
         },
         zNewLayer(){
             return 1 + this.zMax();
         },
         genLayer(layerType){
             var cLayers = this && this.page ? this.page.layers.length : 0;
             return {
                 id: cLayers + 1, type: layerType, name: 'new1',
                 x: 50, y: 50, w:100, h:80, z: this.zNewLayer(), bg: Colors.hexRandom(),
                 textContent: '', imgSrc: '',
             };
         },
         addLayer(layerType){
             //this.$el, this.$parent, this._props, this._data
             this.page.layers.push(this.genLayer(layerType));
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
 @mixin abs($left, $top: $left){ position: absolute; left: $left; top: $top; }
 @mixin absr($right, $top: $right){ position: absolute; right: $right; top: $top; }
 @mixin absbl($bottom, $left: $bottom){ position: absolute; bottom: $bottom; left: $left; }
 @mixin absbr($bottom, $right: $bottom){ position: absolute; bottom: $bottom; right: $right; }
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
 /*  */
 * { box-sizing: border-box; }
 *::selection { background-color: rgba(#fff, 0.1); }
 .page-editor {
     position: relative; border: 1px dotted gray; margin-bottom: 30px;
     background-size: 100% 100%; background-position: left top;
     @include ratio(2.83);
     &-actions {
         @include abs(0, calc(100% + 5px)); width: 100%; text-align: center;
     }
 }
 .select-new-layer-type {
     
 }
 .add-btn {
 }
 .save-btn {
 }
</style>
