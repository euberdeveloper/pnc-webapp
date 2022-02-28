<template>
  <course :courseId="courseId" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Course from "@/components/pages/course/Course.vue";

@Component({
  components: {
    Course,
  },
})
export default class DashboardCoursesIdView extends Vue {
  /* PROPS */
  
  @Prop({ type: String, required: true })
  courseId!: string;
}
</script>
