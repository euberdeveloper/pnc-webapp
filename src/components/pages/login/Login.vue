<template>
  <v-main>
    <!-- IMAGE OF BACKGROUND -->
    <div class="background" :style="backgroundStyle" />

    <!-- LOGIN CONTAINER -->
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <!-- LOGIN CARD WITH TRANSITION -->
          <v-scale-transition origin="center center">
            <v-card class="elevation-12" v-show="showCard">
              <!-- TITLE -->
              <v-toolbar color="primary" class="d-flex justify-center" dark flat>
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <!-- FORM -->
              <v-card-text>
                <v-form @keyup.native.enter="login()" v-model="loginFormValid">
                  <v-text-field
                    type="text"
                    label="Username"
                    name="username"
                    :rules="[$validator.requiredText('Password')]"
                    v-model="username"
                    prepend-icon="mdi-account"
                  />
                  <v-text-field
                    :type="passwordType"
                    label="Password"
                    name="password"
                    v-model="password"
                    :rules="[$validator.requiredText('Password')]"
                    prepend-icon="mdi-lock"
                    :append-icon="passwordIcon"
                    @click:append="showPassword = !showPassword"
                  />
                </v-form>
              </v-card-text>
              <!-- BUTTON -->
              <v-card-actions class="d-flex justify-center pb-4">
                <v-btn color="primary" large :disabled="!loginFormValid" :loading="loading" @click="login()">Login</v-btn>
                <!-- TODO: forgot password -->
                <!-- <div class="help">
                  <v-tooltip left nudge-top="15" nudge-right="7">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="primary" v-on="on" v-bind="attrs" to="/password-recovery" icon small><v-icon>mdi-lifebuoy</v-icon></v-btn>
                    </template>
                    <span>Password dimenticata?</span>
                  </v-tooltip>
                </div> -->
              </v-card-actions>
            </v-card>
          </v-scale-transition>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { ActionTypes } from "@/store";
import { getRandomNorwayBackground } from "@/utils";

@Component
export default class Login extends Vue {
  /* DATA */

  private backgroundImage: string | null = null;
  private showCard = false;

  private username: string | null = null;
  private password: string | null = null;
  private showPassword = false;

  private loginFormValid = false;
  private loading = false;

  /* GETTERS AND SETTERS */

  get backgroundStyle() {
    return {
      background: this.backgroundImage ? `url("${this.backgroundImage}") no-repeat center center fixed` : undefined,
      "background-size": "cover",
    };
  }

  get passwordType(): "text" | "password" {
    return this.showPassword ? "text" : "password";
  }
  get passwordIcon(): "mdi-eye" | "mdi-eye-off" {
    return this.showPassword ? "mdi-eye-off" : "mdi-eye";
  }

  get requestedRoute(): string {
    return (this.$route.query.requestedRoute as string) ?? "/";
  }

  /* METHODS */

  reset(): void {
    this.username = "";
    this.password = "";
  }

  async login(): Promise<void> {
    if (this.loginFormValid && !this.loading) {
      try {
        this.loading = true;
        await this.$store.dispatch(ActionTypes.LOGIN, { username: this.username as string, password: this.password as string });
        this.$router.replace(this.requestedRoute);
      } catch (error) {
        if (error) {
          this.$store.dispatch(ActionTypes.SHOW_ALERT_ERROR, "Wrong credentials");
        }
      } finally {
        this.loading = false;
      }
    }
  }

  /* LIFE CYCLE */

  created() {
    this.backgroundImage = getRandomNorwayBackground();
  }

  mounted() {
    this.showCard = true;
  }
}
</script>

<style lang="scss" scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  filter: blur(0px);
}

.help {
  position: absolute;
  bottom: 4px;
  right: 4px;
}
</style>
