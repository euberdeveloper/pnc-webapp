<template>
  <v-app id="app">
    <!-- ROUTES VIEWS -->
    <router-view name="bar" />
    <router-view name="menu" />
    <router-view />

    <!-- TOASTS -->
    <v-snackbar v-if="toast" v-model="toast" :color="toast.color">
      <span>{{ toast.message }}</span>
      <template v-slot:action>
        <v-btn text @click="toast = false">CLOSE</v-btn>
      </template>
    </v-snackbar>
    <!-- DIALOG ALERT MESSAGE -->
    <pnc-alert-dialog v-model="showAlertDialog" :title="alertDialogTitle" :text="alertDialogText" :color="alertDialogColor" />
    <!-- MESSAGES QUEUE -->
    <pnc-messages-queue v-model="messagesQueue" />
    <!-- DIALOG CONFIRM -->
    <pnc-confirm-dialog v-if="showConfirmDialog" v-model="showConfirmDialog" :text="confirmDialog.text" :callback="confirmDialog.callback" />
   
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import PncAlertDialog from "@/components/gears/dialogs/PncAlertDialog.vue";
import PncMessagesQueue from "@/components/gears/dialogs/PncMessagesQueue.vue";
import PncConfirmDialog from "@/components/gears/dialogs/PncConfirmDialog.vue";

import { ActionTypes, AlertDialogMessage, QueueMessage } from "@/store";

@Component({
  components: {
    PncAlertDialog,
    PncMessagesQueue,
    PncConfirmDialog
  },
})
export default class App extends Vue {
  /* COMPUTED */

  get toast(): { message: string; color: string } | null {
    return this.$store.state.toast;
  }
  set toast(value: { message: string; color: string } | null) {
    this.$store.dispatch(ActionTypes.SET_TOAST, value);
  }

  get alertDialog(): AlertDialogMessage | null {
    return this.$store.state.alertDialog;
  }
  get alertDialogTitle(): string | undefined {
    return this.alertDialog?.title;
  }
  get alertDialogText(): string | undefined {
    return this.alertDialog?.text;
  }
  get alertDialogColor(): string | undefined {
    return this.alertDialog?.color;
  }
  get confirmDialog() {
    return this.$store.state.confirmDialog;
  }

  get showAlertDialog(): boolean {
    return this.alertDialog !== null;
  }
  set showAlertDialog(value: boolean) {
    if (!value) {
      this.$store.dispatch(ActionTypes.HIDE_ALERT_DIALOG);
    }
  }

  get showConfirmDialog(): boolean {
    return this.confirmDialog !== null;
  }
  set showConfirmDialog(value: boolean) {
    if (!value) {
      this.$store.dispatch(ActionTypes.HIDE_CONFIRM_DIALOG);
    }
  }

  get messagesQueue(): QueueMessage[] {
    return this.$store.state.messagesQueue;
  }
  set messagesQueue(value: QueueMessage[]) {
    this.$store.dispatch(ActionTypes.SET_MESSAGE_QUEUE, value);
  }

  get isDarkTheme(): boolean {
    return this.$store.state.darkTheme;
  }

  get primaryColour(): string | null {
    return this.$store.state.primaryColour;
  }

  /* WATCH */

  @Watch("isDarkTheme")
  watchDarkTheme() {
    this.$vuetify.theme.dark = this.isDarkTheme;
  }

  @Watch("primaryColour")
  watchPrimaryColour() {
    if (this.primaryColour) {
      this.$vuetify.theme.themes.light.primary = this.primaryColour;
      this.$vuetify.theme.themes.dark.primary = this.primaryColour;
    } else {
      this.$vuetify.theme.themes.light.primary = "#1976D2";
      this.$vuetify.theme.themes.dark.primary = "#1976D2";
    }
  }

  /* LIFE CYCLE */

  mounted() {
    this.$vuetify.theme.dark = this.isDarkTheme;
    if (this.primaryColour) {
      this.$vuetify.theme.themes.light.primary = this.primaryColour;
      this.$vuetify.theme.themes.dark.primary = this.primaryColour;
    }
  }
}
</script>

<style lang="scss">
html {
  overflow-y: auto;
}

.pnc-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
