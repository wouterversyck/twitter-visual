import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import TwitterService from '@/core/services/twitter.service';

Vue.config.productionTip = false;

new Vue({
  router,
  provide: () => ({
    twitterService: new TwitterService()
  }),
  render: h => h(App)
}).$mount('#app');
