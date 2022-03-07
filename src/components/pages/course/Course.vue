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
          <h2>Enrolled students:</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <pnc-base-table title="Students" :values="filteredEnrolledStudents" :columns="columns" :rowBackgrounds="rowBackgrounds" :actions="actions" />
        </v-col>
      </v-row>
    </v-container>

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
      <v-row align="stretch" justify="start">
        <v-col v-for="(group, index) of filteredGroups" :key="group.id" cols="12" sm="4">
          <group-card
            style="height: 100%"
            :group="group"
            :selected="index === selectedGroupIndex"
            @edit="openEdit(group)"
            @remove="remove(group)"
            @toggle="toggle(index)"
          />
        </v-col>
      </v-row>
    </v-container>

    <!-- CREATE DIALOG -->
    <pnc-action-dialog title="New group" v-model="showCreateDialog" :disabled="!createValid" @cancel="closeCreate(false)" @confirm="closeCreate(true)">
      <pnc-group-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" :groupsNames="groupsNames" class="mt-6" />
    </pnc-action-dialog>
    <!-- EDIT DIALOG -->
    <pnc-action-dialog title="Edit group" v-model="showEditDialog" :disabled="!updateValid" @cancel="closeEdit(false)" @confirm="closeEdit(true)">
      <pnc-group-form v-if="showEditDialog" v-model="updateBody" :formValid.sync="updateBodyValid" :groupsNames="groupsNames" class="mt-6" />
    </pnc-action-dialog>
    <!-- ENROLL DIALOG -->
    <pnc-action-dialog title="Enroll student" v-model="showEnrollDialog" :disabled="!enrollValid" @cancel="closeEnroll(false)" @confirm="closeEnroll(true)">
      <v-select
        label="Group"
        name="groupIdToEnroll"
        clearable
        item-text="name"
        item-value="id"
        :items="values"
        :rules="[$validator.requiredText('Group')]"
        v-model="groupIdToEnroll"
      />
    </pnc-action-dialog>
  </pnc-base-page>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { Location } from "vue-router";
import { Course as CourseType, Group, GroupsCreateBody, GroupsUpdateBody, Student, WeekSchedule } from "@prebenorwegian/sdk";

import { ActionTypes } from "@/store";

import CourseHandlerMixin from "@/mixins/handlers/CourseHandlerMixin";
import GroupHandlerMixin from "@/mixins/handlers/GroupHandlerMixin";

import PncBasePage from "@/components/gears/bases/PncBasePage.vue";
import PncBaseTable, { Actions, Column, RowColors } from "@/components/gears/bases/PncBaseTable.vue";
import PncActionDialog from "@/components/gears/dialogs/PncActionDialog.vue";
import PncGroupForm from "@/components/gears/forms/PncGroupForm.vue";
import GroupCard from "./group-card/GroupCard.vue";

type GroupsUpdateBodyStrict = Required<GroupsUpdateBody> & { weekSchedule: WeekSchedule };

interface HandledStudent {
  id: string;
  username: string;
  email: string;
  group: Group | null;
}

