import { Component, Vue } from "vue-property-decorator";
import clipboardCopy from "clipboard-copy";

import { ActionTypes } from "@/store";


@Component
export default class CopyMixin extends Vue {

  copyText(text: string): void {
    clipboardCopy(text);
    this.$store.dispatch(ActionTypes.SET_TOAST, { message: 'Text copied successfully', color: 'success' });
  }

}