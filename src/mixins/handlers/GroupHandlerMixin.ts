
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, Group, GroupsCreateBody } from "@prebenorwegian/sdk";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class GroupHandlerMixin extends Vue {

  /* METHODS */

  async getGroups(id: string, alertType = AlertType.ERRORS_QUEUE): Promise<Group[]> {
    try {
      return await this.$api.courses.groups(id).getAll({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Error during groups loading`, alertType });
      }
      throw error;
    }
  }

  async createGroup(id: string, body: GroupsCreateBody, alertType = AlertType.ERROR_ALERT): Promise<string> {
    try {
      const uid = await this.$api.courses.groups(id).create(body, { alertType });
      return uid;
    } catch (error) {
      if (error) {
        if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Wrong provided data: ${error.message}`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Invalid request: ${error.message}`, alertType });
        }
      }
      throw error;
    }
  }

  async deleteGroup(id: string, uid: string, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.courses.groups(id).delete(uid, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Group with specified id not found: ${error.message}`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Group not found: ${error.message}`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Invalid request: ${error.message}`, alertType });
        }
      }
      throw error;
    }
  }

  getGroupsNames(values: Group[], backupValue: Group | null): string[] {
    const names = values.map((v) => v.name);
    return backupValue ? names.filter((value) => value !== backupValue.name) : names;
  }
}