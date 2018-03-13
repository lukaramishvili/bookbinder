<template v-if="isLoaded">
    <div class="page-editor" :data-page-id="page.id" :style="'background-image: url('+page.scene_bg+');'">
        <div class="page-editor-actions">
            <select class="select-new-layer-type" v-model="newLayerType">
                <option value="text">ტექსტური</option>
                <option value="image">სურათი</option>
                <option value="character">პერსონაჟი</option>
            </select>
            <select v-if="newLayerType == 'character'" :value="newCharacterId" @input="newCharacterId = parseInt($event.target.value);">
                <option value="">--- აირჩიეთ პერსონაჟი ---</option>
                <option v-for="char in allCharacters" v-bind="char" :value="char.post.ID">{{ char.post.post_title }}</option>
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
         //console.clear();
     },
     data() {
         //this._props.page_id
         return {
             isLoaded: false,
             newLayerType: 'text',//default selection
             newCharacterId: '',//selected
             allCharacters: [],
             page: {},
         };
     },
     mounted() {
         this.fetchData();
     },
     methods: {
         fetchData(){
             var self = this;
             //fetch all characters
             fetch('http://bookulus.devv/api/characters')
                 .then(function(response) {
                     return response.json();
                 })
                 .then(function(data) {
                     self.allCharacters = data;
                 });
             //fetch page data
             fetch('http://bookulus.devv/api/page/'+this.page_id)
                 .then(function(response) {
                     return response.json();
                 })
                 .then(function(data) {
                     self.page = data;
                     self.isLoaded = true;
                     console.log(data);
                 });
         },
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
         genLayer(id, layerType){
             var cLayers = this && this.page ? this.page.layers.length : 0;
             return {
                 id: id ? id : (cLayers + 1), type: layerType, name: 'new1',
                 x: Math.round(Math.random()*900), y: 50, w:180, h:130,
                 z: this.zNewLayer(), bg: Colors.hexRandom(),
                 characterId: null, textContent: '', imgSrc: '',
             };
         },
         addLayer(layerType){
             //this.$el, this.$parent, this._props, this._data
             if(layerType == 'character' && !this.newCharacterId){
                 alert('აირჩიე პერსონაჟი');
                 return;
             }
             var newLayer = this.genLayer(null, layerType);
             if(layerType == 'character'){
                 //character id was from selectbox, so it's guaranteed we'll find it
                 newLayer.characterId = this.newCharacterId;
                 //newLayer.character = this.allCharacters.filter(ac => ac.post.ID == this.newCharacterId)[0];
             }
             this.page.layers.push(newLayer);
         },
         removeLayer(layer){
             this.page.layers = this.page.layers.filter(l => l.id != layer.id);
         },
         arrangeLayer(layer, direction, moveFurthest){
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
