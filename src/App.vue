<template>
  <v-app id="app">
    <router-view name="bar" />
    <router-view name="menu" />
    <router-view />
    <!-- <v-snackbar v-if="toast" v-model="toast" :color="toast.color">
      <span>{{ toast.message }}</span>
      <template v-slot:action>
        <v-btn text @click="toast = false">CHIUDI</v-btn>
      </template>
    </v-snackbar>
    <operatn-error-dialog v-model="showErrorDialog" :text="errorDialogText" />
    <operatn-errors-queue v-model="errorsQueue" />
    <operatn-success-dialog v-model="showSuccessDialog" :text="successDialogText" />
    <operatn-confirm-dialog v-if="showConfirmDialog" v-model="showConfirmDialog" :text="confirmDialog.text" :callback="confirmDialog.callback" />
    <operatn-info-dialog v-model="infoDialogShow" v-if="infoDialogText" :text="infoDialogText" /> -->
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
// import OperatnErrorDialog from "@/components/gears/dialogs/OperatnErrorDialog.vue";
// import OperatnErrorsQueue from "@/components/gears/dialogs/OperatnErrorsQueue.vue";
// import OperatnSuccessDialog from "@/components/gears/dialogs/OperatnSuccessDialog.vue";
// import OperatnConfirmDialog from "@/components/gears/dialogs/OperatnConfirmDialog.vue";
// import OperatnInfoDialog from "@/components/gears/dialogs/OperatnInfoDialog.vue";

// import { ActionTypes } from "@/store";

@Component({
  components: {
    // OperatnErrorDialog,
    // OperatnErrorsQueue,
    // OperatnSuccessDialog,
    // OperatnConfirmDialog,
    // OperatnInfoDialog,
  },
})
export default class App extends Vue {
  /* COMPUTED */

  // get toast(): { message: string; color: string } | null {
  //   return this.$store.state.toast;
  // }
  // set toast(value: { message: string; color: string } | null) {
  //   this.$store.dispatch(ActionTypes.SET_TOAST, value);
  // }

  // get errorDialogText(): string | null {
  //   return this.$store.state.errorDialogText;
  // }
  // get successDialogText(): string | null {
  //   return this.$store.state.successDialogText;
  // }
  // get confirmDialog() {
  //   return this.$store.state.confirmDialog;
  // }

  // get showErrorDialog(): boolean {
  //   return this.errorDialogText !== null;
  // }
  // set showErrorDialog(value: boolean) {
  //   if (!value) {
  //     this.$store.dispatch(ActionTypes.HIDE_ERROR_DIALOG);
  //   }
  // }

  // get showSuccessDialog(): boolean {
  //   return this.successDialogText !== null;
  // }
  // set showSuccessDialog(value: boolean) {
  //   if (!value) {
  //     this.$store.dispatch(ActionTypes.HIDE_SUCCESS_DIALOG);
  //   }
  // }

  // get showConfirmDialog(): boolean {
  //   return this.confirmDialog !== null;
  // }
  // set showConfirmDialog(value: boolean) {
  //   if (!value) {
  //     this.$store.dispatch(ActionTypes.HIDE_CONFIRM_DIALOG);
  //   }
  // }

  // get infoDialogText(): string | null {
  //   return this.$store.state.infoDialogText;
  // }
  // get infoDialogShow(): boolean {
  //   return this.$store.state.showInfo;
  // }
  // set infoDialogShow(value: boolean) {
  //   this.$store.dispatch(value ? ActionTypes.SHOW_INFO : ActionTypes.HIDE_INFO);
  // }

  // get errorsQueue(): string[] {
  //   return this.$store.state.errorsQueue;
  // }
  // set errorsQueue(value: string[]) {
  //   this.$store.dispatch(ActionTypes.SET_ERRORS_QUEUE, value);
  // }

  // get isDarkTheme(): boolean {
  //   return this.$store.state.darkTheme;
  // }

  // get primaryColour(): string | null {
  //   return this.$store.state.primaryColour;
  // }

  /* WATCH */

  // @Watch("isDarkTheme")
  // watchDarkTheme() {
  //   this.$vuetify.theme.dark = this.isDarkTheme;
  // }

  // @Watch("primaryColour")
  // watchPrimaryColour() {
  //   if (this.primaryColour) {
  //     this.$vuetify.theme.themes.light.primary = this.primaryColour;
  //     this.$vuetify.theme.themes.dark.primary = this.primaryColour;
  //   } else {
  //     this.$vuetify.theme.themes.light.primary = "#1976D2";
  //     this.$vuetify.theme.themes.dark.primary = "#1976D2";
  //   }
  // }

  /* LIFE CYCLE */

  // mounted() {
  //   this.$vuetify.theme.dark = this.isDarkTheme;
  //   if (this.primaryColour) {
  //     this.$vuetify.theme.themes.light.primary = this.primaryColour;
  //     this.$vuetify.theme.themes.dark.primary = this.primaryColour;
  //   }
  // }
}
</script>

<style lang="scss">
html {
  overflow-y: auto;
}

.operatn-loader {
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
