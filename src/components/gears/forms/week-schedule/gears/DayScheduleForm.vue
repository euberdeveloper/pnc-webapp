<template>
  <v-form class="d-flex align-center pa-1">
    <v-checkbox
      class="mt-0"
      v-model="internalValue"
      :true-value="{ from: '', to: '' }"
      :false-value="null"
      :value-comparator="checkboxValueComparator"
      :label="label"
      hide-details
    />
    <span class="flex-grow-1" />
    <v-text-field
      type="text"
      label="From"
      placeholder="hh:mm"
      name="from"
      clearable
      :rules="[$validator.requiredText('From')]"
      v-model="internalValue.from"
      hide-details
      dense
      solo
      v-if="internalValue"
    />
    <v-text-field
      class="ml-4"
      type="text"
      label="To"
      placeholder="hh:mm"
      name="to"
      clearable
      :rules="[$validator.requiredText('To')]"
      v-model="internalValue.to"
      hide-details
      dense
      solo
      v-if="internalValue"
    />
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { TimeRange } from "@prebenorwegian/sdk";

@Component({
  model: {
    prop: "value",
    event: "change",
  },
})
export default class DayScheduleForm extends Vue {
  /* PROPS */

  @Prop({ validator: (v) => v === null || typeof v === "object", required: true })
  value!: null | TimeRange;

  @Prop({ type: String, default: 'Day' })
  label!: string;

  /* DATA */

  public checkboxValueComparator = function (x, y) {
    return (x === null && y === null) || (x !== null && y !== null);
  };

  /* GETTERS AND SETTERS */

  get internalValue() {
    return this.value;
  }
  set internalValue(value) {
    this.$emit("change", value);
  }
}
</script>