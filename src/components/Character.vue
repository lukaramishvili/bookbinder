<template v-if="isLoaded">

    <div class="character">
        <template v-for="attr in character.attributes" v-bind="attr">
            <template v-if="attr.component_enable=='1'">
                <div class="character-attr">
                    <template v-for="opt in attr.options" v-bind="opt">
                        <template v-if="opt.option_enable=='1' && opt.option_default=='1'">
                            <div class="character-opt" :style="'background-image: url('+opt.option_image+')'"></div>
                        </template>
                    </template>
                </div>
            </template>
        </template>
    </div>

</template>

<script lang="js">
 export default  {
     name: 'Character',
     props: {
         characterId : {
             type: Number,
             required: true,
         },
     },
     mounted() {
         this.fetchData();
     },
     data() {
         return {
             isLoaded: false,
             character: {},
         }
     },
     methods: {
         fetchData(){
             var self = this;
             //fetch all characters
             fetch('http://bookulus.devv/api/character/'+this.characterId)
                 .then(function(response) {
                     return response.json();
                 })
                 .then(function(data) {
                     self.character = data;
                 });
         },
     },
     computed: {

     }
 }
</script>

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
 .character {
     position: relative;
     width: 100%; @include ratio(6, 7); /* @include size(100%); */
     &-attr {
         @include abs(0,0); @include size(100%);
     }
     &-opt {
         @include abs(0,0); @include size(100%); @include img();
     }
 }
</style>
