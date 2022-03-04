import Vue from 'vue';
import { PncSDK } from "@prebenorwegian/sdk";

import CONFIG from '@/config';

const api = new PncSDK(CONFIG.API_URL, null, null, {
    withCredentials: CONFIG.AXIOS_WITH_CREDENTIALS,
    timeout: CONFIG.AXIOS_TIMEOUT,
    timeoutErrorMessage: 'The server is taking too much time, request aborted. Note that this affects just the frontend side, the server could be still working.'
});

const apiPlugin = {
    install: function (vue: typeof Vue) {
        vue.prototype.$api = api;
    }
}

Vue.use(apiPlugin);

export default api;