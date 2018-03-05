// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false




// now using vue-wysiwyg, very simplistic. trumbowyg and vue-froala-wysiwyg didn't work
import wysiwyg from "vue-wysiwyg";
Vue.use(wysiwyg, {}); // config is optional. more below




/* eslint-disable no-new */
new Vue({
  el: '#app',
    components: { App, wysiwyg },
  template: '<App/>'
})
