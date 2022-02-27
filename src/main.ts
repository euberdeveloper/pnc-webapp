import Vue from 'vue'
import App from '@/App.vue'
import './registerServiceWorker'
import router from '@/router'
import store/*, { ActionTypes } */from '@/store'
// import VueGtag from "vue-gtag";
import vuetify from '@/plugins/vuetify';
// import '@/plugins/cropper';
// import api from '@/plugins/api';
// import '@/plugins/stored';
// import '@/plugins/validator';

// import CONFIG from '@/config';

async function main() {
  // if (CONFIG.GOOGLE_ANALYTICS_ID) {
  //   Vue.use(VueGtag, {
  //     config: { id: CONFIG.GOOGLE_ANALYTICS_ID }
  //   }, router);
  // }

  // await store.dispatch(ActionTypes.STARTUP);
  // api.errorHandler = (error) => {
  //   store.dispatch(ActionTypes.HANDLE_API_ERROR, error);
  // };

  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app');
}
main();

