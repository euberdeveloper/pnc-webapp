<template>
  <v-card>
    <v-card-title class="headline primary white--text">
      <v-icon v-if="backRoute" class="back-icon" color="white" @click="goBack()">mdi-arrow-left-thick</v-icon>
      {{ title }}
    </v-card-title>
    <v-card-text>
      <slot name="description" />
    </v-card-text>
    <slot />
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Location } from "vue-router";

@Component
export default class PncBasePage extends Vue {
  /* PROPS */

  @Prop({ type: [String, Object], required: false })
  backRoute?: string | Location;

  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: false })
  description?: string;

  /* METHODS */

  goBack() {
    if (this.backRoute) {
      this.$router.push(this.backRoute);
    }
  }
}
</script>

<style scoped>
.back-icon {
  margin-right: 1em;
  cursor: pointer;
}
</style>