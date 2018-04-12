<template v-if="isLoaded">
  <!-- if we point data-preview-mode to the boolean preview_mode without .toString(), it will omit the data-preview-mode attribute entirely when preview_mode is false -->
  <div class="page-editor" :data-page-id="page.id" :data-preview-mode="preview_mode.toString()" :style="'background-image: url('+page.scene_bg+');'">
    <div class="page-editor-actions">
      <div style="float:left; font-size: 12px;">
        ბიჭი/გოგო
        <select class="select-preview-gender" v-model="previewGender">
          <option value="none" selected="selected">ყველა</option>
          <option value="boy">ბიჭი</option>
          <option value="girl">გოგო</option>
        </select>
      </div>
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
      <button type="button" class="save-btn" @click="toggleFullscreen()">
        <i class="fa fa-compress fs-collapse-btn"></i>
        <i class="fa fa-expand fs-expand-btn"></i>
        <template v-if="isFullscreen">დახურვა</template>
        <template v-else>მთელ ეკრანზე</template>
      </button>
    </div>
    <template v-if="showLayers">
      <template v-for="(l, indexL) in page.layers" v-bind="l">
        <Layer :layer="l" @remove-layer="removeLayer(indexL)" @arrange="arrangeLayer(l, ...arguments)"></Layer>
      </template>
    </template>
  </div>
</template>

