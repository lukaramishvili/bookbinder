<template>
  <!-- +'background: '+layer.bg+'; color: '+invertColor(layer.bg)+';' -->
  <vue-draggable-resizable
    :x="this.$parent.horRelToAbs(layer.x)" :y="this.$parent.verRelToAbs(layer.y)" :w="this.$parent.horRelToAbs(layer.w)" :h="this.$parent.verRelToAbs(layer.h)" :parent="true"
    :class="(isEditing ? ' is-editing ' : '') + (isVisible ? '' : ' hidden ')" :style="'z-index: '+layer.z+'; '"
    :drag-handle="'.drag-handle'" @resizing="onResize" @dragging="onDragging"
    :key="rerenderKey">
    <div class="drag-handle">
      <i class="fa fa-arrows-alt"></i>
    </div>
    <button type="button" class="info-btn" onclick="this.nextElementSibling.style.display = window.getComputedStyle(this.nextElementSibling).display === 'block' ? 'none' : 'block';">
      <i class="fa fa-info-circle"></i>
    </button>
    <div class="info">
      #{{layer.id}}.
      ტიპი: {{ layer.type }}.
      სახელი: <input v-model="layer.name" size="5" />
      <br />
      თანმიმდ.: {{layer.z}}.
      სქესი:
      <select v-model="layer.gender">
        <option value="all" selected="selected">ყველა</option>
        <option value="boy">ბიჭი</option>
        <option value="girl">გოგო</option>
      </select>
      <br />
      კანის ფერი:
      <select v-model="layer.skin">
        <option value="all" selected="selected">ყველა</option>
        <option value="light">ღია</option>
        <option value="dark">მუქი</option>
      </select>
      <br />
      ფერი:
      <button type="button" class="toggle-colorpicker-btn" @click="isColorPickerVisible = !isColorPickerVisible" :style="'background-color: ' + layer.color + ';'"></button>
      <div class="colorpicker-wrapper" :style="isColorPickerVisible ? 'display: block' : 'display: none'">
        <!-- <photoshop-picker v-model="layer.color" class="colorpicker" /> -->
        <photoshop-picker :value="tempColor" class="colorpicker" @input="updateTempColor" @ok="okColorPicker" @cancel="cancelColorPicker" />
      </div>
      ფონტი:
      <input type="number" v-model="layer.fz" size="2" class="input-font-size" />
      <br />
      X:
      <input type="text" v-model="layer.x" size="2" class="input-percent" @change="rerenderKey = Math.random()" />%
      Y:
      <input type="text" v-model="layer.y" size="2" class="input-percent" @change="rerenderKey = Math.random()" />%
      <br />
      W:
      <input type="text" v-model="layer.w" size="2" class="input-percent" @change="rerenderKey = Math.random()" />%
      H:
      <input type="text" v-model="layer.h" size="2" class="input-percent" @change="rerenderKey = Math.random()" />%
    </div>
    <button type="button" class="actions-btn" onclick="this.nextElementSibling.style.display = window.getComputedStyle(this.nextElementSibling).display === 'block' ? 'none' : 'block';">
      <i class="fa fa-bars"></i>
    </button>
    <div class="actions" :style="'color: '+invertColor(layer.bg)+';'">
      <button type="button" @click="$emit('arrange', 'up', true)">
        <i class="fa fa-arrow-alt-circle-up"></i>
      </button>
      <button type="button" @click="$emit('arrange', 'up', false)">
        <i class="fa fa-arrow-up"></i>
      </button>
      <button type="button" @click="$emit('arrange', 'down', false)">
        <i class="fa fa-arrow-down"></i>
      </button>
      <button type="button" @click="$emit('arrange', 'down', true)">
        <i class="fa fa-arrow-alt-circle-down"></i>
      </button>
      <button type="button" @click="$emit('remove-layer')">
        <i class="fa fa-times-circle"></i>
      </button>
    </div>
    <button type="button" class="toggle-edit-mode-btn" @click="isEditing = !isEditing">
      <i class="fa fa-pen-square icon-default"></i>
      <i class="fa fa-times icon-editing"></i>
    </button>
    <!-- end of pos:abs action buttons; start content -->
    <div class="draggable-content">
      <template v-if="layer.type == 'text'">
        <div v-html="layer.textContent" :style="'color: ' + layer.color + ';' + 'font-size: '+(layer.fz/10)+'vw; '"></div>
      </template>
      <template v-if="layer.type == 'image'">
        <div v-if="layer.imgSrc" class="layer-img-preview" :style="'background-image: url('+layer.imgSrc+');'"></div>
        <div v-else class="layer-img-placeholder">Image here</div>
      </template>
      <template v-else-if="layer.type == 'character'">
        <Character :character-id="layer.characterId"></Character>
      </template>
    </div>
    <div class="draggable-editor">
      <template v-if="layer.type == 'text'">
        <wysiwyg v-model="layer.textContent" :style="'color: ' + layer.color + ';' + 'font-size: '+(layer.fz/10)+'vw; '"></wysiwyg>
      </template>
      <template v-if="layer.type == 'image'">
        <input :id="'imgLayerUpload-'+layer.id" type="file" @change="upload($event.target)" class="layer-upload-input" />
        <label class="layer-upload-label" :for="'imgLayerUpload-'+layer.id">Upload</label>
      </template>
      <template v-else-if="layer.type == 'character'">
        <!-- we don't need :editable <Character> here to change facial features -->
        <!-- <Character :character-id="layer.characterId"></Character> -->
        No edit parameters
      </template>
    </div>
  </vue-draggable-resizable>
