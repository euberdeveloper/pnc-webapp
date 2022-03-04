import { PncSDK } from '@prebenorwegian/sdk';
import { Validator } from '@/plugins/validator';

declare module 'vue/types/vue' {
    import Vue from 'vue';

    interface Vue {
        $api: PncSDK;
        $validator: Validator;
    }
}