<template>
  <pnc-base-menu :items="items" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import PncBaseMenu, { MenuItem } from "@/components/gears/bases/PncBaseMenu.vue";
import { UserRole } from "pnc-sdk";

@Component({
  components: {
    PncBaseMenu,
  },
})
export default class MenuDashboard extends Vue {
  /* DATA */

  private items: MenuItem[] = [
    {
      icon: "mdi-file-document-edit",
      text: "Courses",
      path: "/dashboard/courses"
    },
    {
      icon: "mdi-account-multiple",
      text: "Users",
      path: "/dashboard/users",
      roles: [UserRole.ADMIN]
    }
  ];
}
</script>