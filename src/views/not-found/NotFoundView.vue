<template>
  <not-found />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NotFound from "@/components/pages/not-found/NotFound.vue";

@Component({
  components: {
    NotFound,
  },
})
export default class NotFoundView extends Vue {}
</script>
