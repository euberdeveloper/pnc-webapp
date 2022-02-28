
import { Component, Vue } from "vue-property-decorator";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class VersionHandlerMixin extends Vue {

  /* METHODS */

  async getApiVersion(alertType = AlertType.ERRORS_QUEUE): Promise<string> {
    try {
      return await this.$api.version.get();
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Error in retrieving APIs version`, alertType });
      }
      throw error;
    }
  }

}