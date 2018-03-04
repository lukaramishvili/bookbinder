<template>
    <vue-draggable-resizable :x="layer.x" :y="layer.y" :w="layer.w" :h="layer.h" :parent="true" :style="'border: 1px dashed gray; z-index: '+layer.z+'; background: '+layer.bg+'; color: '+invertColor(layer.bg)+';'" :drag-handle="'.drag-handle'" @resizing="onResize" @dragging="onDrag">
        <div class="drag-handle">
            <i class="fa fa-arrows-alt"></i>
        </div>
        <button type="button" class="info-btn" onclick="this.nextElementSibling.style.display = window.getComputedStyle(this.nextElementSibling).display === 'block' ? 'none' : 'block';">
            <i class="fa fa-info-circle"></i>
        </button>
        <div class="info">
            #{{layer.id}}
            <input v-model="layer.name" size="5" />
            order: {{layer.z}}
        </div>
        <button type="button" class="actions-btn" onclick="this.nextElementSibling.style.display = window.getComputedStyle(this.nextElementSibling).display === 'block' ? 'none' : 'block';">
            <i class="fa fa-pen-square"></i>
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
    </vue-draggable-resizable>
</template>

<script>
 // docs/examples: https://mauricius.github.io/vue-draggable-resizable/
 import VueDraggableResizable from '../../node_modules/vue-draggable-resizable/src/components/vue-draggable-resizable'
 import Colors from '../lib/Colors'
 
 export default {
     name: 'Layer',
     components: {
         VueDraggableResizable
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
<style scoped lang="scss">
 @mixin abs($left, $top: $left){ position: absolute; left: $left; top: $top; }
 @mixin absr($right, $top: $right){ position: absolute; right: $right; top: $top; }
 @mixin absbl($bottom, $left: $bottom){ position: absolute; bottom: $bottom; left: $left; }
 @mixin absbr($bottom, $right: $bottom){ position: absolute; bottom: $bottom; right: $right; }
 .draggable {
     &.dragging {
         .drag-handle {
             cursor: grabbing; cursor: -webkit-grabbing; cursor: -moz-grabbing;
         }
     }
 }
 .drag-handle {
     /* cursor: all-scroll; */
     cursor: grab; cursor: -webkit-grab; cursor: -moz-grab;
     @include absr(calc(100% + 2px), 0); color: gray;
 }
 .actions {
     &-btn { @include absbr(100%, 0); }
     @include absbr(100%, 20px); width: 80px; background: inherit; color: inherit;
     white-space: nowrap;
     display: none;
     button {
         -webkit-appearance: none; display: inline-block; border: 0; padding: 0;
         background: transparent; box-shadow: none; cursor: pointer;
         outline: none !important; color: inherit;
     }
 }
 .info {
     &-btn { @include abs(100%, 0); }
     @include abs(100%, 20px); width: 60px; background: inherit; color: inherit;
     display: none;
 }
</style>
