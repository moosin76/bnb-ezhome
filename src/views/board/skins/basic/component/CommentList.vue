<template>
  <v-card-text>
    <commnet-form :wr_reply="id" :table="table" :parent="0" />
  </v-card-text>
</template>

<script>
import CommnetForm from "./CommnetForm.vue";
export default {
  components: { CommnetForm },
  name: "CommentList",
  props: {
    table: { type: String, required: true },
    id: { type: Number, require: true },
    access: { type: Object, required: true },
  },
};
</script>

<style>
</style>