import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

if (process.env.NODE_ENV == 'development') {
  require('../mock/mock');
}

Vue.config.productionTip = false
Vue.prototype.$http = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
