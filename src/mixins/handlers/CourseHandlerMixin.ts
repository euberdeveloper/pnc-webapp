
import { Component, Vue } from "vue-property-decorator";
import { Course } from "pnc-sdk";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class CourseHandlerMixin extends Vue {

  /* METHODS */

  async getCourses(alertType = AlertType.ERRORS_QUEUE): Promise<Course[]> {
    try {
      return await this.$api.courses.getAll({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Error during courses loading`, alertType });
      }
      throw error;
    }
  }

}