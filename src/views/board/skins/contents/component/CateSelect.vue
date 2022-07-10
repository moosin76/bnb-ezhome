<template>
  <v-select
   
    label="카데고리"
    v-model="cateItem"
		:items="items"
    @change="cateChange"
		hide-details
		dense
  ></v-select>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "CateSelect",
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cateItem: "전체",
    };
  },
  computed: {
    ...mapState({
      config: (state) => state.board.config,
    }),
    items() {
      if (this.config.bo_use_category) {
        return ["전체", ...this.config.bo_category];
      }
      return [];
    },
  },
  methods: {
    cateChange() {
      const cate = this.cateItem == "전체" ? "" : this.cateItem;
      const options = {
        ...this.options,
        page: 1,
      };
			options.stx.splice(1, 1, cate);
			this.$emit("update:options", options);
    },
  },
};
</script>

<style>
</style>