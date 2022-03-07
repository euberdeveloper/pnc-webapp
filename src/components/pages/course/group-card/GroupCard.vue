<template>
  <v-card :to="groupRoute" class="group-card mx-auto d-flex flex-column" color="#26c6da" dark>
    <v-card-title>
      <span class="text-h6 font-weight-light d-flex" style="width: 100%">
        <span class="name">{{ group.name }}</span>
        <span class="flex-grow-1" />
        <span class="creation">{{ creation }}</span>
      </span>
    </v-card-title>

    <v-card-text class="text-h6">
      <span v-html="displayGroupSchedule" />
    </v-card-text>

    <v-spacer />

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
import { Group, TimeRange } from "@prebenorwegian/sdk";

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

  get displayGroupSchedule(): string {
    const weekScheduleDisplay = [
      this.displayDaySchedule("Monday", this.group.weekSchedule.monday),
      this.displayDaySchedule("Tuesday", this.group.weekSchedule.tuesday),
      this.displayDaySchedule("Wednesday", this.group.weekSchedule.wednesday),
      this.displayDaySchedule("Thursday", this.group.weekSchedule.thursday),
      this.displayDaySchedule("Friday", this.group.weekSchedule.friday),
      this.displayDaySchedule("Saturday", this.group.weekSchedule.saturday),
      this.displayDaySchedule("Sunday", this.group.weekSchedule.sunday),
    ]
      .filter((value) => !!value)
      .join(", ");

    return `From <b>${this.lecturePeriod.start}</b> to <b>${this.lecturePeriod.end}</b> on ${weekScheduleDisplay}`;
  }

  get groupRoute(): Location {
    return { name: "dashboard-courses-id-groups-id", params: { courseId: this.group.courseId, groupId: this.group.id } };
  }

  /* METHODS */

  private displayDaySchedule(day: string, timeRange: TimeRange | null): string {
    return timeRange ? `<b>${day}</b> (${timeRange.from} - ${timeRange.to})` : "";
  }
}
</script>
