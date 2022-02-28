<template>
  <bar />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Bar from '@/components/bars/bar/Bar.vue';

@Component({
  components: {
    Bar
  }
})
export default class DashboardBarView extends Vue {}
</script>