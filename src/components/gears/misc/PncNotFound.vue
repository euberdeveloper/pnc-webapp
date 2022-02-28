<template>
  <v-card class="elevation-12">
    <!-- TITLE -->
    <v-toolbar color="primary" class="d-flex justify-center" dark flat>
      <v-toolbar-title>Preben Norwegian Community - PAGE NOT FOUND</v-toolbar-title>
    </v-toolbar>
    <!-- CONTENT -->
    <v-card-text class="px-8 d-flex flex-column align-center">
      <h2 class="my-4">Page {{ requestedRoute }} not found</h2>
      <img class="my-4 image" src="@/assets/not_found.png" alt="not found" />
    </v-card-text>
    <!-- BUTTON -->
    <v-card-actions class="d-flex justify-center pb-4">
      <v-btn color="primary" large to="/">Back to Home</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class PncNotFound extends Vue {

  /* GETTERS AND SETTERS */

  get requestedRoute(): string {
    return this.$route.path;
  }
}
</script>

<style lang="scss" scoped>
.image {
  max-width: 100%;
}
</style>
