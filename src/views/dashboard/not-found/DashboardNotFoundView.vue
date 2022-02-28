<template>
  <v-container>
    <v-row class="justify-center align-center">
      <v-col :cols="$vuetify.breakpoint.mdAndUp ? 7 : 12">
        <pnc-not-found class="pnc-not-found" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import PncNotFound from "@/components/gears/misc/PncNotFound.vue";

@Component({
  components: {
    PncNotFound,
  },
})
export default class DashboardPncNotFoundView extends Vue {}
</script>
