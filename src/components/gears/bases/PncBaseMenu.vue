<template>
  <v-navigation-drawer v-model="showMenu" :clipped="$vuetify.breakpoint.lgAndUp" app>
    <v-text-field class="mx-2 my-5" type="text" filled rounded dense hide-details outlined label="Search" name="search" v-model="search" clearable  />
    <v-divider />
    <v-list shaped>
      <v-list-item-group v-model="tab">
        <v-list-item v-for="item of shownItems" :key="item.path" :to="item.path">
          <v-list-item-icon class="mr-3">
            <v-icon dense>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-divider />
    <p class="version">
      <span>Site version:</span>
      <span class="version-value"> {{ siteVersion }}</span>
    </p>
    <p class="version">
      <span>API version:</span>
      <span class="version-value"> {{ apiVersion }}</span>
    </p>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { UserRole } from "@prebenorwegian/sdk";

import { MutationTypes } from "@/store";
import CONFIG from "@/config";

import VersionHandlerMixin from "@/mixins/handlers/VersionHandlerMixin";

export interface MenuItem {
  icon: string;
  text: string;
  path: string;
  roles?: UserRole[] ;
}

@Component
export default class PncBaseMenu extends Mixins(VersionHandlerMixin) {
  /* PROPS */

  @Prop({ type: Array, required: true })
  private items!: MenuItem[];

  /* DATA */

  private tab = 0;
  private search = "";
  private siteVersion = CONFIG.VERSION;
  private apiVersion = "-";

  /* COMPUTED */

  get showMenu(): boolean {
    return this.$store.state.showMenu;
  }
  set showMenu(value: boolean) {
    this.$store.commit(MutationTypes.SET_SHOW_MENU, value);
  }

  get shownItems(): MenuItem[] {
    let result = this.items;
    result = this.search ? result.filter((item) => item.text.toUpperCase().indexOf(this.search.toUpperCase()) !== -1) : result;
    result = result.filter((item) => item.roles === undefined || item.roles.includes(this.$store.getters.role as UserRole));
    return result;
  }

  /* LIFE CYCLE */

  async mounted() {
    this.apiVersion = await this.getApiVersion();
  }
}
</script>

<style lang="scss" scoped>
.version {
  margin-top: 1em;
  text-align: center;
}
</style>