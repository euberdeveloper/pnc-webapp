<template>
  <menu-dashboard />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import MenuDashboard from "@/components/menus/dashboard/MenuDashboard.vue";

@Component({
  components: {
    MenuDashboard,
  },
})
export default class DashboardMenuView extends Vue {

}
</script>