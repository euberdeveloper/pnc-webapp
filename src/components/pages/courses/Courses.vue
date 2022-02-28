<template>
  <pnc-base-page title="Courses">
    <v-container fluid>
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
    </v-container>
  </pnc-base-page>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { Course } from "pnc-sdk";

import CourseHandlerMixin from "@/mixins/handlers/CourseHandlerMixin";

import PncBasePage from "@/components/gears/bases/PncBasePage.vue";
import CourseCard from "./course-card/CourseCard.vue";

@Component({
  components: {
    PncBasePage,
    CourseCard,
  },
})
export default class Courses extends Mixins(CourseHandlerMixin) {
  /* DATA */

  private courses: Course[] = [];
  private search = "";

  /* GETTERS */

  get filteredCourses(): Course[] {
    return this.courses.filter((course) => {
      return course.title.toLowerCase().includes(this.search.toLowerCase());
    });
  }

  /* LIFE CYCLE */

  async created() {
    this.courses = await this.getCourses();
  }
}
</script>