<template>
  <v-card :to="groupRoute" class="group-card mx-auto" color="#26c6da" dark>
    <v-card-title>
      <span class="text-h6 font-weight-light d-flex" style="width: 100%">
        <span class="name">{{ group.name }}</span>
        <span class="flex-grow-1" />
        <span class="creation">{{ creation }}</span>
      </span>
    </v-card-title>

    <v-card-text class="text-h6">
      <span>
        "From <u><b>{{ lecturePeriod.start }}</b></u> to <u><b>{{ lecturePeriod.end }}</b></u>"
      </span>
    </v-card-text>

    <v-card-actions>
      <v-icon class="mr-1">mdi-account</v-icon>
      <span class="partecipants subheading mr-2">
        <span class="partecipants">{{ group.partecipants.length }}</span>
        <span class="mx-1">/</span>
        <span class="maxPartecipants">{{ group.maxPartecipants }}</span>
      </span>

      <v-row align="center" justify="end">
        <v-btn icon @click.prevent="$emit('edit')">
          <v-icon color="blue darken-3">mdi-pencil</v-icon>
        </v-btn>
        <v-btn class="mr-2" icon @click.prevent="$emit('remove')">
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Location } from "vue-router";
import { Group } from "@prebenorwegian/sdk";

@Component
export default class GroupCard extends Vue {
  /* PROPS */

  @Prop({ type: Object, required: true })
  group!: Group;

  /* GETTERS */

  get creation(): string {
    return this.group.creationDate.toLocaleDateString();
  }

  get lecturePeriod() {
    return {
      start: this.group.lecturePeriod.start.toLocaleDateString(),
      end: this.group.lecturePeriod.end.toLocaleDateString(),
    };
  }

  get groupRoute(): Location {
    return { name: "dashboard-courses-id-groups-id", params: { courseId: this.group.courseId, groupId: this.group.id } };
  }
}
</script>