<script>
 import Layer from './Layer'
 import Colors from '../lib/Colors'
 import fullscreen from 'vue-fullscreen'
 import Vue from 'vue'
 Vue.use(fullscreen)
 
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
         },
         preview_mode : {
             type: Boolean,
             required: true,
             /* validator: function (value) {
                return /^\d+$/.test(value);
                }*/
         },
     },
     beforeUpdate(){
         //console.clear();
     },
     data() {
         //this._props.page_id
         return {
             isLoaded: false,
             isFullscreen: false,
             showLayers: true,//for redrawing
             newLayerType: 'text',//default selection
             previewGender: 'none',
             newCharacterId: '',//selected
             allCharacters: [],
             page: {},
         };
     },
     mounted() {
         this.fetchData();
         this.fixFullscreenIcons();
         window.addEventListener('resize', this.onResize);
     },
     methods: {
         fetchData(){
             var self = this;
             //fetch all characters
             fetch(self.$apiBaseUrl + '/characters')
                 .then(function(response) {
                     return response.json();
                 })
                 .then(function(data) {
                     self.allCharacters = data;
                 });
             //fetch page data
             fetch(self.$apiBaseUrl + '/page/'+this.page_id)
                 .then(function(response) {
                     return response.json();
                 })
                 .then(function(data) {
                     self.page = data;
                     self.isLoaded = true;
                     console.log('JSON data from server: ', data);
                 });
         },
         fixFullscreenIcons(){
             //vue v-if/v-else or :class= or :style= attributes didn't work on .fa icons
             if(this.isFullscreen){
                 this.$el.querySelector('.fs-expand-btn').style.display = 'none';
                 this.$el.querySelector('.fs-collapse-btn').style.display = 'inline-block';
             } else {
                 this.$el.querySelector('.fs-expand-btn').style.display = 'inline-block';
                 this.$el.querySelector('.fs-collapse-btn').style.display = 'none';
             }
         },
         fullscreenChangeCallback(){
             this.isFullscreen = !this.isFullscreen;
             //fontawesome has a problem, so force-fix them
             this.fixFullscreenIcons();
             //relative positions are not updating, so force it
             setTimeout(()=> { this.redrawLayers(); }, 50);
         },
         toggleFullscreen(){
             //this.$el already is .page-editor
             this.$fullscreen.toggle(this.$el, {
                 wrap: false,
                 callback: this.fullscreenChangeCallback
             });
         },
         onResize(){
             setTimeout(()=> { this.redrawLayers(); }, 50);
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
             var areLayers = this && this.page && this.page.layers && this.page.layers.length;
             var maxLayerId = areLayers ? Math.max(...this.page.layers.map((l)=>l.id)) : 0;
             return {
                 id: id ? id : (maxLayerId + 1), type: layerType, name: 'new1',
                 x: Math.round(Math.random()*70), y: Math.round(Math.random()*30),
                 w:180, h:130,
                 z: this.zNewLayer(), bg: Colors.hexRandom(), color: '#ffffff',
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
         removeLayer(indexL){
             this.page.layers.splice(indexL, 1);
             //splice makes layers with their index>indexL listen to wrong layers because the indices have been changed
             this.redrawLayers();
         },
         redrawLayers(){
             var self = this;
             self.showLayers = false;
             setTimeout(function(){
                 self.showLayers = true;
             }, 0);
         },
         arrangeLayer(layer, direction, moveFurthest){
             var zCur = layer.z;
             var zDest;
             if(direction == 'up'){
                 //move this layer 1 level up
                 zDest = 1 + (moveFurthest ? this.zMax() : layer.z);
             } else {
                 //move this layer 1 level down
                 zDest = Math.max(1, -1 + (moveFurthest ? this.zMin() : layer.z));
             }
             //if a layer already exists on this z position, swap z-indices
             this.page.layers
                 .filter(l => l.z == zDest)
                 .map(l => { l.z = zCur; });
             //move the current layer itself
             layer.z = zDest;
         },
         getWorkingAreaWidth(){
             return document.querySelector('.page-editor').offsetWidth;
         },
         getWorkingAreaHeight(){
             return document.querySelector('.page-editor').offsetHeight;
         },
         //translates absolute pixel x,w to percents for correct page editor scaling
         //xRel/etc are relative percents here (e.g. 50 means x=50%)
         horRelToAbs(horDimRel){ return horDimRel*this.getWorkingAreaWidth()/100; },
         verRelToAbs(verDimRel){ return verDimRel*this.getWorkingAreaHeight()/100; },
         //the reverse
         horAbsToRel(horDimAbs){ return 100*horDimAbs/this.getWorkingAreaWidth(); },
         verAbsToRel(verDimAbs){ return 100*verDimAbs/this.getWorkingAreaHeight(); },
         save(){
             var self = this;
             //ajax save page layout
             var formData = new FormData();
             //gather layer data
             var page_layout = JSON.stringify(this.page.layers);
             // TEST layer data
             /* [
                {
                'id' : 1, 'type' : 'text', 'name' : 'layer1',
                'x' : 400, 'y' : 80, 'w' : 210, 'h' : 130,
                'z' : 1, 'bg' : '#00ccff',
                'textContent' : '', 'imgSrc' : '',
                },
                {
                'id' : 2, 'type' : 'image', 'name' : 'layer1',
                'x' : 800, 'y' : 60, 'w' : 200, 'h' : 160,
                'z' : 2, 'bg' : '#ff0000',
                'textContent' : '', 'imgSrc' : '',
                },
                ] */
             //
             //add each layer image as separate upload and clear upload temp data
             //straightforward base64 imgSrc saving was working, but felt very wrong
             var submit_page_layout = this.page.layers.map((l_orig) => {
                 var l_to_submit = JSON.parse(JSON.stringify(l_orig));
                 if(l_orig.tempUpload){
                     formData.append('layer_upload_'+l_orig.tempUpload.index, l_orig.tempUpload.file);
                     //forEach passes by reference, so we can mutate arguments
                     //clear imgSrc, so that base64 image is not submitted
                     l_to_submit.imgSrc = '';
                     //it's already appended to formData, so we can safely delete it
                     //we're clearing tempUpload's file contents but leaving other upload info for the upload script (index, file name, etc). the upload php code will delete it
                     delete l_to_submit.tempUpload.file;
                 }
                 l_to_submit.textContent = l_to_submit.textContent.replace(new RegExp('"', 'gi'), '\\"');
                 return l_to_submit;
             });
             //directly appending to formData results in [object Object]
             //turns out the reason for json_decode=>NULL was excess slashes (\" vs ")
             // which were added by WORDPRESS!!!!!!111 spent hours on this, used hex2bin, stripcslashes, iconv, convert_encoding, utf8_, everything
             formData.append('page_layout', JSON.stringify(submit_page_layout));
             //
             fetch(self.$apiBaseUrl + '/page/'+this.page_id, {
                 method:'POST',
                 body:formData,
             }).then(function(response) {
                 return response.json();
             }).then(function(data) {
                 if(data.success){
                     alert('გვერდი შენახულია.');
                     //the page sends back the saved layers data so that the page editor can update the data without refreshing
                     self.page.layers = data.page_layout;
                 } else {
                     alert('მოხდა შეცდომა. ' + data.message);
                 }
                 console.log('Save success', data);
             }).catch(function(e) {
                 console.log('Save Error', e);
             });
         }//end save()
     },
     computed: {
         isPreviewModeOn: function(){
             return !(this.previewGender == 'none' || this.previewGender == 'all');
         },
     }
 }
</script>

<!-- this style is not scoped to allow styling everything -->
<style lang="scss">
/* when edit mode is turned off, hide editor elements */
%hidden {
  /* on .page-editor, display: none causes weird Invalid prop validation errors */
  display: none !important; pointer-events: none !important;
}
  .page-editor[data-preview-mode="true"] {
    margin: 0 !important;
    .page-editor-actions,
    .drag-handle,
    .draggable .handle,
    .info-btn,
    .actions-btn,
    .toggle-edit-mode-btn {
      @extend %hidden;
    }
    .draggable { border: 0; }
  }
</style>
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
     width: 100%;
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
