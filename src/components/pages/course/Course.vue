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
          <v-btn class="ml-4" depressed color="primary">ADD</v-btn>
        </v-col>
      </v-row>
      <v-row align="start" justify="start">
        <v-col v-for="group of filteredGroups" :key="group.id" cols="12" sm="4">
          <group-card :group="group" @edit="edit(group)" @remove="remove(group)" />
        </v-col>
      </v-row>
    </v-container>
  </pnc-base-page>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { Location } from "vue-router";
import { Course as CourseType, Group } from "pnc-sdk";

import CourseHandlerMixin from "@/mixins/handlers/CourseHandlerMixin";
import GroupHandlerMixin from "@/mixins/handlers/GroupHandlerMixin";

import PncBasePage from "@/components/gears/bases/PncBasePage.vue";
import GroupCard from "./group-card/GroupCard.vue";
import { ActionTypes } from "@/store";

@Component({
  components: {
    PncBasePage,
    GroupCard,
  },
})
export default class Course extends Mixins(CourseHandlerMixin, GroupHandlerMixin) {
  /* PROP */

  @Prop({ type: String, required: true })
  courseId!: string;

  /* DATA */

  private course: CourseType | null = null;
  private groups: Group[] = [];
  private searchGroup = "";
  private backRoute: Location = { name: "dashboard-courses" };

  /* GETTERS */

  get title(): string {
    return this.course ? `Course - ${this.course.title}` : "Course";
  }

  get filteredGroups(): Group[] {
    return this.groups.filter((group) => {
      return group.name.toLowerCase().includes(this.searchGroup.toLowerCase());
    });
  }

  /* METHODS */

  async remove(group: Group): Promise<void> {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Are you sure you want to remove the group "${group.name}"?`,
      callback: async (answer) => {
        if (answer) {
          await this.deleteGroup(group.courseId, group.id);
          this.groups = this.groups.filter((g) => g.id !== group.id);
        }
      },
    });
  }

  /* LIFE CYCLE */

  async created() {
    this.course = await this.getCourse(this.courseId);
    this.groups = await this.getGroups(this.courseId);
  }
}
</script>