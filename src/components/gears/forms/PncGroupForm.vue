<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Name"
            name="name"
            clearable
            :rules="[$validator.requiredText('Name'), $validator.unique(groupsNames)]"
            v-model="internalValue.name"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Description"
            name="description"
            clearable
            :rules="[$validator.requiredText('Description')]"
            v-model="internalValue.description"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-text-field
            type="number"
            label="Max. partecipants"
            name="maxPartecipants"
            clearable
            :rules="[$validator.requiredText('Max. partecipants'), $validator.number(), $validator.gte(1)]"
            v-model="internalValue.maxPartecipants"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <pnc-date-input
            type="text"
            label="Start date"
            name="startDate"
            clearable
            :rules="[$validator.requiredText('Start date')]"
            v-model="internalValue.lecturePeriod.start"
          />
        </v-col>
        <v-col cols="6">
          <pnc-date-input
            type="text"
            label="End date"
            name="endDate"
            clearable
            :rules="[$validator.requiredText('End date'), $validator.after(internalValue.lecturePeriod.start, internalValue.lecturePeriod.end)]"
            v-model="internalValue.lecturePeriod.end"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { GroupsCreateBody } from "@prebenorwegian/sdk";

import PncDateInput from "@/components/gears/inputs/PncDateInput.vue";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
  components: {
    PncDateInput,
  },
})
export default class PncGroupForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: GroupsCreateBody;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Array, default: () => [] })
  groupsNames!: string[];

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

  /* METHODS */

  getEmptyValue(): GroupsCreateBody {
    return {
      name: "",
      description: "",
      maxPartecipants: null as unknown as number,
      lecturePeriod: {
        start: null as unknown as Date,
        end: null as unknown as Date,
      },
    };
  }

  /* WATCH */

  @Watch("value", { deep: true, immediate: true })
  watchValue() {
    if (this.value === null) {
      this.internalValue = this.getEmptyValue();
    }
  }
}
</script>