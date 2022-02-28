<template>
  <v-main>
    <!-- IMAGE OF BACKGROUND -->
    <div class="background" :style="backgroundStyle" />

    <!-- NOT FOUND CONTAINER -->
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <!-- NOT FOUND CARD WITH TRANSITION -->
          <v-scale-transition origin="center center">
            <pnc-not-found v-show="showCard" />
          </v-scale-transition>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { getRandomNorwayBackground } from "@/utils";

import PncNotFound from '@/components/gears/misc/PncNotFound.vue';

@Component({
  components: {
    PncNotFound
  }
})
export default class NoFound extends Vue {
  /* DATA */

  private showCard = false;
  private backgroundImage: string | null = null;

  /* GETTERS */

  get backgroundStyle() {
    return {
      'background': this.backgroundImage ? `url("${this.backgroundImage}") no-repeat center center fixed` : undefined,
      'background-size': 'cover'
    };
  }

  /* LIFE CYCLE */

  created() {
    this.backgroundImage = getRandomNorwayBackground();
  }

  mounted() {
    this.showCard = true;
  }
}
</script>

<style lang="scss" scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  filter: blur(0px);
}
</style>
