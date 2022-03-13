<template>
  <div>
    Gallery Read
    <v-btn :to="`/board/${table}`">목록</v-btn>
    <v-btn :to="`/board/${table}?act=write`">쓰기</v-btn>
    <v-btn :to="`/board/${table}/11`">읽기</v-btn>
  </div>
</template>

<script>
export default {
  name: "GalleryRead",
  props: {
    config: Object,
    access: Object,
    id: [String, Number],
  },
  computed: {
    table() {
      return this.config.bo_table;
    },
  },
};
</script>

<style>
</style>