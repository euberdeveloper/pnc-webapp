<template>
  <div class="norway-background" :style="backgroundStyle"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { getRandomNorwayBackground } from "@/utils";

@Component
export default class PncNorwayBackground extends Vue {
  private backgroundImage: string | null = null;

  /* GETTERS */

  get backgroundStyle() {
    return {
      background: this.backgroundImage ? `url("${this.backgroundImage}") no-repeat center center fixed` : undefined,
      "background-size": "cover",
    };
  }

  /* LIFE CYCLE */

  created() {
    this.backgroundImage = getRandomNorwayBackground();
  }
}
</script>

<style lang="scss" scoped>
.norway-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  filter: blur(0px);
}
</style>
