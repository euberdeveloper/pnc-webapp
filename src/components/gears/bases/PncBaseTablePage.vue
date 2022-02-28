<template>
  <pnc-base-page :title="title">
    <template v-slot:description>
      <slot name="description">
        <v-subheader class="px-0 mt-md-4 mb-md-0 mt-8 mb-4 text-subtitle-1" v-if="description">
          <!-- description -->
          <span>{{ description }}</span>

          <v-spacer />

          <!-- csv -->
          <v-btn v-if="exportTsv" class="ma-2" :loading="exportLoadings.tsv" :disabled="exportLoadings.tsv" color="success" @click="$emit('exportTsv')">
            <v-icon left dark>mdi-file-table</v-icon>
            <span>TSV</span>
            <template v-slot:loader>
              <span class="pnc-loader">
                <v-icon light>mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>

          <!-- excel -->
          <v-btn v-if="exportXlsx" class="ma-2" :loading="exportLoadings.xlsx" :disabled="exportLoadings.xlsx" color="success" @click="$emit('exportXlsx')">
            <v-icon left dark>mdi-google-spreadsheet</v-icon>
            <span>XLSX</span>
            <template v-slot:loader>
              <span class="pnc-loader">
                <v-icon light>mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
        </v-subheader>
      </slot>
    </template>
    <template v-slot>
      <!-- TABLE -->
      <pnc-base-table
        :title="tableTitle"
        v-model="internalTableSelectedValues"
        :columns="tableColumns"
        :actions="tableActions"
        :rowBackgrounds="rowBackgrounds"
        :groupHeaders="tableGroupHeaders"
        :values="tableValues"
        :itemKey="tableItemKey"
        :sortBy="tableSortBy"
        :sortDesc="tableSortDesc"
        :showSelect="tableShowSelect"
        :multiSort="tableMultiSort"
        :loading="tableLoading"
        :showTitle="tableShowTitle"
        :updateBody.sync="internalTableUpdateBody"
        :options.sync="internalTableOptions"
        :itemsPerPageOptions="tableItemsPerPageOptions"
        :serverItemsLength="tableServerItemsLength"
        :tableSearch.sync="internalTableSearch"
        @click:row="tableRowClicked"
        v-if="showTable"
      >
        <template v-slot:header>
          <slot name="tableHeader" />
        </template>
      </pnc-base-table>

      <!-- PLUS FAB BUTTON -->
      <v-fab-transition v-if="showActionButton && !isSelecting" key="plus">
        <v-btn color="primary" @click="fabCreateClick" fab large fixed bottom right>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-fab-transition>
      <!-- DELETE/SELECT FAB BUTTON -->
      <v-fab-transition v-else-if="showActionButton" key="delete">
        <slot name="selectFab">
          <v-btn color="error" @click="fabDeleteClick" fab large fixed bottom right>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </slot>
      </v-fab-transition>

      <!-- CREATE DIALOG -->
      <pnc-action-dialog
        :title="createDialogTitle"
        :width="dialogWidth"
        :widthMobile="dialogWidthMobile"
        v-model="internalCreateDialogShow"
        :disabled="createDialogDisabled"
        @cancel="createDialogCancel"
        @confirm="createDialogConfirm"
      >
        <slot name="createDialog" />
      </pnc-action-dialog>

      <!-- EDIT DIALOG -->
      <pnc-action-dialog
        :title="editDialogTitle"
        :width="dialogWidth"
        :widthMobile="dialogWidthMobile"
        v-model="internalEditDialogShow"
        :disabled="editDialogDisabled"
        @cancel="editDialogCancel"
        @confirm="editDialogConfirm"
      >
        <slot name="editDialog" />
      </pnc-action-dialog>
    </template>
  </pnc-base-page>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Location } from "vue-router";
import { DataOptions } from "vuetify";

import PncActionDialog from "@/components/gears/dialogs/PncActionDialog.vue";
import PncBasePage from "@/components/gears/bases/PncBasePage.vue";
import PncBaseTable, { Actions, Column, GroupHeaders, RowColors } from "@/components/gears/bases/PncBaseTable.vue";

export { Actions, Column, GroupHeaders } from "@/components/gears/bases/PncBaseTable.vue";

@Component({
  components: {
    PncActionDialog,
    PncBasePage,
    PncBaseTable,
  },
})
export default class PncBaseTablePage extends Vue {
  /* PROPS */

