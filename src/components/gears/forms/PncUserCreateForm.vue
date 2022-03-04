<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Username"
            name="username"
            clearable
            prepend-icon="mdi-account"
            :rules="[$validator.requiredText('Username'), $validator.username(), $validator.unique(usersUsernames)]"
            v-model="internalValue.username"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="email"
            label="Email"
            name="email"
            clearable
            prepend-icon="mdi-email"
            :rules="[$validator.requiredText('Email'), $validator.email()]"
            v-model="internalValue.email"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-select
            v-model="internalValue.role"
            label="Role"
            name="role"
            clearable
            prepend-icon="mdi-spider"
            :items="$store.state.roles"
            :rules="[$validator.requiredText('Role'), $validator.userRole()]"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            :type="passwordType"
            label="Password"
            name="password"
            clearable
            prepend-icon="mdi-lock"
            :append-icon="passwordIcon"
            @click:append="showPassword = !showPassword"
            :rules="[$validator.requiredText('Password'), $validator.password()]"
            v-model="internalValue.password"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { UserRole, UsersCreateBody } from "@prebenorwegian/sdk";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class PncUsersCreateForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: UsersCreateBody;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Array, default: () => [] })
  usersUsernames!: string;

  /* DATA */

  private showPassword = false;

  /* GETTERS AND SETTERS */

  get passwordType(): "text" | "password" {
    return this.showPassword ? "text" : "password";
  }
  get passwordIcon(): "mdi-eye" | "mdi-eye-off" {
    return this.showPassword ? "mdi-eye-off" : "mdi-eye";
  }

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

  getEmptyUtente(): UsersCreateBody {
    return {
      username: "",
      email: "",
      role: '' as UserRole,
      password: ""
    };
  }

  /* WATCH */

  @Watch("value", { deep: true, immediate: true })
  watchValue() {
    if (this.value === null) {
      this.internalValue = this.getEmptyUtente();
    }
  }

  /* LIFE CYCLE */

  created() {
    this.internalValue = this.value === null ? this.getEmptyUtente() : this.value;
  }
}
</script>