@Component({
  components: {
    PncBasePage,
    PncBaseTable,
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
  private selectedGroupIndex: number | null = null;
  private searchGroup = "";
  private backRoute: Location = { name: "dashboard-courses" };

  private enrolledStudents: Student[] = [];
  private columns: Column[] = [
    {
      text: "ID",
      value: "id",
    },
    {
      text: "Username",
      value: "username",
    },
    {
      text: "Email",
      value: "email",
    },
    {
      text: "Group",
      value: "group.name",
      itemTextHandler: (value: string | null) => value ?? "None",
    },
  ];
  private actions: Actions = {
    others: [
      {
        title: "Enroll",
        icon: "mdi-account-plus",
        color: "blue",
        action: (student: HandledStudent) => this.openEnroll(student),
        showAction: (student: HandledStudent) => student.group === null,
      },
      {
        title: "Unenroll",
        icon: "mdi-account-cancel",
        color: "red",
        action: (student: HandledStudent) => this.askUnenroll(student),
        showAction: (student: HandledStudent) => student.group !== null,
      },
    ],
  };

  private showEnrollDialog = false;
  private enrollLoading = false;
  private groupIdToEnroll: string | null = null;
  private studentToEnroll: HandledStudent | null = null;

  private showCreateDialog = false;
  private createBodyValid = false;
  private createLoading = false;
  private createBody: GroupsCreateBody | null = null;

  private backupValue: Group | null = null;
  private showEditDialog = false;
  private updateBodyValid = false;
  private updateBody: GroupsUpdateBodyStrict | null = null;
  private updateLoading = false;
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

  get updateValid(): boolean {
    return this.updateBodyValid && !this.updateLoading;
  }

  get enrollValid(): boolean {
    return this.enrollBodyValid && !this.enrollLoading;
  }

  get handledEnrolledStudents(): HandledStudent[] {
    return this.enrolledStudents.map((student) => ({
      id: student.id,
      username: student.username,
      email: student.email,
      group: this.values.find((group) => group.partecipants.includes(student.id)) ?? null,
    }));
  }

  get filteredEnrolledStudents(): HandledStudent[] {
    return this.handledEnrolledStudents.filter((student) => this.selectedGroup === null || student.group?.id === this.selectedGroup.id);
  }

  get selectedGroup(): Group | null {
    return this.selectedGroupIndex !== null ? this.values[this.selectedGroupIndex] : null;
  }

  get enrollBodyValid(): boolean {
    return this.groupIdToEnroll !== null;
  }

  /* METHODS */

  rowBackgrounds(item: any): RowColors {
    if (item.group === null) {
      return "soft-orange";
    }

    return "";
  }

  toggle(index: number): void {
    this.selectedGroupIndex = this.selectedGroupIndex === index ? null : index;
  }

  askUnenroll(student: HandledStudent): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Are you sure that you want to unenroll ${student.username} from group ${student.group?.name ?? ""}?`,
      callback: async (answer) => {
        if (answer) {
          try {
            if (student.group) {
              await this.groupRemovePartecipant(this.courseId, student.group.id, student.id);
              const groupToChange = this.values.find((value) => value.id === student.group?.id);
              if (groupToChange) {
                groupToChange.partecipants = groupToChange.partecipants.filter((id) => id !== student.id);
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      },
    });
  }

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

  openEnroll(student: HandledStudent): void {
    this.studentToEnroll = student;
    this.showEnrollDialog = true;
  }
  async closeEnroll(save: boolean): Promise<void> {
    if (!save) {
      this.groupIdToEnroll = null;
      this.showEnrollDialog = false;
      return;
    }

    if (this.enrollValid && this.groupIdToEnroll && this.studentToEnroll) {
      try {
        this.enrollLoading = true;
        await this.groupAddPartecipant(this.courseId, this.groupIdToEnroll, this.studentToEnroll.id);
        const group = this.values.find((group) => group.id === this.groupIdToEnroll);
        if (group) {
          group.partecipants.push(this.studentToEnroll.id);
        }

        this.groupIdToEnroll = null;
        this.showEnrollDialog = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.enrollLoading = false;
      }
    }
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
          lecturePeriod: this.createBody.lecturePeriod,
          partecipants: [],
          weekSchedule: {
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null,
            saturday: null,
            sunday: null,
          },
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

  reflectUpdate(id: string, updateBody: GroupsUpdateBodyStrict): void {
    const index = this.values.findIndex((v) => v.id === id);
    this.values.splice(index, 1, {
      id,
      courseId: this.courseId,
      name: updateBody.name,
      description: updateBody.description,
      maxPartecipants: updateBody.maxPartecipants,
      lecturePeriod: updateBody.lecturePeriod,
      weekSchedule: updateBody.weekSchedule,
      partecipants: this.backupValue?.partecipants ?? [],
      creationDate: this.backupValue?.creationDate ?? new Date(),
    });
  }
  async prepareUpdateBody(value: Group): Promise<void> {
    this.backupValue = value;
    this.updateBody = {
      name: value.name,
      description: value.description,
      maxPartecipants: value.maxPartecipants,
      lecturePeriod: value.lecturePeriod,
      weekSchedule: value.weekSchedule,
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

    if (this.updateValid && this.updateBody && this.updateId) {
      try {
        this.updateLoading = true;
        await this.updateGroup(this.courseId, this.updateId, this.updateBody);
        this.reflectUpdate(this.updateId, this.updateBody);
        this.sprepareUpdateBody();
        this.showEditDialog = false;
      } catch (error) {
        console.error(error);
      } finally {
        this.updateLoading = false;
      }
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
    this.enrolledStudents = await this.getCourseStudents(this.courseId);
  }
}
</script>