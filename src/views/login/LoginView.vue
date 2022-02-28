<template>
  <login />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Login from "@/components/pages/login/Login.vue";

@Component({
  components: {
    Login,
  },
})
export default class LoginView extends Vue {}
</script>
