<template>
    <!-- +'background: '+layer.bg+'; color: '+invertColor(layer.bg)+';' -->
    <vue-draggable-resizable
        :x="layer.x" :y="layer.y" :w="layer.w" :h="layer.h" :parent="true"
        :class="(isEditing ? 'is-editing' : '')" :style="'z-index: '+layer.z+'; '"
        :drag-handle="'.drag-handle'" @resizing="onResize" @dragging="onDrag">
        <div class="drag-handle">
            <i class="fa fa-arrows-alt"></i>
        </div>
        <button type="button" class="info-btn" onclick="this.nextElementSibling.style.display = window.getComputedStyle(this.nextElementSibling).display === 'block' ? 'none' : 'block';">
            <i class="fa fa-info-circle"></i>
        </button>
        <div class="info">
            #{{layer.id}}
            <br>
            type: {{ layer.type }}
            <input v-model="layer.name" size="5" />
            order: {{layer.z}}
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
                <div v-html="layer.textContent"></div>
            </template>
            <template v-if="layer.type == 'image'">
                <img v-if="layer.imgSrc" :src="layer.imgSrc" />
            </template>
            <template v-else-if="layer.type == 'character'">
                <Character :character-id="layer.characterId"></Character>
            </template>
        </div>
        <div class="draggable-editor">
            <template v-if="layer.type == 'text'">
                <wysiwyg v-model="layer.textContent"></wysiwyg>
            </template>
            <template v-if="layer.type == 'image'">
                <input :id="'imgLayerUpload-'+layer.id" type="file" value="" style="display: none;" />
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



 
 export default {
     name: 'Layer',
     components: {
         VueDraggableResizable, Character,
     },
     props: {
         layer : {
             type: Object,
             required: true,
             /*validator: function (value) {
                return /^\d+$/.test(value);
                }*/
         }
     },
     data() {
         return {
             isEditing: false,
         };
     },
     methods: {
         invertColor(color){
             return Colors.invert(color, true);
         },
         updatePosSize(x,y,w,h){
             [this.layer.x, this.layer.y, this.layer.w, this.layer.h] = [x,y,w,h];
         },
         onDrag(x,y,w,h){
             this.updatePosSize(x,y,w,h);
         },
         onResize(x,y,w,h){
             //if the top/left resizer handles are moved, x and y also change
             this.updatePosSize(x,y,w,h);
         }
     }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
 /* need to be unscoped - .handle's are inside .vue-draggable */
 .draggable {
     /* handles are awkward when editing content */
     &.is-editing { .handle { visibility: hidden; } }
 }
</style>
<style scoped lang="scss">
 @mixin abs($left, $top: $left){ position: absolute; left: $left; top: $top; }
 @mixin absr($right, $top: $right){ position: absolute; right: $right; top: $top; }
 @mixin absbl($bottom, $left: $bottom){ position: absolute; bottom: $bottom; left: $left; }
 @mixin absbr($bottom, $right: $bottom){ position: absolute; bottom: $bottom; right: $right; }
 @mixin size($width, $height: $width) { width: $width; height: $height; }
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
         .editr {
             background-color: #fff;
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
     &-btn { @extend %extra-btn; @include abs(calc(100% + 1px), 0); }
     @include abs(calc(100% + 1px), 23px); width: 60px;
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
</style>