</template>

<script>
 // docs/examples: https://mauricius.github.io/vue-draggable-resizable/
 import VueDraggableResizable from 'vue-draggable-resizable'
 import Character from './Character'
 import Colors from '../lib/Colors'
 import { Photoshop } from 'vue-color'



 export default {
     name: 'Layer',
     components: {
         VueDraggableResizable,
         Character,
         'photoshop-picker': Photoshop,
         /* 'material-picker': material,
          * 'compact-picker': compact,
          * 'swatches-picker': swatches,
          * 'slider-picker': slider,
          * 'sketch-picker': sketch,
          * 'chrome-picker': chrome,*/
     },
     props: {
         layer : {
             type: Object,
             required: true,
             /*validator: function (value) {
                return /^\d+$/.test(value);
                }*/
         },
     },
     data() {
         return {
             isEditing: false,
             isColorPickerVisible: false,
             tempColor: this.layer.color,
             rerenderKey: 1,
         };
     },
     methods: {
         invertColor(color){
             return Colors.invert(color, true);
         },
         updatePos(x,y){
             [this.layer.x, this.layer.y] = [
                 this.$parent.horAbsToRel(x),
                 this.$parent.verAbsToRel(y),
             ];
         },
         updateSize(w,h){
             [this.layer.w, this.layer.h] = [
                 this.$parent.horAbsToRel(w),
                 this.$parent.verAbsToRel(h),
             ];
         },
         updatePosSize(x,y,w,h){
             [this.layer.x, this.layer.y, this.layer.w, this.layer.h] = [
                 this.$parent.horAbsToRel(x),
                 this.$parent.verAbsToRel(y),
                 this.$parent.horAbsToRel(w),
                 this.$parent.verAbsToRel(h),
             ];
         },
         onDragging(x,y){
             this.updatePos(x,y);
         },
         onResize(x,y,w,h){
             //if the top/left resizer handles are moved, x and y also change
             this.updatePosSize(x,y,w,h);
         },
         updateTempColor(chosenColor){
             this.tempColor = chosenColor.hex;
         },
         okColorPicker(){
             this.layer.color = this.tempColor;
             this.isColorPickerVisible = !this.isColorPickerVisible;
         },
         cancelColorPicker(){
             //on cancel, reset the temp color to the last color
             this.tempColor = this.layer.color;
             this.isColorPickerVisible = !this.isColorPickerVisible;
         },
         upload(input){
             var self = this;
             if(input.files.length){
                 // TODO show loader
                 for(var iFile in input.files){
                     if(!isNaN(iFile)){//otherwise we'll get 'length' and 'file' as keys too
                         var file = input.files[iFile];
                         //to allow removing before submit, save uploads in a variable instead of directly appending to form data (that's done directly before submitting)
                         var uploadIndex = Math.round(Math.random()*10000000);
                         self.layer.tempUpload = {
                             index : uploadIndex,
                             //to allow multiple uploads, square brackets are needed
                             //just for reference, we won't be needing it here
                             input_name : 'layerupload-'+self.layer.id,//+'[]'
                             file : file,
                             file_name : file.name,
                         };
                         // add preview box
                         var reader = new FileReader();
                         reader.onload = function(e) {
                             var previewSrc = e.target.result;
                             self.layer.imgSrc = previewSrc;
                             //close edit form to show uploaded image
                             self.isEditing = false;
                         };
                         reader.readAsDataURL(file);
                     }
                 }
                 //clear file uploader value to allow uploading again(e.g. same file)
                 input.value = null;
             }
         },//upload()
     },
     computed: {
         isVisibleInPreview: function(){
             var previewGender = this.$parent.previewGender;
             var previewSkin = this.$parent.previewSkin;
             //show only when: empty gender value on layer (meaning non-gender-specific)
             var showByGender = !('gender' in this.layer)
                 || this.layer.gender == ''
             //selected all-gender value on layer
                 || this.layer.gender == 'all'
             //matching the preview gender
                 || this.layer.gender == previewGender;
             //show only when: empty skin value on layer (meaning non-skin-specific)
             var showBySkin = !('skin' in this.layer)
                 || this.layer.skin == ''
             //selected all-skin value on layer
                 || this.layer.skin == 'all'
             //matching the preview skin
                 || this.layer.skin == previewSkin;
             return showByGender && showBySkin;
         },
         isVisible: function(){
             return this.$parent.isPreviewModeOn ? this.isVisibleInPreview : true;
         },
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@font-face {
  font-family: "GARayuela-Bold";
  src: url("http://bookulus.ge/p/fonts/garayuela-bold/GARayuela-Bold.eot?#iefix") format("embedded-opentype"),  url("http://bookulus.ge/p/fonts/garayuela-bold/GARayuela-Bold.otf")  format("opentype"),
	     url("http://bookulus.ge/p/fonts/garayuela-bold/GARayuela-Bold.woff") format("woff"), url("http://bookulus.ge/p/fonts/garayuela-bold/GARayuela-Bold.ttf")  format("truetype"), url("http://bookulus.ge/p/fonts/garayuela-bold/GARayuela-Bold.svg#GARayuela-Bold") format("svg");
  font-weight: normal;
  font-style: normal;
}
.draggable-content > *, .editr { font-family: "GARayuela-Bold"; font-size: 2.4vw; }
 /* need to be unscoped - .handle's are inside .vue-draggable */
 .draggable {
     &.hidden { display: none !important; }
     /* handles are awkward when editing content */
     &.is-editing { .handle { visibility: hidden; } }
 }
 /* this code didn't work below, inside .draggable-content .editr &-.. */
 .editr {
     /* add 1px margin to avoid changing dimensions due to border */
     border-top: 0; margin-left: -1px; margin-right: -1px; width: calc(100% + 2px);
 }
 .editr--toolbar {
   position: absolute; left: 0; bottom: 100%;
   a {
     vertical-align: top;
     svg { vertical-align: top; }
   }
 }
 .editr--content {
     line-height: inherit; padding: 0px;
 }
</style>
<style scoped lang="scss">
 @mixin abs($left, $top: $left){ position: absolute; left: $left; top: $top; }
 @mixin absr($right, $top: $right){ position: absolute; right: $right; top: $top; }
 @mixin absbl($bottom, $left: $bottom){ position: absolute; bottom: $bottom; left: $left; }
 @mixin absbr($bottom, $right: $bottom){ position: absolute; bottom: $bottom; right: $right; }
 @mixin size($width, $height: $width) { width: $width; height: $height; }
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
 @mixin img($xRatio: 1, $yRatio: 1){
     @include ratio($xRatio, $yRatio, ".nothing");
     background-size: cover; background-position: center center; background-repeat: no-repeat;
 }
 @mixin img-contain($xRatio, $yRatio: $xRatio){
     @include img($xRatio, $yRatio); background-size: contain;
 }
 /*  */
 %reset-btn {
     -webkit-appearance: none; display: inline-block; border: 0; padding: 0;
     background: transparent; box-shadow: none; cursor: pointer;
     outline: none !important;
 }
 /* actions pencil/info buttons */
 %extra-btn {
     @extend %reset-btn; padding: 5px; background-color: #fff; line-height: 1;
     border-radius: 50%;
 }
 /*  */
 * { box-sizing: border-box; }
 *::selection { background-color: rgba(#fff, 0.05); }
 .draggable {
     border: 1px dashed gray; display: flex; justify-content: stretch; align-items: stretch;
     &-content {
         @include size(100%);
     }
     &-editor {
         width: 100%;
         .editr {
             /* background-color: #fff; */
         }
         display: none;
     }
     &.active {
         /* when the draggable is focused */
     }
     &:not(.is-editing){
         color: #fff;/* TODO use stub color before wysiwyg color picker is implemented */
     }
     &.is-editing {
         /* when the layer is being edited */
         /* background-color: #fff; */
         /* .handle-s are hidden but above in unscoped style block */
         .draggable-content { display: none; }
         .draggable-editor { display: block; }
     }
     &.dragging {
         .drag-handle {
             cursor: grabbing; cursor: -webkit-grabbing; cursor: -moz-grabbing;
         }
     }
 }
 .drag-handle {
     /* cursor: all-scroll; */
     cursor: grab; cursor: -webkit-grab; cursor: -moz-grab;
     @include absr(calc(100% + 2px), 0); color: #fff;
 }
 .layer {
     &-upload-input {
         display: none;
     }
     &-upload-label {
         color: #fff; cursor: pointer;
     }
     &-img-placeholder {
         color: #fff;
     }
     &-img-preview {
         @include abs(0); @include size(100%); @include img();
     }
 }
 .actions {
     &-btn { @extend %extra-btn; @include absbr(calc(100% + 1px), 0); }
     @include absbr(calc(100% + 1px), 22px); width: 80px;
     /* background: inherit; color: inherit; */ background: #fff; color: black;
     white-space: nowrap; border-radius: 2px;
     display: none;
     button {
         @extend %reset-btn; /* color: inherit; */ color: black;
     }
 }
 .info {
     padding: 5px; line-height: 2;
     &-btn { @extend %extra-btn; @include abs(calc(100% + 1px), 0); }
     @include abs(calc(100% + 1px), 23px); width: 200px;
     /* background: inherit; color: inherit; */ background: #fff; color: gray;
     font-size: 12px; border-radius: 2px;
     display: none;
 }
 .toggle-edit-mode-btn {
     @extend %extra-btn; @include absr(calc(100% + 1px), 25px);
     .icon-editing { display: none; }
     .draggable.is-editing & {
         .icon-default { display: none; }
         .icon-editing { display: inline-block; }
     }
 }
 .toggle-colorpicker-btn {
     -webkit-appearance: none; @include size(15px); padding: 0;
     border: 1px solid #d8d8d8;
 }
 .colorpicker-wrapper {
     position: relative;
 }
 .colorpicker {
     /* @include abs(0); */
     position: fixed; right: 15px; top: 15px; z-index: 1000;
 }
 .input-font-size {
     width: 50px;
 }
 .input-percent {
 width: 50px;
 }
</style>
