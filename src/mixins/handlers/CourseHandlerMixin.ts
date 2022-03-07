
import { Component, Vue } from "vue-property-decorator";
import { Course, NotFoundError, Student } from "@prebenorwegian/sdk";

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

  async getCourse(id: string, alertType = AlertType.ERRORS_QUEUE): Promise<Course> {
    try {
      return await this.$api.courses.get(id, { alertType });
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Course not found: ${error.message}`, alertType });
      }
      throw error;
    }
  }

  async getCourseStudents(id: string, alertType = AlertType.ERRORS_QUEUE): Promise<Student[]> {
    try {
      return await this.$api.courses.getStudents(id, { alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Error during enrolled students loading`, alertType });
      }
      throw error;
    }
  }

}