  @Prop({ type: [String, Object], required: false })
  backRoute?: string | Location;

  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: Boolean, default: true })
  showTable!: boolean;

  @Prop({ type: String, required: true })
  tableTitle!: string;

  @Prop({ type: Array, required: true })
  tableColumns!: Column[];

  @Prop({ type: Object, required: true })
  tableActions!: Actions;

  @Prop({ type: Object, required: false })
  tableGroupHeaders?: GroupHeaders;

  @Prop({ type: Array, required: true })
  tableSelectedValues!: any[];

  @Prop({ type: Array, required: true })
  tableValues!: any[];

  @Prop({ type: String, required: true })
  tableItemKey!: string;

  @Prop({ type: Boolean, default: false })
  tableShowSelect!: boolean;

  @Prop({ type: String, required: false })
  tableSortBy?: string;

  @Prop({ type: Boolean, required: false })
  tableSortDesc?: boolean;

  @Prop({ type: Boolean, default: false })
  tableMultiSort!: boolean;

  @Prop({ type: Boolean, default: false })
  tableLoading!: boolean;

  @Prop({ type: Boolean, default: true })
  tableShowTitle!: boolean;

  @Prop({ validator: (v) => typeof v === "object" || v === null, required: true })
  tableUpdateBody!: any;

  @Prop({ type: Number, required: false })
  tableServerItemsLength?: number;

  @Prop({ type: Object, required: false })
  tableOptions?: DataOptions;

  @Prop({ type: Array, required: false })
  tableItemsPerPageOptions?: number[];

  @Prop({ type: String, required: false })
  tableSearch?: string;

  @Prop({ type: String, required: true })
  createDialogTitle!: string;

  @Prop({ type: Boolean, default: false })
  createDialogShow!: boolean;

  @Prop({ type: Boolean, required: true })
  createDialogDisabled!: boolean;

  @Prop({ type: String, required: true })
  editDialogTitle!: string;

  @Prop({ type: Boolean, default: false })
  editDialogShow!: boolean;

  @Prop({ type: Boolean, required: true })
  editDialogDisabled!: boolean;

  @Prop({ type: Boolean, default: true })
  showActionButton!: boolean;

  @Prop({ type: String, required: false })
  dialogWidth?: string;

  @Prop({ type: String, required: false })
  dialogWidthMobile?: string;

  @Prop({ type: Function, default: () => "" })
  rowBackgrounds!: (item: any) => RowColors;

  @Prop({ type: Object, required: false })
  exportLoadings?: { tsv: boolean; xlsx: boolean };

  @Prop({ type: Boolean, default: false })
  exportTsv!: boolean;

  @Prop({ type: Boolean, default: false })
  exportXlsx!: boolean;

  /* GETTERS AND SETTERS */

  get internalTableSelectedValues(): any[] {
    return this.tableSelectedValues;
  }
  set internalTableSelectedValues(value: any[]) {
    this.$emit("update:table-selected-values", value);
  }

  get internalTableOptions(): DataOptions | undefined {
    return this.tableOptions;
  }
  set internalTableOptions(value: DataOptions | undefined) {
    this.$emit("update:table-options", value);
  }
  get internalTableSearch(): string | undefined {
    return this.tableSearch;
  }
  set internalTableSearch(value: string | undefined) {
    this.$emit("update:table-search", value);
  }

  get internalTableUpdateBody(): any {
    return this.tableUpdateBody;
  }
  set internalTableUpdateBody(value: any) {
    this.$emit("update:table-update-body", value);
  }

  get internalCreateDialogShow(): boolean {
    return this.createDialogShow;
  }
  set internalCreateDialogShow(value: boolean) {
    this.$emit("update:create-dialog-show", value);
  }

  get internalEditDialogShow(): boolean {
    return this.editDialogShow;
  }
  set internalEditDialogShow(value: boolean) {
    this.$emit("update:edit-dialog-show", value);
  }

  get isSelecting(): boolean {
    return this.internalTableSelectedValues.length > 0;
  }

  /* METHODS */

  fabCreateClick(): void {
    this.$emit("fabCreateClick");
  }
  fabDeleteClick(): void {
    this.$emit("fabDeleteClick");
  }

  createDialogCancel(): void {
    this.$emit("createDialogCancel");
  }
  createDialogConfirm(): void {
    this.$emit("createDialogConfirm");
  }

  editDialogCancel(): void {
    this.$emit("editDialogCancel");
  }
  editDialogConfirm(): void {
    this.$emit("editDialogConfirm");
  }

  tableRowClicked(item: any): void {
    this.$emit("tableRowClicked", item);
  }
}
</script>

<style scoped>
.back-icon {
  margin-right: 1em;
  cursor: pointer;
}
</style>