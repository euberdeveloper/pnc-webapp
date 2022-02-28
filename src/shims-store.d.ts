import { Store } from '@/store';

// NOTE: to work you shall comment /node_modules/vuex/types/vue.d.ts (only the last declare)

declare module 'vue/types/vue' {
    import Vue from 'vue';

    interface Vue {
        $store: Store;
    }
}