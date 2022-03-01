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
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
// TODO: set to pnc-sdk
import { GroupsCreateBody } from "pnc-sdk/api/controllers/courses/groups";

@Component({
  model: {
    prop: "value",
    event: "save",
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