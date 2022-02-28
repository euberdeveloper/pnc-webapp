<template>
  <v-dialog v-model="internalShow" :persistent="persistent" width="400">
    <v-card>
      <v-card-title :class="['title', 'headline', 'white--text', 'text--darken-5', color, colorModificator]">
        <v-spacer />
        <span>{{ title }}</span>
        <v-spacer />
      </v-card-title>

      <v-card-text class="confirm-text">
        <span>{{ text }}</span>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined @click="action(true)">SÌ</v-btn>
        <v-btn color="error" outlined @click="action(false)">NO</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
  model: {
    prop: "show",
    event: "show-updated",
  },
})
export default class PncConfirmDialog extends Vue {
  /* PROPS */

  @Prop({ type: String, default: "warning" })
  color!: string;

  @Prop({ type: String, default: "lighten-1" })
  colorModificator!: string;

  @Prop({ type: String, default: "Attention" })
  title!: string;

  @Prop({ type: Function, required: true })
  callback!: (answer: boolean) => void | Promise<void>;

  @Prop({ type: Boolean })
  show!: boolean;

  @Prop({ type: String })
  text!: string;

  @Prop({ type: Boolean, default: true })
  persistent!: boolean;

  /* GETTERS AND SETTERS */

  get internalShow(): boolean {
    return this.show;
  }
  set internalShow(value: boolean) {
    this.$emit("show-updated", value);
  }

  /* METHODS */

  async action(answer: boolean): Promise<void> {
    this.internalShow = false;
    await this.callback(answer);
  }
}
</script>

<style scoped>
.confirm-text {
  text-align: justify;
  font-size: 16px;
  margin: 30px 0;
}
</style>