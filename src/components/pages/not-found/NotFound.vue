<template>
  <v-main>
    <!-- IMAGE OF BACKGROUND -->
    <pnc-norway-background />

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

import PncNotFound from "@/components/gears/misc/PncNotFound.vue";
import PncNorwayBackground from "@/components/gears/misc/PncNorwayBackground.vue";

@Component({
  components: {
    PncNotFound,
    PncNorwayBackground
  },
})
export default class NoFound extends Vue {
  /* DATA */

  private showCard = false;

  /* LIFE CYCLE */

  mounted() {
    this.showCard = true;
  }
}
</script>

