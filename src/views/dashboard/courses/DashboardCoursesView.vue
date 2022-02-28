<template>
  <courses />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Courses from "@/components/pages/courses/Courses.vue";

@Component({
  components: {
    Courses,
  },
})
export default class DashboardCoursesView extends Vue {}
</script>
