<template>
  <div v-if="!!member.mb_provider">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <span v-on="on" v-bind="attrs">
          <v-icon left small>mdi-account-network</v-icon>
          {{ member.mb_provider.toUpperCase() }}
        </span>
      </template>
      <span>{{ member.mb_id }}</span>
    </v-tooltip>
  </div>
  <div v-else>
    {{ member.mb_id }}
  </div>
</template>

<script>
export default {
  name: "DisplayId",
  props: {
    member: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
</style>