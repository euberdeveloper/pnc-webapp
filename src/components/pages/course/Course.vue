<template>
  <pnc-base-page :title="title" :backRoute="backRoute">
    <template v-slot:description v-if="course">
      <v-subheader class="px-0 mt-md-4 mb-md-0 mt-8 mb-4 text-subtitle-1" v-if="course.description">
        <b>Description:</b>
        <span class="ml-2">{{ course.description }}</span>
      </v-subheader>
    </template>

    <v-container fluid class="px-6">
      <v-row align="center" justify="center">
        <v-col cols="12">
          <h2>Groups:</h2>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12" class="d-flex align-center">
          <v-text-field
            class="flex-grow-1 flex-shrink-1"
            v-model="searchGroup"
            label="Search"
            dense
            solo
            outlined
            clearable
            hide-details
            prepend-inner-icon="mdi-magnify"
          />
          <v-btn class="ml-4" depressed color="primary" @click="openCreate">ADD</v-btn>
        </v-col>
      </v-row>
      <v-row align="start" justify="start">
        <v-col v-for="group of filteredGroups" :key="group.id" cols="12" sm="4">
          <group-card :group="group" @edit="openEdit(group)" @remove="remove(group)" />
        </v-col>
      </v-row>
    </v-container>

    <!-- CREATE DIALOG -->
    <pnc-action-dialog title="New group" v-model="showCreateDialog" :disabled="!createBodyValid" @cancel="closeCreate(false)" @confirm="closeCreate(true)">
      <pnc-group-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" :groupsNames="groupsNames" class="mt-6" />
    </pnc-action-dialog>
    <!-- EDIT DIALOG -->
    <pnc-action-dialog title="Edit group" v-model="showEditDialog" :disabled="!updateBodyValid" @cancel="closeEdit(false)" @confirm="closeEdit(true)">
      <pnc-group-form v-if="showEditDialog" v-model="updateBody" :formValid.sync="updateBodyValid" :groupsNames="groupsNames" class="mt-6" />
    </pnc-action-dialog>
  </pnc-base-page>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { Location } from "vue-router";
import { Course as CourseType, Group, GroupsCreateBody } from "@prebenorwegian/sdk";

import { ActionTypes } from "@/store";

import CourseHandlerMixin from "@/mixins/handlers/CourseHandlerMixin";
import GroupHandlerMixin from "@/mixins/handlers/GroupHandlerMixin";

import PncBasePage from "@/components/gears/bases/PncBasePage.vue";
import PncActionDialog from "@/components/gears/dialogs/PncActionDialog.vue";
import PncGroupForm from "@/components/gears/forms/PncGroupForm.vue";
import GroupCard from "./group-card/GroupCard.vue";
import { GroupsUpdateBody } from "@prebenorwegian/sdk/api";

@Component({
  components: {
    PncBasePage,
    PncActionDialog,
    PncGroupForm,
    GroupCard,
  },
})
export default class Course extends Mixins(CourseHandlerMixin, GroupHandlerMixin) {
  /* PROP */

  @Prop({ type: String, required: true })
  courseId!: string;

  /* DATA */

  private course: CourseType | null = null;
  private values: Group[] = [];
  private searchGroup = "";
  private backRoute: Location = { name: "dashboard-courses" };

  private showCreateDialog = false;
  private createBodyValid = false;
  private createLoading = false;
  private createBody: GroupsCreateBody | null = null;

  private backupValue: Group | null = null;
  private showEditDialog = false;
  private updateBodyValid = false;
  private updateBody: GroupsUpdateBody | null = null;
  private updateId: string | null = null;

  /* GETTERS */

  get title(): string {
    return this.course ? `Course - ${this.course.title}` : "Course";
  }

  get filteredGroups(): Group[] {
    return this.values.filter((group) => {
      return group.name.toLowerCase().includes(this.searchGroup.toLowerCase());
    });
  }

  get groupsNames(): string[] {
    return this.getGroupsNames(this.values, this.backupValue);
  }

  get createValid(): boolean {
    return this.createBodyValid && !this.createLoading;
  }

  /* METHODS */

  async remove(group: Group): Promise<void> {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Are you sure you want to remove the group "${group.name}"?`,
      callback: async (answer) => {
        if (answer) {
          await this.deleteGroup(group.courseId, group.id);
          this.values = this.values.filter((g) => g.id !== group.id);
        }
      },
    });
  }

  openCreate(): void {
    this.createBodyValid = false;
    this.showCreateDialog = true;
  }
  async closeCreate(save: boolean): Promise<void> {
    if (!save) {
      this.createBody = null;
      this.showCreateDialog = false;
      return;
    }

    if (this.createBodyValid && this.createBody) {
      try {
        this.createLoading = true;
        const id = await this.createGroup(this.courseId, this.createBody);
        this.values.push({
          id,
          courseId: this.courseId,
          name: this.createBody.name,
          description: this.createBody.description,
          maxPartecipants: this.createBody.maxPartecipants,
          partecipants: [],
          creationDate: new Date(),
        });

        this.createBody = null;
        this.showCreateDialog = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.createLoading = false;
      }
    }
  }

  reflectUpdate(id: string, updateBody: GroupsUpdateBody): void {
    const index = this.values.findIndex((v) => v.id === id);
      this.values.splice(index, 1, {
        id,
        courseId: this.courseId,
        name: updateBody.name,
        description: updateBody.description,
        maxPartecipants: updateBody.maxPartecipants,
        partecipants: this.backupValue?.partecipants ?? [],
        creationDate: this.backupValue?.creationDate ?? new Date()
      });
  }
  async prepareUpdateBody(value: Group): Promise<void> {
    this.backupValue = value;
    this.updateBody = {
      name: value.name,
      description: value.description,
      maxPartecipants: value.maxPartecipants,
    };
    this.updateId = value.id;
  }
  sprepareUpdateBody(): void {
    this.updateBody = null;
    this.updateId = null;
    this.backupValue = null;
  }
  async openEdit(value: Group): Promise<void> {
    await this.prepareUpdateBody(value);
    this.updateBodyValid = false;
    this.showEditDialog = true;
  }
  async closeEdit(save: boolean): Promise<void> {
    if (!save) {
      this.sprepareUpdateBody();
      this.showEditDialog = false;
      return;
    }

    if (this.updateBodyValid && this.updateBody && this.updateId) {
      await this.updateGroup(this.courseId, this.updateId, this.updateBody);
      this.reflectUpdate(this.updateId, this.updateBody);
      this.sprepareUpdateBody();
      this.showEditDialog = false;
    }
  }

  async updateValue(): Promise<void> {
    if (this.updateBody && this.updateId !== null) {
      const updateBody = this.updateBody;
      const updateId = this.updateId;

      try {
        await this.updateGroup(this.courseId, this.updateId, this.updateBody);
        this.reflectUpdate(updateId, updateBody);
      } catch (error) {
        console.error(error);
      }
    }
  }

  /* LIFE CYCLE */

  async created() {
    this.course = await this.getCourse(this.courseId);
    this.values = await this.getGroups(this.courseId);
  }
}
</script>