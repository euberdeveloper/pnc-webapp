<template>
  <v-dialog v-model="internalShow" width="400">
    <v-card>
      <v-card-title :class="['title', 'headline', 'white--text', 'text--darken-5', color, colorModificator]">
        <v-spacer />
        <span>{{ title }}</span>
        <v-spacer />
      </v-card-title>

      <v-card-text class="text">
        <span>{{ text }}</span>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn color="error" outlined @click="internalShow = false">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
  model: {
    prop: 'show',
    event: 'show-updated'
  }
})
export default class PncAlertDialog extends Vue {
  /* PROPS */

  @Prop({ type: String, default: 'yellow' })
  color!: string;

  @Prop({ type: String, default: 'lighten-1'})
  colorModificator!: string;

  @Prop({ type: String, default: 'Warning'})
  title!: string;

  @Prop({ type: Boolean })
  show!: boolean;

  @Prop({ type: String })
  text!: string;

  /* GETTERS AND SETTERS */

  get internalShow(): boolean {
    return this.show;
  }
  set internalShow(value: boolean) {
    this.$emit('show-updated', value);
  }
}
</script>

<style scoped>
.text {
  text-align: justify;
  font-size: 16px;
  margin: 30px 0;
}
</style>