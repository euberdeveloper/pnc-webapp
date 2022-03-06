<template>
  <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="dateFormatted"
        :label="label"
        :placeholder="placeholder"
        hint="DD/MM/YYYY"
        persistent-hint
        :prepend-icon="icon"
        :clearable="clearable"
        :dense="dense"
        :hide-details="hideDetails"
        :rules="rules"
        :required="required"
        @blur="internalValue = parseDate(dateFormatted)"
        @keypress.enter="enterClicked"
        v-on="on"
        v-bind="attrs"
      ></v-text-field>
    </template>
    <v-date-picker v-model="internalValue" no-title @input="menu = false" :locale="locale" />
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component({
  model: {
    prop: "value",
    event: "change",
  },
})
export default class PncDateInput extends Vue {
  /* PROPS */

  @Prop({ validator: (v) => typeof v === "object" || v === null || v === undefined, required: true })
  value!: Date | null;

  @Prop({ type: String, default: "" })
  label!: string;

  @Prop({ type: String, default: "" })
  placeholder!: string;

  @Prop({ type: String, required: false })
  icon?: string;

  @Prop({ type: String, required: false })
  locale?: string;

  @Prop({ type: Array, default: () => [] })
  rules!: any[];

  @Prop({ type: Boolean, default: false })
  clearable?: boolean;

  @Prop({ type: Boolean, default: false })
  hideDetails?: boolean;

  @Prop({ type: Boolean, default: false })
  dense?: boolean;

  @Prop({ type: Boolean, default: false })
  required?: boolean;

  /* DATA */

  private menu = false;
  private dateFormatted: string | null = null;

  /* GETTERS AND SETTERS */

  get internalValue(): string | null {
    return this.value ? this.value.toISOString().slice(0, 10) : null;
  }
  set internalValue(value: string | null) {
    const dateVal = value ? new Date(value) : null;
    this.$emit("change", dateVal && !isNaN(+dateVal) ? dateVal : null);
  }

  /* WATCH */

  @Watch("value")
  watchValue() {
    this.dateFormatted = this.formatDate(this.value);
  }

  /* METHODS */

  formatDate(date: Date | null): string | null {
    if (!date) return null;
    date = new Date(date);
    const tempDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const [year, month, day] = tempDate.toISOString().slice(0, 10).split("-");
    return `${day}/${month}/${year}`;
  }

  parseDate(date: string | null): Date | null {
    if (!date) return null;
    const [day, month, year] = date.split("/");
    const dateValue = new Date(Date.UTC(+year, +month - 1, +day));
    return isNaN(+dateValue) ? null : dateValue;
  }

  enterClicked(): void {
    const doc: any = document;
    if (doc?.activeElement?.blur) {
      doc.activeElement.blur();
    }
    this.menu = false;
  }

  /* LIFE CYCLE */

  created() {
    this.dateFormatted = this.formatDate(this.value);
  }
}
</script>