<template>
  <v-dialog v-model="internalShow" persistent :width="$vuetify.breakpoint.smAndDown ? widthMobile : width">
      <v-card>
        <v-toolbar :color="color" dark>
          <v-toolbar-title>{{title}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <slot />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn large color="error" @click="cancel">
            ANNULLA
            <v-icon right dark>mdi-cancel</v-icon>
          </v-btn>
          <v-btn large :color="color" @click="confirm" :disabled="disabled">SALVA<v-icon right dark>mdi-content-save</v-icon></v-btn>
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
export default class PncActionDialog extends Vue {
  /* PROPS */

  @Prop({ type: String, default: "primary" })
  color!: string;

  @Prop({ type: String, default: "Attention" })
  title!: string;

  @Prop({ type: Boolean })
  show!: boolean;

  @Prop({ type: Boolean, default: true })
  persistent!: boolean;

  @Prop({ type: Boolean, required: true })
  disabled!: boolean;

  @Prop({ type: String, default: '50vw' })
  width!: string;

  @Prop({ type: String, default: '80vw' })
  widthMobile!: string;

  /* GETTERS AND SETTERS */

  get internalShow(): boolean {
    return this.show;
  }
  set internalShow(value: boolean) {
    this.$emit("show-updated", value);
  }

  /* METHODS */

  cancel(): void {
    this.internalShow = false;
    this.$emit('cancel');
  }

  confirm(): void {
    this.$emit('confirm');
  }
}
</script>