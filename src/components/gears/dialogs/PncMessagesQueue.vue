<template>
  <v-snackbars :messages.sync="intenalMessages" color="red" top right>
    <template v-slot:action="{ close }">
      <v-btn text @click="close()">CLOSE</v-btn>
    </template>
  </v-snackbars>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import VSnackbars from "v-snackbars";

import { QueueMessage } from "@/store";

@Component({
  components: {
    VSnackbars,
  },
  model: {
    prop: "messages",
    event: "messages-updated",
  },
})
export default class PncMessagesQueue extends Vue {
  /* PROPS */

  @Prop({ type: Array, default: () => [] })
  messages!: QueueMessage[];

  /* GETTERS AND SETTERS */

  get intenalMessages(): QueueMessage[] {
    return this.messages;
  }
  set intenalMessages(value: QueueMessage[]) {
    this.$emit("messages-updated", value);
  }
}
</script>