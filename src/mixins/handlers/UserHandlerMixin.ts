
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, User, UsersCreateBody } from "pnc-sdk";

import { ActionTypes, AlertType } from "@/store";

@Component
export default class UtenteHandlerMixin extends Vue {

  /* METHODS */

  async getUsers(alertType = AlertType.ERRORS_QUEUE): Promise<User[]> {
    try {
      return await this.$api.users.getAll({ alertType });
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.ALERT, { message: `Error during users loading`, alertType });
      }
      throw error;
    }
  }

  async createUser(body: UsersCreateBody, alertType = AlertType.ERROR_ALERT): Promise<string> {
    try {
      const uid = await this.$api.users.create(body, { alertType });
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

  async deleteUser(uid: string, alertType = AlertType.ERROR_ALERT): Promise<void> {
    try {
      await this.$api.users.delete(uid, { alertType });
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `User with specified id not found: ${error.message}`, alertType });
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `User not found: ${error.message}`, alertType });
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.ALERT, { message: `Invalid request: ${error.message}`, alertType });
        }
      }
      throw error;
    }
  }

  getUsersUsernames(values: User[], backupValue: User | null): string[] {
    const tipi = values.map((t) => t.username);
    return backupValue ? tipi.filter((value) => value !== backupValue.username) : tipi;
  }
}