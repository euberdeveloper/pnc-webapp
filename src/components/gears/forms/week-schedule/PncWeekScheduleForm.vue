<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h3>Week schedule {{ formValid }} {{ internalFormValid }} {{ realFormValid }}</h3>
      </v-col>
    </v-row>
    <v-row class="my-1 pa-0">
      <v-col cols="12">
        <day-schedule-form v-model="internalValue.monday" label="Monday" />
      </v-col>
      <v-col cols="12">
        <day-schedule-form v-model="internalValue.tuesday" label="Tuesday" />
      </v-col>
      <v-col cols="12">
        <day-schedule-form v-model="internalValue.wednesday" label="Wednesday" />
      </v-col>
      <v-col cols="12">
        <day-schedule-form v-model="internalValue.thursday" label="Thursday" />
      </v-col>
      <v-col cols="12">
        <day-schedule-form v-model="internalValue.friday" label="Friday" />
      </v-col>
      <v-col cols="12">
        <day-schedule-form v-model="internalValue.saturday" label="Saturday" />
      </v-col>
      <v-col cols="12">
        <day-schedule-form v-model="internalValue.sunday" label="Sunday" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { TimeRange, WeekSchedule } from "@prebenorwegian/sdk";

import DayScheduleForm from "./gears/DayScheduleForm.vue";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
  components: {
    DayScheduleForm,
  },
})
export default class PncWeekScheduleForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, required: true })
  value!: WeekSchedule;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  /* DATA */

  private checkboxValueComparator = function (x, y) {
    return (x === null && y === null) || (x !== null && y !== null);
  };

  /* GETTERS AND SETTERS */

  get internalValue() {
    return this.value;
  }
  set internalValue(value) {
    this.$emit("save", value);
  }

  get internalFormValid() {
    return this.formValid;
  }
  set internalFormValid(value) {
    this.$emit("update:formValid", value);
  }

  get realFormValid() {
    return (
      this.validateWeekdayValue(this.internalValue.monday) &&
      this.validateWeekdayValue(this.internalValue.tuesday) &&
      this.validateWeekdayValue(this.internalValue.wednesday) &&
      this.validateWeekdayValue(this.internalValue.thursday) &&
      this.validateWeekdayValue(this.internalValue.friday) &&
      this.validateWeekdayValue(this.internalValue.saturday) &&
      this.validateWeekdayValue(this.internalValue.sunday)
    );
  }

  /* METHODS */

  private validateWeekdayValue(value: null | TimeRange): boolean {
    return value === null || (/^([01]\d|2[0-3]):([0-5]\d)$/.test(value.from) && /^([01]\d|2[0-3]):([0-5]\d)$/.test(value.to));
  }

  /* WATCHERS */

  @Watch("realFormValid")
  watchRealFormValid() {
    this.internalFormValid = this.realFormValid;
  }

  /* LIFE CYCLE */

  created() {
    this.internalFormValid = this.realFormValid;
  }
}
</script>