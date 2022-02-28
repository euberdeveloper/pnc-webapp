<template>
  <pnc-base-page title="Courses">
    ciao
  </pnc-base-page>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import PncBasePage from "@/components/gears/bases/PncBasePage.vue";

@Component({
  components: {
    PncBasePage,
  },
})
export default class Users extends Vue {}
</script>