<template>
  <v-card class="mx-auto" :max-width="$vuetify.breakpoint.xs ? undefined : 344">
    <v-img :src="courseImage" height="200px"></v-img>
    <v-card-title> {{ course.title }} </v-card-title>

    <v-card-actions>
      <v-btn color="orange lighten-2" :to="courseLink" text>View</v-btn>
      <v-spacer />
      <v-btn icon @click="show = !show" v-if="course.description">
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition v-if="course.description">
      <div v-show="show">
        <v-divider />

        <v-card-text>
          <b>Description:</b><br />
          <span>{{ course.description }}</span>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Location } from "vue-router";
import { Course } from "@prebenorwegian/sdk";

@Component
export default class CourseCard extends Vue {
  /* PROPS */

  @Prop({ type: Object, required: true })
  course!: Course;

  /* DATA */

  private show = false;

  /* GETTERS */

  get courseImage(): string {
    return this.course.courseImage ?? require("@/assets/placeholder.png");
  }

  get courseLink(): Location {
    return { name: "dashboard-courses-id", params: { courseId: this.course.id } };
  }
}
</script>