<template>
  <pnc-base-table-page
    title="Users"
    tableTitle="Users"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    tableSortBy="username"
    tableMultiSort
    tableShowSelect
    :tableUpdateBody.sync="updateBody"
    createDialogTitle="New user"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Edit user"
    :editDialogShow.sync="showEditDialog"
    :editDialogDisabled="!updateBodyValid"
    @fabCreateClick="openCreate"
    @fabDeleteClick="askDeleteMultiple"
    @createDialogConfirm="closeCreate(true)"
    @createDialogCancel="closeCreate(false)"
    @editDialogConfirm="closeEdit(true)"
    @editDialogCancel="closeEdit(false)"
  >
    <template v-slot:createDialog>
      <pnc-user-create-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" :usersUsernames="usersUsernames" class="mt-6" />
    </template>
    <!-- <template v-slot:editDialog>
      <pnc-user-edit-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :usersUsernames="usersUsernames"
        :canChangePassword="isRoot"
        class="mt-6"
      />
    </template> -->
  </pnc-base-table-page>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { User, UsersCreateBody } from "@prebenorwegian/sdk";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import UserHandlerMixin from "@/mixins/handlers/UserHandlerMixin";

import PncBaseTablePage, { Column, Actions } from "@/components/gears/bases/PncBaseTablePage.vue";
import PncUserCreateForm from "@/components/gears/forms/PncUserCreateForm.vue";

@Component({
  components: {
    PncBaseTablePage,
    PncUserCreateForm
  },
})
export default class Users extends Mixins<ResourceManagerMixin<User, UsersCreateBody, any, string> & UserHandlerMixin>(
  ResourceManagerMixin,
  UserHandlerMixin
) {
  /* DATA */

  protected askDeleteText = "Are you sure that you want to delete this user?";
  protected askDeleteMultipleText = "Are you sure that you want to delete the selected users?";

  /* GETTERS AND SETTERS */

  get columns(): Column<User>[] {
    return [
      {
        text: "Username",
        value: "username",
        groupable: false,

        // editable: true,
        // onEditCancel: () => this.sprepareUpdateBody(),
        // onEditClose: () => {},
        // onEditSave: () => this.updateValue(),
        // onEditOpen: (item) => {
        //   this.prepareUpdateBody(item);
        // },
        // editInput: {
        //   type: "text",
        //   label: "Edit",
        //   hint: "Press enter to save",
        //   counter: true,
        //   rules: [this.$validator.requiredText("User"), this.$validator.unique(this.usersUsernames)],
        // },
      },

      {
        text: "Email",
        value: "email",
        groupable: false,

        // editable: true,
        // onEditCancel: () => this.sprepareUpdateBody(),
        // onEditClose: () => {},
        // onEditSave: () => this.updateValue(),
        // onEditOpen: (item) => {
        //   this.prepareUpdateBody(item);
        // },
        // editInput: {
        //   type: "email",
        //   label: "Edit",
        //   hint: "Click enter to save",
        //   counter: true,
        //   rules: [this.$validator.requiredText("Email"), this.$validator.email()],
        // },
      },
      {
        text: "Role",
        value: "role",
        groupable: true,
        filterable: false,

        // editable: true,
        // onEditCancel: () => this.sprepareUpdateBody(),
        // onEditClose: () => {},
        // onEditSave: () => this.updateValue(),
        // onEditOpen: (item) => {
        //   this.prepareUpdateBody(item);
        // },
        // editInput: {
        //   type: "select",
        //   label: "Edit",
        //   hint: "Click enter to save",
        //   rules: [this.$validator.requiredText("Role"), this.$validator.userRole()],
        //   items: this.$store.state.roles,
        // },
        // itemText: true,
        // itemIcon: true,
        // itemIconHandler: (value: UserRole | null) => (value) ?? "",
      },
      {
        text: "Creation date",
        value: "creationDate",
        groupable: false,
        filterable: false,

        editable: false,
        itemTextHandler: (value: string) => new Date(value).toLocaleString(),
      },
    ];
  }

  get usersUsernames(): string[] {
    return this.getUsersUsernames(this.values, this.backupValue);
  }

  get actions(): Actions<User> {
    return {
      // onEdit: (item) => this.openEdit(item),
      onDelete: (item) => this.askDelete(item),
    };
  }

  /* METHODS */

  getIdFromValue(value: User): string {
    return value.id;
  }

  async deleteHandler(uid: string, isMultiple: boolean): Promise<void> {
    await this.deleteUser(uid, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: UsersCreateBody): Promise<string> {
    return this.createUser(value);
  }

  // async updateHandler(uid: string, value: UsersHandlerUpdateBody, isTableEdit: boolean): Promise<void> {
  //   await this.updateUser(uid, value, this.backupValue?.role !== value.role, !!value.password, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  // }

  // updateBodyFromValue(value: User): UsersHandlerUpdateBody {
  //   return {
  //     uid: value.uid,
  //     nomeUser: value.nomeUser,
  //     email: value.email,
  //     role: value.role,
  //     password: "",
  //   };
  // }
  tupleValueFromCreateBody(id: string, body: UsersCreateBody): User {
    return {
      id,
      username: body.username,
      email: body.email,
      role: body.role,
      password: '', // TODO: fix this thing
      creationDate: new Date(),
    };
  }
  // tupleValueFromUpdateBody(uid: string, body: UsersHandlerUpdateBody, backupValue?: User): User {
  //   return {
  //     uid,
  //     nomeUser: body.nomeUser as string,
  //     email: body.email as string,
  //     role: body.role,
  //     dataCreazione: (backupValue as User).dataCreazione,
  //   };
  // }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getUsers();
  }
}
</script>