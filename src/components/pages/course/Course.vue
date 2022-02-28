<template>
  <pnc-base-page :title="title">
    <template v-slot:description v-if="course">
      <v-subheader class="px-0 mt-md-4 mb-md-0 mt-8 mb-4 text-subtitle-1" v-if="course.description">
        {{ course.description }}
      </v-subheader>
    </template>
    <!-- <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-text-field class="mx-8" v-model="search" label="Search" dense solo outlined clearable hide-details prepend-inner-icon="mdi-magnify" />
        </v-col>
      </v-row>
      <v-row align="start" justify="start">
        <v-col v-for="course of filteredCourses" :key="course.id" cols="12" sm="4">
          <course-card :course="course" />
        </v-col>
      </v-row>
    </v-container> -->
  </pnc-base-page>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { Course as CourseType } from "pnc-sdk";

import CourseHandlerMixin from "@/mixins/handlers/CourseHandlerMixin";

import PncBasePage from "@/components/gears/bases/PncBasePage.vue";

@Component({
  components: {
    PncBasePage,
  },
})
export default class Course extends Mixins(CourseHandlerMixin) {
  /* PROP */

  @Prop({ type: String, required: true })
  courseId!: string;

  /* DATA */

  private course: CourseType | null = null;

  /* GETTERS */

  get title(): string {
    return this.course ? `Course - ${this.course.title}` : "Course";
  }

  /* LIFE CYCLE */

  async created() {
    this.course = await this.getCourse(this.courseId);
  }
}
</script>